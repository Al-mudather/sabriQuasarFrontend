// The ONE persistent VdoCipher player of a classroom session (DOM side).
// Decisions are pure and live in src/utils/vdoPlayerPolicy.ts.
//
// Why this exists — "Error 6006. Multiple active videos…":
//   Every non-lite VdoCipher player opens a Widevine session the moment its
//   iframe loads, and never closes it when the iframe is removed. The old
//   classroom built a fresh iframe per lesson, so browsing four lessons opened
//   and abandoned four sessions within seconds; low-end Android phones then
//   refuse the next one (6006).
//
// What this controller does instead:
//   - builds the player in LITE mode (no licence / media until the student
//     taps play), so lessons that are only opened cost no session;
//   - keeps ONE iframe for the whole classroom visit. Once it has played, the
//     next VdoCipher lesson is loaded INSIDE it with the vendor Player API
//     (`player.api.loadVideo`), which closes the old session before opening
//     the next. A player that never played is simply rebuilt (nothing to
//     release);
//   - serialises switches: only the last lesson tapped is loaded, never two
//     loads at once (LatestOnlyQueue);
//   - listens for player errors; on the session-failure family (6002 / 6003 /
//     6006) it rebuilds the player after a backoff, twice, then reports
//     `failed` so the UI can show the help panel;
//   - tears down gracefully: about:blank, wait for that document to load,
//     THEN remove the iframe and start the (adaptive) release gap.

import logger from 'src/utils/logger'
import {
  VDOCIPHER_API_SCRIPT,
  VDOCIPHER_IFRAME_ALLOW,
  extractVdoCipherCredentials,
  isV2PlayerUrl,
  withLiteMode,
  type VdoCipherCredentials,
} from 'src/utils/vdocipher'
import {
  LatestOnlyQueue,
  decideSwitch,
  errorCodeOf,
  isSessionError,
  recoveryDelayMs,
  type ReleaseInfo,
} from 'src/utils/vdoPlayerPolicy'

// --- Vendor Player API (https://player.vdocipher.com/v2/api.js) -------------

interface VdoEventTarget {
  addEventListener: (event: string, handler: (payload: unknown) => void) => unknown
}

export interface VdoPlayerInstance {
  /** Proxy of the <video> inside the iframe: media events (play, ended…). */
  video: VdoEventTarget
  api: VdoEventTarget & {
    loadVideo: (credentials: VdoCipherCredentials) => Promise<unknown> | unknown
  }
}

export interface VdoPlayerStatic {
  getInstance: (iframe: HTMLIFrameElement) => VdoPlayerInstance
}

type VdoWindow = Window & {
  VdoPlayer?: VdoPlayerStatic
  onVdoPlayerV2APIReady?: () => void
}

let apiPromise: Promise<VdoPlayerStatic | null> | null = null

/**
 * Load api.js once. Resolves null when it cannot be had (blocked, offline,
 * timeout) — callers then fall back to rebuilding the iframe. A failed load is
 * not cached, so a later lesson can try again.
 */
export function loadVdoPlayerApi(timeoutMs = 8000): Promise<VdoPlayerStatic | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve(null)
  const w = window as VdoWindow
  if (w.VdoPlayer?.getInstance) return Promise.resolve(w.VdoPlayer)
  if (apiPromise) return apiPromise
  const attempt = new Promise<VdoPlayerStatic | null>((resolve) => {
    let settled = false
    const finish = (): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(w.VdoPlayer?.getInstance ? w.VdoPlayer : null)
    }
    const timer = setTimeout(finish, timeoutMs)
    // api.js calls `onVdoPlayerV2APIReady` BEFORE it assigns `window.VdoPlayer`
    // (verified against the live bundle), so the callback must not read it in
    // the same tick. The script's `load` event — fired after the whole file
    // ran — is the reliable signal; the callback is only a deferred second.
    const previous = w.onVdoPlayerV2APIReady
    w.onVdoPlayerV2APIReady = () => {
      try {
        previous?.()
      } catch { /* not ours */ }
      setTimeout(() => {
        if (w.VdoPlayer?.getInstance) finish()
      }, 0)
    }
    const script = document.createElement('script')
    script.src = VDOCIPHER_API_SCRIPT
    script.async = true
    script.onload = finish
    script.onerror = finish
    document.head.appendChild(script)
  })
  apiPromise = attempt
  void attempt.then((api) => {
    if (!api && apiPromise === attempt) apiPromise = null
  })
  return attempt
}

// --- Session ----------------------------------------------------------------

export interface VdoTarget {
  /** Player URL parsed out of the stored embed (never logged). */
  src: string
  title: string
}

