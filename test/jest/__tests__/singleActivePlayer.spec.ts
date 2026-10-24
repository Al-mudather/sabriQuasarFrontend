import {
  SinglePlayerArbiter,
  StoragePlayerChannel,
  compareClaims,
  type PlayerLockChannel,
  type PlayerLockMessage,
} from 'src/utils/singleActivePlayer'

// Fake BroadcastChannel bus with ASYNC delivery (like the real thing).
function makeBus(latencyMs = 5): { connect: () => PlayerLockChannel; frozen: Set<PlayerLockChannel> } {
  const members = new Set<PlayerLockChannel & { handler?: (m: unknown) => void }>()
  const frozen = new Set<PlayerLockChannel>()
  return {
    frozen,
    connect() {
      const ch: PlayerLockChannel & { handler?: (m: unknown) => void } = {
        postMessage(message: PlayerLockMessage) {
          const copy = JSON.parse(JSON.stringify(message)) as unknown
          for (const m of members) {
            if (m === ch) continue
            setTimeout(() => {
              if (!frozen.has(m)) m.handler?.(copy)
            }, latencyMs)
          }
        },
        listen(handler) {
          ch.handler = handler
        },
        close() {
          members.delete(ch)
        },
      }
      members.add(ch)
      return ch
    },
  }
}

function arbiter(tabId: string, channel: PlayerLockChannel | null, extra: Partial<ConstructorParameters<typeof SinglePlayerArbiter>[0]> = {}): SinglePlayerArbiter {
  return new SinglePlayerArbiter({ tabId, channelFactory: () => channel, ...extra })
}

