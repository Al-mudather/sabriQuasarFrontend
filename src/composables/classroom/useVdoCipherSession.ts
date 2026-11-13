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
 * Media events that prove a `loadVideo` reached the player. Only events a NEW
 * load fires — `playing` / `canplay` could still come from the video being
 * replaced. (Real Chrome: loadstart → loadedmetadata → play → playing.)
 */
const LOAD_SIGNS = ['loadstart', 'loadedmetadata'] as const

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

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
  private sessionOpen = false
  private recoveries = 0
  /** Set by a session error: the next run rebuilds after this delay. */
  private rebuildDelayMs: number | null = null
  private loadSign: (() => void) | null = null
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

  /** True once the current player opened a DRM session (played). */
  get hasSession(): boolean {
    return this.iframe !== null && this.sessionOpen
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

  /** Help-panel "retry": start over with a fresh player. */
  retry(): void {
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
    if (this.phase !== 'failed') this.setPhase('idle')
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
    if (this.iframe && document.activeElement === this.iframe) this.sessionOpen = true
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
        sessionOpen: this.sessionOpen,
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
          if (epoch !== this.epoch) return
          // The API let us down: fall back to a clean rebuild.
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
    for (let left = this.opts.arbiter.gapLeftMs(); left > 0; left = this.opts.arbiter.gapLeftMs()) {
      await this.pause(left)
      if (epoch !== this.epoch) return
    }
    const host = this.opts.host()
    if (!host || epoch !== this.epoch || this.destroyed) return
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
    this.sessionOpen = !v2
    this.setPhase('ready')
    if (v2) void this.attachApi(el, this.gen)
  }

  private async attachApi(el: HTMLIFrameElement, gen: number): Promise<void> {
    const api = await (this.opts.loadApi ?? loadVdoPlayerApi)()
    if (!api || gen !== this.gen || this.iframe !== el) return
    try {
      const player = api.getInstance(el)
      const live = (): boolean => gen === this.gen
      player.video.addEventListener('play', () => {
        if (live()) this.sessionOpen = true
      })
      player.video.addEventListener('playing', () => {
        if (!live()) return
        this.sessionOpen = true
        this.recoveries = 0 // it plays: the device is healthy again
      })
      for (const sign of LOAD_SIGNS) {
        player.video.addEventListener(sign, () => {
          if (live()) this.loadSign?.()
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

  /** Swap the video inside the live player. False → caller must rebuild. */
  private async loadVideo(target: VdoTarget, epoch: number): Promise<boolean> {
    const player = this.player
    const el = this.iframe
    const credentials = extractVdoCipherCredentials(target.src)
    if (!player || !el || !credentials) return false
    const settleMs = this.opts.loadVideoSettleMs ?? 4000
    try {
      const sign = new Promise<void>((resolve) => {
        this.loadSign = resolve
      })
      // Resolves when the message was SENT, not when the video is loaded.
      await Promise.race([
        Promise.resolve(player.api.loadVideo(credentials)),
        sleep(settleMs).then(() => {
          throw new Error('loadVideo timed out')
        }),
      ])
      if (epoch !== this.epoch || this.iframe !== el) return true
      this.loadedSrc = target.src
      this.sessionOpen = true // loadVideo always runs non-lite and autoplays
      el.setAttribute('title', target.title || 'Video')
      // Hold the queue until the player shows a sign of life (or gives up
      // waiting), so two loadVideo calls never overlap inside the player.
      await Promise.race([sign, this.pause(settleMs)])
      if (epoch === this.epoch && this.iframe === el && this.rebuildDelayMs === null) this.setPhase('ready')
      return true
    } catch (e) {
      logger.warn('[VdoCipher] loadVideo failed; rebuilding the player', {
        message: e instanceof Error ? e.message : String(e),
      })
      return false
    } finally {
      this.loadSign = null
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
    this.loadSign?.()
    if (!session || this.rebuildDelayMs !== null || this.phase === 'recovering' || this.phase === 'failed') return
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
    if (this.wanted) this.queue.request(this.wanted, true)
  }

  /** Forget the current iframe; returns what it held. */
  private detach(): ReleaseInfo {
    const hadSession = this.iframe !== null && this.sessionOpen
    this.iframe = null
    this.player = null
    this.loadedSrc = null
    this.sessionOpen = false
    this.loadSign?.()
    this.gen++
    return { kind: 'vdocipher', hadSession }
  }

  /**
   * about:blank → wait for it to load → remove → start the gap. `forceSession`
   * is for error recovery, where a (broken) session certainly existed.
   */
  private async teardown(forceSession = false): Promise<ReleaseInfo> {
    const el = this.iframe
    const info = this.detach()
    if (forceSession) info.hadSession = true
    if (!el) return { kind: 'vdocipher', hadSession: false }
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
  }
}