/**
 *  - `idle`       nothing loaded (not started, or stopped);
 *  - `loading`    a player is being built / a video is being switched in;
 *  - `ready`      the wanted video is loaded in the player;
 *  - `recovering` a session error happened; rebuilding after a backoff;
 *  - `failed`     automatic recovery gave up — show the help panel.
 */
export type VdoSessionPhase = 'idle' | 'loading' | 'ready' | 'recovering' | 'failed'

export interface VdoSessionArbiter {
  noteRelease: (info: ReleaseInfo) => void
  gapLeftMs: () => number
}

export interface VdoCipherSessionOptions {
  /** Element the iframe is appended to (owned by the component). */
  host: () => HTMLElement | null
  arbiter: VdoSessionArbiter
  onPhase: (phase: VdoSessionPhase) => void
  /** Class put on the iframe (the component styles it). */
  frameClass?: string
  /** Trailing debounce between lesson taps. */
  debounceMs?: number
  loadApi?: () => Promise<VdoPlayerStatic | null>
  /** How long to wait for the about:blank document before removing anyway. */
  blankTimeoutMs?: number
  /** How long a loadVideo may take to show a sign of life. */
  loadVideoSettleMs?: number
}

/**
 * How a `loadVideo` proves it really happened (measured on real Chrome):
 *   loadVideo() → abort, `emptied` (old media dropped, ~5 ms)
 *               → `emptied`, `loadstart` (new media, 0.2–0.7 s) → loadedmetadata → play → playing
 * The vendor player ACCEPTS the message and silently does nothing when it has
 * no playback tech yet (lite mode, still initialising after the tap, a
 * previous loadVideo still initialising). So success is `emptied` AFTER our
 * call, followed by one of these — never the promise, never a timeout.
 */
const SWITCH_SIGNS = ['loadstart', 'loadedmetadata'] as const

/** Result of watching one loadVideo. */
interface SwitchWatch {
  sawEmptied: boolean
  settle: (ok: boolean) => void
}

const live = new Set<VdoCipherSession>()

/**
 * Gracefully stop every VdoCipher player on the page and wait until their
 * documents are gone. Call BEFORE unmounting a player on purpose (leaving the
 * classroom, switching to a Vimeo / self-hosted / file / quiz lesson, closing
 * the preview dialog): once Vue has detached the iframe there is nothing left
 * to wait for.
 */
export async function stopVdoCipherPlayers(): Promise<void> {
  await Promise.all([...live].map((s) => s.stop().catch(() => undefined)))
}

export class VdoCipherSession {
  private iframe: HTMLIFrameElement | null = null
  private player: VdoPlayerInstance | null = null
  /** Bumped whenever the iframe is replaced: stale listeners check it. */
  private gen = 0
  /** Bumped by stop(): async work started before it gives up. */
  private epoch = 0
  private loadedSrc: string | null = null
  private wanted: VdoTarget | null = null
  /**
   * "The current player may hold a DRM session" — generous on purpose (a tap
   * inside the iframe counts). Only ever used to pick the release gap.
   */
  private mayHoldSession = false
  /**
   * A real `play` / `playing` arrived for the video loaded right now. The ONLY
   * thing that makes `loadVideo` eligible; cleared on every loadVideo and
   * re-armed by the next play of the new video.
   */
  private playConfirmed = false
  /** In-flight graceful teardown; a new iframe waits for it. */
  private tearingDown: Promise<unknown> | null = null
  private recoveries = 0
  /** Set by a session error: the next run rebuilds after this delay. */
  private rebuildDelayMs: number | null = null
  private switchWatch: SwitchWatch | null = null
  /** Was the current iframe built from a v2 URL (false → legacy 1.x)? */
  private builtV2 = false
  /** Wake-ups for in-flight waits, fired by stop() so nothing lingers. */
  private readonly waiters = new Set<() => void>()
  private phase: VdoSessionPhase = 'idle'
  private destroyed = false
  private readonly queue: LatestOnlyQueue<VdoTarget>
  private readonly opts: VdoCipherSessionOptions

  constructor(opts: VdoCipherSessionOptions) {
    this.opts = opts
    this.queue = new LatestOnlyQueue<VdoTarget>({
      debounceMs: opts.debounceMs ?? 350,
      run: (target) => this.run(target),
    })
    if (typeof window !== 'undefined') window.addEventListener('blur', this.onWindowBlur)
    live.add(this)
  }

  /** Raw player URL of the video actually loaded right now (null if none). */
  get loaded(): string | null {
    return this.loadedSrc
  }

  /** True when the current player may hold a DRM session (tapped / played). */
  get hasSession(): boolean {
    return this.iframe !== null && this.mayHoldSession
  }

