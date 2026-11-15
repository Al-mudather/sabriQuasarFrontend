<template>
  <!-- dir=ltr: media time is universally left→right (like YouTube in Arabic);
       only the seek/time row is pinned LTR. The button row below inherits the
       page's RTL order naturally. -->
  <div ref="barRef" class="cvc" v-bind="$attrs" :data-fullscreen="isFullscreen || null">
    <!-- Scrub row: time · seek bar (buffered/played/knob) · time · % -->
    <div class="cvc__scrubrow" dir="ltr">
      <span class="cvc__time">{{ fmt(currentTime) }}</span>

      <div class="cvc__scrub">
        <div class="cvc__track">
          <div class="cvc__buffered" :style="{ width: bufferedPct + '%' }"></div>
          <div class="cvc__played" :style="{ width: percent + '%' }"></div>
          <div class="cvc__knob" :style="{ left: percent + '%' }"></div>
        </div>
        <input
          class="cvc__range"
          type="range"
          min="0"
          :max="duration || 0"
          :value="currentTime"
          step="0.1"
          :disabled="!ready || !duration"
          :aria-label="$t('classroom.player.controls.seek')"
          :aria-valuetext="fmt(currentTime) + ' / ' + fmt(duration)"
          @input="onSeek"
        />
      </div>

      <span class="cvc__time">{{ fmt(duration) }}</span>
      <span class="cvc__pct" :aria-label="$t('classroom.player.controls.watched')">{{ percent }}%</span>
    </div>

    <!-- Button row -->
    <div class="cvc__btnrow">
      <button
        type="button"
        class="cvc__btn cvc__btn--primary"
        :disabled="!ready"
        :aria-label="playing ? $t('classroom.player.controls.pause') : $t('classroom.player.controls.play')"
        @click="$emit('toggle-play')"
      >
        <q-icon :name="playing ? 'pause' : 'play_arrow'" size="26px" />
      </button>

      <button
        type="button"
        class="cvc__btn"
        :disabled="!ready"
        :aria-label="$t('classroom.player.controls.back10')"
        @click="$emit('skip', -10)"
      >
        <q-icon name="replay_10" size="22px" />
      </button>

      <button
        type="button"
        class="cvc__btn"
        :disabled="!ready"
        :aria-label="$t('classroom.player.controls.forward10')"
        @click="$emit('skip', 10)"
      >
        <q-icon name="forward_10" size="22px" />
      </button>

      <span class="cvc__spacer"></span>

      <!-- Mute: always its own button. The slider only shows on wide bars. -->
      <button
        type="button"
        class="cvc__btn"
        data-cvc="mute"
        :aria-label="muted || volume === 0 ? $t('classroom.player.controls.unmute') : $t('classroom.player.controls.mute')"
        @click="$emit('toggle-mute')"
      >
        <q-icon :name="volumeIcon" size="22px" />
      </button>
      <input
        class="cvc__volume"
        type="range"
        min="0" max="1" step="0.05"
        :value="muted ? 0 : volume"
        :aria-label="$t('classroom.player.controls.volume')"
        @input="onVolume"
      />

      <!-- Settings: two labelled buttons. On a narrow bar they wrap onto their
           own row and share it equally; on a wide bar they sit inline. -->
      <div class="cvc__settings">
        <div class="cvc__setting">
          <button
            ref="speedBtnRef"
            type="button"
            class="cvc__opt"
            data-cvc="speed"
            data-cvc-trigger
            aria-haspopup="dialog"
            :aria-expanded="openMenu === 'speed' ? 'true' : 'false'"
            :aria-label="$t('classroom.player.controls.speed') + ': ' + speedValue"
            @click="toggleMenu('speed')"
          >
            <q-icon name="speed" size="20px" class="cvc__opt-icon" />
            <span class="cvc__opt-text">
              <span class="cvc__opt-label">{{ $t('classroom.player.controls.speed') }}</span>
              <span class="cvc__opt-value" dir="auto">{{ speedValue }}</span>
            </span>
          </button>
          <PlayerOptionsPanel
            v-if="openMenu === 'speed' && !sheetMode"
            mode="popover"
            :title="$t('classroom.player.controls.speedTitle')"
            :options="speedOptions"
            :active-id="String(rate)"
            :close-label="$t('classroom.player.controls.close')"
            @select="onSelect"
            @close="closeMenu()"
          />
        </div>

        <div v-if="showQuality" class="cvc__setting">
          <button
            ref="qualityBtnRef"
            type="button"
            class="cvc__opt"
            data-cvc="quality"
            data-cvc-trigger
            aria-haspopup="dialog"
            :aria-expanded="openMenu === 'quality' ? 'true' : 'false'"
            :aria-label="$t('classroom.player.controls.quality') + ': ' + qualityValue"
            @click="toggleMenu('quality')"
          >
            <q-icon name="hd" size="20px" class="cvc__opt-icon" />
            <span class="cvc__opt-text">
              <span class="cvc__opt-label">{{ $t('classroom.player.controls.quality') }}</span>
              <span class="cvc__opt-value" dir="auto">{{ qualityValue }}</span>
            </span>
          </button>
          <PlayerOptionsPanel
            v-if="openMenu === 'quality' && !sheetMode"
            mode="popover"
            :title="$t('classroom.player.controls.qualityTitle')"
            :options="qualityOptions"
            :active-id="activeQualityId"
            :close-label="$t('classroom.player.controls.close')"
            @select="onSelect"
            @close="closeMenu()"
          />
        </div>
      </div>

      <button
        type="button"
        class="cvc__btn"
        data-cvc="fullscreen"
        :aria-label="isFullscreen ? $t('classroom.player.controls.exitFullscreen') : $t('classroom.player.controls.fullscreen')"
        @click="$emit('toggle-fullscreen')"
      >
        <q-icon :name="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" size="24px" />
      </button>
    </div>
  </div>

  <!-- Bottom sheet (phones / narrow bars / touch). It carries its own `dir`:
       <body> is always LTR in this app (the layouts set dir), and values such
       as «1.5×» / «تلقائي · 360p» are isolated with dir="auto" wherever they
       are shown, so Latin and Arabic never reorder each other. Rendered in <body> so no
       transformed ancestor can trap its fixed positioning — EXCEPT in
       fullscreen, where only descendants of the fullscreen element (the player
       shell) are painted: there it renders in place, next to the bar. -->
  <Teleport to="body" :disabled="isFullscreen">
    <PlayerOptionsPanel
      v-if="openMenu && sheetMode"
      :key="openMenu"
      mode="sheet"
      :dir="$q.lang.rtl ? 'rtl' : 'ltr'"
      :title="openMenu === 'speed' ? $t('classroom.player.controls.speedTitle') : $t('classroom.player.controls.qualityTitle')"
      :options="openMenu === 'speed' ? speedOptions : qualityOptions"
      :active-id="openMenu === 'speed' ? String(rate) : activeQualityId"
      :close-label="$t('classroom.player.controls.close')"
      @select="onSelect"
      @close="closeMenu()"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PlayerOptionsPanel from 'src/components/classroom/player/PlayerOptionsPanel.vue'
