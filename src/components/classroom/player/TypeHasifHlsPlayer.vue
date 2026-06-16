<template>
  <!-- Shell = the fullscreen element. It stacks the 16:9 video stage and the
       custom control bar below it. In fullscreen the bar overlays the video. -->
  <div
    ref="shellRef"
    class="cls-hasif"
    :data-fullscreen="isFullscreen || null"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="cls-hasif__stage">
      <video ref="videoEl" playsinline class="cls-hasif__video video-js" />

      <!-- Click anywhere on the picture to toggle play (YouTube-style). -->
      <button
        type="button"
        class="cls-hasif__surface"
        :aria-label="state.playing ? $t('classroom.player.controls.pause') : $t('classroom.player.controls.play')"
        @click="togglePlay"
      ></button>

      <div v-if="state.buffering" class="cls-hasif__spinner">
        <q-spinner-dots color="secondary" size="42px" />
      </div>
    </div>

    <ClassroomVideoControls
      :playing="state.playing"
      :ready="state.ready"
      :current-time="state.currentTime"
      :duration="state.duration"
      :buffered-end="state.bufferedEnd"
      :volume="state.volume"
      :muted="state.muted"
      :rate="state.rate"
      :qualities="qualities"
      :active-quality-id="activeQualityId"
      :is-fullscreen="isFullscreen"
      @toggle-play="togglePlay"
      @seek="seek"
      @skip="skip"
      @set-rate="setRate"
      @set-volume="setVolume"
      @toggle-mute="toggleMute"
      @set-quality="setQuality"
      @toggle-fullscreen="toggleFullscreen"
    />
  </div>
</template>

<script setup lang="ts">
/*
  TypeHasifHlsPlayer — self-hosted HLS (ClearKey DRM) on video.js 8, with the
  native control bar REPLACED by a custom, always-visible bar rendered below the
  video. The video.js instance + all media state live in useVideoJsPlayer; this
  wrapper owns the shell element (for fullscreen), keyboard shortcuts, and source
  loading, and re-emits begin/progress/complete/error so the classroom's
  StartLearningUnit / progress hooks keep working unchanged.
*/
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ClassroomVideoControls from 'src/components/classroom/player/ClassroomVideoControls.vue'
import { useVideoJsPlayer } from 'src/composables/classroom/useVideoJsPlayer'

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

const {
  state, qualities, activeQualityId,
  mount, loadSource,
  togglePlay, seek, skip, setRate, setVolume, toggleMute, setQuality,
} = useVideoJsPlayer({
  onBegin: () => emit('begin'),
  onProgress: (s, d) => emit('progress', s, d),
  onComplete: () => emit('complete'),
  onError: (m) => emit('error', m),
})

const videoEl = ref<HTMLVideoElement | null>(null)
const shellRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

function toggleFullscreen(): void {
  const el = shellRef.value
  if (!el) return
  if (document.fullscreenElement) void document.exitFullscreen()
  else void el.requestFullscreen?.()
}

function onFullscreenChange(): void {
  isFullscreen.value = document.fullscreenElement === shellRef.value
}

function onKeydown(e: KeyboardEvent): void {
  // When a control (button / range) is focused, let its native key behavior win
  // so we don't double-handle Space / arrows.
  const tag = (e.target as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA') return

  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault(); togglePlay(); break
    case 'ArrowLeft':
      e.preventDefault(); skip(-10); break
    case 'ArrowRight':
      e.preventDefault(); skip(10); break
    case 'ArrowUp':
      e.preventDefault(); setVolume(Math.min(1, state.volume + 0.1)); break
    case 'ArrowDown':
      e.preventDefault(); setVolume(Math.max(0, state.volume - 0.1)); break
    case 'f': case 'F':
      toggleFullscreen(); break
    case 'm': case 'M':
      toggleMute(); break
    default: break
  }
}

onMounted(() => {
  if (videoEl.value) mount(videoEl.value)
  if (props.videoUuid) loadSource(props.videoUuid)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

watch(() => props.videoUuid, (next) => {
  if (next) loadSource(next)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  // useVideoJsPlayer disposes the player on its own onBeforeUnmount.
})
</script>

<style lang="scss" scoped>
.cls-hasif {
  position: relative;
  inline-size: 100%;
  display: flex;
  flex-direction: column;

  &:focus { outline: none; }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: 2px; }

  &__stage {
    position: relative;
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;
    border-start-start-radius: var(--cls-radius-lg, 16px);
    border-start-end-radius: var(--cls-radius-lg, 16px);
  }

  &__video {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;

    :deep(.video-js) {
      inline-size: 100% !important;
      block-size: 100% !important;
    }
    :deep(.video-js video) {
      inline-size: 100%;
      block-size: 100%;
      object-fit: contain;
    }
  }

  &__surface {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  &__spinner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
}

// ---- Fullscreen: stage fills the screen, control bar overlays the bottom ----
.cls-hasif[data-fullscreen] {
  background: #000;

  .cls-hasif__stage {
    flex: 1;
    aspect-ratio: auto;
    block-size: auto;
    border-radius: 0;
  }

  :deep(.cvc) {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: 2;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent);
    border: none;
    border-radius: 0;
    padding-block-end: max(14px, env(safe-area-inset-bottom, 0px));
  }
}

// ---- Mobile cockpit: edge-to-edge stage to match the other providers --------
@media (max-width: 1023px) {
  .cls-hasif__stage {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
}
</style>
