<template>
  <div
    class="ds-skeleton"
    :class="[`ds-skeleton--${shape}`, { 'ds-skeleton--static': !animated }]"
    :style="customStyle"
    aria-hidden="true"
  />
</template>

<script>
export default {
  name: 'DsSkeleton',
  props: {
    shape: {
      type: String,
      default: 'rect',
      validator: v => ['rect', 'line', 'circle', 'pill'].includes(v)
    },
    width:  { type: String, default: '100%' },
    height: { type: String, default: null },
    radius: { type: String, default: null },
    animated: { type: Boolean, default: true }
  },
  computed: {
    customStyle () {
      const style = { width: this.width }
      if (this.height) style.height = this.height
      if (this.radius) style.borderRadius = this.radius
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.ds-skeleton {
  background: linear-gradient(
    90deg,
    var(--ds-neutral-100) 0%,
    var(--ds-neutral-200) 50%,
    var(--ds-neutral-100) 100%
  );
  background-size: 200% 100%;
  animation: ds-shimmer 1.4s var(--ds-ease-in-out) infinite;
  border-radius: var(--ds-radius-md);
  display: block;

  &--static { animation: none; }

  &--line {
    height: 0.9em;
    border-radius: var(--ds-radius-sm);
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
  }
}

@keyframes ds-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
