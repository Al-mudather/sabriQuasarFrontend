<template>
  <component
    :is="to ? RouterLink : tag"
    ref="root"
    :to="to || null"
    :type="!to && tag === 'button' ? nativeType : null"
    :href="!to && tag === 'a' ? href : null"
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
    :disabled="(!to && tag === 'button') ? (disabled || loading) : null"
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { magnetic } from 'src/design-system/motion'

defineOptions({ name: 'DsButton' })

interface Props {
  tag?: string
  nativeType?: string
  href?: string | null
  // When set, the button renders as a <router-link> for in-app SPA navigation
  // (correct under hash history — generates `#/...` hrefs and pushes without a
  // full reload). Takes precedence over `tag`/`href`.
  to?: string | Record<string, unknown> | null
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  pill?: boolean
  magneticEnabled?: boolean
  magneticStrength?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  nativeType: 'button',
  href: null,
  to: null,
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false,
  loading: false,
  pill: false,
  magneticEnabled: true,
  magneticStrength: 4,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 'danger' kept as alias for 'destructive' to preserve call-site API
const resolvedVariant = computed(() =>
  props.variant === 'danger' ? 'destructive' : props.variant
)

const root = ref<HTMLElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let magneticHandle: { kill: () => void } | null = null

function teardownMagnetic(): void {
  if (magneticHandle && typeof magneticHandle.kill === 'function') {
    magneticHandle.kill()
  }
  magneticHandle = null
}

function setupMagnetic(): void {
  teardownMagnetic()
  if (!props.magneticEnabled || props.disabled || props.loading) return
  const el = root.value && (root.value as unknown as { $el: HTMLElement }).$el
    ? (root.value as unknown as { $el: HTMLElement }).$el
    : root.value
  if (!el) return
  magneticHandle = magnetic(el, { strength: props.magneticStrength })
}

watch(() => props.disabled, (v) => { if (v) teardownMagnetic(); else setupMagnetic() })
watch(() => props.loading, (v) => { if (v) teardownMagnetic(); else setupMagnetic() })
watch(() => props.magneticEnabled, (v) => { if (v) setupMagnetic(); else teardownMagnetic() })

onMounted(() => { setupMagnetic() })
onBeforeUnmount(() => { teardownMagnetic() })

function onClick(e: MouseEvent): void {
  if (props.disabled || props.loading) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit('click', e)
}
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
