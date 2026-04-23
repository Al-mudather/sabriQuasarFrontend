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
    :aria-valuenow="indeterminate ? null : clampedValue"
    :aria-label="label || null"
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

<script>
// DsProgressBar — linear (pill) or vine (growing curved path).
// Preserved API: value, size (sm/md/lg), variant (brand/accent/success),
// indeterminate, showLabel.
// Extended: variant aliases (indigo/terracotta), label (string above),
// mode (linear|vine).
export default {
  name: 'DsProgressBar',
  props: {
    value:         { type: Number, default: 0 },
    size:          { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
    variant:       {
      type: String,
      default: 'brand',
      validator: v => ['brand', 'indigo', 'accent', 'terracotta', 'success'].includes(v)
    },
    indeterminate: { type: Boolean, default: false },
    showLabel:     { type: Boolean, default: false },
    label:         { type: String, default: '' },
    mode:          { type: String, default: 'linear', validator: v => ['linear', 'vine'].includes(v) }
  },
  computed: {
    clampedValue () { return Math.max(0, Math.min(100, Math.round(this.value))) },
    // Normalize variant aliases so the class matches CSS.
    normalizedVariant () {
      if (this.variant === 'indigo') return 'brand'
      if (this.variant === 'terracotta') return 'accent'
      return this.variant
    },
    vineStyle () {
      // Path length of the cubic-bezier above is ~320 units. We use CSS
      // pathLength-agnostic stroke-dasharray: 1 0 via `pathLength` trick below.
      const pct = this.clampedValue / 100
      return {
        strokeDasharray: '1',
        strokeDashoffset: String(1 - pct),
        // pathLength normalizes to 1 on modern browsers
        ['--vine-progress']: pct
      }
    }
  }
}
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
