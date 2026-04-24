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

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  amount: number
  originalAmount?: number | null
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'terracotta' | 'cream' | 'ink'
  locale?: string
  showDiscount?: boolean
  perLabel?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  originalAmount: null,
  currency: 'SAR',
  size: 'md',
  variant: 'terracotta',
  locale: 'ar-EG',
  showDiscount: false,
  perLabel: null
})

const numberFormatter = computed(() => {
  try {
    return new Intl.NumberFormat(props.locale, { style: 'decimal' })
  } catch (e) {
    return new Intl.NumberFormat('ar-EG', { style: 'decimal' })
  }
})

const formattedAmount = computed(() => numberFormatter.value.format(props.amount))

const hasOriginal = computed(() =>
  props.originalAmount != null && props.originalAmount > props.amount
)

const discountPercent = computed(() => {
  if (!hasOriginal.value || props.originalAmount == null) return 0
  return Math.round((1 - props.amount / props.originalAmount) * 100)
})

const formattedOriginal = computed(() =>
  props.originalAmount != null ? numberFormatter.value.format(props.originalAmount) : ''
)

const formattedDiscount = computed(() => numberFormatter.value.format(discountPercent.value))

const currencySymbol = computed(() => {
  const code = (props.currency ?? '').toUpperCase()
  if (code === 'SAR') return 'ر.س'
  if (code === 'AED') return 'د.إ'
  return code
})

const ariaLabel = computed(() => {
  let label = `${formattedAmount.value} ${currencySymbol.value}`
  if (hasOriginal.value) {
    label += ` (قبل الخصم ${formattedOriginal.value} ${currencySymbol.value})`
  }
  if (props.perLabel) label += ` ${props.perLabel}`
  return label
})
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
