import {
  LatestOnlyQueue,
  MAX_AUTO_RECOVERIES,
  adaptiveReleaseGapMs,
  decideSwitch,
  errorCodeOf,
  isAndroidUa,
  isSessionError,
  leadingErrorCode,
  recoveryDelayMs,
  type SwitchInput,
} from 'src/utils/vdoPlayerPolicy'

const ANDROID = 'Mozilla/5.0 (Linux; Android 11; SM-A125F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36'
const DESKTOP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

describe('vdoPlayerPolicy error classification', () => {
  it('takes the leading four digits, tolerating composite and string codes', () => {
    expect(leadingErrorCode(6006)).toBe('6006')
    expect(leadingErrorCode('6006')).toBe('6006')
    expect(leadingErrorCode(60072013)).toBe('6007')
    expect(leadingErrorCode(' 60062001 ')).toBe('6006')
    expect(leadingErrorCode(600)).toBeNull()
    expect(leadingErrorCode('abc')).toBeNull()
    expect(leadingErrorCode(null)).toBeNull()
    expect(leadingErrorCode({ code: 6006 })).toBeNull()
  })

  it('treats 6002 / 6003 / 6006 (and composites) as session errors, nothing else', () => {
    for (const code of [6002, 6003, 6006, '6006', 60062013, 60031001]) expect(isSessionError(code)).toBe(true)
    for (const code of [6007, 60072013, 6001, 6008, 1001, 2013, 3016, 0, '', null, undefined, NaN]) {
      expect(isSessionError(code)).toBe(false)
    }
  })

  it('finds the code in the Player API error payload', () => {
    expect(errorCodeOf({ code: 6006, message: 'x', payload: { code: 6006, shaka: 6006, vdo: 0, wasSuppressed: false } })).toBe(6006)
    expect(errorCodeOf({ message: 'x', payload: { code: 60072013, shaka: 6007 } })).toBe(60072013)
    expect(errorCodeOf({ payload: { shaka: 6003 } })).toBe(6003)
    expect(errorCodeOf({ message: 'no code' })).toBeNull()
    expect(errorCodeOf('6006')).toBeNull()
    expect(errorCodeOf(null)).toBeNull()
  })
})

describe('vdoPlayerPolicy recovery backoff', () => {
  it('waits 2 s, then 4 s, then gives up', () => {
    expect(MAX_AUTO_RECOVERIES).toBe(2)
    expect(recoveryDelayMs(1)).toBe(2000)
    expect(recoveryDelayMs(2)).toBe(4000)
    expect(recoveryDelayMs(3)).toBeNull()
    expect(recoveryDelayMs(0)).toBeNull()
    expect(recoveryDelayMs(1.5)).toBeNull()
  })
})

describe('vdoPlayerPolicy adaptive release gap', () => {
  it('detects Android', () => {
    expect(isAndroidUa(ANDROID)).toBe(true)
    expect(isAndroidUa(DESKTOP)).toBe(false)
    expect(isAndroidUa(IPHONE)).toBe(false)
    expect(isAndroidUa(undefined)).toBe(false)
  })

  it('needs no gap after a VdoCipher player that never opened a session', () => {
    expect(adaptiveReleaseGapMs({ kind: 'vdocipher', hadSession: false }, ANDROID)).toBe(0)
    expect(adaptiveReleaseGapMs({ hadSession: false }, DESKTOP)).toBe(0)
  })

  it('waits at least 1500 ms on Android and 800 ms elsewhere after an open session', () => {
    expect(adaptiveReleaseGapMs({ kind: 'vdocipher', hadSession: true }, ANDROID)).toBeGreaterThanOrEqual(1500)
    expect(adaptiveReleaseGapMs({ kind: 'vdocipher', hadSession: true }, DESKTOP)).toBe(800)
    expect(adaptiveReleaseGapMs({ kind: 'vdocipher', hadSession: true }, IPHONE)).toBe(800)
  })

  it('assumes a session when it does not know', () => {
    expect(adaptiveReleaseGapMs({}, ANDROID)).toBe(adaptiveReleaseGapMs({ hadSession: true }, ANDROID))
    expect(adaptiveReleaseGapMs({ kind: 'vdocipher' }, DESKTOP)).toBe(800)
  })

  it('keeps a moderate gap after a self-hosted or Vimeo player', () => {
    const hasifAndroid = adaptiveReleaseGapMs({ kind: 'hasif' }, ANDROID)
    expect(hasifAndroid).toBeGreaterThan(0)
    expect(hasifAndroid).toBeLessThan(adaptiveReleaseGapMs({ hadSession: true }, ANDROID))
    expect(adaptiveReleaseGapMs({ kind: 'hasif' }, DESKTOP)).toBeGreaterThan(0)
    expect(adaptiveReleaseGapMs({ kind: 'vimeo' }, ANDROID)).toBeGreaterThan(0)
    expect(adaptiveReleaseGapMs({ kind: 'vimeo' }, DESKTOP)).toBeGreaterThan(0)
  })
})