import type { PanelOption } from 'src/components/classroom/player/PlayerOptionsPanel.vue'
import type { QualityOption } from 'src/composables/classroom/useVideoJsPlayer'
import { PLAYBACK_RATES } from 'src/composables/classroom/useVideoJsPlayer'
import {
  AUTO_QUALITY_ID,
  hasQualityChoice,
  qualityOptionLabel,
  qualityValueLabel,
  rateLabel,
  shouldUseSheet,
} from 'src/utils/playerControls'

// Two root nodes (the bar + the teleported sheet): listeners/attrs the parent
// puts on this component go to the bar explicitly.
defineOptions({ inheritAttrs: false })

interface Props {
  playing: boolean
  ready: boolean
  currentTime: number
  duration: number
  bufferedEnd: number
  volume: number
  muted: boolean
  rate: number
  qualities: QualityOption[]
  activeQualityId: string
  /** Height (px) of the picture actually on screen; 0/null when unknown. */
  playingHeight?: number | null
  isFullscreen: boolean
}

const props = withDefaults(defineProps<Props>(), { playingHeight: null })

const emit = defineEmits<{
  'toggle-play': []
  seek: [time: number]
  skip: [delta: number]
  'set-rate': [rate: number]
  'set-volume': [volume: number]
  'toggle-mute': []
  'set-quality': [id: string]
  'toggle-fullscreen': []
  /** A speed/quality list opened or closed — the shell pauses auto-hide. */
  'menu-open': [open: boolean]
}>()

