<template>
  <span
    class="ds-tag"
    :class="[
      `ds-tag--${variant}`,
      `ds-tag--${size}`,
      { 'ds-tag--active': active, 'ds-tag--closable': closable }
    ]"
  >
    <span v-if="$slots.icon || icon" class="ds-tag__icon" aria-hidden="true">
      <slot name="icon">
        <i v-if="icon" :class="icon"></i>
      </slot>
    </span>
    <span class="ds-tag__label"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="ds-tag__close"
      :aria-label="closeLabel"
      @click.stop="onClose"
      @keydown.enter.prevent="onClose"
      @keydown.space.prevent="onClose"
    >
      <svg viewBox="0 0 14 14" width="10" height="10" aria-hidden="true" focusable="false">
        <path d="M2 2 L12 12 M12 2 L2 12"
              stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" fill="none" />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'DsTag' })

interface Props {
  variant?: 'indigo' | 'terracotta' | 'taupe' | 'ghost'
  size?: 'sm' | 'md'
  closable?: boolean
  active?: boolean
  icon?: string | null
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'taupe',
  size: 'md',
  closable: false,
  active: false,
  icon: null,
  closeLabel: 'إزالة',
})

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()

function onClose(e: MouseEvent): void {
  emit('close', e)
}
</script>

<style lang="scss" scoped>
.ds-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  line-height: 1;
  border-radius: var(--ds-radius-pill);
  white-space: nowrap;
  transition:
    box-shadow var(--ds-duration-fast) var(--ds-ease-out),
    background-color var(--ds-duration-fast) var(--ds-ease-out);

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
  }

  &__label {
    display: inline-flex;
    align-items: center;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 0;
    margin-inline-start: 0.125rem;
    background: transparent;
    border: none;
    border-radius: var(--ds-radius-pill);
    color: var(--ds-taupe);
    cursor: pointer;
    transition: color var(--ds-duration-fast) var(--ds-ease-out),
                background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover  { color: var(--ds-ink); }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: 0 0 0 2px rgba(50, 40, 115, 0.35);
      color: var(--ds-ink);
    }
  }

  &--sm {
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }
  &--md {
    padding: 0.375rem 0.875rem;
    font-size: 13px;
  }

  // trim inline-end padding when closable so the × has room
  &--closable#{&}--sm { padding-inline-end: 0.4rem; }
  &--closable#{&}--md { padding-inline-end: 0.5rem; }

  &--indigo {
    background: var(--ds-brand-100);
    color: var(--ds-brand-800);
  }
  &--terracotta {
    background: var(--ds-accent-50);
    color: var(--ds-accent-700);
  }
  &--taupe {
    background: var(--ds-surface-sunken);
    color: var(--ds-taupe);
  }
  &--ghost {
    background: transparent;
    color: var(--ds-text);
    border: 1px solid var(--ds-taupe);
  }

  // Active: subtle 2px indigo-100 outer ring
  &--active {
    box-shadow: 0 0 0 2px var(--ds-brand-100);
  }
}
</style>
