<template>
  <div
    v-if="effectiveType === 'text'"
    class="ds-skeleton-stack"
    :class="{ 'ds-skeleton-stack--static': !animatedEffective }"
    aria-hidden="true"
  >
    <span
      v-for="(n, i) in rowsSafe"
      :key="i"
      class="ds-skeleton ds-skeleton--line"
      :style="lineStyle(i)"
    />
  </div>

  <div
    v-else-if="effectiveType === 'card'"
    class="ds-skeleton-card"
    :class="{ 'ds-skeleton-card--static': !animatedEffective }"
    :style="cardStyle"
    aria-hidden="true"
  >
    <span class="ds-skeleton ds-skeleton--rect ds-skeleton-card__media"></span>
    <span class="ds-skeleton ds-skeleton--line" style="width:85%"></span>
    <span class="ds-skeleton ds-skeleton--line" style="width:60%"></span>
  </div>

  <div
    v-else
    class="ds-skeleton"
    :class="[
      `ds-skeleton--${effectiveType}`,
      { 'ds-skeleton--static': !animatedEffective }
    ]"
    :style="customStyle"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'DsSkeleton' })

interface Props {
  // Legacy prop — kept for existing call sites.
  shape?: 'rect' | 'line' | 'circle' | 'pill' | null
  // New preferred prop.
  type?: 'text' | 'circle' | 'rect' | 'card' | 'line' | 'pill' | null
  width?: string
  height?: string | null
  radius?: string | null
  rows?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shape: null,
  type: null,
  width: '100%',
  height: null,
  radius: null,
  rows: 1,
  animated: true,
})

const effectiveType = computed(() => {
  const t = props.type || props.shape || 'rect'
  if (t === 'line') return 'text'
  return t
})

const rowsSafe = computed(() => Math.max(1, Math.min(20, props.rows || 1)))

const animatedEffective = computed(() => props.animated)

const customStyle = computed(() => {
  const style: Record<string, string> = { width: props.width }
  if (props.height) style.height = props.height
  if (props.radius) style.borderRadius = props.radius
  if (effectiveType.value === 'circle' && !props.height && (!props.width || props.width === '100%')) {
    style.width = '48px'
    style.height = '48px'
  }
  return style
})

const cardStyle = computed(() => {
  const s: Record<string, string> = { width: props.width }
  if (props.height) s.height = props.height
  return s
})

function lineStyle(i: number): Record<string, string> {
  const isLast = i === rowsSafe.value - 1
  const w = isLast && rowsSafe.value > 1 ? '70%' : (props.width && props.width !== '100%' ? props.width : '100%')
  const s: Record<string, string> = { width: w }
  if (props.height) s.height = props.height
  return s
}
</script>

<style lang="scss" scoped>
// Warm-tinted shimmer — base at ink 4%, highlight at ink 8%.
.ds-skeleton {
  --ds-skeleton-base:      rgba(27, 20, 16, 0.04);
  --ds-skeleton-highlight: rgba(27, 20, 16, 0.08);

  background: var(--ds-skeleton-base);
  background-image: linear-gradient(
    90deg,
    var(--ds-skeleton-base) 0%,
    var(--ds-skeleton-highlight) 50%,
    var(--ds-skeleton-base) 100%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: ds-skeleton-shimmer 1.5s var(--ds-ease-in-out) infinite;
  border-radius: var(--ds-radius-md);
  display: block;

  &--static { animation: none; }

  &--line {
    height: 0.9em;
    border-radius: var(--ds-radius-sm);
    display: inline-block;
  }

  &--circle {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
  }

  &--pill {
    border-radius: var(--ds-radius-pill);
    height: 2.5rem;
  }

  &--rect {
    height: 1rem;
    border-radius: 8px;
  }
}

// RTL: flip the shimmer direction so light moves with the reading flow.
[dir="rtl"] .ds-skeleton {
  animation-name: ds-skeleton-shimmer-rtl;
}

.ds-skeleton-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  &--static .ds-skeleton { animation: none; }
}

.ds-skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  &__media {
    aspect-ratio: 4 / 3;
    height: auto;
    width: 100%;
    border-radius: var(--ds-radius-lg);
  }

  &--static .ds-skeleton { animation: none; }
}

@keyframes ds-skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes ds-skeleton-shimmer-rtl {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ds-skeleton { animation: none !important; }
}
</style>