const { t } = useI18n()

type MenuName = 'speed' | 'quality'

const percent = computed<number>(() => {
  if (!props.duration) return 0
  return Math.min(100, Math.round((props.currentTime / props.duration) * 100))
})

const bufferedPct = computed<number>(() => {
  if (!props.duration) return 0
  return Math.min(100, (props.bufferedEnd / props.duration) * 100)
})

const volumeIcon = computed<string>(() => {
  if (props.muted || props.volume === 0) return 'volume_off'
  if (props.volume < 0.5) return 'volume_down'
  return 'volume_up'
})

// ---- speed / quality labels ------------------------------------------------
const normalText = computed<string>(() => t('classroom.player.controls.normal'))
const autoText = computed<string>(() => t('classroom.player.controls.auto'))

const speedValue = computed<string>(() => rateLabel(props.rate, normalText.value))

const speedOptions = computed<PanelOption[]>(() =>
  PLAYBACK_RATES.map((r) => ({ id: String(r), label: rateLabel(r, normalText.value) })),
)

const showQuality = computed<boolean>(() => hasQualityChoice(props.qualities))

const qualityValue = computed<string>(() =>
  qualityValueLabel(props.qualities, props.activeQualityId, props.playingHeight, autoText.value),
)

const qualityOptions = computed<PanelOption[]>(() =>
  props.qualities.map((q) => ({
    id: q.id,
    // The auto row also says what auto is currently playing, like YouTube.
    label: q.id === AUTO_QUALITY_ID && props.activeQualityId === AUTO_QUALITY_ID
      ? qualityValue.value
      : qualityOptionLabel(q, autoText.value),
  })),
)

// ---- sheet vs popover ------------------------------------------------------
const barRef = ref<HTMLElement | null>(null)
const speedBtnRef = ref<HTMLButtonElement | null>(null)
const qualityBtnRef = ref<HTMLButtonElement | null>(null)

const barWidth = ref(0)
const viewportHeight = ref(0)
const coarsePointer = ref(false)

const sheetMode = computed<boolean>(() =>
  shouldUseSheet({
    barWidth: barWidth.value,
    viewportHeight: viewportHeight.value,
    coarsePointer: coarsePointer.value,
  }),
)

let resizeObserver: ResizeObserver | null = null

function measure(): void {
  barWidth.value = barRef.value?.getBoundingClientRect().width ?? 0
  viewportHeight.value = window.innerHeight
}

// ---- open / close ----------------------------------------------------------
const openMenu = ref<MenuName | null>(null)

// While a SHEET is open we own one history entry, so the phone's back
// button / gesture closes the sheet instead of leaving the lesson. The entry
// keeps the URL and vue-router's own state; our popstate listener runs in the
// capture phase (before the router's) and swallows the event, so the router
// never sees a navigation.
const HISTORY_FLAG = 'clsPlayerSheet'
let ownsHistoryEntry = false
let swallowNextPop = false

function historyStateRecord(): Record<string, unknown> {
  const state: unknown = window.history.state
  return state !== null && typeof state === 'object' ? (state as Record<string, unknown>) : {}
}

function pushHistoryEntry(): void {
  if (ownsHistoryEntry) return
  try {
    window.history.pushState({ ...historyStateRecord(), [HISTORY_FLAG]: true }, '')
    ownsHistoryEntry = true
  } catch {
    /* history unavailable (sandboxed frame) — the sheet still works */
  }
}

/** The sheet was closed from the UI: step back over our entry, quietly. */
function dropHistoryEntry(): void {
  if (!ownsHistoryEntry) return
  ownsHistoryEntry = false
  if (historyStateRecord()[HISTORY_FLAG] === true) {
    swallowNextPop = true
    window.history.back()
  }
}

function onPopState(e: PopStateEvent): void {
  const state: unknown = e.state
  const flagged = state !== null && typeof state === 'object'
    && (state as Record<string, unknown>)[HISTORY_FLAG] === true
  if (flagged) {
    // Forward into a stale sheet entry: nothing to show, keep the router out.
    e.stopImmediatePropagation()
    return
  }
  if (ownsHistoryEntry) {
    // Back pressed with the sheet open: close it.
    ownsHistoryEntry = false
    e.stopImmediatePropagation()
    if (openMenu.value) setMenu(null, false)
    return
  }
  if (swallowNextPop) {
    // Our own history.back() after the sheet was closed from the UI.
    swallowNextPop = false
    e.stopImmediatePropagation()
  }
}

