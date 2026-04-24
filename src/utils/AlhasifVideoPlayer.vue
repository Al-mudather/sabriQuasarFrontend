<template>
<div style="width: 100%; height: 52vh;">
  <video ref="videoPlayer" controls style="width: 100%; height: 100%;" class="video-js vjs-theme-fantasy"></video>
</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'videojs-contrib-hls'
import 'videojs-contrib-quality-levels'
import videojsqualityselector from 'videojs-hls-quality-selector'

interface Props {
  videoUuid?: string
}

const props = defineProps<Props>()

const videoPlayer = ref<HTMLVideoElement | null>(null)
let player: ReturnType<typeof videojs> | null = null

const videoOptions = {
  controlBar: {
    children: [
      'playToggle',
      'progressControl',
      'volumePanel',
      'qualitySelector',
      'fullscreenToggle',
    ],
  },
  controls: true,
  playbackRates: [0.5, 1, 1.5, 2],
  html5: {
    nativeAudioTracks: false,
    nativeVideoTracks: false,
    vhs: { cacheEncryptionKeys: true },
    hls: { overrideNative: true, debug: true }
  }
}

async function playVideo (videoUuid: string): Promise<void> {
  if (!player) return
  const src = `https://video.cdn1.stc.training/stream/hls/${videoUuid}/playlist.m3u8`
  player.src({
    src,
    type: 'application/vnd.apple.mpegurl',
    keySystems: { 'org.w3.clearkey': {} }
  })

  // videojs.Hls was removed in VHS/video.js 7+; guard at runtime.
  const vjsAny = videojs as unknown as Record<string, unknown>
  if (vjsAny['Hls'] && (vjsAny['Hls'] as Record<string, unknown>)['xhr']) {
    const hlsXhr = (vjsAny['Hls'] as Record<string, unknown>)['xhr'] as {
      beforeRequest?: (cb: (opts: { uri: string }) => { uri: string }) => void
    }
    if (typeof hlsXhr.beforeRequest === 'function') {
      hlsXhr.beforeRequest((options: { uri: string }) => {
        if (!options.uri.includes('.m3u8') && !options.uri.includes('.ts')) {
          options.uri = `https://video.cdn1.stc.training/api/video/key/${videoUuid}/`
        }
        return options
      })
    }
  }
}

onMounted(() => {
  if (!videoPlayer.value) return
  player = videojs(videoPlayer.value, videoOptions, function (this: ReturnType<typeof videojs>) {
    (this as unknown as Record<string, unknown>)['hlsQualitySelector'] = videojsqualityselector;
    (this as unknown as { hlsQualitySelector: (opts: { displayCurrentQuality: boolean }) => void })
      .hlsQualitySelector({ displayCurrentQuality: true })
  })
  if (props.videoUuid) playVideo(props.videoUuid)
})

onBeforeUnmount(() => {
  if (player) player.dispose()
})

watch(() => props.videoUuid, (val) => {
  if (val) playVideo(val)
})
</script>

<style scoped>
/* @import "https://unpkg.com/video.js/dist/video-js.min.css"; */
.video-js .vjs-time-control {
  display: block;
}
.video-js.vjs-http-source-selector{display:block !important}
</style>
