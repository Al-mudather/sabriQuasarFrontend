<template>
  <div
    v-if="isActive"
    class="ds-tab"
    role="tabpanel"
    :aria-labelledby="name"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, inject, onBeforeUnmount } from 'vue'

defineOptions({ name: 'DsTab' })

interface TabsApi {
  state: { active: string | number | null }
  register: (tab: { name: string | number; label: string; icon: string; disabled: boolean }) => void
  unregister: (name: string | number) => void
}

interface Props {
  name: string | number
  label?: string
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: '',
  disabled: false,
})

const dsTabs = inject<TabsApi | null>('dsTabs', null)

const isActive = computed(() => dsTabs ? dsTabs.state.active === props.name : false)

function registerSelf(): void {
  if (!dsTabs) return
  dsTabs.unregister(props.name)
  dsTabs.register({ name: props.name, label: props.label, icon: props.icon, disabled: props.disabled })
}

// Register immediately (replaces `created`)
registerSelf()

watch(() => props.name, registerSelf)
watch(() => props.label, registerSelf)
watch(() => props.icon, registerSelf)
watch(() => props.disabled, registerSelf)

onBeforeUnmount(() => {
  if (dsTabs) dsTabs.unregister(props.name)
})
</script>

<style lang="scss" scoped>
.ds-tab {
  font-family: var(--ds-font-body);
  color: var(--ds-text);
  line-height: var(--ds-leading-arabic);
}
</style>
