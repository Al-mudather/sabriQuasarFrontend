<template>
  <div
    class="ds-input"
    :class="[
      `ds-input--${size}`,
      {
        'ds-input--disabled': disabled,
        'ds-input--error': !!error,
        'ds-input--focused': focused
      }
    ]"
  >
    <label
      v-if="$slots.label || label"
      :for="inputId"
      class="ds-input__label"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="ds-input__required" aria-hidden="true">*</span>
    </label>

    <div class="ds-input__field" :class="{ 'ds-input__field--directional': directionalIcon }">
      <span
        v-if="$slots.prefix"
        class="ds-input__affix ds-input__affix--prefix"
      >
        <slot name="prefix" />
      </span>

      <input
        :id="inputId"
        ref="input"
        class="ds-input__control"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
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
        class="ds-input__affix ds-input__affix--suffix"
      >
        <slot name="suffix" />
      </span>
    </div>

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="ds-input__helper ds-input__helper--error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="$slots.helper"
      :id="`${inputId}-helper`"
      class="ds-input__helper"
    >
      <slot name="helper" />
    </p>
  </div>
</template>

<script>
let _uid = 0;

export default {
  name: 'DsInput',
  inheritAttrs: false,
  emits: ['update:modelValue', 'focus', 'blur'],
  props: {
    modelValue:  { type: [String, Number], default: '' },
    type:        {
      type: String,
      default: 'text',
      validator: v => ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(v)
    },
    label:       { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled:    { type: Boolean, default: false },
    required:    { type: Boolean, default: false },
    error:       { type: String, default: '' },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    id:               { type: String, default: null },
    directionalIcon:  { type: Boolean, default: false }
  },
  data() {
    return {
      focused: false,
      localUid: `ds-input-${++_uid}`
    };
  },
  computed: {
    inputId() {
      return this.id || this.localUid;
    },
    describedBy() {
      if (this.error) return `${this.inputId}-error`;
      if (this.$slots.helper) return `${this.inputId}-helper`;
      return null;
    }
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', e.target.value);
    },
    onFocus(e) {
      this.focused = true;
      this.$emit('focus', e);
    },
    onBlur(e) {
      this.focused = false;
      this.$emit('blur', e);
    },
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },
    blur() {
      this.$refs.input && this.$refs.input.blur();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-input {
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
    align-items: center;
    gap: var(--ds-space-2);
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-taupe);
    border-radius: var(--ds-radius-sm); // 8px-ish (6px token, closest to spec 8)
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
  }

  // Directional icons flip under RTL via scaleX; non-directional stay put.
  &__field--directional [dir='rtl'] & .ds-input__affix--prefix,
  &__field--directional [dir='rtl'] & .ds-input__affix--suffix {
    transform: scaleX(-1);
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
    line-height: var(--ds-leading-normal);
    padding-block: 0.75rem;
    padding-inline: 0;

    &::placeholder {
      color: var(--ds-taupe);
      opacity: 0.8;
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--ds-text-muted);
    }
  }

  // --- sizes (adjust vertical padding + font) ---
  &--sm .ds-input__control {
    padding-block: 0.5rem;
    font-size: var(--ds-text-sm);
  }
  &--md .ds-input__control {
    padding-block: 0.75rem;
    font-size: var(--ds-text-md);
  }
  &--lg .ds-input__control {
    padding-block: 1rem;
    font-size: var(--ds-text-lg);
  }

  // --- focus ---
  &--focused .ds-input__field {
    @include ds-focus-ring;
    border-color: var(--ds-brand-600);
  }

  // --- error ---
  &--error .ds-input__field {
    border-color: var(--ds-danger);
  }
  &--error.ds-input--focused .ds-input__field {
    box-shadow: 0 0 0 3px rgba(158, 53, 36, 0.25);
    border-color: var(--ds-danger);
  }

  // --- disabled ---
  &--disabled .ds-input__field {
    background: var(--ds-neutral-100);
    border-color: var(--ds-neutral-300);
    cursor: not-allowed;
  }
  &--disabled .ds-input__label,
  &--disabled .ds-input__affix {
    color: var(--ds-text-muted);
    opacity: 0.75;
  }

  &__helper {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-arabic);
    margin: 0;

    &--error {
      color: var(--ds-danger);
      font-weight: var(--ds-weight-medium);
    }
  }
}
</style>
