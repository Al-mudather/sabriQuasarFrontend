<template>
  <span class="ds-badge" :class="[`ds-badge--${variant}`, `ds-badge--${size}`]">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'DsBadge',
  props: {
    variant: {
      type: String,
      default: 'neutral',
      validator: v => ['neutral', 'brand', 'success', 'warning', 'danger', 'info', 'accent'].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md'].includes(v)
    }
  }
}
</script>

<style lang="scss" scoped>
.ds-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  line-height: 1;
  border-radius: var(--ds-radius-pill);
  white-space: nowrap;

  &--sm { padding: 0.2rem 0.55rem; font-size: var(--ds-text-2xs); }
  &--md { padding: 0.3rem 0.75rem; font-size: var(--ds-text-xs); }

  &--neutral { background: var(--ds-neutral-100); color: var(--ds-neutral-700); }
  &--brand   { background: var(--ds-brand-50);    color: var(--ds-brand-700); }
  &--accent  { background: var(--ds-accent-50);   color: var(--ds-accent-600); }
  &--success { background: var(--ds-success-bg);  color: var(--ds-success); }
  &--warning { background: var(--ds-warning-bg);  color: var(--ds-warning); }
  &--danger  { background: var(--ds-danger-bg);   color: var(--ds-danger); }
  &--info    { background: var(--ds-info-bg);     color: var(--ds-info); }
}
</style>
