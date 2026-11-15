// =============================================================================
// useVideoJsPlayer — reactive bridge over a video.js 8 instance.
//
// Owns the video.js lifecycle for the self-hosted HLS (TYPE_HASIF) stream and
// exposes its media state as Vue reactivity plus a set of intent methods. The
// player is created with `controls: false` — video.js renders NO chrome of its
// own; our `ClassroomVideoControls.vue` drives it through the methods returned
// here. Fullscreen is intentionally NOT handled here: it belongs to the shell
// element (video + custom controls), which the wrapper component owns, so the
// controls stay visible in fullscreen. See TypeHasifHlsPlayer.vue.
//
// The stream is **plain AES-128 HLS** (standard HLS encryption — NOT DRM). The
// decryption key is fetched from the manifest's #EXT-X-KEY URI automatically.
// Apple's WebKit (Safari + every iOS/iPadOS browser) plays AES-128 HLS NATIVELY
// but its MSE/JS path is unreliable, so on native-HLS browsers we must let the
// browser play natively (see `mount`). Desktop Chrome/Firefox have no native
// HLS and keep the VHS (MSE) path. No EME / ClearKey is involved.
// =============================================================================
import { onBeforeUnmount, reactive, ref } from 'vue'
import { getPlayerArbiter } from 'src/utils/singleActivePlayer'
import videojs from 'video.js'
import 'videojs-contrib-quality-levels'
import 'video.js/dist/video-js.css'

type PlayerInstance = ReturnType<typeof videojs>

/** A single adaptive rendition the user can lock to, plus the synthetic 'auto'. */
export interface QualityOption {
  /** 'auto' or the stringified quality-level index. */
  id: string
  /** Vertical resolution in px, when the manifest reports it. */
  height: number | null
  /** Display label, e.g. "1080p" or "Auto". */
  label: string
}

export interface VideoJsState {
  ready: boolean
  playing: boolean
  /** True while the player is stalled waiting for data (spinner). */
  buffering: boolean
  ended: boolean
  currentTime: number
  duration: number
  /** End of the contiguous buffered range from 0 — drives the buffer bar. */
  bufferedEnd: number
  volume: number
  muted: boolean
  rate: number
  /** Height (px) of the picture actually being decoded; 0 until known. Lets
   *  the quality button say what "auto" is playing right now. */
  videoHeight: number
  error: string | null
}

// video.js plugin surfaces that aren't in the base typings. We model only what
// we call — no `any`.
interface QualityLevel {
  height?: number | null
  enabled: boolean
}
interface QualityLevelList {
  length: number
  readonly [index: number]: QualityLevel
  /** Index of the rendition being downloaded right now, or -1. */
  readonly selectedIndex?: number
  on(event: string, cb: () => void): void
}
interface PluginSurface {
  qualityLevels?: () => QualityLevelList
}

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

/**
 * What the student chose, for the rest of this visit to the app. The classroom
 * mounts a NEW player (and a new instance of this composable) for every Hasif
 * lesson, so without this a student watching at 1.5× / 360p would have to pick
 * both again on each lesson. In memory only: a reload starts from the defaults.
 */
const sessionPrefs: { rate: number; height: number | null } = { rate: 1, height: null }

export interface UseVideoJsPlayerCallbacks {
  onBegin?: () => void
  onProgress?: (seconds: number, duration: number) => void
  onComplete?: () => void
  onError?: (message: string) => void
}

