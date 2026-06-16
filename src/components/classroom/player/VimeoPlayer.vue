<template>
  <!-- Shell = the fullscreen element: 16:9 Vimeo stage + the shared custom
       control bar below it (the same bar the HLS player uses). -->
  <div
    ref="shellRef"
    class="cls-vimeo"
    :data-fullscreen="isFullscreen || null"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="cls-vimeo__stage">
      <div ref="mountRef" class="cls-vimeo__mount" />

      <button
        type="button"
        class="cls-vimeo__surface"
        :aria-label="state.playing ? $t('classroom.player.controls.pause') : $t('classroom.player.controls.play')"
        @click="togglePlay"
      ></button>

      <div v-if="state.buffering" class="cls-vimeo__spinner">
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
  VimeoPlayer — Vimeo embed driven by the @vimeo/player SDK with `controls:false`,
  fronted by the shared ClassroomVideoControls bar (mirrors TypeHasifHlsPlayer).
  useVimeoPlayer owns the SDK + media state; this wrapper owns the shell element
  (fullscreen), keyboard shortcuts, and (re)mounting on id/hash change, and
  re-emits begin/progress/complete/error so progress tracking is unchanged.
*/
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ClassroomVideoControls from 'src/components/classroom/player/ClassroomVideoControls.vue'
import { useVimeoPlayer } from 'src/composables/classroom/useVimeoPlayer'

interface Props {
  /** Vimeo numeric id, stored on ContentVideoNode.videoMetadata. */
  videoId: string
  /** Optional private-video hash (e.g. vimeo.com/123/abc → "abc"). */
  hash?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  begin: []
  progress: [seconds: number, duration: number]
  complete: []
  error: [message: string]
}>()

const {
  state, qualities, activeQualityId,
  mount, destroy,
  togglePlay, seek, skip, setRate, setVolume, toggleMute, setQuality,
} = useVimeoPlayer({
  onBegin: () => emit('begin'),
  onProgress: (s, d) => emit('progress', s, d),
  onComplete: () => emit('complete'),
  onError: (m) => emit('error', m),
})

const mountRef = ref<HTMLDivElement | null>(null)
const shellRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

function remount(): void {
  if (mountRef.value && props.videoId) mount(mountRef.value, props.videoId, props.hash)
}

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
  remount()
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

watch(() => [props.videoId, props.hash], remount)

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  destroy()
})
</script>

<style lang="scss" scoped>
.cls-vimeo {
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

  &__mount {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;

    // Force the Vimeo iframe — and any wrapper the SDK injects — to fill the
    // 16:9 stage. The !important + the wrapper rule neutralize Vimeo's
    // padding-based aspect-ratio hack so the video can't overflow/clip.
    :deep(iframe),
    :deep(div) {
      position: absolute !important;
      inset: 0 !important;
      inline-size: 100% !important;
      block-size: 100% !important;
      padding: 0 !important;
      border: 0;
      display: block;
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

// Fullscreen: stage fills the screen, control bar overlays the bottom.
.cls-vimeo[data-fullscreen] {
  background: #000;

  .cls-vimeo__stage {
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

@media (max-width: 1023px) {
  .cls-vimeo__stage {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
}
</style>