describe('utils/singleActivePlayer', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1_000_000 })
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('single tab: loads immediately; a new claim revokes the previous player', () => {
    const a = arbiter('t1', null)
    const revokedA = jest.fn()
    const readyA = jest.fn()
    a.claim('p1', revokedA, readyA)
    expect(readyA).toHaveBeenCalledTimes(1)
    const readyB = jest.fn()
    a.claim('p2', jest.fn(), readyB)
    expect(revokedA).toHaveBeenCalledTimes(1)
    expect(a.activeId()).toBe('p2')
    // The previous player just went away: wait the 400 ms gap before loading.
    expect(readyB).not.toHaveBeenCalled()
    jest.advanceTimersByTime(399)
    expect(readyB).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(readyB).toHaveBeenCalledTimes(1)
  })

  it('lesson switch: release then claim waits for the release gap', () => {
    const a = arbiter('t1', null)
    a.claim('lesson-1', jest.fn(), jest.fn())
    a.release('lesson-1')
    const ready = jest.fn()
    a.claim('lesson-2', jest.fn(), ready)
    jest.advanceTimersByTime(399)
    expect(ready).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready).toHaveBeenCalled()
  })

  it('cross-tab: the claimer waits for the other tab to release, then the gap', () => {
    const bus = makeBus(50)
    const tab1 = arbiter('t1', bus.connect())
    const tab2 = arbiter('t2', bus.connect())
    const revoked1 = jest.fn()
    const ready1 = jest.fn()
    tab1.claim('a', revoked1, ready1)
    jest.advanceTimersByTime(200) // discovery window passes; tab2 learns tab1 holds
    expect(ready1).toHaveBeenCalledTimes(1)

    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    // t+50: tab1 receives the claim, stops; t+100: tab2 receives "released".
    jest.advanceTimersByTime(49)
    expect(revoked1).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(revoked1).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(50)
    expect(ready2).not.toHaveBeenCalled() // released arrived, now the 400 ms gap
    jest.advanceTimersByTime(399)
    expect(ready2).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBeNull()
    expect(tab2.activeId()).toBe('b')
  })

  it('cross-tab: a holder that never answers is waited for at most the timeout', () => {
    const bus = makeBus(5)
    const c1 = bus.connect()
    const tab1 = arbiter('t1', c1)
    const tab2 = arbiter('t2', bus.connect())
    tab1.claim('a', jest.fn(), jest.fn())
    jest.advanceTimersByTime(200)
    bus.frozen.add(c1) // tab1 frozen: never answers
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(599)
    expect(ready2).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready2).toHaveBeenCalledTimes(1)
  })

  it('"play here" in the stopped tab takes the player back the same way', () => {
    const bus = makeBus(10)
    const tab1 = arbiter('t1', bus.connect())
    const tab2 = arbiter('t2', bus.connect())
    const revoked1 = jest.fn()
    tab1.claim('a', revoked1, jest.fn())
    jest.advanceTimersByTime(200)
    const revoked2 = jest.fn()
    tab2.claim('b', revoked2, jest.fn())
    jest.advanceTimersByTime(1000)
    expect(revoked1).toHaveBeenCalledTimes(1)
    const readyAgain = jest.fn()
    tab1.claim('a', jest.fn(), readyAgain)
    jest.advanceTimersByTime(10)
    expect(revoked2).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(10)
    expect(readyAgain).not.toHaveBeenCalled()
    jest.advanceTimersByTime(400)
    expect(readyAgain).toHaveBeenCalledTimes(1)
  })

  it('simultaneous claims: the newer claim wins and neither tab stops the other twice', () => {
    const bus = makeBus(20)
    const tab1 = arbiter('t1', bus.connect())
    const tab2 = arbiter('t2', bus.connect())
    const revoked1 = jest.fn()
    const revoked2 = jest.fn()
    const ready1 = jest.fn()
    const ready2 = jest.fn()
    tab1.claim('a', revoked1, ready1) // ts = 1_000_000
    tab2.claim('b', revoked2, ready2) // same ms, tie → tabId 't2' > 't1' wins
    jest.advanceTimersByTime(2000)
    expect(revoked1).toHaveBeenCalledTimes(1)
    expect(revoked2).not.toHaveBeenCalled()
    expect(ready1).not.toHaveBeenCalled()
    expect(ready2).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBeNull()
    expect(tab2.activeId()).toBe('b')
  })

  it('simultaneous claims: a later timestamp beats tabId order', () => {
    const bus = makeBus(20)
    const tab1 = arbiter('t1', bus.connect())
    const tab2 = arbiter('t2', bus.connect())
    const revoked1 = jest.fn()
    const revoked2 = jest.fn()
    tab2.claim('b', revoked2, jest.fn())
    jest.advanceTimersByTime(5) // tab1 claims later, before tab2's message lands
    const ready1 = jest.fn()
    tab1.claim('a', revoked1, ready1)
    jest.advanceTimersByTime(2000)
    expect(revoked2).toHaveBeenCalledTimes(1)
    expect(revoked1).not.toHaveBeenCalled()
    expect(ready1).toHaveBeenCalledTimes(1)
  })

  it('compareClaims orders by ts then tabId', () => {
    expect(compareClaims({ ts: 2, tabId: 'a' }, { ts: 1, tabId: 'z' })).toBeGreaterThan(0)
    expect(compareClaims({ ts: 1, tabId: 'b' }, { ts: 1, tabId: 'a' })).toBeGreaterThan(0)
    expect(compareClaims({ ts: 1, tabId: 'a' }, { ts: 1, tabId: 'a' })).toBe(0)
  })

  it('suspend (pagehide/freeze) revokes, tells other tabs, closes; resume reopens without playing', () => {
    const bus = makeBus(5)
    let opened = 0
    const tab1 = new SinglePlayerArbiter({ tabId: 't1', channelFactory: () => { opened++; return bus.connect() } })
    const tab2 = arbiter('t2', bus.connect())
    const revoked = jest.fn()
    const ready = jest.fn()
    tab1.claim('a', revoked, ready)
    jest.advanceTimersByTime(200)
    tab1.suspend()
    expect(revoked).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBeNull()
    // tab2 learnt the release, so its claim does not wait for tab1.
    jest.advanceTimersByTime(10)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(400)
    expect(ready2).toHaveBeenCalledTimes(1)
    tab1.resume()
    expect(opened).toBe(2)
    expect(ready).toHaveBeenCalledTimes(1) // no auto-play after resume
  })

  it('ignores malformed and own-tab messages', () => {
    let handler: ((m: unknown) => void) | null = null
    const ch: PlayerLockChannel = { postMessage: jest.fn(), listen: (h) => { handler = h }, close: jest.fn() }
    const a = arbiter('t1', ch)
    const revoked = jest.fn()
    a.claim('p1', revoked, jest.fn())
    const h = handler as unknown as (m: unknown) => void
    h('garbage')
    h({ type: 'claim', tabId: 't1', playerId: 'x', ts: 9e15 })
    h({ type: 'claim', tabId: 't9', playerId: 'x' }) // no ts
    expect(revoked).not.toHaveBeenCalled()
    expect(ch.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'claim', tabId: 't1', playerId: 'p1' }))
  })
})

