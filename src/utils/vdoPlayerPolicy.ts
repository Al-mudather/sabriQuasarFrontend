// Pure decision logic for the persistent VdoCipher player — DOM-free and
// unit-tested in test/jest/__tests__/vdoPlayerPolicy.spec.ts. The DOM side
// lives in src/composables/classroom/useVdoCipherSession.ts.
//
// Background ("Error 6006. Multiple active videos…"): 6006 is Shaka Player's
// FAILED_TO_GENERATE_LICENSE_REQUEST — the device's Widevine stack refused to
// open one more session. Android caps sessions device-wide, and VdoCipher's
// iframe never closes its session when the iframe is removed (release is left
// to garbage collection). So the rules are:
//   1. open no session until the student presses play (`litemode=true`);
//   2. once a session IS open, switch lessons inside the same player with
//      `player.api.loadVideo`, which closes the old session before opening
//      the next one;
//   3. when a player with an open session must be destroyed, give the device
//      real time before another protected player starts;
//   4. if the device still refuses, rebuild the player with backoff, then
//      tell the student what to do.

// ---------------------------------------------------------------------------
// Release gap
// ---------------------------------------------------------------------------

/** What kind of media element was just destroyed. */
export type ReleasedKind = 'vdocipher' | 'hasif' | 'vimeo'

export interface ReleaseInfo {
  kind?: ReleasedKind
  /**
   * VdoCipher only: did the destroyed player hold a DRM session (it played, or
   * it was a non-lite player)? `undefined` = unknown → treated as true.
   */
  hadSession?: boolean
}

export function isAndroidUa(ua: string | null | undefined): boolean {
  return /android/i.test(ua ?? '')
}

/**
 * How long to keep the next VdoCipher player from loading after a media
 * element was destroyed.
 *  - VdoCipher that never played (lite): no session existed → nothing to wait for.
 *  - VdoCipher with a session: ≥1500 ms on Android (slow, device-wide DRM
 *    slots), 800 ms elsewhere.
 *  - TYPE_HASIF (video.js / secure decode) and Vimeo: a moderate gap so the
 *    hardware decoder is back before a protected player asks for it.
 */
export function adaptiveReleaseGapMs(info: ReleaseInfo, ua: string | null | undefined): number {
  const android = isAndroidUa(ua)
  switch (info.kind ?? 'vdocipher') {
    case 'hasif':
      return android ? 800 : 400
    case 'vimeo':
      return android ? 500 : 250
    default:
      if (info.hadSession === false) return 0
      return android ? 1500 : 800
  }
}

// ---------------------------------------------------------------------------
// Player errors
// ---------------------------------------------------------------------------

/** Shaka DRM errors that mean "the device would not open a session". */
const SESSION_ERROR_PREFIXES = new Set(['6002', '6003', '6006'])

/**
 * First four digits of a player error code, or null. VdoCipher also emits
 * composite codes (Shaka code + its own, e.g. 60072013), hence "leading 4".
 */
export function leadingErrorCode(code: unknown): string | null {
  if (typeof code !== 'number' && typeof code !== 'string') return null
  const digits = String(code).trim()
  if (!/^\d{4,}$/.test(digits)) return null
  return digits.slice(0, 4)
}

/** True for 6002 / 6003 / 6006 and their composite forms. */
export function isSessionError(code: unknown): boolean {
  const lead = leadingErrorCode(code)
  return lead !== null && SESSION_ERROR_PREFIXES.has(lead)
}

/** Pull the numeric code out of the Player API `error` event payload. */
export function errorCodeOf(event: unknown): number | string | null {
  if (!event || typeof event !== 'object') return null
  const e = event as { code?: unknown; payload?: { code?: unknown; shaka?: unknown } | null }
  for (const c of [e.code, e.payload?.code, e.payload?.shaka]) {
    if (typeof c === 'number' || (typeof c === 'string' && c.trim() !== '')) return c
  }
  return null
}

// ---------------------------------------------------------------------------
// Automatic recovery
// ---------------------------------------------------------------------------

export const MAX_AUTO_RECOVERIES = 2
const RECOVERY_BACKOFF_MS = [2000, 4000] as const

/**
 * Wait before rebuilding the player for automatic retry number `attempt`
 * (1-based). null → stop retrying and show the help panel.
 */