function triggerFor(name: MenuName): HTMLButtonElement | null {
  return name === 'speed' ? speedBtnRef.value : qualityBtnRef.value
}

function setMenu(next: MenuName | null, returnFocus: boolean): void {
  const prev = openMenu.value
  if (prev === next) return
  openMenu.value = next
  emit('menu-open', next !== null)
  if (next !== null && sheetMode.value) pushHistoryEntry()
  if (next === null) {
    dropHistoryEntry()
    if (returnFocus && prev) {
      void nextTick(() => triggerFor(prev)?.focus({ preventScroll: true }))
    }
  }
}

function toggleMenu(name: MenuName): void {
  setMenu(openMenu.value === name ? null : name, false)
}

function closeMenu(): void {
  setMenu(null, true)
}

function onSelect(id: string): void {
  if (openMenu.value === 'speed') {
    const rate = Number(id)
    if (Number.isFinite(rate) && rate > 0) emit('set-rate', rate)
  } else if (openMenu.value === 'quality') {
    emit('set-quality', id)
  }
  closeMenu()
}

// The quality button can disappear under an open list (new lesson with a
// single rendition) — close rather than leave an orphan sheet.
watch(showQuality, (show) => {
  if (!show && openMenu.value === 'quality') setMenu(null, false)
})

// Entering/leaving fullscreen moves the sheet between <body> and the shell;
// closing is simpler and matches what the browser does to other overlays.
watch(() => props.isFullscreen, () => {
  if (openMenu.value) setMenu(null, false)
})

onMounted(() => {
  measure()
  coarsePointer.value = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches
  if (typeof ResizeObserver === 'function' && barRef.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(barRef.value)
  }
  window.addEventListener('resize', measure)
  window.addEventListener('popstate', onPopState, true)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', measure)
  window.removeEventListener('popstate', onPopState, true)
  if (openMenu.value) emit('menu-open', false)
})

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

function onSeek(e: Event): void {
  const v = Number((e.target as HTMLInputElement).value)
  if (Number.isFinite(v)) emit('seek', v)
}

function onVolume(e: Event): void {
  const v = Number((e.target as HTMLInputElement).value)
  if (Number.isFinite(v)) emit('set-volume', v)
}
</script>

