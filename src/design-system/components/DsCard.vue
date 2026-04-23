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

<script>
export default {
  name: 'DsCard',
  props: {
    tag:         { type: String,  default: 'div' },
    variant:     {
      type: String,
      default: 'default',
      validator: v => ['default', 'indigo-hero', 'ghost'].includes(v)
    },
    elevation:   {
      type: String,
      default: 'sm',
      validator: v => ['flat', 'xs', 'sm', 'md', 'lg'].includes(v)
    },
    interactive: { type: Boolean, default: false },
    href:        { type: String,  default: null },
    to:          { type: [String, Object], default: null }
  },
  data () {
    return {
      isTilting: false,
      tiltX: 0,
      tiltY: 0,
      lift: 0,
      hoverCapable: true,
      reducedMotion: false
    }
  },
  computed: {
    resolvedTag () {
      if (this.to) return 'router-link'
      if (this.href) return 'a'
      return this.tag
    },
    tiltStyle () {
      if (!this.isTilting) return null
      return {
        transform: `perspective(900px) rotateX(${this.tiltY}deg) rotateY(${this.tiltX}deg) translateY(${this.lift}px)`
      }
    }
  },
  mounted () {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.hoverCapable = window.matchMedia('(hover: hover)').matches
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  },
  methods: {
    handleClick (e) {
      if (this.interactive) this.$emit('click', e)
    },
    handleKey (e) {
      if (this.interactive && !this.href && !this.to) this.$emit('click', e)
    },
    canTilt () {
      return this.interactive && this.hoverCapable && !this.reducedMotion
    },
    onPointerEnter () {
      if (!this.canTilt()) return
      this.isTilting = true
      this.lift = -2
    },
    onPointerMove (e) {
      if (!this.canTilt()) return
      const rect = this.$el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      // Cap at 3 degrees, per spec
      this.tiltX = Math.max(-3, Math.min(3, dx * 3))
      this.tiltY = Math.max(-3, Math.min(3, -dy * 3))
    },
    onPointerLeave () {
      this.isTilting = false
      this.tiltX = 0
      this.tiltY = 0
      this.lift = 0
    }
  }
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
