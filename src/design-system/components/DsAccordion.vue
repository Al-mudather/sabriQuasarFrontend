<template>
  <div class="ds-accordion">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'

defineOptions({ name: 'DsAccordion' })

interface Props {
  multi?: boolean
  modelValue?: (string | number)[] | null
}

const props = withDefaults(defineProps<Props>(), {
  multi: false,
  modelValue: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: (string | number)[]): void
  (e: 'change', val: (string | number)[]): void
}>()

interface AccordionRef { name: string | number; el: HTMLElement | null }

const internalOpened = ref<(string | number)[]>(props.modelValue ? [...props.modelValue] : [])
const refs = ref<AccordionRef[]>([])

watch(() => props.modelValue, (val) => {
  if (val) internalOpened.value = [...val]
})

function isOpen(name: string | number): boolean {
  return internalOpened.value.includes(name)
}

function toggle(name: string | number): void {
  let next: (string | number)[]
  if (internalOpened.value.includes(name)) {
    next = internalOpened.value.filter((n) => n !== name)
  } else if (props.multi) {
    next = [...internalOpened.value, name]
  } else {
    next = [name]
  }
  internalOpened.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

function registerRef(name: string | number, el: HTMLElement | null): void {
  const existing = refs.value.find((r) => r.name === name)
  if (existing) existing.el = el
  else refs.value.push({ name, el })
}

function unregisterRef(name: string | number): void {
  refs.value = refs.value.filter((r) => r.name !== name)
}

function focusNeighbor(name: string | number, direction: number): void {
  if (!refs.value.length) return
  const idx = refs.value.findIndex((r) => r.name === name)
  if (idx < 0) return
  const n = refs.value.length
  const next = (idx + direction + n) % n
  const target = refs.value[next]
  if (target?.el?.focus) target.el.focus()
}

// Reactive provide — getters on state object so children always read current values
const state = {
  get opened() { return internalOpened.value },
  get multi() { return props.multi },
}

provide('dsAccordion', {
  state,
  toggle,
  isOpen,
  focusNeighbor,
  registerRef,
  unregisterRef,
})
</script>

<style lang="scss" scoped>
.ds-accordion {
  width: 100%;
  background: var(--ds-surface-elevated);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  box-shadow: var(--ds-shadow-sm);
}
</style>
