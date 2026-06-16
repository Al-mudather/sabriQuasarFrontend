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
// HLS + ClearKey DRM + adaptive quality come from video.js (VHS) and the
// contrib-eme / contrib-quality-levels plugins — none of that changes; only the
// control surface does.
// =============================================================================
import { onBeforeUnmount, reactive, ref } from 'vue'
import videojs from 'video.js'
import 'videojs-contrib-eme'
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
  on(event: string, cb: () => void): void
}
interface PluginSurface {
  eme?: () => void
  qualityLevels?: () => QualityLevelList
}

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

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
    error: null,
  })

  const qualities = ref<QualityOption[]>([])
  /** 'auto' or a level index as string. */
  const activeQualityId = ref<string>('auto')

  let player: PlayerInstance | null = null
  let levels: QualityLevelList | null = null
  let beginEmitted = false

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
    player = videojs(el, {
      controls: false,
      preload: 'auto',
      playbackRates: [...PLAYBACK_RATES],
      html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: { cacheEncryptionKeys: true, overrideNative: true },
      },
    })

    player.ready(() => {
      const p = player as unknown as PluginSurface
      if (typeof p.eme === 'function') p.eme()
      if (typeof p.qualityLevels === 'function') {
        levels = p.qualityLevels()
        levels.on('addqualitylevel', refreshQualities)
        levels.on('removequalitylevel', refreshQualities)
        refreshQualities()
      }
      state.ready = true
      state.volume = player?.volume() ?? 1
      state.muted = player?.muted() ?? false
      state.rate = player?.playbackRate() ?? 1
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
    player.on('ratechange', () => { state.rate = player?.playbackRate() ?? 1 })
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
    const source = {
      src: buildSrc(uuid),
      type: 'application/vnd.apple.mpegurl',
      // ClearKey DRM — backend serves the key when the manifest requests it.
      keySystems: { 'org.w3.clearkey': {} },
    }
    player.src(source as unknown as Parameters<PlayerInstance['src']>[0])
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
  function setRate(rate: number): void { player?.playbackRate(rate) }
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
    const target = id === 'auto' ? -1 : Number(id)
    for (let i = 0; i < levels.length; i++) {
      levels[i]!.enabled = target === -1 || i === target
    }
    activeQualityId.value = id
  }

  function dispose(): void {
    if (player) {
      try { player.dispose() } catch { /* ignore */ }
      player = null
      levels = null
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