describe('vdoPlayerPolicy decideSwitch', () => {
  const base: SwitchInput = {
    hasPlayer: true,
    sameTarget: false,
    currentIsV2: true,
    mayHoldSession: false,
    playConfirmed: false,
    apiReady: true,
    nextIsV2: true,
    nextHasCredentials: true,
  }

  it('builds a player when there is none', () => {
    expect(decideSwitch({ ...base, hasPlayer: false })).toEqual({ action: 'create' })
    expect(decideSwitch({ ...base, hasPlayer: false, sameTarget: true })).toEqual({ action: 'create' })
  })

  it('does nothing when the wanted video is already loaded', () => {
    expect(decideSwitch({ ...base, sameTarget: true, mayHoldSession: true, playConfirmed: true })).toEqual({ action: 'none' })
  })

  it('never played, API watching: rebuilds, with nothing to release', () => {
    expect(decideSwitch(base)).toEqual({ action: 'recreate', hadSession: false })
  })

  it('never played but NO API to confirm it: rebuilds as "unknown", never as "no session"', () => {
    expect(decideSwitch({ ...base, apiReady: false })).toEqual({ action: 'recreate', hadSession: undefined })
  })

  it('playback confirmed for the current video: switches inside the player with loadVideo', () => {
    expect(decideSwitch({ ...base, mayHoldSession: true, playConfirmed: true })).toEqual({ action: 'load-video' })
  })

  it('a tap alone (no play event yet) NEVER selects loadVideo — the player would ignore it', () => {
    // Lite player just tapped, or still initialising, or a previous loadVideo not yet playing.
    expect(decideSwitch({ ...base, mayHoldSession: true, playConfirmed: false })).toEqual({ action: 'recreate', hadSession: true })
  })

  it('played but loadVideo is impossible: graceful rebuild that counts as a released session', () => {
    const rebuilt = { action: 'recreate', hadSession: true }
    const played = { ...base, mayHoldSession: true, playConfirmed: true }
    expect(decideSwitch({ ...played, apiReady: false })).toEqual(rebuilt)
    expect(decideSwitch({ ...played, nextIsV2: false })).toEqual(rebuilt)
    expect(decideSwitch({ ...played, nextHasCredentials: false })).toEqual(rebuilt)
  })

  it('legacy 1.x player: always holds a session and can only be rebuilt', () => {
    expect(decideSwitch({ ...base, currentIsV2: false })).toEqual({ action: 'recreate', hadSession: true })
    expect(decideSwitch({ ...base, currentIsV2: false, mayHoldSession: true, playConfirmed: true })).toEqual({ action: 'recreate', hadSession: true })
  })
})

describe('vdoPlayerPolicy LatestOnlyQueue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  // A run() the test settles by hand.
  function manual(): { run: jest.Mock<Promise<void>, [string]>; settle: (ok?: boolean) => Promise<void>; active: () => number } {
    let resolve: (() => void) | null = null
    let reject: ((e: Error) => void) | null = null
    let active = 0
    const run = jest.fn((_: string) => {
      active++
      return new Promise<void>((res, rej) => {
        resolve = res
        reject = rej
      }).finally(() => {
        active--
      })
    })
    return {
      run,
      active: () => active,
      settle: async (ok = true) => {
        if (ok) resolve?.()
        else reject?.(new Error('boom'))
        await Promise.resolve()
        await Promise.resolve()
        await Promise.resolve()
      },
    }
  }

  it('trailing debounce: rapid requests collapse to the last target', () => {
    const m = manual()
    const q = new LatestOnlyQueue<string>({ debounceMs: 400, run: m.run })
    q.request('L2')
    jest.advanceTimersByTime(300)
    q.request('L3')
    jest.advanceTimersByTime(300)
    q.request('L8')
    expect(m.run).not.toHaveBeenCalled()
    jest.advanceTimersByTime(399)
    expect(m.run).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(m.run).toHaveBeenCalledTimes(1)
    expect(m.run).toHaveBeenCalledWith('L8')
  })

  it('immediate requests skip the debounce', () => {
    const m = manual()
    const q = new LatestOnlyQueue<string>({ debounceMs: 400, run: m.run })
    q.request('L1', true)
    expect(m.run).toHaveBeenCalledWith('L1')
  })

  it('serialises: nothing starts while a run is in flight, then only the last parked target runs', async () => {
    const m = manual()
    const q = new LatestOnlyQueue<string>({ debounceMs: 400, run: m.run })
    q.request('L1', true)
    q.request('L2')
    q.request('L3', true) // even "immediate" must wait for the run in flight
    jest.advanceTimersByTime(5000)
    expect(m.run).toHaveBeenCalledTimes(1)
    expect(m.active()).toBe(1)
    expect(q.busy).toBe(true)
    await m.settle()
    expect(m.run).toHaveBeenCalledTimes(2)
    expect(m.run).toHaveBeenLastCalledWith('L3')
    expect(m.active()).toBe(1)
    await m.settle()
    expect(m.run).toHaveBeenCalledTimes(2)
    expect(q.busy).toBe(false)
  })

  it('keeps going after a run rejects or throws', async () => {
    const m = manual()
    const q = new LatestOnlyQueue<string>({ debounceMs: 0, run: m.run })
    q.request('L1')
    q.request('L2')
    await m.settle(false)
    expect(m.run).toHaveBeenLastCalledWith('L2')
    await m.settle()

    const thrower = jest.fn((): Promise<void> => {
      throw new Error('sync')
    })
    const q2 = new LatestOnlyQueue<string>({ debounceMs: 0, run: thrower })
    q2.request('a')
    await Promise.resolve()
    await Promise.resolve()
    q2.request('b')
    expect(thrower).toHaveBeenCalledTimes(2)
  })

  it('cancel drops what has not started; stop refuses new requests', async () => {
    const m = manual()
    const q = new LatestOnlyQueue<string>({ debounceMs: 400, run: m.run })
    q.request('L2')
    q.cancel()
    jest.advanceTimersByTime(1000)
    expect(m.run).not.toHaveBeenCalled()
    q.request('L3', true)
    q.request('L4')
    q.cancel() // L4 dropped, L3 still running
    await m.settle()
    expect(m.run).toHaveBeenCalledTimes(1)
    q.stop()
    q.request('L5', true)
    expect(m.run).toHaveBeenCalledTimes(1)
  })
})
