<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percent: number
  size?: number
  stroke?: number
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  stroke: 4,
  showLabel: true,
})

const clamped = computed(() => Math.max(0, Math.min(100, props.percent)))
const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value - (clamped.value / 100) * circumference.value,
)
const center = computed(() => props.size / 2)
const fontSize = computed(() => Math.max(9, Math.round(props.size * 0.28)))
const gradientId = `cls-progress-gradient-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div
    class="cls-progress-ring"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`${Math.round(clamped)}% complete`"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#322873" />
          <stop offset="100%" stop-color="#C1623C" />
        </linearGradient>
      </defs>
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--cls-divider)"
        :stroke-width="stroke"
      />
      <circle
        class="cls-progress-ring__fg"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <span
      v-if="showLabel"
      class="cls-progress-ring__label"
      :style="{ fontSize: `${fontSize}px` }"
      aria-hidden="true"
    >
      {{ Math.round(clamped) }}%
    </span>
  </div>
</template>

<style lang="scss" scoped>
.cls-progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &__fg {
    transition: stroke-dashoffset var(--cls-dur-med) var(--cls-ease);
  }

  &__label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cls-text-primary);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-semibold);
    line-height: 1;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }
}
</style>
