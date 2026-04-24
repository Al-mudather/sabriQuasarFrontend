<template>
  <div
    class="rating-stars"
    :class="[`rating-stars--${size}`, `rating-stars--${variant}`, { 'rating-stars--interactive': interactive }]"
    :role="interactive ? 'radiogroup' : 'img'"
    :aria-label="groupAriaLabel"
  >
    <div class="rating-stars__track" @mouseleave="onTrackLeave">
      <template v-for="n in 5" :key="n">
        <button
          v-if="interactive"
          type="button"
          class="rating-stars__star rating-stars__star--btn"
          :aria-label="`قيم بـ ${n} من 5`"
          :aria-pressed="Math.round(displayValue) === n ? 'true' : 'false'"
          @click="onSelect(n)"
          @mouseenter="onHover(n)"
          @focus="onHover(n)"
          @blur="onTrackLeave"
          @keydown.left.prevent="onKey(-1)"
          @keydown.right.prevent="onKey(1)"
        >
          <span class="rating-stars__star-inner">
            <svg class="rating-stars__svg rating-stars__svg--bg" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="starPath" />
            </svg>
            <span class="rating-stars__fill" :style="fillStyle(n)">
              <svg class="rating-stars__svg rating-stars__svg--fg" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="starPath" />
              </svg>
            </span>
          </span>
        </button>

        <span
          v-else
          class="rating-stars__star"
        >
          <span class="rating-stars__star-inner">
            <svg class="rating-stars__svg rating-stars__svg--bg" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="starPath" />
            </svg>
            <span class="rating-stars__fill" :style="fillStyle(n)">
              <svg class="rating-stars__svg rating-stars__svg--fg" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="starPath" />
              </svg>
            </span>
          </span>
        </span>
      </template>
    </div>

    <span v-if="count != null" class="rating-stars__count">
      (<span class="rating-stars__count-num">{{ formattedCount }}</span>
      <span class="rating-stars__count-label">&nbsp;تقييم</span>)
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const STAR_PATH = 'M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 17.77l-5.9 3.09 1.12-6.57L2.45 9.64l6.6-.96L12 2.5z'

interface Props {
  modelValue?: number
  count?: number | null
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  variant?: 'terracotta' | 'cream' | 'ink'
  precision?: 'half' | 'full'
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  count: null,
  size: 'md',
  interactive: false,
  variant: 'terracotta',
  precision: 'half',
  locale: 'ar-EG'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const hoverValue = ref<number | null>(null)

const starPath = STAR_PATH

const displayValue = computed(() => {
  const raw = hoverValue.value != null ? hoverValue.value : props.modelValue
  const clamped = Math.max(0, Math.min(5, raw || 0))
  if (props.precision === 'full') return Math.round(clamped)
  return Math.round(clamped * 2) / 2
})

const formattedCount = computed(() => {
  if (props.count == null) return ''
  try {
    return new Intl.NumberFormat(props.locale, { style: 'decimal' }).format(props.count)
  } catch (e) {
    return String(props.count)
  }
})

const groupAriaLabel = computed(() => {
  const v = displayValue.value
  return `التقييم ${v} من 5${props.count != null ? '، ' + formattedCount.value + ' تقييم' : ''}`
})

function fillStyle (n: number): Record<string, string> {
  const v = displayValue.value
  let pct = 0
  if (v >= n) pct = 100
  else if (v > n - 1) pct = Math.max(0, Math.min(100, (v - (n - 1)) * 100))
  return { 'clip-path': `inset(0 ${100 - pct}% 0 0)` }
}

function onHover (n: number): void {
  if (!props.interactive) return
  hoverValue.value = n
}

function onTrackLeave (): void {
  hoverValue.value = null
}

function onSelect (n: number): void {
  if (!props.interactive) return
  emit('update:modelValue', n)
  emit('change', n)
}

function onKey (delta: number): void {
  if (!props.interactive) return
  const next = Math.max(0, Math.min(5, Math.round((props.modelValue || 0) + delta)))
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style lang="scss" scoped>
.rating-stars {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  line-height: 1;

  &__track {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    // Logical start side: fills read from inline-start; CSS logical
    // property `clip-path: inset(0 X% 0 0)` is physical, so flip via
    // direction-aware transform when in RTL.
  }

  &__star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    background: transparent;
    line-height: 0;

    &--btn {
      cursor: pointer;
      border-radius: var(--ds-radius-xs);

      &:focus-visible {
        outline: 2px solid var(--ds-brand-600);
        outline-offset: 2px;
      }
    }
  }

  &__star-inner {
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  &__svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;

    &--bg {
      fill: none;
      stroke: var(--ds-taupe);
      stroke-width: 1.4;
    }

    &--fg {
      fill: currentColor;
      stroke: currentColor;
      stroke-width: 1;
    }
  }

  &__fill {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  // RTL: flip the partial fill direction so "start" remains logical.
  :host-context([dir='rtl']) &__fill,
  [dir='rtl'] &__fill {
    transform: scaleX(-1);
    transform-origin: center;
  }

  &__count {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    color: var(--ds-taupe);
    font-size: 13px;
  }

  &__count-num {
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-medium);
  }

  // Sizes
  &--sm .rating-stars__star-inner { width: 14px; height: 14px; }
  &--md .rating-stars__star-inner { width: 16px; height: 16px; }
  &--lg .rating-stars__star-inner { width: 20px; height: 20px; }

  // Variants — define filled color only; empty is taupe-outline.
  &--terracotta { color: var(--ds-accent-300); }
  &--cream      { color: var(--ds-ivory); }
  &--ink        { color: var(--ds-ink); }

  &--cream .rating-stars__svg--bg { stroke: rgba(251, 247, 240, 0.55); }
  &--cream .rating-stars__count   { color: rgba(251, 247, 240, 0.78); }

  &--interactive .rating-stars__star--btn {
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);

    @media (hover: hover) {
      &:hover { transform: scale(1.12); }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
      &:hover { transform: none; }
    }
  }
}
</style>
