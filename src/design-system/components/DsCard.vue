<template>
  <component
    :is="resolvedTag"
    :href="href || null"
    :to="to || null"
    class="ds-card"
    :class="[
      `ds-card--${variant}`,
      `ds-card--${elevation}`,
      {
        'ds-card--interactive': interactive,
        'ds-card--flat': elevation === 'flat',
        'ds-card--tilting': isTilting
      }
    ]"
    :style="tiltStyle"
    :tabindex="interactive && !href && !to ? 0 : null"
    :role="interactive && !href && !to ? 'button' : null"
    @click="handleClick"
    @keydown.enter="handleKey"
    @keydown.space.prevent="handleKey"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div v-if="$slots.media" class="ds-card__media"><slot name="media" /></div>
    <div v-if="$slots.header" class="ds-card__header"><slot name="header" /></div>
    <div class="ds-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ds-card__footer"><slot name="footer" /></div>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

defineOptions({ name: 'DsCard' })

interface Props {
  tag?: string
  variant?: 'default' | 'indigo-hero' | 'ghost'
  elevation?: 'flat' | 'xs' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  href?: string | null
  to?: string | Record<string, unknown> | null
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'default',
  elevation: 'sm',
  interactive: false,
  href: null,
  to: null,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent | KeyboardEvent): void
}>()

const isTilting = ref(false)
const tiltX = ref(0)
const tiltY = ref(0)
const lift = ref(0)
const hoverCapable = ref(true)
const reducedMotion = ref(false)

const resolvedTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

const tiltStyle = computed(() => {
  if (!isTilting.value) return null
  return {
    transform: `perspective(900px) rotateX(${tiltY.value}deg) rotateY(${tiltX.value}deg) translateY(${lift.value}px)`,
  }
})

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    hoverCapable.value = window.matchMedia('(hover: hover)').matches
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
})

function handleClick(e: MouseEvent): void {
  if (props.interactive) emit('click', e)
}

function handleKey(e: KeyboardEvent): void {
  if (props.interactive && !props.href && !props.to) emit('click', e)
}

function canTilt(): boolean {
  return props.interactive && hoverCapable.value && !reducedMotion.value
}

function onPointerEnter(): void {
  if (!canTilt()) return
  isTilting.value = true
  lift.value = -2
}

function onPointerMove(e: PointerEvent & { currentTarget: HTMLElement }): void {
  if (!canTilt()) return
  const el = (e.currentTarget as HTMLElement) ?? (e.target as HTMLElement)
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = (e.clientX - cx) / (rect.width / 2)
  const dy = (e.clientY - cy) / (rect.height / 2)
  tiltX.value = Math.max(-3, Math.min(3, dx * 3))
  tiltY.value = Math.max(-3, Math.min(3, -dy * 3))
}

function onPointerLeave(): void {
  isTilting.value = false
  tiltX.value = 0
  tiltY.value = 0
  lift.value = 0
}
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-card {
  display: flex;
  flex-direction: column;
  background: var(--ds-surface-elevated);
  color: var(--ds-text);
  border-radius: var(--ds-radius-lg);
  overflow: hidden;
  text-decoration: none;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    transform var(--ds-duration-base) var(--ds-ease-out),
    box-shadow var(--ds-duration-base) var(--ds-ease-out);

  @include ds-elevation(1);

  &--flat { box-shadow: none; border: 1px solid var(--ds-border); }
  &--xs   { box-shadow: var(--ds-shadow-xs); }
  &--sm   { @include ds-elevation(1); }
  &--md   { @include ds-elevation(2); }
  &--lg   { @include ds-elevation(3); }

  // Variants
  &--default {
    background: var(--ds-surface-elevated);
  }
  &--indigo-hero {
    background: var(--ds-surface-indigo);
    color: var(--ds-text-on-indigo);
  }
  &--ghost {
    background: transparent;
    border: 1px solid var(--ds-border);
    box-shadow: none;
  }

  &--interactive {
    cursor: pointer;

    @media (hover: hover) {
      &:hover {
        transform: translateY(-2px);
        @include ds-elevation(3);
      }
    }

    &:focus-visible { @include ds-focus-ring; }

    @media (prefers-reduced-motion: reduce) {
      &:hover { transform: none; }
    }
  }

  &--tilting {
    @include ds-elevation(3);
  }

  &__media {
    position: relative;
    line-height: 0;
    :deep(img), :deep(video) {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 16 / 10;
      object-fit: cover;
    }
  }

  &__header {
    padding-block-start: var(--ds-space-6);
    padding-inline: var(--ds-space-6);

    @include ds-above(md) {
      padding-block-start: var(--ds-space-8);
      padding-inline: var(--ds-space-8);
    }
  }

  &__body {
    padding: var(--ds-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    flex: 1;
    line-height: var(--ds-leading-arabic);

    @include ds-above(md) {
      padding: var(--ds-space-8);
    }
  }

  &__header + &__body {
    padding-block-start: var(--ds-space-3);
  }

  &__footer {
    padding: 0 var(--ds-space-6) var(--ds-space-6);

    @include ds-above(md) {
      padding: 0 var(--ds-space-8) var(--ds-space-8);
    }
  }
}
</style>
