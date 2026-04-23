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
        :value="value"
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
      <span v-else class="ds-textarea__helper-spacer" />

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

<script>
let _uid = 0;

export default {
  name: 'DsTextarea',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value:       { type: [String, Number], default: '' },
    label:       { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled:    { type: Boolean, default: false },
    required:    { type: Boolean, default: false },
    error:       { type: String, default: '' },
    rows:        { type: Number, default: 4 },
    maxlength:   { type: Number, default: null },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    id: { type: String, default: null }
  },
  data() {
    return {
      focused: false,
      localUid: `ds-textarea-${++_uid}`
    };
  },
  computed: {
    inputId() {
      return this.id || this.localUid;
    },
    currentLength() {
      return this.value == null ? 0 : String(this.value).length;
    },
    nearLimit() {
      if (!this.maxlength) return false;
      return this.currentLength >= Math.floor(this.maxlength * 0.9);
    },
    describedBy() {
      if (this.error) return `${this.inputId}-error`;
      if (this.$slots.helper) return `${this.inputId}-helper`;
      return null;
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
    onFocus(e) {
      this.focused = true;
      this.$emit('focus', e);
    },
    onBlur(e) {
      this.focused = false;
      this.$emit('blur', e);
    },
    focus() { this.$refs.input && this.$refs.input.focus(); },
    blur()  { this.$refs.input && this.$refs.input.blur(); }
  }
};
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
