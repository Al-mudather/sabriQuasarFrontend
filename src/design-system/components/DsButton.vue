<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : null"
    :href="tag === 'a' ? href : null"
    class="ds-btn"
    :class="[
      `ds-btn--${variant}`,
      `ds-btn--${size}`,
      { 'ds-btn--full': fullWidth, 'ds-btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : null"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="ds-btn__spinner" aria-hidden="true" />
    <span v-if="$slots.leading && !loading" class="ds-btn__icon ds-btn__icon--leading">
      <slot name="leading" />
    </span>
    <span class="ds-btn__label"><slot /></span>
    <span v-if="$slots.trailing && !loading" class="ds-btn__icon ds-btn__icon--trailing">
      <slot name="trailing" />
    </span>
  </component>
</template>

<script>
export default {
  name: 'DsButton',
  props: {
    tag:        { type: String, default: 'button' },
    nativeType: { type: String, default: 'button' },
    href:       { type: String, default: null },
    variant:    {
      type: String,
      default: 'primary',
      validator: v => ['primary', 'secondary', 'ghost', 'danger', 'accent'].includes(v)
    },
    size:       {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    fullWidth:  { type: Boolean, default: false },
    disabled:   { type: Boolean, default: false },
    loading:    { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-2);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  line-height: 1;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out),
    transform        var(--ds-duration-fast) var(--ds-ease-out);

  &:focus-visible { @include ds-focus-ring; }
  &:disabled      { opacity: 0.55; cursor: not-allowed; }
  &:active:not(:disabled) { transform: translateY(1px); }
  &--full { width: 100%; }

  // --- sizes ---
  &--sm { padding: 0.4rem 0.95rem; font-size: var(--ds-text-sm); min-height: 2rem; }
  &--md { padding: 0.55rem 1.25rem; font-size: var(--ds-text-md); min-height: 2.5rem; }
  &--lg { padding: 0.75rem 1.5rem;  font-size: var(--ds-text-lg); min-height: 3rem; }

  // --- variants ---
  &--primary {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    &:hover:not(:disabled) { background: var(--ds-brand-700); }
  }
  &--secondary {
    background: var(--ds-surface);
    color: var(--ds-brand-700);
    border-color: var(--ds-border-strong);
    &:hover:not(:disabled) { background: var(--ds-surface-muted); border-color: var(--ds-brand-600); }
  }
  &--accent {
    background: var(--ds-accent-300);
    color: var(--ds-brand-800);
    &:hover:not(:disabled) { background: var(--ds-accent-400); }
  }
  &--ghost {
    background: transparent;
    color: var(--ds-text);
    &:hover:not(:disabled) { background: var(--ds-surface-muted); }
  }
  &--danger {
    background: var(--ds-danger);
    color: var(--ds-text-onBrand);
    &:hover:not(:disabled) { filter: brightness(0.95); }
  }

  // --- loading ---
  &--loading { cursor: wait; }
  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    border-radius: 50%;
    animation: ds-btn-spin var(--ds-duration-slow) linear infinite;
  }
}

@keyframes ds-btn-spin { to { transform: rotate(360deg); } }
</style>
