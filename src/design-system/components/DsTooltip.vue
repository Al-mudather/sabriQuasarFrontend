<template>
  <span class="ds-tooltip-trigger">
    <slot />
    <q-tooltip
      :anchor="anchor"
      :self="self"
      :offset="[0, 8]"
      :delay="delay"
      transition-show="fade"
      transition-hide="fade"
      content-class="ds-tooltip"
    >
      {{ text }}
    </q-tooltip>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'DsTooltip' })

type QPosition = 'top middle' | 'bottom middle' | 'center start' | 'center end' |
  'top left' | 'top right' | 'top start' | 'top end' |
  'center left' | 'center middle' | 'center right' |
  'bottom left' | 'bottom right' | 'bottom start' | 'bottom end'

const POSITION_MAP: Record<string, { anchor: QPosition; self: QPosition }> = {
  top:    { anchor: 'top middle',    self: 'bottom middle' },
  bottom: { anchor: 'bottom middle', self: 'top middle' },
  start:  { anchor: 'center start',  self: 'center end' },
  end:    { anchor: 'center end',    self: 'center start' },
}

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'start' | 'end'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 400,
})

const resolved = computed(() => POSITION_MAP[props.position] || POSITION_MAP['top'])
const anchor = computed(() => resolved.value.anchor)
const self = computed(() => resolved.value.self)
</script>

<style lang="scss">
.ds-tooltip-trigger {
  display: inline-flex;
}

.ds-tooltip.q-tooltip {
  background: var(--ds-ink);
  color: var(--ds-cream);
  border-radius: var(--ds-radius-sm);
  padding: 0.5rem 0.75rem;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 12px;
  line-height: var(--ds-leading-arabic);
  max-width: 240px;
  box-shadow: var(--ds-shadow-md);
  position: relative;

  // Arrow
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
  }

  &[data-v-anchor*="top"]::after,
  &.ds-tooltip--top::after {
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--ds-ink);
  }
}
</style>