export function useVideoJsPlayer(cb: UseVideoJsPlayerCallbacks = {}) {
  const state = reactive<VideoJsState>({
    ready: false,
    playing: false,
    buffering: false,
    ended: false,
    currentTime: 0,
    duration: 0,
    bufferedEnd: 0,
    volume: 1,
    muted: false,
    rate: 1,
    videoHeight: 0,
    error: null,
  })

  const qualities = ref<QualityOption[]>([])
  /** 'auto' or a level index as string. */
  const activeQualityId = ref<string>('auto')

  let player: PlayerInstance | null = null
  /** The <video> itself (video.js keeps using the element it was given). */
  let mediaEl: HTMLVideoElement | null = null
  let levels: QualityLevelList | null = null
  let beginEmitted = false
  let hasSource = false
  /** Height the student locked quality to (null = auto). Kept across lessons:
   *  each new source brings a fresh level list with everything enabled, so
   *  the lock is re-applied by height (or dropped to auto when that height
   *  does not exist in the new ladder) — the label never lies. */
  let preferredHeight: number | null = sessionPrefs.height

  function buildSrc(uuid: string): string {
    return `https://video.cdn1.stc.training/stream/hls/${uuid}/playlist.m3u8`
  }

  function refreshQualities(): void {
    if (!levels) return
    const out: QualityOption[] = [{ id: 'auto', height: null, label: 'Auto' }]
    for (let i = 0; i < levels.length; i++) {
      const h = levels[i]?.height ?? null
      out.push({ id: String(i), height: h, label: h ? `${h}p` : `#${i + 1}` })
    }
    // Highest resolution first (after Auto) — the order users expect.
    const auto = out[0]!
    const rest = out.slice(1).sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
    qualities.value = [auto, ...rest]
    applyPreferredQuality()
  }

  /**
   * Enable exactly rendition `target`, or everything (ABR) for -1.
   *
   * `immediate` (a choice the student just made): VHS only does its fast
   * switch — drop the forward buffer and refetch from the playhead — when a
   * rendition goes disabled → enabled, and it switches TO that rendition
   * (debounced, last call wins). Merely disabling the others leaves up to
   * ~30 s of the old quality in the buffer, so the picture would change half
   * a minute after the tap. We therefore finish with an off → on toggle of:
   *   - the chosen rendition (lock)  → fast switch to it, now;
   *   - the one already playing (auto) → VHS sees "same as current" and keeps
   *     the buffer; ABR simply takes over from the next segment.
   */
  function enableOnly(target: number, immediate: boolean): void {
    if (!levels) return
    const last = !immediate ? -1 : target === -1 ? (levels.selectedIndex ?? -1) : target
    for (let i = 0; i < levels.length; i++) {
      if (i === last) continue
      const level = levels[i]
      const enable = target === -1 || i === target
      if (level && level.enabled !== enable) level.enabled = enable
    }
    const lastLevel = last >= 0 ? levels[last] : undefined
    if (lastLevel) {
      if (lastLevel.enabled) lastLevel.enabled = false
      lastLevel.enabled = true
    }
  }

  /** Apply the remembered lock (by height) to the current level list. */
  function applyPreferredQuality(immediate = false): void {
    if (!levels) return
    let target = -1
    if (preferredHeight !== null) {
      for (let i = 0; i < levels.length; i++) {
        if (levels[i]?.height === preferredHeight) { target = i; break }
      }
    }
    enableOnly(target, immediate)
    activeQualityId.value = target === -1 ? 'auto' : String(target)
  }

  /** The speed really in effect. Read from the element: video.js's own
   *  getter answers from a cache that only follows 'ratechange' events, and a
   *  source load can change the rate without one. */
  function actualRate(): number {
    const fromEl = mediaEl?.playbackRate
    if (typeof fromEl === 'number' && fromEl > 0) return fromEl
    return player?.playbackRate() ?? 1
  }

  function syncVideoHeight(): void {
    if (!player) return
    try {
      state.videoHeight = player.videoHeight() ?? 0
    } catch {
      /* tech not ready */
    }
  }

  function syncBuffered(): void {
    if (!player) return
    try {
      state.bufferedEnd = player.bufferedEnd() ?? 0
    } catch {
      /* no buffered range yet */
    }
  }

  function mount(el: HTMLVideoElement): void {
    // Should we let the browser play HLS natively (vs video.js's VHS/MSE)?
    // YES on Apple's WebKit (Safari / iOS / iPadOS) — forcing VHS there breaks
    // playback on iPad/iPhone. NO on desktop Chrome/Firefox — they need VHS for
    // the AES-128 stream AND for the quality-level selector.
    // NOTE: do NOT use video.canPlayType('application/vnd.apple.mpegurl') —
    // Chrome lies and returns "maybe" for it, which would wrongly disable VHS
    // on desktop (kills the quality menu). video.js's browser flags are correct.
    const nativeHls = videojs.browser.IS_ANY_SAFARI || videojs.browser.IS_IPAD
    mediaEl = el

    player = videojs(el, {
      controls: false,
      // 'metadata' fetches only the HLS manifest (duration + quality levels) up
      // front, NOT the media segments — so opening a lesson no longer kicks off
      // segment downloads that compete with the page's GraphQL requests before
      // the user even presses play (a cause of the "slow / won't load" reports).
      preload: 'metadata',
      playbackRates: [...PLAYBACK_RATES],
      html5: {
        // On native-HLS browsers (Apple), DON'T override native or playback
        // dies on iPad/iPhone; let WebKit decrypt the AES-128 stream itself.
        // Elsewhere keep the VHS (MSE) path that powers the quality selector.
        nativeAudioTracks: nativeHls,
        nativeVideoTracks: nativeHls,
        vhs: { cacheEncryptionKeys: true, overrideNative: !nativeHls },
      },
    })

    player.ready(() => {
      const p = player as unknown as PluginSurface
      if (typeof p.qualityLevels === 'function') {
        levels = p.qualityLevels()
        levels.on('addqualitylevel', refreshQualities)
        levels.on('removequalitylevel', refreshQualities)
        refreshQualities()
      }
      if (sessionPrefs.rate !== 1) applyRate(sessionPrefs.rate)
      state.ready = true
      state.volume = player?.volume() ?? 1
      state.muted = player?.muted() ?? false
      state.rate = actualRate()
    })

    player.on('play', () => {
      state.playing = true
      state.ended = false
      if (!beginEmitted) {
        beginEmitted = true
        cb.onBegin?.()
      }
    })
    player.on('pause', () => { state.playing = false })
    player.on('waiting', () => { state.buffering = true })
    player.on('playing', () => { state.buffering = false })
    player.on('timeupdate', () => {
      if (!player) return
      state.currentTime = player.currentTime() ?? 0
      state.duration = player.duration() ?? 0
      syncBuffered()
      cb.onProgress?.(state.currentTime, state.duration)
    })
    player.on('progress', syncBuffered)
    player.on('durationchange', () => { state.duration = player?.duration() ?? 0 })
    player.on('volumechange', () => {
      if (!player) return
      state.volume = player.volume() ?? 0
      state.muted = player.muted() ?? false
    })
    player.on('ratechange', () => { state.rate = actualRate() })
    // 'resize' fires on the media element whenever the decoded picture size
    // changes — i.e. on every real rendition switch (ABR or manual).
    player.on(['resize', 'loadedmetadata', 'playing'], syncVideoHeight)
    // A freshly loaded source may come up at the element's default rate
    // without a 'ratechange' we can rely on — re-assert the chosen speed.
    player.on('loadedmetadata', () => {
      if (!player) return
      if (actualRate() !== sessionPrefs.rate) applyRate(sessionPrefs.rate)
      state.rate = actualRate()
    })
    player.on('ended', () => {
      state.playing = false
      state.ended = true
      cb.onComplete?.()
    })
    player.on('error', () => {
      const message = player?.error()?.message ?? 'TypeHasif player error'
      state.error = message
      cb.onError?.(message)
    })
  }

  function loadSource(uuid: string): void {
    if (!player || !uuid) return
    beginEmitted = false
    state.error = null
    state.ended = false
    state.videoHeight = 0
    // Clean tech reset BETWEEN lessons (not on first load): tears down the
    // previous stream's VHS/hls segment loaders and their abort listeners.
    // Without it, a long session of source swaps on one instance leaks listeners
    // and lets stale segment requests interfere with the new source ("video
    // won't load"). reset() reverts volume/rate to defaults, so preserve them.
    if (hasSource) {
      try {
        const vol = player.volume() ?? 1
        const mut = player.muted() ?? false
        const rate = actualRate()
        player.reset()
        player.volume(vol)
        player.muted(mut)
        player.defaultPlaybackRate(rate)
        player.playbackRate(rate)
      } catch { /* ignore — fall through to src() */ }
    }
    // Plain AES-128 HLS: VHS (desktop) and native HLS (Apple) both fetch the
    // key from the manifest's #EXT-X-KEY URI automatically — no EME/keySystems.
    const source = {
      src: buildSrc(uuid),
      type: 'application/vnd.apple.mpegurl',
    }
    player.src(source)
    hasSource = true
  }

  // --- intent methods -------------------------------------------------------
  function play(): void { void player?.play() }
  function pause(): void { player?.pause() }
  function togglePlay(): void {
    if (!player) return
    if (player.paused()) void player.play()
    else player.pause()
  }
  function seek(time: number): void {
    if (!player) return
    const d = player.duration() ?? 0
    player.currentTime(Math.max(0, d ? Math.min(time, d) : time))
  }
  function skip(delta: number): void {
    if (!player) return
    seek((player.currentTime() ?? 0) + delta)
  }
  /** Set the speed AND the default speed: loading a source resets a media
   *  element to its default rate, so the default has to follow the choice. */
  function applyRate(rate: number): void {
    if (!player) return
    player.defaultPlaybackRate(rate)
    player.playbackRate(rate)
    state.rate = rate
  }
  function setRate(rate: number): void {
    if (!Number.isFinite(rate) || rate <= 0) return
    sessionPrefs.rate = rate
    applyRate(rate)
  }
  function setVolume(v: number): void {
    if (!player) return
    const vol = Math.max(0, Math.min(1, v))
    player.volume(vol)
    if (vol > 0 && player.muted()) player.muted(false)
  }
  function toggleMute(): void {
    if (!player) return
    player.muted(!player.muted())
  }
  function setQuality(id: string): void {
    if (!levels) return
    const index = id === 'auto' ? -1 : Number(id)
    const picked = Number.isInteger(index) && index >= 0 ? levels[index] : undefined
    preferredHeight = picked?.height ?? null
    sessionPrefs.height = preferredHeight
    if (picked && preferredHeight === null) {
      // Rendition without a reported height: lock by index for this source only.
      enableOnly(index, true)
      activeQualityId.value = id
      return
    }
    applyPreferredQuality(true)
  }

  function dispose(): void {
    if (player) {
      try { player.dispose() } catch { /* ignore */ }
      player = null
      mediaEl = null
      levels = null
      // Tell the single-player arbiter a <video> was just destroyed, so a
      // VdoCipher (DRM) player never starts 0 ms after this one let go of the
      // decoder — it waits a moderate gap first.
      getPlayerArbiter().noteRelease({ kind: 'hasif' })
    }
  }

  onBeforeUnmount(dispose)

  return {
    state,
    qualities,
    activeQualityId,
    mount,
    loadSource,
    play,
    pause,
    togglePlay,
    seek,
    skip,
    setRate,
    setVolume,
    toggleMute,
    setQuality,
    dispose,
  }
}