  /** True when playback of the loaded video was confirmed by the player. */
  get canSwitchInPlace(): boolean {
    return this.iframe !== null && this.player !== null && this.playConfirmed
  }

  /** Show this video. Rapid calls collapse to the last one. */
  show(target: VdoTarget): void {
    if (this.destroyed) return
    const previous = this.wanted
    this.wanted = target
    if (this.phase === 'failed') {
      // Same lesson: the help panel's retry button decides. Another lesson is
      // an explicit new request: start over with a fresh player.
      if (target.src !== previous?.src) this.retry()
      return
    }
    const first = this.iframe === null && !this.queue.busy
    if (this.iframe === null) this.setPhase('loading')
    this.queue.request(target, first)
  }

  /** Help-panel "retry" / "play here" after a failure: a fresh attempt. */
  retry(target?: VdoTarget): void {
    if (target) this.wanted = target
    if (this.destroyed || !this.wanted) return
    this.recoveries = 0
    this.rebuildDelayMs = null
    this.setPhase('loading')
    this.queue.request(this.wanted, true)
  }

  /**
   * Graceful stop: cancel pending switches, blank the iframe, wait for the
   * blank document, remove it. Resolves with what was released.
   */
  async stop(): Promise<ReleaseInfo> {
    this.queue.cancel()
    this.interrupt()
    this.rebuildDelayMs = null
    const info = await this.teardown()
    // A show() that arrived while we were tearing down owns the phase now.
    if (this.phase !== 'failed' && this.iframe === null && !this.queue.busy) this.setPhase('idle')
    return info
  }

  /** Synchronous stop for pagehide / freeze / component unmount. */
  stopSync(): ReleaseInfo {
    this.queue.cancel()
    this.interrupt()
    this.rebuildDelayMs = null
    const el = this.iframe
    const info = this.detach()
    if (el) {
      try {
        el.src = 'about:blank'
      } catch { /* ignore */ }
      el.remove()
      this.opts.arbiter.noteRelease(info)
    }
    if (this.phase !== 'failed') this.setPhase('idle')
    return info
  }

  /** Stop for good (component unmounted). */
  destroy(): ReleaseInfo {
    const info = this.stopSync()
    this.destroyed = true
    this.queue.stop()
    if (typeof window !== 'undefined') window.removeEventListener('blur', this.onWindowBlur)
    live.delete(this)
    return info
  }

  // -------------------------------------------------------------------------

  /** Invalidate async work in flight and wake whatever it is waiting on. */
  private interrupt(): void {
    this.epoch++
    for (const wake of [...this.waiters]) wake()
  }

