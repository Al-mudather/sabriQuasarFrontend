<template>
  <!-- Shell = the fullscreen element. It stacks the 16:9 video stage and the
       custom control bar below it. In fullscreen the bar overlays the video. -->
  <div
    ref="shellRef"
    class="cls-hasif"
    :data-fullscreen="isFullscreen || null"
    :data-controls-hidden="(isFullscreen && !controlsVisible) || null"
    tabindex="0"
    @keydown="onShellKeydown"
    @pointermove="onActivity"
    @touchstart="onActivity"
  >
    <div class="cls-hasif__stage">
      <video ref="videoEl" playsinline class="cls-hasif__video video-js" />

      <!-- Click anywhere on the picture to toggle play (YouTube-style). In
           fullscreen, the first tap when controls are hidden just reveals them. -->
      <button
        type="button"
        class="cls-hasif__surface"
        :aria-label="state.playing ? $t('classroom.player.controls.pause') : $t('classroom.player.controls.play')"
        @click="onSurfaceClick"
      ></button>

      <div v-if="state.buffering" class="cls-hasif__spinner">
        <q-spinner-dots color="secondary" size="42px" />
      </div>
    </div>

    <ClassroomVideoControls
      @mouseenter="hoveringControls = true"
      @mouseleave="onControlsLeave"
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
import {
  getFullscreenElement,
  requestFullscreen,
  exitFullscreen,
  FS_CHANGE_EVENTS,
} from 'src/composables/classroom/useFullscreen'

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
  if (getFullscreenElement()) {
    exitFullscreen()
  } else {
    // Pass videoEl as the iOS fallback: if neither W3C nor webkit element
    // fullscreen is available (iOS Safari), the <video> element's native
    // webkitEnterFullscreen() is used instead, opening the iOS player.
    requestFullscreen(el, videoEl.value)
  }
}

function onFullscreenChange(): void {
  // Check both W3C and webkit-prefixed fullscreen element so this works on
  // desktop Chrome/Firefox AND older WebKit / Android browsers.
  isFullscreen.value = getFullscreenElement() === shellRef.value
}

// ---------------------------------------------------------------------------
// YouTube-style auto-hiding controls (fullscreen only).
//
// In fullscreen the control bar OVERLAYS the bottom of the picture, so a
// persistent bar covers content (worse in landscape/rotation). We hide it
// after a short idle while PLAYING and reveal it on any pointer/touch/key
// activity. We never hide while paused or while the pointer is over the bar
// (so the user can aim for a button). Windowed mode is unchanged — there the
// bar sits BELOW the video and covers nothing.
//
// Opacity/transform is used (not display:none) so the controls stay in the DOM
// and remain reachable; on touch the first tap reveals (see onSurfaceClick).
const HIDE_DELAY_MS = 2800
const controlsVisible = ref(true)
const hoveringControls = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearHideTimer(): void {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function scheduleHide(): void {
  clearHideTimer()
  // Only auto-hide in fullscreen, while playing, and not hovering the bar.
  if (!isFullscreen.value || !state.playing || hoveringControls.value) return
  hideTimer = setTimeout(() => {
    if (isFullscreen.value && state.playing && !hoveringControls.value) {
      controlsVisible.value = false
    }
  }, HIDE_DELAY_MS)
}

function nudgeControls(): void {
  controlsVisible.value = true
  scheduleHide()
}

/** Any pointer / touch activity inside the shell reveals the controls. */
function onActivity(): void {
  if (isFullscreen.value) nudgeControls()
}

/** Pointer left the control bar — resume the idle countdown. */
function onControlsLeave(): void {
  hoveringControls.value = false
  scheduleHide()
}

/** Surface tap: in fullscreen, a tap while controls are hidden only reveals
 *  them (don't also toggle play); otherwise toggle play as usual. */
function onSurfaceClick(): void {
  if (isFullscreen.value && !controlsVisible.value) {
    nudgeControls()
    return
  }
  togglePlay()
  nudgeControls()
}

// Pause → always show controls; play/enter-fullscreen → start the idle cycle.
watch(() => state.playing, (playing) => {
  if (!playing) { clearHideTimer(); controlsVisible.value = true }
  else scheduleHide()
})
watch(isFullscreen, (fs) => {
  if (fs) nudgeControls()
  else { clearHideTimer(); controlsVisible.value = true }
})

function onShellKeydown(e: KeyboardEvent): void {
  nudgeControls()
  onKeydown(e)
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
  // Listen to both unprefixed (W3C) and webkit-prefixed fullscreen events.
  for (const evt of FS_CHANGE_EVENTS) {
    document.addEventListener(evt, onFullscreenChange)
  }
})

watch(() => props.videoUuid, (next) => {
  if (next) loadSource(next)
})

onBeforeUnmount(() => {
  for (const evt of FS_CHANGE_EVENTS) {
    document.removeEventListener(evt, onFullscreenChange)
  }
  clearHideTimer()
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
    // Fade/slide for the auto-hide (opacity — controls stay in the DOM).
    transition: opacity var(--cls-dur-med, 220ms) ease, transform var(--cls-dur-med, 220ms) ease;
    will-change: opacity, transform;
  }
}

// ---- Auto-hide: controls + cursor fade away after idle in fullscreen --------
.cls-hasif[data-fullscreen][data-controls-hidden] {
  cursor: none;

  .cls-hasif__surface { cursor: none; }

  :deep(.cvc) {
    opacity: 0;
    transform: translateY(110%);
    pointer-events: none;
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