export function recoveryDelayMs(attempt: number): number | null {
  if (!Number.isInteger(attempt) || attempt < 1 || attempt > MAX_AUTO_RECOVERIES) return null
  return RECOVERY_BACKOFF_MS[attempt - 1] ?? null
}

// ---------------------------------------------------------------------------
// Lesson switch policy
// ---------------------------------------------------------------------------

export interface SwitchInput {
  /** Is there a player iframe right now? */
  hasPlayer: boolean
  /** Is the wanted video the one already loaded? */
  sameTarget: boolean
  /** Is the current player a v2 player (false → legacy 1.x)? */
  currentIsV2: boolean
  /** Did the current player open a DRM session (played / loadVideo'd)? */
  sessionOpen: boolean
  /** Is the Player API attached to the current iframe? */
  apiReady: boolean
  nextIsV2: boolean
  /** Could otp + playbackInfo be read from the next embed? */
  nextHasCredentials: boolean
}

export type SwitchAction =
  /** Nothing loaded yet: build a (lite) player. */
  | { action: 'create' }
  | { action: 'none' }
  /** Session open and API ready: swap the video inside the same player. */
  | { action: 'load-video' }
  /** Destroy + build a new player. `hadSession` picks the gap. */
  | { action: 'recreate'; hadSession: boolean }

export function decideSwitch(s: SwitchInput): SwitchAction {
  if (!s.hasPlayer) return { action: 'create' }
  if (s.sameTarget) return { action: 'none' }
  // Legacy 1.x has no lite mode: it opened a session when it loaded.
  const hadSession = s.currentIsV2 ? s.sessionOpen : true
  if (!hadSession) return { action: 'recreate', hadSession: false }
  if (s.currentIsV2 && s.apiReady && s.nextIsV2 && s.nextHasCredentials) return { action: 'load-video' }
  return { action: 'recreate', hadSession: true }
}

// ---------------------------------------------------------------------------
// Serialised, latest-wins command queue with a trailing debounce
// ---------------------------------------------------------------------------

export interface LatestOnlyQueueOptions<T> {
  /** Trailing debounce: taps closer together than this collapse to the last. */
  debounceMs: number
  /** Performs one switch. Never called while a previous call is unsettled. */
  run: (target: T) => Promise<void>
  setTimer?: (fn: () => void, ms: number) => unknown
  clearTimer?: (handle: unknown) => void
}

/**
 * `request(a); request(b); request(c)` in quick succession runs only `c`.
 * A request that arrives while `run` is in flight is parked (latest wins) and
 * runs when the current one settles — two `run`s never overlap.
 */
export class LatestOnlyQueue<T> {
  private pending: { target: T } | null = null
  private timer: unknown = null
  private running = false
  private stopped = false
  private readonly opts: LatestOnlyQueueOptions<T>

  constructor(opts: LatestOnlyQueueOptions<T>) {
    this.opts = opts
  }

  get busy(): boolean {
    return this.running || this.pending !== null
  }

  /** `immediate` skips the debounce (first load, explicit retry). */
  request(target: T, immediate = false): void {
    if (this.stopped) return
    this.pending = { target }
    this.clear()
    if (this.running) return // picked up when the running switch settles
    if (immediate || this.opts.debounceMs <= 0) {
      this.drain()
      return
    }
    const set = this.opts.setTimer ?? ((fn, ms) => setTimeout(fn, ms))
    this.timer = set(() => {
      this.timer = null
      this.drain()
    }, this.opts.debounceMs)
  }

  /** Drop anything not started yet (a running switch finishes on its own). */
  cancel(): void {
    this.pending = null
    this.clear()
  }

  /** Cancel and refuse further requests (owner destroyed). */
  stop(): void {
    this.stopped = true
    this.cancel()
  }

  private clear(): void {
    if (this.timer === null) return
    const clr = this.opts.clearTimer ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>))
    clr(this.timer)
    this.timer = null
  }

  private drain(): void {
    if (this.running || this.stopped) return
    const next = this.pending
    if (!next) return
    this.pending = null
    this.running = true
    let p: Promise<void>
    try {
      p = Promise.resolve(this.opts.run(next.target))
    } catch (e) {
      p = Promise.reject(e)
    }
    const done = (): void => {
      this.running = false
      this.drain()
    }
    p.then(done, done)
  }
}