  /** Sleep that stop() can cut short. */
  private pause(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const wake = (): void => {
        clearTimeout(timer)
        this.waiters.delete(wake)
        resolve()
      }
      const timer = setTimeout(wake, ms)
      this.waiters.add(wake)
    })
  }

  private setPhase(phase: VdoSessionPhase): void {
    if (this.phase === phase) return
    this.phase = phase
    this.opts.onPhase(phase)
  }

  /**
   * A tap inside a cross-origin iframe is invisible to us, but it moves focus
   * into it: the top window blurs with the iframe as activeElement. In lite
   * mode the only thing to tap is play, so treat it as "a session may be
   * open". Works even when api.js could not be loaded.
   */
  private readonly onWindowBlur = (): void => {
    if (this.iframe && document.activeElement === this.iframe) this.mayHoldSession = true
  }

  /** One serialised switch (never overlaps another). */
  private async run(target: VdoTarget): Promise<void> {
    if (this.destroyed) return
    const epoch = this.epoch
    try {
      if (this.rebuildDelayMs !== null) {
        const delay = this.rebuildDelayMs
        this.rebuildDelayMs = null
        this.setPhase('recovering')
        await this.teardown(true)
        await this.pause(delay)
        if (epoch !== this.epoch) return
        await this.create(target, epoch)
        return
      }
      const decision = decideSwitch({
        hasPlayer: this.iframe !== null,
        sameTarget: this.loadedSrc === target.src,
        currentIsV2: this.iframe !== null && this.builtV2,
        mayHoldSession: this.mayHoldSession,
        playConfirmed: this.playConfirmed,
        apiReady: this.player !== null,
        nextIsV2: isV2PlayerUrl(target.src),
        nextHasCredentials: extractVdoCipherCredentials(target.src) !== null,
      })
      switch (decision.action) {
        case 'none':
          this.iframe?.setAttribute('title', target.title || 'Video')
          this.setPhase('ready')
          return
        case 'create':
          await this.create(target, epoch)
          return
        case 'load-video':
          this.setPhase('loading')
          if (await this.loadVideo(target, epoch)) return
          // A session error during the switch: the queued recovery rebuilds.
          if (epoch !== this.epoch || this.rebuildDelayMs !== null) return
          // The player did not switch (ignored, rejected or timed out). Never
          // leave lesson A playing under lesson B's title: rebuild cleanly.
          await this.teardown(true)
          if (epoch !== this.epoch) return
          await this.create(target, epoch)
          return
        case 'recreate':
          this.setPhase('loading')
          await this.teardown(decision.hadSession)
          if (epoch !== this.epoch) return
          await this.create(target, epoch)
      }
    } catch (e) {
      logger.warn('[VdoCipher] switch failed', { message: e instanceof Error ? e.message : String(e) })
    }
  }

  /** Build a fresh (lite) player once the release gap has passed. */
  private async create(target: VdoTarget, epoch: number): Promise<void> {
    // Never two iframes: a graceful teardown still in flight finishes first.
    while (this.tearingDown) {
      await this.tearingDown.catch(() => undefined)
      if (epoch !== this.epoch) return
    }
    for (let left = this.opts.arbiter.gapLeftMs(); left > 0; left = this.opts.arbiter.gapLeftMs()) {
      await this.pause(left)
      if (epoch !== this.epoch) return
    }
    // The host is rendered by the component; right after an invalid embed is
    // replaced by a valid one it may not be in the DOM yet. Wait briefly.
    let host = this.opts.host()
    for (let tries = 0; !host && tries < 40; tries++) {
      await this.pause(25)
      if (epoch !== this.epoch || this.destroyed) return
      host = this.opts.host()
    }
    if (epoch !== this.epoch || this.destroyed) return
    if (!host) {
      // Nowhere to put a player: say so instead of spinning forever.
      this.setPhase('idle')
      return
    }
    const v2 = isV2PlayerUrl(target.src)
    const el = document.createElement('iframe')
    if (this.opts.frameClass) el.className = this.opts.frameClass
    el.setAttribute('title', target.title || 'Video')
    el.setAttribute('allow', VDOCIPHER_IFRAME_ALLOW)
    el.setAttribute('allowfullscreen', '')
    el.setAttribute('frameborder', '0')
    el.src = withLiteMode(target.src)
    host.appendChild(el)
    this.iframe = el
    this.player = null
    this.gen++
    this.builtV2 = v2
    this.loadedSrc = target.src
    // Legacy 1.x has no lite mode: it opens its session while loading.
    this.mayHoldSession = !v2
    this.playConfirmed = false
    this.setPhase('ready')
    if (v2) void this.attachApi(el, this.gen)
  }

  private async attachApi(el: HTMLIFrameElement, gen: number): Promise<void> {
    const api = await (this.opts.loadApi ?? loadVdoPlayerApi)()
    if (!api || gen !== this.gen || this.iframe !== el) return
    try {
      const player = api.getInstance(el)
      const live = (): boolean => gen === this.gen
      const onPlay = (playing: boolean): void => {
        if (!live()) return
        this.mayHoldSession = true
        // While a loadVideo is unconfirmed, a play event may still belong to
        // the video being replaced: it proves nothing about the new one.
        if (this.switchWatch) return
        this.playConfirmed = true
        if (playing) this.recoveries = 0 // it plays: the device is healthy again
      }
      player.video.addEventListener('play', () => onPlay(false))
      player.video.addEventListener('playing', () => onPlay(true))
      player.video.addEventListener('emptied', () => {
        if (live() && this.switchWatch) this.switchWatch.sawEmptied = true
      })
      for (const sign of SWITCH_SIGNS) {
        player.video.addEventListener(sign, () => {
          const watch = this.switchWatch
          if (live() && watch?.sawEmptied) watch.settle(true)
        })
      }
      // Undocumented but accepted by api.js: player-level errors.
      player.api.addEventListener('error', (payload) => {
        if (live()) this.onPlayerError(payload)
      })
      this.player = player
    } catch (e) {
      logger.warn('[VdoCipher] Player API unavailable; lessons will switch by rebuilding the player', {
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  /**
   * Swap the video inside the live player. Resolves true ONLY when the player
   * showed that it dropped the old media and started the new one; anything
   * else (ignored message, rejection, timeout, error) is false and the caller
   * rebuilds. `loadedSrc` / the title change only on that positive sign, so
   * the UI can never claim a lesson the iframe did not load.
   */
  private async loadVideo(target: VdoTarget, epoch: number): Promise<boolean> {
    const player = this.player
    const el = this.iframe
    const credentials = extractVdoCipherCredentials(target.src)
    if (!player || !el || !credentials) return false
    const settleMs = this.opts.loadVideoSettleMs ?? 6000
    let watch: SwitchWatch | null = null
    try {
      const switched = new Promise<boolean>((resolve) => {
        const mine: SwitchWatch = {
          sawEmptied: false,
          settle: (ok) => {
            // Stop watching at once: the next play event belongs to the new video.
            if (this.switchWatch === mine) this.switchWatch = null
            resolve(ok)
          },
        }
        watch = mine
        this.switchWatch = mine
      })
      // From here the old video's play state says nothing about the next one.
      this.playConfirmed = false
      this.mayHoldSession = true
      // Resolves when the message was SENT, not when the video is loaded.
      void Promise.resolve(player.api.loadVideo(credentials)).catch(() => watch?.settle(false))
      const ok = await Promise.race([switched, this.pause(settleMs).then(() => false)])
      if (epoch !== this.epoch || this.iframe !== el) return true // stopped meanwhile: nothing to rebuild
      if (!ok) {
        logger.warn('[VdoCipher] the player did not switch videos; rebuilding it')
        return false
      }
      this.loadedSrc = target.src
      el.setAttribute('title', target.title || 'Video')
      if (this.rebuildDelayMs === null) this.setPhase('ready')
      return true
    } catch (e) {
      logger.warn('[VdoCipher] loadVideo failed; rebuilding the player', {
        message: e instanceof Error ? e.message : String(e),
      })
      return false
    } finally {
      if (this.switchWatch === watch) this.switchWatch = null
    }
  }

  private onPlayerError(payload: unknown): void {
    const code = errorCodeOf(payload)
    const session = isSessionError(code)
    // Never log the payload itself: it can carry the OTP / playbackInfo.
    logger.warn('[VdoCipher] player error', {
      code,
      sessionError: session,
      recoveries: this.recoveries,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    })
    if (!session || this.rebuildDelayMs !== null || this.phase === 'recovering' || this.phase === 'failed') {
      this.switchWatch?.settle(false)
      return
    }
    const delay = recoveryDelayMs(this.recoveries + 1)
    if (delay === null) {
      // Out of automatic retries: free the player and ask the student.
      this.queue.cancel()
      this.interrupt()
      this.setPhase('failed')
      void this.teardown(true)
      return
    }
    this.recoveries++
    this.rebuildDelayMs = delay
    this.setPhase('recovering')
    // After rebuildDelayMs is set, so an in-flight switch leaves it to recovery.
    this.switchWatch?.settle(false)
    if (this.wanted) this.queue.request(this.wanted, true)
  }

  /** Forget the current iframe; returns what it held. */
  private detach(): ReleaseInfo {
    const had = this.iframe !== null
    // true: something suggested a session. false: the API was attached and saw
    // no playback. undefined: a v2 player we could not observe → unknown, which
    // the gap policy treats as "yes".
    const hadSession: boolean | undefined = !had
      ? false
      : this.mayHoldSession || this.playConfirmed
        ? true
        : this.builtV2 && this.player === null
          ? undefined
          : false
    this.iframe = null
    this.player = null
    this.loadedSrc = null
    this.mayHoldSession = false
    this.playConfirmed = false
    this.switchWatch?.settle(false)
    this.gen++
    return { kind: 'vdocipher', hadSession }
  }

  /**
   * about:blank → wait for it to load → remove → start the gap. `forceSession`
   * is for error recovery / a failed switch, where a session certainly existed.
   */
  private teardown(forceSession: boolean | undefined = false): Promise<ReleaseInfo> {
    const el = this.iframe
    const info = this.detach()
    if (forceSession === true) info.hadSession = true
    else if (forceSession === undefined && info.hadSession === false) info.hadSession = undefined
    if (!el) return Promise.resolve({ kind: 'vdocipher', hadSession: false })
    const work = (async (): Promise<ReleaseInfo> => {
      if (el.isConnected) {
        await new Promise<void>((resolve) => {
          let done = false
          const finish = (): void => {
            if (done) return
            done = true
            clearTimeout(timer)
            el.removeEventListener('load', finish)
            resolve()
          }
          const timer = setTimeout(finish, this.opts.blankTimeoutMs ?? 450)
          el.addEventListener('load', finish)
          try {
            el.src = 'about:blank'
          } catch {
            finish()
          }
        })
      }
      el.remove()
      this.opts.arbiter.noteRelease(info)
      return info
    })()
    const tracked = work.finally(() => {
      if (this.tearingDown === tracked) this.tearingDown = null
    })
    this.tearingDown = tracked
    return tracked
  }
}
