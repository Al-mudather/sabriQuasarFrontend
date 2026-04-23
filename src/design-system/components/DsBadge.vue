<template>
  <span class="ds-badge" :class="[`ds-badge--${resolvedVariant}`, `ds-badge--${size}`]">
    <span v-if="$slots.icon || icon" class="ds-badge__icon" aria-hidden="true">
      <slot name="icon">
        <i v-if="icon" :class="icon"></i>
      </slot>
    </span>
    <slot />
  </span>
</template>

<script>
export default {
  name: 'DsBadge',
  props: {
    variant: {
      type: String,
      default: 'taupe',
      // Preserve legacy values (neutral/brand/accent/info) + new names
      validator: v => [
        'indigo', 'terracotta', 'taupe',
        'success', 'warning', 'danger', 'ghost',
        // legacy aliases
        'neutral', 'brand', 'accent', 'info'
      ].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md'].includes(v)
    },
    icon: { type: String, default: null }
  },
  computed: {
    resolvedVariant () {
      // Map legacy names forward to the new vocabulary
      const map = {
        neutral: 'taupe',
        brand:   'indigo',
        accent:  'terracotta',
        info:    'indigo'
      }
      return map[this.variant] || this.variant
    }
  }
}
</script>

<style lang="scss" scoped>
.ds-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  line-height: 1;
  border-radius: var(--ds-radius-pill);
  white-space: nowrap;

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
  }

  &--sm {
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }
  &--md {
    padding: 0.375rem 0.875rem;
    font-size: 13px;
  }

  // indigo: indigo-100 bg, indigo-800 text
  &--indigo {
    background: var(--ds-brand-100);
    color: var(--ds-brand-800);
  }
  // terracotta: terracotta-50 bg, terracotta-700 text
  &--terracotta {
    background: var(--ds-accent-50);
    color: var(--ds-accent-700);
  }
  // taupe: cream-sunken bg, taupe text
  &--taupe {
    background: var(--ds-surface-sunken);
    color: var(--ds-taupe);
  }
  &--success {
    background: var(--ds-success-bg);
    color: var(--ds-success);
  }
  &--warning {
    background: var(--ds-warning-bg);
    color: var(--ds-warning);
  }
  &--danger {
    background: var(--ds-danger-bg);
    color: var(--ds-danger);
  }
  &--ghost {
    background: transparent;
    color: var(--ds-text);
    border: 1px solid var(--ds-taupe);
  }
}
</style>
