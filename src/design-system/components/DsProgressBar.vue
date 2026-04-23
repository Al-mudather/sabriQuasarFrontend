<template>
  <div
    class="ds-progress"
    :class="[`ds-progress--${size}`, { 'ds-progress--indeterminate': indeterminate }]"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? null : clampedValue"
  >
    <div class="ds-progress__track">
      <div
        class="ds-progress__fill"
        :class="`ds-progress__fill--${variant}`"
        :style="indeterminate ? null : { inlineSize: clampedValue + '%' }"
      />
    </div>
    <span v-if="showLabel && !indeterminate" class="ds-progress__label">{{ clampedValue }}%</span>
  </div>
</template>

<script>
export default {
  name: 'DsProgressBar',
  props: {
    value:         { type: Number, default: 0 },
    size:          { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
    variant:       { type: String, default: 'brand', validator: v => ['brand', 'accent', 'success'].includes(v) },
    indeterminate: { type: Boolean, default: false },
    showLabel:     { type: Boolean, default: false }
  },
  computed: {
    clampedValue () { return Math.max(0, Math.min(100, Math.round(this.value))) }
  }
}
</script>

<style lang="scss" scoped>
.ds-progress {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  inline-size: 100%;

  &__track {
    position: relative;
    flex: 1;
    background: var(--ds-neutral-100);
    border-radius: var(--ds-radius-pill);
    overflow: hidden;
  }

  &--sm &__track { block-size: 4px; }
  &--md &__track { block-size: 7px; }
  &--lg &__track { block-size: 10px; }

  &__fill {
    block-size: 100%;
    border-radius: var(--ds-radius-pill);
    transition: inline-size var(--ds-duration-base) var(--ds-ease-out);

    &--brand   { background: linear-gradient(90deg, var(--ds-brand-600),  var(--ds-accent-300)); }
    &--accent  { background: var(--ds-accent-300); }
    &--success { background: var(--ds-success); }
  }

  &__label {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    font-variant-numeric: tabular-nums;
    min-inline-size: 2.5rem;
    text-align: end;
  }

  &--indeterminate .ds-progress__fill {
    inline-size: 30%;
    animation: ds-progress-indeterminate 1.3s var(--ds-ease-in-out) infinite;
  }
}

@keyframes ds-progress-indeterminate {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(380%); }
}

[dir="rtl"] .ds-progress--indeterminate .ds-progress__fill {
  animation-name: ds-progress-indeterminate-rtl;
}
@keyframes ds-progress-indeterminate-rtl {
  0%   { transform: translateX(120%); }
  100% { transform: translateX(-380%); }
}
</style>
