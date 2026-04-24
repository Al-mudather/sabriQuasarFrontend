<template>
  <div
    class="ds-tabs"
    :class="[`ds-tabs--${align}`, `ds-tabs--${size}`]"
  >
    <div
      ref="list"
      class="ds-tabs__list"
      role="tablist"
    >
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.name"
        :ref="setTabRef"
        type="button"
        role="tab"
        class="ds-tabs__tab"
        :class="{
          'is-active': tab.name === currentValue,
          'is-disabled': tab.disabled,
        }"
        :aria-selected="tab.name === currentValue ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : 'false'"
        :tabindex="tab.name === currentValue ? 0 : -1"
        :disabled="tab.disabled"
        @click="select(tab)"
        @keydown="onKeydown($event, idx)"
      >
        <span v-if="tab.icon" class="ds-tabs__icon">
          <i :class="tab.icon" aria-hidden="true"></i>
        </span>
        <span class="ds-tabs__label">{{ tab.label }}</span>
      </button>
      <span
        v-show="indicator.width > 0"
        class="ds-tabs__indicator"
        :style="indicatorStyle"
        aria-hidden="true"
      />
    </div>
    <div class="ds-tabs__panels">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted, onBeforeUnmount, onUpdated, nextTick } from 'vue'

defineOptions({ name: 'DsTabs' })

interface TabEntry {
  name: string | number
  label: string
  icon: string
  disabled: boolean
}

interface Props {
  modelValue?: string | number | null
  align?: 'start' | 'center' | 'end' | 'stretch'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  align: 'start',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
  (e: 'change', val: string | number): void
}>()

const tabs = ref<TabEntry[]>([])
const tabRefs = ref<HTMLElement[]>([])
const indicator = ref({ offset: 0, width: 0 })
const list = ref<HTMLElement | null>(null)

const currentValue = computed(() => {
  if (props.modelValue != null) return props.modelValue
  const first = tabs.value.find((t) => !t.disabled)
  return first ? first.name : null
})

const isRTL = computed(() => {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('dir') === 'rtl'
})

const indicatorStyle = computed(() => ({
  transform: `translateX(${indicator.value.offset}px)`,
  width: `${indicator.value.width}px`,
}))

function setTabRef(el: Element | null): void {
  if (el && !tabRefs.value.includes(el as HTMLElement)) tabRefs.value.push(el as HTMLElement)
}

function register(tab: TabEntry): void {
  if (!tabs.value.find((t) => t.name === tab.name)) {
    tabs.value.push(tab)
  }
}

function unregister(name: string | number): void {
  tabs.value = tabs.value.filter((t) => t.name !== name)
  tabRefs.value = []
}

function select(tab: TabEntry): void {
  if (tab.disabled) return
  emit('update:modelValue', tab.name)
  emit('change', tab.name)
}

function updateIndicator(): void {
  if (!list.value) return
  const activeIdx = tabs.value.findIndex((t) => t.name === currentValue.value)
  if (activeIdx < 0) {
    indicator.value = { offset: 0, width: 0 }
    return
  }
  const btn = list.value.querySelectorAll('.ds-tabs__tab')[activeIdx] as HTMLElement | undefined
  if (!btn) return
  indicator.value = { offset: btn.offsetLeft, width: btn.offsetWidth }
}

watch(currentValue, () => { void nextTick(updateIndicator) })
watch(tabs, () => { void nextTick(updateIndicator) })

onMounted(() => {
  void nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})

onUpdated(() => { void nextTick(updateIndicator) })

function onKeydown(e: KeyboardEvent, idx: number): void {
  const key = e.key
  const rtl = isRTL.value
  let dir = 0
  if (key === 'ArrowRight') dir = rtl ? -1 : 1
  else if (key === 'ArrowLeft') dir = rtl ? 1 : -1
  else if (key === 'Home') dir = -999
  else if (key === 'End') dir = 999
  else if (key === 'Enter' || key === ' ') {
    e.preventDefault()
    select(tabs.value[idx])
    return
  } else return

  e.preventDefault()
  const n = tabs.value.length
  if (!n) return
  let next: number | undefined
  if (dir === -999) next = tabs.value.findIndex((t) => !t.disabled)
  else if (dir === 999) {
    for (let i = n - 1; i >= 0; i -= 1) {
      if (!tabs.value[i].disabled) { next = i; break }
    }
  } else {
    next = idx
    for (let step = 0; step < n; step += 1) {
      next = (next + dir + n) % n
      if (!tabs.value[next].disabled) break
    }
  }
  if (next == null) return
  const btns = list.value!.querySelectorAll('.ds-tabs__tab')
  const el = btns[next] as HTMLElement | undefined
  if (el) el.focus()
  select(tabs.value[next])
}

// Reactive provide — getter on state so DsTab always reads the current active
const state = {
  get active() { return currentValue.value },
}

provide('dsTabs', { state, register, unregister })
</script>

<style lang="scss" scoped>
@import "../mixins.scss";

.ds-tabs {
  width: 100%;

  &__list {
    position: relative;
    display: flex;
    gap: var(--ds-space-2);
    border-bottom: 1px solid var(--ds-border);
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &--center &__list { justify-content: center; }
  &--end &__list    { justify-content: flex-end; }
  &--stretch &__list .ds-tabs__tab { flex: 1 1 0; }

  &__tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    background: transparent;
    border: 0;
    cursor: pointer;
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-text-muted);
    padding: var(--ds-space-3) var(--ds-space-4);
    transition: color var(--ds-duration-fast) var(--ds-ease-out);
    white-space: nowrap;

    &:hover:not(.is-disabled):not(.is-active) {
      color: var(--ds-text);
    }
    &.is-active { color: var(--ds-text); }
    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:focus-visible {
      @include ds-focus-ring;
      border-radius: var(--ds-radius-sm);
    }
  }

  &--sm &__tab { font-size: var(--ds-text-sm); padding: var(--ds-space-2) var(--ds-space-3); }
  &--md &__tab { font-size: var(--ds-text-md); }
  &--lg &__tab { font-size: var(--ds-text-lg); padding: var(--ds-space-4) var(--ds-space-5); }

  &__icon { display: inline-flex; align-items: center; }

  &__indicator {
    position: absolute;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: var(--ds-brand-600);
    border-radius: 2px;
    transition:
      transform var(--ds-duration-base) var(--ds-ease-out),
      width var(--ds-duration-base) var(--ds-ease-out);
    pointer-events: none;
  }

  &__panels {
    padding-top: var(--ds-space-4);
  }
}
</style>
