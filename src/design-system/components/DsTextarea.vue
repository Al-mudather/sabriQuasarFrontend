<template>
  <div
    class="ds-textarea"
    :class="[
      `ds-textarea--${size}`,
      {
        'ds-textarea--disabled': disabled,
        'ds-textarea--error': !!error,
        'ds-textarea--focused': focused
      }
    ]"
  >
    <label
      v-if="$slots.label || label"
      :for="inputId"
      class="ds-textarea__label"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="ds-textarea__required" aria-hidden="true">*</span>
    </label>

    <div class="ds-textarea__field">
      <span
        v-if="$slots.prefix"
        class="ds-textarea__affix ds-textarea__affix--prefix"
      >
        <slot name="prefix" />
      </span>

      <textarea
        :id="inputId"
        ref="input"
        class="ds-textarea__control"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :maxlength="maxlength || null"
        :aria-invalid="error ? 'true' : null"
        :aria-describedby="describedBy"
        v-bind="$attrs"
        @input="onInput"
        @change="$emit('change', $event.target.value)"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="$emit('keydown', $event)"
      />

      <span
        v-if="$slots.suffix"
        class="ds-textarea__affix ds-textarea__affix--suffix"
      >
        <slot name="suffix" />
      </span>
    </div>

    <div class="ds-textarea__footer">
      <p
        v-if="error"
        :id="`${inputId}-error`"
        class="ds-textarea__helper ds-textarea__helper--error"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-else-if="$slots.helper"
        :id="`${inputId}-helper`"
        class="ds-textarea__helper"
      >
        <slot name="helper" />
      </p>
      <span v-else class="ds-textarea__helper-spacer"></span>

      <span
        v-if="maxlength"
        class="ds-textarea__counter"
        :class="{ 'ds-textarea__counter--near': nearLimit }"
        aria-live="polite"
      >
        {{ currentLength }} / {{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

defineOptions({ name: 'DsTextarea', inheritAttrs: false })

let _uid = 0

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  rows?: number
  maxlength?: number | null
  size?: 'sm' | 'md' | 'lg'
  id?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  error: '',
  rows: 4,
  maxlength: null,
  size: 'md',
  id: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', val: string): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const slots = useSlots()
const focused = ref(false)
const localUid = `ds-textarea-${++_uid}`
const input = ref<HTMLTextAreaElement | null>(null)

const inputId = computed(() => props.id || localUid)

const currentLength = computed(() =>
  props.modelValue == null ? 0 : String(props.modelValue).length
)

const nearLimit = computed(() => {
  if (!props.maxlength) return false
  return currentLength.value >= Math.floor(props.maxlength * 0.9)
})

const describedBy = computed(() => {
  if (props.error) return `${inputId.value}-error`
  if (slots.helper) return `${inputId.value}-helper`
  return null
})

function onInput(e: Event): void {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

function onFocus(e: FocusEvent): void {
  focused.value = true
  emit('focus', e)
}

function onBlur(e: FocusEvent): void {
  focused.value = false
  emit('blur', e)
}

function focus(): void { input.value?.focus() }
function blur(): void  { input.value?.blur() }

defineExpose({ focus, blur })
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-textarea {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  font-family: var(--ds-font-body);
  color: var(--ds-text);
  width: 100%;

  &__label {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
  }

  &__required {
    color: var(--ds-danger);
    margin-inline-start: 0.25rem;
  }

  &__field {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-taupe);
    border-radius: var(--ds-radius-sm);
    padding-block: 0;
    padding-inline-start: var(--ds-space-3);
    padding-inline-end:   var(--ds-space-3);
    transition:
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow   var(--ds-duration-fast) var(--ds-ease-out),
      background-color var(--ds-duration-fast) var(--ds-ease-out);
  }

  &__affix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-taupe);
    font-size: var(--ds-text-md);
    flex: 0 0 auto;
    padding-block: 0.75rem;
  }

  &__control {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: var(--ds-leading-arabic);
    padding-block: 0.75rem;
    padding-inline: 0;
    resize: vertical;
    min-height: 3rem;

    &::placeholder {
      color: var(--ds-taupe);
      opacity: 0.8;
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--ds-text-muted);
      resize: none;
    }
  }

  // --- sizes ---
  &--sm .ds-textarea__control {
    padding-block: 0.5rem;
    font-size: var(--ds-text-sm);
  }
  &--md .ds-textarea__control {
    padding-block: 0.75rem;
    font-size: var(--ds-text-md);
  }
  &--lg .ds-textarea__control {
    padding-block: 1rem;
    font-size: var(--ds-text-lg);
  }

  // --- focus ---
  &--focused .ds-textarea__field {
    @include ds-focus-ring;
    border-color: var(--ds-brand-600);
  }

  // --- error ---
  &--error .ds-textarea__field {
    border-color: var(--ds-danger);
  }
  &--error.ds-textarea--focused .ds-textarea__field {
    box-shadow: 0 0 0 3px rgba(158, 53, 36, 0.25);
    border-color: var(--ds-danger);
  }

  // --- disabled ---
  &--disabled .ds-textarea__field {
    background: var(--ds-neutral-100);
    border-color: var(--ds-neutral-300);
    cursor: not-allowed;
  }
  &--disabled .ds-textarea__label,
  &--disabled .ds-textarea__affix {
    color: var(--ds-text-muted);
    opacity: 0.75;
  }

  &__footer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }

  &__helper,
  &__helper-spacer {
    flex: 1 1 auto;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-arabic);
    margin: 0;
  }

  &__helper {
    &--error {
      color: var(--ds-danger);
      font-weight: var(--ds-weight-medium);
    }
  }

  &__counter {
    flex: 0 0 auto;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    font-variant-numeric: tabular-nums;
    margin-inline-start: auto;

    &--near {
      color: var(--ds-warning);
    }
  }
}
</style>
