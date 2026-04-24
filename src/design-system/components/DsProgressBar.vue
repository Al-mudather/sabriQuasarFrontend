<template>
  <div
    class="ds-progress"
    :class="[
      `ds-progress--${size}`,
      `ds-progress--${mode}`,
      `ds-progress--${variant}`,
      { 'ds-progress--indeterminate': indeterminate, 'ds-progress--has-label': !!label }
    ]"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :aria-label="label || undefined"
  >
    <div v-if="label" class="ds-progress__caption">
      <span class="ds-progress__label-text">{{ label }}</span>
      <span v-if="showLabel && !indeterminate" class="ds-progress__label">{{ clampedValue }}%</span>
    </div>

    <!-- Linear mode -->
    <template v-if="mode === 'linear'">
      <div class="ds-progress__row">
        <div class="ds-progress__track">
          <div
            class="ds-progress__fill"
            :class="`ds-progress__fill--${variant}`"
            :style="indeterminate ? null : { inlineSize: clampedValue + '%' }"
          />
        </div>
        <span
          v-if="showLabel && !indeterminate && !label"
          class="ds-progress__label"
        >{{ clampedValue }}%</span>
      </div>
    </template>

    <!-- Vine mode -->
    <template v-else-if="mode === 'vine'">
      <div class="ds-progress__row">
        <svg
          class="ds-progress__vine"
          :class="`ds-progress__vine--${variant}`"
          viewBox="0 0 320 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <!-- ghost rail -->
          <path
            class="ds-progress__vine-rail"
            d="M6 20 C 60 4, 120 36, 170 20 S 260 4, 314 20"
            fill="none"
            stroke-linecap="round"
          />
          <!-- growing vine -->
          <path
            ref="vinePath"
            class="ds-progress__vine-fill"
            d="M6 20 C 60 4, 120 36, 170 20 S 260 4, 314 20"
            fill="none"
            stroke-linecap="round"
            :style="vineStyle"
          />
        </svg>
        <span
          v-if="showLabel && !indeterminate && !label"
          class="ds-progress__label"
        >{{ clampedValue }}%</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'DsProgressBar' })

interface Props {
  value?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'brand' | 'indigo' | 'accent' | 'terracotta' | 'success'
  indeterminate?: boolean
  showLabel?: boolean
  label?: string
  mode?: 'linear' | 'vine'
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  size: 'md',
  variant: 'brand',
  indeterminate: false,
  showLabel: false,
  label: '',
  mode: 'linear',
})

const clampedValue = computed(() => Math.max(0, Math.min(100, Math.round(props.value))))

const normalizedVariant = computed(() => {
  if (props.variant === 'indigo') return 'brand'
  if (props.variant === 'terracotta') return 'accent'
  return props.variant
})

const vineStyle = computed(() => {
  const pct = clampedValue.value / 100
  return {
    strokeDasharray: '1',
    strokeDashoffset: String(1 - pct),
    '--vine-progress': pct,
  }
})
</script>

<style lang="scss" scoped>
.ds-progress {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  inline-size: 100%;

  &__caption {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--ds-space-3);
  }

  &__label-text {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    line-height: var(--ds-leading-arabic);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    inline-size: 100%;
  }

  // ---------- Linear ----------
  &__track {
    position: relative;
    flex: 1;
    background: rgba(27, 20, 16, 0.06); // warm taupe-tinted
    border-radius: var(--ds-radius-pill);
    overflow: hidden;
  }

  &--sm &__track { block-size: 4px; }
  &--md &__track { block-size: 8px; }
  &--lg &__track { block-size: 12px; }

  &__fill {
    block-size: 100%;
    border-radius: var(--ds-radius-pill);
    transition: inline-size 600ms var(--ds-ease-out);

    &--brand,
    &--indigo   { background: var(--ds-brand-600); }
    &--accent,
    &--terracotta { background: var(--ds-accent-300); }
    &--success  { background: var(--ds-success); }
  }

  &--indeterminate .ds-progress__fill {
    inline-size: 30%;
    animation: ds-progress-indeterminate 1.3s var(--ds-ease-in-out) infinite;
  }

  &__label {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    font-variant-numeric: tabular-nums;
    min-inline-size: 3rem;
    text-align: end;
  }

  // ---------- Vine ----------
  &__vine {
    flex: 1;
    block-size: 40px;
    inline-size: 100%;
    display: block;
    overflow: visible;
  }

  &--sm &__vine { block-size: 28px; }
  &--lg &__vine { block-size: 52px; }

  &__vine-rail {
    stroke: rgba(27, 20, 16, 0.08);
    stroke-width: 3;
  }

  &__vine-fill {
    stroke-width: 3;
    pathLength: 1;
    transition: stroke-dashoffset 600ms var(--ds-ease-out);
  }

  &--brand .ds-progress__vine-fill,
  &--indigo .ds-progress__vine-fill { stroke: var(--ds-brand-600); }
  &--accent .ds-progress__vine-fill,
  &--terracotta .ds-progress__vine-fill { stroke: var(--ds-accent-300); }
  &--success .ds-progress__vine-fill { stroke: var(--ds-success); }
}

// RTL: mirror the vine and the indeterminate sweep.
[dir="rtl"] .ds-progress__vine { transform: scaleX(-1); }

[dir="rtl"] .ds-progress--indeterminate .ds-progress__fill {
  animation-name: ds-progress-indeterminate-rtl;
}

@keyframes ds-progress-indeterminate {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(380%); }
}
@keyframes ds-progress-indeterminate-rtl {
  0%   { transform: translateX(120%); }
  100% { transform: translateX(-380%); }
}

@media (prefers-reduced-motion: reduce) {
  .ds-progress__fill,
  .ds-progress__vine-fill { transition-duration: 0ms; }
  .ds-progress--indeterminate .ds-progress__fill { animation: none; }
}
</style>
