<template>
  <div class="cls-hasif">
    <video
      ref="videoEl"
      controls
      playsinline
      class="cls-hasif__mount video-js vjs-big-play-centered"
    />
  </div>
</template>

<script setup lang="ts">
/*
  TypeHasifHlsPlayer — self-hosted HLS with ClearKey DRM, mirroring
  CourseClassRoom2/src/components/utils/VideoPlayer.vue but ported to video.js 8
  and Vue 3 + TS.

  Stream convention (from CC2):
    https://video.cdn1.stc.training/stream/hls/<videoUuid>/playlist.m3u8

  video.js 8 has HLS built in via VHS (videojs-http-streaming), so the
  legacy videojs-contrib-hls dependency is gone. We still rely on
  videojs-contrib-eme to surface ClearKey key negotiation to the browser,
  and videojs-hls-quality-selector v2 for the quality menu.

  Sizing: the player fills its parent box 100% × 100%. The parent
  (`.cls-cockpit__media`) owns the dimensions — a 16:9 frame on desktop and a
  fixed ~42vh region on mobile. The native <video> uses object-fit: contain so
  all content stays visible (no crop) and the controls remain reachable.
*/
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import videojs from 'video.js'
import 'videojs-contrib-eme'
import 'videojs-hls-quality-selector'
import 'videojs-contrib-quality-levels'
import 'video.js/dist/video-js.css'

type PlayerInstance = ReturnType<typeof videojs>

const props = defineProps<{
  videoUuid: string
  title?: string | null
}>()

const emit = defineEmits<{
  (e: 'begin'): void
  (e: 'progress', seconds: number, duration: number): void
  (e: 'complete'): void
  (e: 'error', message: string): void
}>()

const videoEl = ref<HTMLVideoElement | null>(null)
let player: PlayerInstance | null = null
let beginEmitted = false

function buildSrc(uuid: string): string {
  return `https://video.cdn1.stc.training/stream/hls/${uuid}/playlist.m3u8`
}

function loadSource(uuid: string): void {
  if (!player) return
  beginEmitted = false
  player.src({
    src: buildSrc(uuid),
    type: 'application/vnd.apple.mpegurl',
    // ClearKey DRM — matches CC2. The backend serves the key when the
    // manifest requests it; no client-side license handler is required.
    // Cast keeps TS quiet about the video.js source type lacking keySystems.
    keySystems: { 'org.w3.clearkey': {} },
  } as unknown as videojs.Tech.SourceObject)
}

onMounted(() => {
  const el = videoEl.value
  if (!el) return

  player = videojs(el, {
    controls: true,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    html5: {
      nativeAudioTracks: false,
      nativeVideoTracks: false,
      vhs: { cacheEncryptionKeys: true, overrideNative: true },
    },
    controlBar: {
      children: [
        'playToggle',
        'progressControl',
        'volumePanel',
        'qualitySelector',
        'playbackRateMenuButton',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'fullscreenToggle',
      ],
    },
  })

  player.ready(() => {
    // Attach EME plugin for ClearKey negotiation.
    const p = player as unknown as { eme?: () => void; hlsQualitySelector?: (opts: Record<string, unknown>) => void }
    if (typeof p.eme === 'function') p.eme()
    if (typeof p.hlsQualitySelector === 'function') {
      p.hlsQualitySelector({ displayCurrentQuality: true })
    }
  })

  player.on('play', () => {
    if (!beginEmitted) {
      beginEmitted = true
      emit('begin')
    }
  })
  player.on('timeupdate', () => {
    if (!player) return
    emit('progress', player.currentTime() ?? 0, player.duration() ?? 0)
  })
  player.on('ended', () => emit('complete'))
  player.on('error', () => {
    const err = player?.error()
    emit('error', err?.message ?? 'TypeHasif player error')
  })

  if (props.videoUuid) loadSource(props.videoUuid)
})

watch(
  () => props.videoUuid,
  (next) => {
    if (next && player) loadSource(next)
  },
)

onBeforeUnmount(() => {
  if (player) {
    try {
      player.dispose()
    } catch {
      /* ignore */
    }
    player = null
  }
})
</script>

<style lang="scss" scoped>
.cls-hasif {
  position: relative;
  inline-size: 100%;
  // Fill the parent box — `.cls-cockpit__media` owns the dimensions.
  block-size: 100%;
  background: #000;
  border-radius: inherit;
  overflow: hidden;

  &__mount {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;

    // video.js wraps the <video> in a generated .video-js div at runtime.
    // Both it and the inner <video> must fill the container so no internal
    // letterboxing is added by the player chrome.
    :deep(.video-js) {
      inline-size: 100% !important;
      block-size: 100% !important;
    }

    :deep(.video-js video) {
      inline-size: 100%;
      block-size: 100%;
      // contain keeps all content visible (no crop). With the root container
      // now matching the source aspect-ratio exactly, contain == cover for
      // correctly-sized sources: zero bars.
      object-fit: contain;
    }
  }
}
</style>