<style lang="scss" scoped>
// Container query against the bar's own width — responsiveness tracks the
// player size, not the viewport (a narrow side-by-side desktop collapses too).
.cvc {
  container-type: inline-size;
  inline-size: 100%;
  background: var(--cls-surface-elevated, #1A1430);
  border: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
  border-block-start: none;
  border-end-start-radius: var(--cls-radius-md, 12px);
  border-end-end-radius: var(--cls-radius-md, 12px);
  padding: 12px 14px;
  color: var(--cls-text-primary, #F5F2EA);
}

// ---- scrub row -----------------------------------------------------------
.cvc__scrubrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cvc__time {
  font-variant-numeric: tabular-nums;
  font-size: 12.5px;
  color: var(--cls-text-muted, #9890A8);
  min-inline-size: 44px;
  text-align: center;
}

.cvc__pct {
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 700;
  color: var(--cls-accent, #C1623C);
  min-inline-size: 38px;
  text-align: center;
}

.cvc__scrub {
  position: relative;
  flex: 1;
  block-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.cvc__track {
  position: relative;
  inline-size: 100%;
  block-size: 6px;
  border-radius: 6px;
  background: rgba(245, 242, 234, 0.14);
  overflow: hidden;
  transition: block-size var(--cls-dur-fast, 120ms) ease;
}

.cvc__buffered,
.cvc__played {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: 6px;
}
.cvc__buffered { background: rgba(245, 242, 234, 0.22); }
.cvc__played { background: linear-gradient(90deg, var(--cls-indigo, #322873), var(--cls-accent, #C1623C)); }

.cvc__knob {
  position: absolute;
  top: 50%;
  inline-size: 14px;
  block-size: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity var(--cls-dur-fast, 120ms) ease;
}

.cvc__scrub:hover .cvc__track { block-size: 8px; }
.cvc__scrub:hover .cvc__knob,
.cvc__range:focus-visible + .cvc__knob { opacity: 1; }

// Transparent native range overlaid for drag + keyboard + a11y.
.cvc__range {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  &:disabled { cursor: default; }
}

// ---- button row ----------------------------------------------------------
.cvc__btnrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-block-start: 12px;
}

.cvc__spacer { flex: 1; }

.cvc__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 44px;
  block-size: 44px;
  border: 0;
  border-radius: var(--cls-radius-sm, 8px);
  background: rgba(245, 242, 234, 0.06);
  color: var(--cls-text-primary, #F5F2EA);
  cursor: pointer;
  transition: background var(--cls-dur-fast, 120ms) ease, transform var(--cls-dur-fast, 120ms) ease;

  &:hover:not(:disabled) { background: rgba(245, 242, 234, 0.12); }
  &:active:not(:disabled) { transform: scale(0.94); }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: 2px; }
  &:disabled { opacity: 0.45; cursor: default; }

  &--primary {
    inline-size: 50px;
    block-size: 50px;
    background: linear-gradient(135deg, var(--cls-accent, #C1623C), #E0823F);
    color: #fff;
    box-shadow: 0 4px 14px rgba(193, 98, 60, 0.4);
    &:hover:not(:disabled) { background: linear-gradient(135deg, #CE6B43, #ED9352); }
  }
}

.cvc__volume {
  inline-size: 84px;
  accent-color: var(--cls-accent, #C1623C);
  cursor: pointer;
}

// ---- settings (speed / quality) -------------------------------------------
.cvc__settings {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

// Anchor for the desktop popover.
.cvc__setting {
  position: relative;
  display: flex;
  min-inline-size: 0;
}

.cvc__opt {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-inline-size: 0;
  block-size: 44px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: var(--cls-radius-sm, 8px);
  background: rgba(245, 242, 234, 0.06);
  color: var(--cls-text-primary, #F5F2EA);
  font: inherit;
  cursor: pointer;
  transition: background var(--cls-dur-fast, 120ms) ease, border-color var(--cls-dur-fast, 120ms) ease;

  &:hover { background: rgba(245, 242, 234, 0.12); }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: 2px; }
  &[aria-expanded='true'] {
    background: var(--cls-accent-soft, rgba(193, 98, 60, 0.16));
    border-color: var(--cls-accent, #C1623C);
  }
}

.cvc__opt-icon { flex: none; color: var(--cls-accent, #C1623C); }

.cvc__opt-text {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  min-inline-size: 0;
  white-space: nowrap;
}

.cvc__opt-label {
  font-size: 13px;
  line-height: 1.3;
  color: var(--cls-text-muted, #9890A8);
}

.cvc__opt-value {
  font-size: 13px;
  line-height: 1.3;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
}

// ---- Narrow bar (phones): transport row + a row of two labelled buttons ----
// Keep 680px in sync with NARROW_BAR_MAX_PX in src/utils/playerControls.ts.
@container (max-width: 680px) {
  .cvc__btnrow { flex-wrap: wrap; row-gap: 10px; }
  .cvc__time { min-inline-size: 38px; font-size: 11.5px; }
  .cvc__btn--primary { inline-size: 48px; block-size: 48px; }
  .cvc__volume { display: none; }

  .cvc__settings {
    order: 10;
    flex: 0 0 100%;
    display: flex;
  }
  .cvc__setting { flex: 1 1 0; }

  .cvc__opt {
    flex: 1 1 auto;
    inline-size: 100%;
    block-size: auto;
    min-block-size: 48px;
    padding: 6px 12px;
    gap: 10px;
  }
  .cvc__opt-icon { font-size: 22px !important; }
  .cvc__opt-text {
    flex: 1 1 auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .cvc__opt-label { font-size: 11.5px; }
  .cvc__opt-value { font-size: 13.5px; max-inline-size: 100%; }
}

// Smallest phones (320px): tighten the two buttons so «تلقائي · 1080p» fits.
@container (max-width: 345px) {
  .cvc__opt { padding-inline: 8px; gap: 6px; }
  .cvc__opt-icon { font-size: 20px !important; }
  .cvc__opt-value { font-size: 12.5px; }
}

// In fullscreen the wrapper overlays this bar on the video; drop the seam so it
// reads as a floating control strip over the gradient scrim.
.cvc[data-fullscreen] {
  background: transparent;
  border: none;
}
</style>
