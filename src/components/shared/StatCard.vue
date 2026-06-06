<template>
  <div
    ref="rootEl"
    class="stat-card"
    :class="[`stat-card--${size}`, `stat-card--${variant}`]"
    role="figure"
    :aria-label="ariaLabel"
  >
    <svg class="stat-card__ring" :viewBox="`0 0 ${svgSize} ${svgSize}`" aria-hidden="true">
      <circle
        class="stat-card__track"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
      />
      <circle
        ref="arc"
        class="stat-card__arc"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="initialOffset"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>

    <div class="stat-card__content">
      <div class="stat-card__value-row">
        <span ref="number" class="stat-card__value">{{ initialDisplay }}</span>
        <span v-if="suffix" class="stat-card__suffix">{{ suffix }}</span>
      </div>
      <span v-if="label" class="stat-card__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { counterUp } from 'src/design-system/motion'
import { gsap } from 'gsap'

const SIZES: Record<string, number> = { sm: 180, md: 240, lg: 300 }
const STROKES: Record<string, number> = { sm: 3, md: 3.5, lg: 4 }

interface Props {
  value: number
  label?: string
  suffix?: string
  max?: number | null
  size?: 'sm' | 'md' | 'lg'
  variant?: 'indigo' | 'terracotta'
  animated?: boolean
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  suffix: '',
  max: null,
  size: 'md',
  variant: 'indigo',
  animated: true,
  locale: 'en-US'
})

// Refs for DOM elements
const arc = ref<SVGCircleElement | null>(null)
const number = ref<HTMLSpanElement | null>(null)
const rootEl = ref<HTMLElement | null>(null)

const prefersReduced = ref(false)
const hasPlayed = ref(false)

let observer: IntersectionObserver | null = null
let counterTween: { kill?: () => void } | null = null
let arcTween: { kill?: () => void } | null = null

const svgSize = computed(() => SIZES[props.size] ?? SIZES['md'])
const strokeWidth = computed(() => STROKES[props.size] ?? STROKES['md'])
const center = computed(() => svgSize.value / 2)
const radius = computed(() => (svgSize.value / 2) - (strokeWidth.value * 2))
const circumference = computed(() => 2 * Math.PI * radius.value)

const targetFraction = computed(() => {
  if (props.max && props.max > 0) {
    return Math.max(0, Math.min(1, props.value / props.max))
  }
  return 0.75
})

const targetOffset = computed(() => circumference.value * (1 - targetFraction.value))

const initialOffset = computed(() => {
  if (!props.animated || prefersReduced.value) return targetOffset.value
  return circumference.value
})

const initialDisplay = computed(() => {
  if (!props.animated || prefersReduced.value) return formatNumber(props.value)
  return formatNumber(0)
})

const ariaLabel = computed(() => {
  const num = formatNumber(props.value)
  return `${num}${props.suffix || ''} ${props.label || ''}`.trim()
})

function formatNumber (v: number): string {
  try {
    return new Intl.NumberFormat(props.locale, { maximumFractionDigits: 0 }).format(Math.round(v))
  } catch (e) {
    return String(Math.round(v))
  }
}

function paintFinalState (): void {
  nextTick(() => {
    if (number.value) number.value.textContent = formatNumber(props.value)
    if (arc.value) arc.value.setAttribute('stroke-dashoffset', String(targetOffset.value))
  })
}

function play (): void {
  if (hasPlayed.value) return
  hasPlayed.value = true

  counterTween = counterUp(number.value!, {
    from: 0,
    to: props.value,
    duration: 1.2,
    format: (v: number) => formatNumber(v)
  })

  if (arc.value) {
    if (prefersReduced.value) {
      arc.value.setAttribute('stroke-dashoffset', String(targetOffset.value))
    } else {
      arcTween = gsap.to(arc.value, {
        attr: { 'stroke-dashoffset': targetOffset.value },
        duration: 1.2,
        ease: 'power2.out'
      })
    }
  }

  if (observer) {
    observer.disconnect()
    observer = null
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  if (!props.animated || prefersReduced.value) {
    paintFinalState()
    return
  }

  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    play()
    return
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasPlayed.value) play()
    })
  }, { threshold: 0.35 })

  if (rootEl.value) observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  if (observer) { observer.disconnect(); observer = null }
  if (counterTween && typeof counterTween.kill === 'function') counterTween.kill()
  if (arcTween && typeof arcTween.kill === 'function') arcTween.kill()
})
</script>

<style lang="scss" scoped>
.stat-card {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: var(--ds-leading-arabic);

  &__ring {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__track {
    stroke: var(--ds-taupe);
    opacity: 0.2;
  }

  &__arc {
    transition: stroke var(--ds-duration-base) var(--ds-ease-out);
  }

  &__content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--ds-space-4);
    gap: var(--ds-space-1);
  }

  &__value-row {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-medium);
    font-feature-settings: 'tnum' 1;
    line-height: 1;
  }

  &__value {
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-medium);
  }

  &__suffix {
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-medium);
    font-size: 0.55em;
    opacity: 0.85;
  }

  &__label {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    color: var(--ds-taupe);
    font-size: 13px;
    line-height: var(--ds-leading-arabic);
    max-width: 70%;
  }

  // Sizes ------------------------------------------------------
  &--sm { width: 180px; height: 180px; }
  &--md { width: 240px; height: 240px; }
  &--lg { width: 300px; height: 300px; }

  &--sm .stat-card__value { font-size: 40px; }
  &--md .stat-card__value { font-size: 48px; }
  &--lg .stat-card__value { font-size: 56px; }

  // Variants ---------------------------------------------------
  &--indigo .stat-card__arc   { stroke: var(--ds-brand-600); }
  &--indigo .stat-card__value,
  &--indigo .stat-card__suffix { color: var(--ds-brand-600); }

  &--terracotta .stat-card__arc { stroke: var(--ds-accent-300); }
  &--terracotta .stat-card__value,
  &--terracotta .stat-card__suffix { color: var(--ds-accent-300); }
}
</style>
