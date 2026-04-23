<template>
  <component
    :is="tag"
    ref="root"
    :type="tag === 'button' ? nativeType : null"
    :href="tag === 'a' ? href : null"
    class="ds-btn"
    :class="[
      `ds-btn--${resolvedVariant}`,
      `ds-btn--${size}`,
      {
        'ds-btn--full': fullWidth,
        'ds-btn--loading': loading,
        'ds-btn--pill': pill,
        'ds-btn--disabled': disabled || loading
      }
    ]"
    :disabled="(tag === 'button') ? (disabled || loading) : null"
    :aria-disabled="(disabled || loading) ? 'true' : null"
    :aria-busy="loading ? 'true' : null"
    @click="onClick"
  >
    <span v-if="loading" class="ds-btn__spinner" aria-hidden="true"></span>
    <span
      v-if="$slots.leading && !loading"
      class="ds-btn__icon ds-btn__icon--leading"
    >
      <slot name="leading" />
    </span>
    <span class="ds-btn__label"><slot /></span>
    <span
      v-if="$slots.trailing && !loading"
      class="ds-btn__icon ds-btn__icon--trailing"
    >
      <slot name="trailing" />
    </span>
  </component>
</template>

<script>
import { magnetic } from 'src/design-system/motion';

export default {
  name: 'DsButton',
  props: {
    tag:        { type: String, default: 'button' },
    nativeType: { type: String, default: 'button' },
    href:       { type: String, default: null },
    variant: {
      type: String,
      default: 'primary',
      validator: v => [
        'primary',
        'secondary',
        'ghost',
        'danger',
        'destructive',
        'accent'
      ].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    fullWidth:       { type: Boolean, default: false },
    disabled:        { type: Boolean, default: false },
    loading:         { type: Boolean, default: false },
    pill:            { type: Boolean, default: false },
    magneticEnabled: { type: Boolean, default: true },
    magneticStrength:{ type: Number,  default: 4 }
  },
  computed: {
    // 'danger' kept as alias for 'destructive' to preserve call-site API
    resolvedVariant() {
      return this.variant === 'danger' ? 'destructive' : this.variant;
    }
  },
  watch: {
    disabled(v)        { if (v) this.teardownMagnetic(); else this.setupMagnetic(); },
    loading(v)         { if (v) this.teardownMagnetic(); else this.setupMagnetic(); },
    magneticEnabled(v) { if (v) this.setupMagnetic(); else this.teardownMagnetic(); }
  },
  mounted() {
    this.setupMagnetic();
  },
  beforeUnmount() {
    this.teardownMagnetic();
  },
  methods: {
    onClick(e) {
      if (this.disabled || this.loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.$emit('click', e);
    },
    setupMagnetic() {
      this.teardownMagnetic();
      if (!this.magneticEnabled || this.disabled || this.loading) return;
      const el = this.$refs.root && this.$refs.root.$el
        ? this.$refs.root.$el
        : this.$refs.root;
      if (!el) return;
      // magnetic() already respects prefers-reduced-motion
      this._magneticHandle = magnetic(el, { strength: this.magneticStrength });
    },
    teardownMagnetic() {
      if (this._magneticHandle && typeof this._magneticHandle.kill === 'function') {
        this._magneticHandle.kill();
      }
      this._magneticHandle = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-2);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  line-height: 1;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: var(--ds-radius-md); // 10px default
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  box-shadow: var(--ds-shadow-xs);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out),
    box-shadow       var(--ds-duration-fast) var(--ds-ease-out),
    transform        var(--ds-duration-fast) var(--ds-ease-out);

  &:focus-visible { @include ds-focus-ring; }

  // Active press: lift up with a deeper shadow
  &:active:not(.ds-btn--disabled):not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--ds-shadow-md);
  }

  &--full { width: 100%; }
  &--pill { border-radius: var(--ds-radius-pill); }

  // --- sizes ---
  &--sm {
    padding-block: 0.4rem;
    padding-inline: 0.95rem;
    font-size: var(--ds-text-sm);
    min-height: 2rem;
  }
  &--md {
    padding-block: 0.55rem;
    padding-inline: 1.25rem;
    font-size: var(--ds-text-md);
    min-height: 2.5rem;
  }
  &--lg {
    padding-block: 0.75rem;
    padding-inline: 1.5rem;
    font-size: var(--ds-text-lg);
    min-height: 3rem;
  }

  // --- variants ---
  &--primary {
    background: var(--ds-brand-600);
    color: var(--ds-text-on-indigo);
    &:hover:not(.ds-btn--disabled) {
      background: var(--ds-brand-700);
      box-shadow: var(--ds-shadow-sm);
    }
  }
  &--secondary {
    background: var(--ds-surface-elevated);
    color: var(--ds-brand-700);
    border-color: var(--ds-border-strong);
    &:hover:not(.ds-btn--disabled) {
      background: var(--ds-surface);
      border-color: var(--ds-brand-600);
    }
  }
  &--accent {
    background: var(--ds-accent-300);
    color: var(--ds-text-on-indigo);
    &:hover:not(.ds-btn--disabled) { background: var(--ds-accent-400); }
  }
  &--ghost {
    background: transparent;
    color: var(--ds-text);
    border-color: transparent;
    box-shadow: none;
    &:hover:not(.ds-btn--disabled) {
      border-color: var(--ds-taupe);
      background: transparent;
    }
  }
  &--destructive {
    background: var(--ds-danger);
    color: var(--ds-text-on-indigo);
    &:hover:not(.ds-btn--disabled) { filter: brightness(0.95); }
  }

  // --- loading / disabled ---
  &--loading { cursor: wait; }
  &--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    // Magnetic is torn down in JS; ensure no residual transform hover effects
    &:hover { transform: none; }
    &:active { transform: none; box-shadow: none; }
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    border-radius: 50%;
    animation: ds-btn-spin var(--ds-duration-slow) linear infinite;
    color: var(--ds-brand-600);
  }

  // Primary/accent/destructive keep spinner in the onBrand ivory tone
  &--primary .ds-btn__spinner,
  &--accent .ds-btn__spinner,
  &--destructive .ds-btn__spinner {
    color: var(--ds-text-on-indigo);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
  }
}

@keyframes ds-btn-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .ds-btn {
    transition: none;
  }
  .ds-btn:active:not(.ds-btn--disabled) {
    transform: none;
  }
}
</style>
