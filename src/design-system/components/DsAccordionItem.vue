<template>
  <div
    class="ds-accordion-item"
    :class="{ 'is-open': open, 'is-disabled': disabled }"
  >
    <button
      ref="header"
      type="button"
      class="ds-accordion-item__header"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="bodyId"
      :aria-disabled="disabled ? 'true' : 'false'"
      :disabled="disabled"
      :id="headerId"
      @click="onToggle"
      @keydown="onKeydown"
    >
      <span v-if="$slots.icon || icon" class="ds-accordion-item__icon">
        <slot name="icon">
          <i v-if="icon" :class="icon" aria-hidden="true"></i>
        </slot>
      </span>
      <span class="ds-accordion-item__titles">
        <span class="ds-accordion-item__title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span
          v-if="subtitle || $slots.subtitle"
          class="ds-accordion-item__subtitle"
        >
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
      </span>
      <span class="ds-accordion-item__chevron" aria-hidden="true">
        <slot name="chevron">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </span>
    </button>
    <div
      :id="bodyId"
      role="region"
      :aria-labelledby="headerId"
      class="ds-accordion-item__panel"
      :style="panelStyle"
      :aria-hidden="open ? 'false' : 'true'"
    >
      <div ref="inner" class="ds-accordion-item__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Module-scope id counter for auto-generated item names. Lives in a separate
// `<script>` block so `defineProps()` can reference it via the module closure
// even though defineProps hoists above the setup body.
let __dsAccUid = 0
</script>

<script setup lang="ts">
import { ref, computed, watch, inject, onMounted, onBeforeUnmount, onUpdated } from 'vue'

defineOptions({ name: 'DsAccordionItem' })

interface AccordionApi {
  state: { opened: (string | number)[]; multi: boolean }
  toggle: (name: string | number) => void
  isOpen: (name: string | number) => boolean
  focusNeighbor: (name: string | number, direction: number) => void
  registerRef: (name: string | number, el: HTMLElement | null) => void
  unregisterRef: (name: string | number) => void
}

interface Props {
  name?: string | number
  title?: string
  subtitle?: string
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: () => `ds-acc-${++__dsAccUid}`,
  title: '',
  subtitle: '',
  icon: '',
  disabled: false,
})

const dsAccordion = inject<AccordionApi | null>('dsAccordion', null)

const bodyHeight = ref(0)
const header = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

const open = computed(() => dsAccordion ? dsAccordion.isOpen(props.name) : false)
const headerId = computed(() => `${props.name}-header`)
const bodyId = computed(() => `${props.name}-body`)
const panelStyle = computed(() => ({
  maxHeight: open.value ? `${bodyHeight.value}px` : '0px',
}))

function measure(): void {
  if (!inner.value) return
  const h = inner.value.scrollHeight
  if (h !== bodyHeight.value) bodyHeight.value = h
}

watch(open, () => { measure() })

onMounted(() => {
  measure()
  if (dsAccordion) dsAccordion.registerRef(props.name, header.value)
  ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null
  if (ro && inner.value) ro.observe(inner.value)
})

onBeforeUnmount(() => {
  if (dsAccordion) dsAccordion.unregisterRef(props.name)
  if (ro) ro.disconnect()
})

onUpdated(() => { measure() })

function onToggle(): void {
  if (props.disabled || !dsAccordion) return
  dsAccordion.toggle(props.name)
}

function onKeydown(e: KeyboardEvent): void {
  if (!dsAccordion) return
  const k = e.key
  if (k === 'Enter' || k === ' ') {
    e.preventDefault()
    onToggle()
  } else if (k === 'ArrowDown') {
    e.preventDefault()
    dsAccordion.focusNeighbor(props.name, 1)
  } else if (k === 'ArrowUp') {
    e.preventDefault()
    dsAccordion.focusNeighbor(props.name, -1)
  }
}
</script>

<style lang="scss" scoped>
@import "../mixins.scss";

.ds-accordion-item {
  background: var(--ds-surface-elevated);
  border-radius: var(--ds-radius-md);

  & + & {
    border-top: 1px solid var(--ds-border);
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    background: transparent;
    border: 0;
    cursor: pointer;
    text-align: start;
    padding: var(--ds-space-4) var(--ds-space-5);
    color: var(--ds-text);
    font-family: var(--ds-font-heading);
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover:not(:disabled) {
      background-color: var(--ds-surface-sunken);
    }
    &:focus-visible {
      @include ds-focus-ring;
      border-radius: var(--ds-radius-sm);
    }
  }

  &.is-disabled &__header {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-brand-600);
  }

  &__titles {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-normal);
  }

  &__chevron {
    flex: 0 0 auto;
    color: var(--ds-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--ds-duration-base) var(--ds-ease-out);
  }

  &.is-open &__chevron {
    transform: rotate(-180deg);
  }

  &__panel {
    overflow: hidden;
    max-height: 0;
    transition: max-height var(--ds-duration-base) var(--ds-ease-out);
    will-change: max-height;
  }

  &__body {
    padding: 0 var(--ds-space-5) var(--ds-space-4);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: var(--ds-leading-arabic);
  }
}

// chevron SVG points down by default; rotation logic is vertical and
// therefore direction-agnostic — no RTL override needed. (Left note instead
// of an empty `:global(html[dir='rtl'])` rule, which the Vue scoped-style
// parser was mis-compiling into a whole-document scaleX(-1) flip.)
</style>
