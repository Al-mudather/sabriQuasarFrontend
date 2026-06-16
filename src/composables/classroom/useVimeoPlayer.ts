// =============================================================================
// useVimeoPlayer — reactive bridge over the @vimeo/player SDK.
//
// The Vimeo twin of useVideoJsPlayer: it returns the SAME shape (reactive
// `state` + `qualities`/`activeQualityId` + intent methods) so the shared
// ClassroomVideoControls.vue drives it unchanged. The embed is created with
// `controls: false`, hiding Vimeo's native chrome; our custom bar takes over.
//
// Vimeo's SDK is Promise-based and event-driven, so state is kept in sync from
// the player's own events (timeupdate / progress / volumechange / …) rather
// than polled. Mute is implemented via a remembered volume (setMuted isn't
// reliable across embed privacy settings).
// =============================================================================
import { onBeforeUnmount, reactive, ref } from 'vue'
import Player from '@vimeo/player'
import type { QualityOption } from 'src/composables/classroom/useVideoJsPlayer'

export interface VimeoState {
  ready: boolean
  playing: boolean
  buffering: boolean
  ended: boolean
  currentTime: number
  duration: number
  bufferedEnd: number
  volume: number
  muted: boolean
  rate: number
  error: string | null
}

export interface UseVimeoPlayerCallbacks {
  onBegin?: () => void
  onProgress?: (seconds: number, duration: number) => void
  onComplete?: () => void
  onError?: (message: string) => void
}

// Minimal shapes for the Vimeo SDK payloads we read (the package ships types,
// but we keep our own narrow ones for the event callbacks we use).
interface TimePayload { seconds: number; percent: number; duration: number }
interface VolumePayload { volume: number }
interface RatePayload { playbackRate: number }
interface VimeoQuality { id: string; label?: string; active?: boolean }

export function useVimeoPlayer(cb: UseVimeoPlayerCallbacks = {}) {
  const state = reactive<VimeoState>({
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
  const activeQualityId = ref<string>('auto')

  let player: Player | null = null
  let beginEmitted = false
  // Volume to restore when unmuting (Vimeo has no reliable cross-embed mute).
  let lastVolume = 1

  function parseHeight(label: string | undefined): number | null {
    if (!label) return null
    const m = /(\d{3,4})p/i.exec(label)
    return m ? Number(m[1]) : null
  }

  async function refreshQualities(): Promise<void> {
    if (!player) return
    try {
      const raw = (await player.getQualities()) as VimeoQuality[] | undefined
      if (!raw || raw.length === 0) { qualities.value = []; return }
      qualities.value = raw.map(q => ({
        id: q.id,
        height: q.id === 'auto' ? null : parseHeight(q.label ?? q.id),
        label: q.label ?? (q.id === 'auto' ? 'Auto' : q.id),
      }))
      const active = raw.find(q => q.active)
      if (active) activeQualityId.value = active.id
    } catch {
      // getQualities is Pro-only; absence just means no quality menu.
      qualities.value = []
    }
  }

  function destroy(): void {
    if (player) {
      try { void player.destroy() } catch { /* ignore */ }
      player = null
    }
  }

  function mount(el: HTMLElement, videoId: string, hash?: string): void {
    destroy()
    beginEmitted = false
    state.ready = false
    state.error = null

    const idNum = Number(videoId)
    const options: Record<string, unknown> = {
      controls: false,      // hide Vimeo's native chrome — our bar replaces it
      // NOT responsive: the SDK's responsive mode injects a `padding:177.78%`
      // aspect-ratio wrapper and absolutely-positions the iframe inside IT, which
      // overflows our fixed 16:9 stage (iframe ends up ~1073px tall, clipped).
      // Instead we let our CSS force the iframe to fill the stage 100%×100%.
      responsive: false,
      dnt: true,
      playsinline: true,
      title: false,
      byline: false,
      portrait: false,
      autopause: false,
    }
    if (Number.isFinite(idNum) && idNum > 0) options.id = idNum
    else options.url = `https://vimeo.com/${videoId}`
    if (hash) options.h = hash

    player = new Player(el, options as unknown as ConstructorParameters<typeof Player>[1])

    player.on('loaded', () => {
      state.ready = true
      void player?.getDuration().then(d => { state.duration = d ?? 0 })
      void player?.getVolume().then(v => { state.volume = v ?? 1; lastVolume = v || 1 })
      void player?.getPlaybackRate().then(r => { state.rate = r ?? 1 })
      void refreshQualities()
    })
    player.on('play', () => {
      state.playing = true
      state.ended = false
      if (!beginEmitted) { beginEmitted = true; cb.onBegin?.() }
    })
    player.on('pause', () => { state.playing = false })
    player.on('bufferstart', () => { state.buffering = true })
    player.on('bufferend', () => { state.buffering = false })
    player.on('timeupdate', (e: TimePayload) => {
      state.currentTime = e.seconds
      state.duration = e.duration
      cb.onProgress?.(e.seconds, e.duration)
    })
    player.on('progress', (e: TimePayload) => {
      // `percent` is the fraction buffered ahead.
      state.bufferedEnd = (e.percent ?? 0) * (e.duration || state.duration)
    })
    player.on('volumechange', (e: VolumePayload) => {
      state.volume = e.volume
      state.muted = e.volume === 0
      if (e.volume > 0) lastVolume = e.volume
    })
    player.on('playbackratechange', (e: RatePayload) => { state.rate = e.playbackRate })
    player.on('ended', () => {
      state.playing = false
      state.ended = true
      cb.onComplete?.()
    })
    player.on('error', (e: { message?: string }) => {
      const message = e?.message ?? 'Vimeo player error'
      state.error = message
      cb.onError?.(message)
    })
  }

  // --- intent methods -------------------------------------------------------
  function togglePlay(): void {
    if (!player) return
    if (state.playing) void player.pause()
    else void player.play()
  }
  function seek(time: number): void {
    if (!player) return
    const d = state.duration
    void player.setCurrentTime(Math.max(0, d ? Math.min(time, d) : time))
  }
  function skip(delta: number): void { seek(state.currentTime + delta) }
  function setRate(rate: number): void { void player?.setPlaybackRate(rate) }
  function setVolume(v: number): void {
    if (!player) return
    const vol = Math.max(0, Math.min(1, v))
    void player.setVolume(vol)
  }
  function toggleMute(): void {
    if (!player) return
    if (state.volume === 0) void player.setVolume(lastVolume || 1)
    else { lastVolume = state.volume; void player.setVolume(0) }
  }
  function setQuality(id: string): void {
    if (!player) return
    // setQuality exists on Pro embeds; ignore if unavailable.
    const p = player as unknown as { setQuality?: (id: string) => Promise<unknown> }
    if (typeof p.setQuality === 'function') {
      void p.setQuality(id)
      activeQualityId.value = id
    }
  }

  onBeforeUnmount(destroy)

  return {
    state,
    qualities,
    activeQualityId,
    mount,
    togglePlay,
    seek,
    skip,
    setRate,
    setVolume,
    toggleMute,
    setQuality,
    destroy,
  }
}
