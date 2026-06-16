<template>
  <!-- dir=ltr: media time is universally left→right (like YouTube in Arabic);
       only the seek/time row is pinned LTR. The button row below inherits the
       page's RTL order naturally. -->
  <div class="cvc" :data-fullscreen="isFullscreen || null">
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

      <!-- Inline secondary controls (wide screens) -->
      <div class="cvc__inline">
        <!-- Volume -->
        <button
          type="button"
          class="cvc__btn"
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

        <!-- Speed -->
        <button type="button" class="cvc__chip" :aria-label="$t('classroom.player.controls.speed')">
          {{ rate }}×
          <q-menu anchor="top middle" self="bottom middle" class="cvc-menu">
            <q-list dense>
              <q-item
                v-for="r in rates" :key="r" clickable v-close-popup
                :active="r === rate" @click="$emit('set-rate', r)"
              >
                <q-item-section>{{ r }}×</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>

        <!-- Quality -->
        <button
          v-if="qualities.length > 1"
          type="button" class="cvc__chip" :aria-label="$t('classroom.player.controls.quality')"
        >
          {{ activeQualityLabel }}
          <q-menu anchor="top middle" self="bottom middle" class="cvc-menu">
            <q-list dense>
              <q-item
                v-for="q in qualities" :key="q.id" clickable v-close-popup
                :active="q.id === activeQualityId" @click="$emit('set-quality', q.id)"
              >
                <q-item-section>{{ q.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>
      </div>

      <!-- Overflow menu (narrow screens): folds volume/speed/quality away -->
      <button type="button" class="cvc__btn cvc__overflow" :aria-label="$t('classroom.player.controls.more')">
        <q-icon name="more_vert" size="22px" />
        <q-menu anchor="top middle" self="bottom middle" class="cvc-menu">
          <q-list style="min-width: 200px">
            <q-item clickable v-close-popup @click="$emit('toggle-mute')">
              <q-item-section avatar><q-icon :name="volumeIcon" /></q-item-section>
              <q-item-section>{{ muted || volume === 0 ? $t('classroom.player.controls.unmute') : $t('classroom.player.controls.mute') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item-label header>{{ $t('classroom.player.controls.speed') }}</q-item-label>
            <q-item
              v-for="r in rates" :key="'m-' + r" clickable v-close-popup
              :active="r === rate" @click="$emit('set-rate', r)"
            >
              <q-item-section>{{ r }}×</q-item-section>
            </q-item>
            <template v-if="qualities.length > 1">
              <q-separator />
              <q-item-label header>{{ $t('classroom.player.controls.quality') }}</q-item-label>
              <q-item
                v-for="q in qualities" :key="'mq-' + q.id" clickable v-close-popup
                :active="q.id === activeQualityId" @click="$emit('set-quality', q.id)"
              >
                <q-item-section>{{ q.label }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </button>

      <button
        type="button"
        class="cvc__btn"
        :aria-label="isFullscreen ? $t('classroom.player.controls.exitFullscreen') : $t('classroom.player.controls.fullscreen')"
        @click="$emit('toggle-fullscreen')"
      >
        <q-icon :name="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" size="24px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QualityOption } from 'src/composables/classroom/useVideoJsPlayer'
import { PLAYBACK_RATES } from 'src/composables/classroom/useVideoJsPlayer'

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
  isFullscreen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-play': []
  seek: [time: number]
  skip: [delta: number]
  'set-rate': [rate: number]
  'set-volume': [volume: number]
  'toggle-mute': []
  'set-quality': [id: string]
  'toggle-fullscreen': []
}>()

const rates = PLAYBACK_RATES

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

const activeQualityLabel = computed<string>(() => {
  const q = props.qualities.find(x => x.id === props.activeQualityId)
  return q?.label ?? 'Auto'
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
  inline-size: 42px;
  block-size: 42px;
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

.cvc__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  block-size: 38px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--cls-radius-sm, 8px);
  background: rgba(245, 242, 234, 0.06);
  color: var(--cls-text-primary, #F5F2EA);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background var(--cls-dur-fast, 120ms) ease;
  &:hover { background: rgba(245, 242, 234, 0.12); }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: 2px; }
}

.cvc__inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cvc__volume {
  inline-size: 84px;
  accent-color: var(--cls-accent, #C1623C);
  cursor: pointer;
}

// Overflow button hidden until the bar gets narrow.
.cvc__overflow { display: none; }

@container (max-width: 520px) {
  .cvc__inline { display: none; }
  .cvc__overflow { display: inline-flex; }
  .cvc__time { min-inline-size: 38px; font-size: 11.5px; }
  .cvc__btn { inline-size: 40px; block-size: 40px; }
  .cvc__btn--primary { inline-size: 46px; block-size: 46px; }
}

// In fullscreen the wrapper overlays this bar on the video; drop the seam so it
// reads as a floating control strip over the gradient scrim.
.cvc[data-fullscreen] {
  background: transparent;
  border: none;
}
</style>
