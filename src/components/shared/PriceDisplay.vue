<template>
  <div
    class="price-display"
    :class="[`price-display--${size}`, `price-display--${variant}`]"
    :aria-label="ariaLabel"
  >
    <div class="price-display__row">
      <span class="price-display__current">
        <span class="price-display__amount">{{ formattedAmount }}</span>
        <span class="price-display__currency">{{ currencySymbol }}</span>
      </span>

      <span
        v-if="hasOriginal"
        class="price-display__original"
        aria-label="السعر قبل الخصم"
      >
        <span class="price-display__original-amount">{{ formattedOriginal }}</span>
        <span class="price-display__original-currency">{{ currencySymbol }}</span>
      </span>

      <span
        v-if="showDiscount && discountPercent > 0"
        class="price-display__discount"
        :aria-label="`خصم ${discountPercent}٪`"
      >
        -{{ formattedDiscount }}%
      </span>
    </div>

    <span v-if="perLabel" class="price-display__per">{{ perLabel }}</span>
  </div>
</template>

<script>
/** @typedef {import('src/types/courses/types').CoursePricing} CoursePricing */
/** @typedef {import('src/types/courses/types').CurrencyCode} CurrencyCode */

export default {
  name: 'PriceDisplay',
  props: {
    amount:         { type: Number, required: true },
    originalAmount: { type: Number, default: null },
    currency:       { type: String, default: 'SAR' },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    variant: {
      type: String,
      default: 'terracotta',
      validator: v => ['terracotta', 'cream', 'ink'].includes(v)
    },
    locale:       { type: String, default: 'ar-EG' },
    showDiscount: { type: Boolean, default: false },
    perLabel:     { type: String, default: null }
  },
  computed: {
    numberFormatter () {
      try {
        return new Intl.NumberFormat(this.locale, { style: 'decimal' })
      } catch (e) {
        return new Intl.NumberFormat('ar-EG', { style: 'decimal' })
      }
    },
    formattedAmount () {
      return this.numberFormatter.format(this.amount)
    },
    formattedOriginal () {
      return this.originalAmount != null ? this.numberFormatter.format(this.originalAmount) : ''
    },
    formattedDiscount () {
      return this.numberFormatter.format(this.discountPercent)
    },
    hasOriginal () {
      return this.originalAmount != null && this.originalAmount > this.amount
    },
    discountPercent () {
      if (!this.hasOriginal) return 0
      return Math.round((1 - this.amount / this.originalAmount) * 100)
    },
    currencySymbol () {
      const code = (this.currency || '').toUpperCase()
      if (code === 'SAR') return 'ر.س'
      if (code === 'AED') return 'د.إ'
      return code
    },
    ariaLabel () {
      let label = `${this.formattedAmount} ${this.currencySymbol}`
      if (this.hasOriginal) {
        label += ` (قبل الخصم ${this.formattedOriginal} ${this.currencySymbol})`
      }
      if (this.perLabel) label += ` ${this.perLabel}`
      return label
    }
  }
}
</script>

<style lang="scss" scoped>
.price-display {
  display: inline-flex;
  flex-direction: column;
  gap: var(--ds-space-1);
  line-height: var(--ds-leading-arabic);

  &__row {
    display: inline-flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
  }

  &__current {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-bold);
    font-feature-settings: 'tnum' 1;
  }

  &__currency {
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-medium);
    font-size: 0.75em;
    opacity: 0.9;
  }

  &__original {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-taupe);
    text-decoration: line-through;
    text-decoration-thickness: 1.5px;
    font-size: 0.7em;
  }

  &__discount {
    display: inline-flex;
    align-items: center;
    padding-inline: var(--ds-space-2);
    padding-block: 2px;
    font-family: var(--ds-font-mono);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-xs);
    border-radius: var(--ds-radius-pill);
    background: var(--ds-accent-300);
    color: var(--ds-ivory);
    letter-spacing: 0.02em;
  }

  &__per {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    color: var(--ds-taupe);
    font-size: var(--ds-text-xs);
  }

  // Sizes ------------------------------------------------------
  &--sm .price-display__current { font-size: var(--ds-text-md); }
  &--md .price-display__current { font-size: var(--ds-text-lg); }
  &--lg .price-display__current { font-size: var(--ds-text-xl); }
  &--xl .price-display__current { font-size: var(--ds-text-2xl); }

  // Variants ---------------------------------------------------
  &--terracotta .price-display__current { color: var(--ds-accent-300); }
  &--cream      .price-display__current { color: var(--ds-ivory); }
  &--cream      .price-display__original { color: rgba(251, 247, 240, 0.65); }
  &--cream      .price-display__per      { color: rgba(251, 247, 240, 0.72); }
  &--ink        .price-display__current { color: var(--ds-ink); }
}
</style>