describe('StoragePlayerChannel (no BroadcastChannel fallback)', () => {
  function fakeWindow(): { target: Pick<Window, 'addEventListener' | 'removeEventListener'>; fire: (key: string, value: string | null) => void } {
    const listeners = new Set<(ev: StorageEvent) => void>()
    return {
      target: {
        addEventListener: ((_: string, l: (ev: StorageEvent) => void) => listeners.add(l)) as Window['addEventListener'],
        removeEventListener: ((_: string, l: (ev: StorageEvent) => void) => listeners.delete(l)) as Window['removeEventListener'],
      },
      fire(key, value) {
        for (const l of listeners) l({ key, newValue: value } as StorageEvent)
      },
    }
  }

  it('writes a message to storage and delivers storage events to the handler', () => {
    const writes: string[] = []
    const storage = { setItem: (_k: string, v: string) => writes.push(v), removeItem: jest.fn() } as unknown as Storage
    const w = fakeWindow()
    const ch = new StoragePlayerChannel(storage, w.target)
    const got: unknown[] = []
    ch.listen((m) => got.push(m))
    ch.postMessage({ type: 'released', tabId: 't1', stopped: true })
    expect(writes).toHaveLength(1)
    w.fire('stc-vdocipher-player', writes[0] as string) // what another tab would see
    w.fire('other-key', writes[0] as string)
    w.fire('stc-vdocipher-player', null) // the removeItem event
    w.fire('stc-vdocipher-player', '{not json')
    expect(got).toEqual([{ type: 'released', tabId: 't1', stopped: true }])
    ch.close()
    w.fire('stc-vdocipher-player', writes[0] as string)
    expect(got).toHaveLength(1)
  })

  it('swallows storage errors (Safari private mode)', () => {
    const storage = { setItem: () => { throw new Error('QuotaExceededError') }, removeItem: jest.fn() } as unknown as Storage
    const ch = new StoragePlayerChannel(storage, fakeWindow().target)
    expect(() => ch.postMessage({ type: 'released', tabId: 't1', stopped: false })).not.toThrow()
  })

  it('drives two arbiters end to end', () => {
    jest.useFakeTimers({ now: 5_000 })
    // A shared fake storage that fires `storage` in the OTHER window, async.
    const wins = [fakeWindow(), fakeWindow()]
    const mkStorage = (self: number): Storage => ({
      setItem: (k: string, v: string) => { setTimeout(() => wins[1 - self]?.fire(k, v), 5) },
      removeItem: () => undefined,
    } as unknown as Storage)
    const tab1 = new SinglePlayerArbiter({ tabId: 't1', channelFactory: () => new StoragePlayerChannel(mkStorage(0), wins[0]!.target) })
    const tab2 = new SinglePlayerArbiter({ tabId: 't2', channelFactory: () => new StoragePlayerChannel(mkStorage(1), wins[1]!.target) })
    const revoked1 = jest.fn()
    tab1.claim('a', revoked1, jest.fn())
    jest.advanceTimersByTime(200)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(1000)
    expect(revoked1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})
