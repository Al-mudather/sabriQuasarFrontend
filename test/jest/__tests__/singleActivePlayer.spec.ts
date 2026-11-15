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
  // The historical fixed 400 ms gap keeps the timing assertions below exact;
  // the adaptive default is covered in its own block.
  return new SinglePlayerArbiter({ tabId, channelFactory: () => channel, releaseGapMs: 400, ...extra })
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
    jest.advanceTimersByTime(400) // discovery window passes; tab2 learns tab1 holds
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
    jest.advanceTimersByTime(400)
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
    jest.advanceTimersByTime(400)
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
    const tab1 = new SinglePlayerArbiter({ tabId: 't1', releaseGapMs: 400, channelFactory: () => { opened++; return bus.connect() } })
    const tab2 = arbiter('t2', bus.connect())
    const revoked = jest.fn()
    const ready = jest.fn()
    tab1.claim('a', revoked, ready)
    jest.advanceTimersByTime(400)
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

  it('discovery: a holder whose answer takes 300 ms is still awaited', () => {
    const bus = makeBus(150) // 150 ms each way → replies land at 300 ms
    const tab1 = arbiter('t1', bus.connect())
    const revoked1 = jest.fn()
    tab1.claim('a', revoked1, jest.fn())
    jest.advanceTimersByTime(1000)
    // tab2 opens later (never saw tab1's claim) and claims at once.
    const tab2 = arbiter('t2', bus.connect())
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(150)
    expect(revoked1).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(150) // tab1's answers arrive at 300 ms
    expect(ready2).not.toHaveBeenCalled()
    jest.advanceTimersByTime(399) // + 400 ms release gap
    expect(ready2).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready2).toHaveBeenCalledTimes(1)
  })

  it('hello: a newly opened tab learns of an existing holder and waits for it', () => {
    const bus = makeBus(5)
    const c1 = bus.connect()
    const tab1 = arbiter('t1', c1)
    tab1.claim('a', jest.fn(), jest.fn())
    jest.advanceTimersByTime(1000)
    const tab2 = arbiter('t2', bus.connect()) // sends hello; tab1 answers holding
    jest.advanceTimersByTime(400)
    bus.frozen.add(c1) // tab1 now never answers
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(599)
    expect(ready2).not.toHaveBeenCalled() // waits for the known holder…
    jest.advanceTimersByTime(1)
    expect(ready2).toHaveBeenCalledTimes(1) // …up to the 600 ms timeout
  })

  it('re-sends its claim when an older claim arrives (clock-jump case)', () => {
    let handler: ((m: unknown) => void) | null = null
    const post = jest.fn()
    const ch: PlayerLockChannel = { postMessage: post, listen: (h) => { handler = h }, close: jest.fn() }
    const a = arbiter('t1', ch)
    const revoked = jest.fn()
    a.claim('p1', revoked, jest.fn())
    jest.advanceTimersByTime(1000)
    const ours = post.mock.calls.map((c) => c[0] as PlayerLockMessage).find((m) => m.type === 'claim')
    post.mockClear()
    const h = handler as unknown as (m: unknown) => void
    // Another tab whose clock is behind claims with an older timestamp.
    h({ type: 'claim', tabId: 't9', playerId: 'x', ts: 1 })
    expect(revoked).not.toHaveBeenCalled()
    expect(post).toHaveBeenCalledWith(ours)
  })

  it('end to end: the older claimer (clock behind) stops after the re-sent claim', () => {
    const bus = makeBus(10)
    const tab1 = arbiter('t1', bus.connect())
    tab1.claim('a', jest.fn(), jest.fn())
    jest.advanceTimersByTime(1000)
    // tab2's clock is far behind, and it claims before hearing anything.
    const tab2 = new SinglePlayerArbiter({ tabId: 't2', channelFactory: () => bus.connect(), now: () => Date.now() - 1e9 })
    const revoked2 = jest.fn()
    tab2.claim('b', revoked2, jest.fn())
    jest.advanceTimersByTime(2000)
    expect(revoked2).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBe('a')
    expect(tab2.activeId()).toBeNull()
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
    jest.advanceTimersByTime(400)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(1000)
    expect(revoked1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})

describe('utils/singleActivePlayer adaptive gap and graceful teardown', () => {
  const ANDROID_GAP = 1500
  // Deterministic stand-in for adaptiveReleaseGapMs on an Android UA.
  const gapFor = (info: { kind?: string; hadSession?: boolean }): number =>
    info.kind === 'hasif' ? 800 : info.hadSession === false ? 0 : ANDROID_GAP
  const make = (tabId: string, channel: PlayerLockChannel | null = null): SinglePlayerArbiter =>
    new SinglePlayerArbiter({ tabId, channelFactory: () => channel, gapFor })

  beforeEach(() => {
    jest.useFakeTimers({ now: 2_000_000 })
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('no gap after a player that never opened a session', () => {
    const a = make('t1')
    a.claim('p1', jest.fn(), jest.fn())
    a.release('p1', { kind: 'vdocipher', hadSession: false })
    expect(a.gapLeftMs()).toBe(0)
    const ready = jest.fn()
    a.claim('p2', jest.fn(), ready)
    expect(ready).toHaveBeenCalledTimes(1)
  })

  it('long gap after a player that held a session (and when it is unknown)', () => {
    const a = make('t1')
    a.claim('p1', jest.fn(), jest.fn())
    a.release('p1', { kind: 'vdocipher', hadSession: true })
    expect(a.gapLeftMs()).toBe(ANDROID_GAP)
    const ready = jest.fn()
    a.claim('p2', jest.fn(), ready)
    jest.advanceTimersByTime(ANDROID_GAP - 1)
    expect(ready).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready).toHaveBeenCalledTimes(1)

    a.release('p2') // unknown → assume a session
    expect(a.gapLeftMs()).toBe(ANDROID_GAP)
  })

  it('a holder that never got to load leaves no gap, whatever it reports', () => {
    const a = make('t1')
    a.claim('p1', jest.fn(), jest.fn())
    a.release('p1', { hadSession: true })
    const ready = jest.fn()
    a.claim('p2', jest.fn(), ready) // waits for p1's gap
    jest.advanceTimersByTime(1000)
    expect(ready).not.toHaveBeenCalled()
    a.release('p2', { hadSession: true }) // it never loaded: nothing to release
    expect(a.gapLeftMs()).toBe(ANDROID_GAP - 1000) // only p1's gap is still running
  })

  it('noteRelease (TYPE_HASIF / Vimeo teardown) delays a VdoCipher claim, even one already waiting', () => {
    const a = make('t1')
    a.noteRelease({ kind: 'hasif' })
    const ready = jest.fn()
    a.claim('p1', jest.fn(), ready)
    expect(ready).not.toHaveBeenCalled() // never 0 ms after the <video> was destroyed
    jest.advanceTimersByTime(799)
    expect(ready).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready).toHaveBeenCalledTimes(1)

    // A claim already pending is pushed back by a later teardown.
    const b = make('t2')
    b.noteRelease({ kind: 'hasif' })
    const readyB = jest.fn()
    b.claim('p1', jest.fn(), readyB)
    jest.advanceTimersByTime(700)
    b.noteRelease({ kind: 'hasif' })
    jest.advanceTimersByTime(700)
    expect(readyB).not.toHaveBeenCalled()
    jest.advanceTimersByTime(100)
    expect(readyB).toHaveBeenCalledTimes(1)
  })

  it('local hand-over waits for the old player to finish its graceful teardown, then the gap', async () => {
    const a = make('t1')
    let finish: (info: { hadSession: boolean }) => void = () => undefined
    const revoke = jest.fn(() => new Promise<{ hadSession: boolean }>((resolve) => { finish = resolve }))
    a.claim('old', revoke, jest.fn())
    const ready = jest.fn()
    a.claim('new', jest.fn(), ready)
    expect(revoke).toHaveBeenCalledWith('replaced')
    jest.advanceTimersByTime(5000)
    expect(ready).not.toHaveBeenCalled() // still tearing down
    finish({ hadSession: true })
    await Promise.resolve()
    await Promise.resolve()
    expect(ready).not.toHaveBeenCalled() // gap starts only now
    jest.advanceTimersByTime(ANDROID_GAP)
    expect(ready).toHaveBeenCalledTimes(1)
  })

  it('a rejected or throwing revoke still lets the next player load', async () => {
    const a = make('t1')
    a.claim('old', () => Promise.reject(new Error('x')), jest.fn())
    const ready = jest.fn()
    a.claim('new', jest.fn(), ready)
    await Promise.resolve()
    await Promise.resolve()
    jest.advanceTimersByTime(ANDROID_GAP)
    expect(ready).toHaveBeenCalledTimes(1)

    const b = make('t2')
    b.claim('old', () => { throw new Error('y') }, jest.fn())
    const readyB = jest.fn()
    b.claim('new', jest.fn(), readyB)
    jest.advanceTimersByTime(ANDROID_GAP)
    expect(readyB).toHaveBeenCalledTimes(1)
  })

  it('cross-tab: `released` is sent only after the graceful teardown, and carries hadSession', async () => {
    const bus = makeBus(5)
    const sent: PlayerLockMessage[] = []
    const ch1 = bus.connect()
    const post = ch1.postMessage.bind(ch1)
    ch1.postMessage = (m: PlayerLockMessage) => { sent.push(m); post(m) }
    const tab1 = make('t1', ch1)
    const tab2 = make('t2', bus.connect())
    let finish: (info: { hadSession: boolean }) => void = () => undefined
    const revoke1 = jest.fn(() => new Promise<{ hadSession: boolean }>((resolve) => { finish = resolve }))
    tab1.claim('a', revoke1, jest.fn())
    jest.advanceTimersByTime(400)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(10)
    expect(revoke1).toHaveBeenCalledWith('elsewhere')
    expect(sent.some((m) => m.type === 'released')).toBe(false)
    finish({ hadSession: false })
    await Promise.resolve()
    await Promise.resolve()
    expect(sent.filter((m) => m.type === 'released')).toEqual([{ type: 'released', tabId: 't1', stopped: true, hadSession: false }])
    jest.advanceTimersByTime(10)
    expect(ready2).toHaveBeenCalledTimes(1) // no session was held → no gap
  })

  it('cross-tab: a released session (or an old tab that does not say) costs the long gap', () => {
    const bus = makeBus(5)
    const tab1 = make('t1', bus.connect())
    const tab2 = make('t2', bus.connect())
    tab1.claim('a', () => ({ hadSession: true }), jest.fn())
    jest.advanceTimersByTime(400)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    jest.advanceTimersByTime(10) // claim → released
    jest.advanceTimersByTime(ANDROID_GAP - 1)
    expect(ready2).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(ready2).toHaveBeenCalledTimes(1)
  })

  it('lazy channel: nothing is opened for teardown reports; the first claim opens it and still discovers holders', () => {
    const bus = makeBus(5)
    const tab1 = make('t1', bus.connect())
    const revoked1 = jest.fn(() => ({ hadSession: false }))
    tab1.claim('a', revoked1, jest.fn())
    jest.advanceTimersByTime(1000)
    let opened = 0
    const tab2 = new SinglePlayerArbiter({ tabId: 't2', lazyChannel: true, gapFor, channelFactory: () => { opened++; return bus.connect() } })
    tab2.noteRelease({ kind: 'hasif' })
    tab2.resume() // pageshow on a page that never claimed
    jest.advanceTimersByTime(2000)
    expect(opened).toBe(0)
    const ready2 = jest.fn()
    tab2.claim('b', jest.fn(), ready2)
    expect(opened).toBe(1)
    expect(ready2).not.toHaveBeenCalled() // discovery window: tab1 may be holding
    jest.advanceTimersByTime(20)
    expect(revoked1).toHaveBeenCalledWith('elsewhere')
    jest.advanceTimersByTime(400)
    expect(ready2).toHaveBeenCalledTimes(1)
    tab2.suspend()
    tab2.resume()
    expect(opened).toBe(2) // it has claimed before: it listens again
  })

  it('suspend is synchronous: revoke("suspend"), released sent at once', () => {
    const bus = makeBus(5)
    const sent: PlayerLockMessage[] = []
    const ch1 = bus.connect()
    const post = ch1.postMessage.bind(ch1)
    ch1.postMessage = (m: PlayerLockMessage) => { sent.push(m); post(m) }
    const tab1 = make('t1', ch1)
    const revoke = jest.fn(() => ({ hadSession: true }))
    tab1.claim('a', revoke, jest.fn())
    jest.advanceTimersByTime(400)
    tab1.suspend()
    expect(revoke).toHaveBeenCalledWith('suspend')
    expect(sent[sent.length - 1]).toEqual({ type: 'released', tabId: 't1', stopped: true, hadSession: true })
    expect(tab1.activeId()).toBeNull()
  })
})
