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
    <span class="ds-skeleton ds-skeleton--rect ds-skeleton-card__media" />
    <span class="ds-skeleton ds-skeleton--line" style="width:85%" />
    <span class="ds-skeleton ds-skeleton--line" style="width:60%" />
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

<script>
// DsSkeleton — warm-tinted shimmer primitive.
// API preserved: `shape` (rect/line/circle/pill) still accepted via `type` alias.
// Extended: `type` (text/circle/rect/card), `rows` for multi-line text blocks.
export default {
  name: 'DsSkeleton',
  props: {
    // Legacy prop — kept for 26 existing call sites.
    shape: {
      type: String,
      default: null,
      validator: v => v === null || ['rect', 'line', 'circle', 'pill'].includes(v)
    },
    // New preferred prop.
    type: {
      type: String,
      default: null,
      validator: v => v === null || ['text', 'circle', 'rect', 'card', 'line', 'pill'].includes(v)
    },
    width:  { type: String, default: '100%' },
    height: { type: String, default: null },
    radius: { type: String, default: null },
    rows:   { type: Number, default: 1 },
    animated: { type: Boolean, default: true }
  },
  computed: {
    effectiveType () {
      // `type` wins if provided; otherwise map legacy `shape`; default to 'rect'.
      const t = this.type || this.shape || 'rect'
      // `line` is an alias for a single-row text bar.
      if (t === 'line') return 'text'
      return t
    },
    rowsSafe () {
      return Math.max(1, Math.min(20, this.rows || 1))
    },
    animatedEffective () {
      return this.animated
    },
    customStyle () {
      const style = { width: this.width }
      if (this.height) style.height = this.height
      if (this.radius) style.borderRadius = this.radius
      // Circle default size if user didn't provide one.
      if (this.effectiveType === 'circle' && !this.height && (!this.width || this.width === '100%')) {
        style.width = '48px'
        style.height = '48px'
      }
      return style
    },
    cardStyle () {
      const s = { width: this.width }
      if (this.height) s.height = this.height
      return s
    }
  },
  methods: {
    lineStyle (i) {
      const isLast = i === this.rowsSafe - 1
      const w = isLast && this.rowsSafe > 1 ? '70%' : (this.width && this.width !== '100%' ? this.width : '100%')
      const s = { width: w }
      if (this.height) s.height = this.height
      return s
    }
  }
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
