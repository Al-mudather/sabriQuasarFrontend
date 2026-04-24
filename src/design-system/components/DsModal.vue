<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    :seamless="false"
    :content-class="contentClass"
    transition-show="ds-modal-in"
    transition-hide="ds-modal-out"
    @update:model-value="onInput"
    @show="$emit('show')"
    @hide="$emit('hide')"
  >
    <div
      class="ds-modal"
      :class="[`ds-modal--${size}`, { 'ds-modal--danger': danger }]"
      role="dialog"
      aria-modal="true"
    >
      <header class="ds-modal__header">
        <slot name="close-button">
          <button
            type="button"
            class="ds-modal__close"
            :aria-label="closeLabel"
            @click="close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </slot>
        <div class="ds-modal__title">
          <slot name="header" />
        </div>
      </header>

      <div class="ds-modal__body">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="ds-modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'DsModal' })

interface Props {
  modelValue?: boolean
  persistent?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  danger?: boolean
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  persistent: false,
  size: 'md',
  danger: false,
  closeLabel: 'Close',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
}>()

const contentClass = computed(() => ['ds-modal-backdrop'])

function onInput(val: boolean): void {
  emit('update:modelValue', val)
}

function close(): void {
  emit('update:modelValue', false)
}
</script>

<style lang="scss">
// Backdrop override — Quasar applies its default backdrop on the root
// dialog via .q-dialog__backdrop. We target our content-class to customise.
.q-dialog__backdrop.ds-modal-backdrop,
.ds-modal-backdrop .q-dialog__backdrop {
  background: rgba(27, 20, 16, 0.45);
}

.ds-modal {
  background: var(--ds-surface-ivory);
  color: var(--ds-text);
  border-radius: var(--ds-radius-xl);
  padding: var(--ds-space-6) var(--ds-space-6) var(--ds-space-5);
  box-shadow:
    0 20px 40px rgba(27, 20, 16, 0.15),
    0 8px 16px rgba(27, 20, 16, 0.08);
  font-family: var(--ds-font-body);
  line-height: var(--ds-leading-arabic);
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &--sm { max-width: 420px; }
  &--md { max-width: 560px; }
  &--lg { max-width: 760px; }
  &--xl { max-width: 960px; }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-3);
    padding-bottom: var(--ds-space-3);
    border-bottom: 1px solid var(--ds-border);
  }

  &__title {
    flex: 1;
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-lg);
    color: var(--ds-text);
    min-width: 0;
  }

  &__close {
    order: -1; // close button first in the flow (logical-start)
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: var(--ds-ink);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background var(--ds-duration-fast) var(--ds-ease-out);

    &:hover,
    &:focus-visible {
      background: var(--ds-surface-sunken);
      outline: none;
    }

    &:focus-visible {
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__body {
    font-size: var(--ds-text-md);
    color: var(--ds-text);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-3);
    padding-top: var(--ds-space-3);
    border-top: 1px solid var(--ds-border);
  }

  // Danger variant — terracotta-tinted header (mapped to danger-rust via semantic)
  &--danger {
    .ds-modal__header {
      border-bottom-color: var(--ds-danger);
    }
    .ds-modal__title {
      color: var(--ds-danger);
    }
  }
}

// Enter / exit motion — fade + scale
.ds-modal-in-enter-active,
.ds-modal-out-leave-active {
  transition:
    opacity var(--ds-duration-base) var(--ds-ease-out),
    transform var(--ds-duration-base) var(--ds-ease-out);
}
.ds-modal-in-enter,
.ds-modal-out-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.ds-modal-in-enter-to,
.ds-modal-out-leave {
  opacity: 1;
  transform: scale(1);
}
</style>
