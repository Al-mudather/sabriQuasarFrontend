<template>
  <div
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

<script>
import { counterUp } from 'src/design-system/motion'
import { gsap } from 'gsap'

const SIZES = { sm: 180, md: 240, lg: 300 }
const STROKES = { sm: 3, md: 3.5, lg: 4 }

export default {
  name: 'StatCard',
  props: {
    value:    { type: Number, required: true },
    label:    { type: String, default: '' },
    suffix:   { type: String, default: '' },
    max:      { type: Number, default: null },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    variant: {
      type: String,
      default: 'indigo',
      validator: v => ['indigo', 'terracotta'].includes(v)
    },
    animated: { type: Boolean, default: true },
    locale:   { type: String, default: 'ar-EG' }
  },
  data () {
    return {
      prefersReduced: false,
      hasPlayed:      false
    }
  },
  computed: {
    svgSize ()    { return SIZES[this.size] || SIZES.md },
    strokeWidth () { return STROKES[this.size] || STROKES.md },
    center ()     { return this.svgSize / 2 },
    radius ()     { return (this.svgSize / 2) - (this.strokeWidth * 2) },
    circumference () { return 2 * Math.PI * this.radius },
    targetFraction () {
      if (this.max && this.max > 0) {
        return Math.max(0, Math.min(1, this.value / this.max))
      }
      return 0.75
    },
    targetOffset () {
      return this.circumference * (1 - this.targetFraction)
    },
    initialOffset () {
      if (!this.animated || this.prefersReduced) return this.targetOffset
      return this.circumference
    },
    initialDisplay () {
      if (!this.animated || this.prefersReduced) {
        return this.formatNumber(this.value)
      }
      return this.formatNumber(0)
    },
    ariaLabel () {
      const num = this.formatNumber(this.value)
      return `${num}${this.suffix || ''} ${this.label || ''}`.trim()
    }
  },
  mounted () {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    if (!this.animated || this.prefersReduced) {
      this.paintFinalState()
      return
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.play()
      return
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasPlayed) {
          this.play()
        }
      })
    }, { threshold: 0.35 })

    this._observer.observe(this.$el)
  },
  beforeUnmount () {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }
    if (this._counterTween && typeof this._counterTween.kill === 'function') {
      this._counterTween.kill()
    }
    if (this._arcTween && typeof this._arcTween.kill === 'function') {
      this._arcTween.kill()
    }
  },
  methods: {
    formatNumber (v) {
      try {
        return new Intl.NumberFormat(this.locale, { maximumFractionDigits: 0 })
          .format(Math.round(v))
      } catch (e) {
        return String(Math.round(v))
      }
    },
    paintFinalState () {
      this.$nextTick(() => {
        if (this.$refs.number) this.$refs.number.textContent = this.formatNumber(this.value)
        if (this.$refs.arc)    this.$refs.arc.setAttribute('stroke-dashoffset', this.targetOffset)
      })
    },
    play () {
      if (this.hasPlayed) return
      this.hasPlayed = true

      // Counter-up for the number — uses the DS motion primitive.
      this._counterTween = counterUp(this.$refs.number, {
        from: 0,
        to: this.value,
        duration: 1.2,
        format: v => this.formatNumber(v)
      })

      // Arc fill tween (ring's dashoffset), paired timing with counterUp.
      if (this.$refs.arc) {
        if (this.prefersReduced) {
          this.$refs.arc.setAttribute('stroke-dashoffset', this.targetOffset)
        } else {
          this._arcTween = gsap.to(this.$refs.arc, {
            attr: { 'stroke-dashoffset': this.targetOffset },
            duration: 1.2,
            ease: 'power2.out'
          })
        }
      }

      if (this._observer) {
        this._observer.disconnect()
        this._observer = null
      }
    }
  }
}
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
