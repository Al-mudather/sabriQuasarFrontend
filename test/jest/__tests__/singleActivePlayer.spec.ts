import { SinglePlayerArbiter, type PlayerLockChannel, type PlayerClaimMessage } from 'src/utils/singleActivePlayer'

// In-memory stand-in for a BroadcastChannel shared by several "tabs".
function makeBus(): { connect: () => PlayerLockChannel } {
  const members: PlayerLockChannel[] = []
  return {
    connect() {
      const ch: PlayerLockChannel = {
        onmessage: null,
        postMessage(message: PlayerClaimMessage) {
          for (const m of members) if (m !== ch) m.onmessage?.({ data: message })
        },
      }
      members.push(ch)
      return ch
    },
  }
}

describe('utils/singleActivePlayer', () => {
  it('a new claim revokes the previous player in the same tab', () => {
    const a = new SinglePlayerArbiter({ tabId: 't1' })
    const revokedA = jest.fn()
    a.claim('p1', revokedA)
    expect(a.activeId()).toBe('p1')
    a.claim('p2', jest.fn())
    expect(revokedA).toHaveBeenCalledTimes(1)
    expect(a.activeId()).toBe('p2')
  })

  it('re-claiming by the same player does not revoke it', () => {
    const a = new SinglePlayerArbiter({ tabId: 't1' })
    const revoked = jest.fn()
    a.claim('p1', revoked)
    a.claim('p1', revoked)
    expect(revoked).not.toHaveBeenCalled()
  })

  it('a claim in another tab revokes this tab\'s player', () => {
    const bus = makeBus()
    const tab1 = new SinglePlayerArbiter({ tabId: 't1', channel: bus.connect() })
    const tab2 = new SinglePlayerArbiter({ tabId: 't2', channel: bus.connect() })
    const revoked1 = jest.fn()
    const revoked2 = jest.fn()
    tab1.claim('a', revoked1)
    tab2.claim('b', revoked2)
    expect(revoked1).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBeNull()
    expect(tab2.activeId()).toBe('b')
    // "Play here" back in tab 1 takes it back.
    tab1.claim('a', revoked1)
    expect(revoked2).toHaveBeenCalledTimes(1)
    expect(tab1.activeId()).toBe('a')
  })

  it('release only clears the matching holder', () => {
    const a = new SinglePlayerArbiter({ tabId: 't1' })
    a.claim('p1', jest.fn())
    a.release('other')
    expect(a.activeId()).toBe('p1')
    a.release('p1')
    expect(a.activeId()).toBeNull()
  })

  it('makes the next player wait for the release gap (lesson switch)', () => {
    let now = 1000
    const a = new SinglePlayerArbiter({ tabId: 't1', now: () => now, releaseGapMs: 400 })
    expect(a.claim('lesson-1', jest.fn()).waitMs).toBe(0)
    // Vue unmounts lesson 1 then mounts lesson 2 in the same tick.
    a.release('lesson-1')
    expect(a.claim('lesson-2', jest.fn()).waitMs).toBe(400)
    now += 1000
    a.release('lesson-2')
    now += 500
    expect(a.claim('lesson-3', jest.fn()).waitMs).toBe(0)
  })

  it('ignores malformed and own-tab messages', () => {
    const ch: PlayerLockChannel = { onmessage: null, postMessage: jest.fn() }
    const a = new SinglePlayerArbiter({ tabId: 't1', channel: ch })
    const revoked = jest.fn()
    a.claim('p1', revoked)
    ch.onmessage?.({ data: 'garbage' })
    ch.onmessage?.({ data: { type: 'claim', tabId: 't1', playerId: 'x' } })
    expect(revoked).not.toHaveBeenCalled()
    expect(ch.postMessage).toHaveBeenCalledWith({ type: 'claim', tabId: 't1', playerId: 'p1' })
  })
})
