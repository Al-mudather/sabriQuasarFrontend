<template>
  <button
    type="button"
    class="cart-trigger"
    :aria-label="$t('السلة')"
    @click="OpenShoppingCartSection"
  >
    <svg class="cart-trigger__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6"
        stroke="currentColor" stroke-width="1.6" fill="none"
        stroke-linecap="round" stroke-linejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
    <span class="cart-trigger__label">{{ $t('السلة') }}</span>
    <span
      v-if="!$_.isEmpty(shoppingCartDataList)"
      class="cart-trigger__count"
      aria-live="polite"
    >
      {{ $_.size(shoppingCartDataList) }}
    </span>
  </button>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useCartStore } from 'src/stores/cart'

export default {
  name: 'ShoppingCart',
  setup () {
    const cart = useCartStore()
    const { shoppingCartDataList } = storeToRefs(cart)
    return { cart, shoppingCartDataList }
  },
  methods: {
    OpenShoppingCartSection () { this.$router.push({ name: 'cart' }) }
  }
}
</script>

<style lang="scss" scoped>
.cart-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 0.5rem 1rem;
  background: var(--ds-accent-300);
  color: var(--ds-brand-800);
  border: 0;
  border-radius: var(--ds-radius-pill);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-bold);
  font-size: var(--ds-text-sm);
  cursor: pointer;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { background: var(--ds-accent-400); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  &__icon { inline-size: 1.25rem; block-size: 1.25rem; }

  &__count {
    position: absolute;
    inset-block-start: -0.35rem;
    inset-inline-end: -0.35rem;
    min-inline-size: 1.1rem;
    block-size: 1.1rem;
    padding-inline: 0.25rem;
    background: var(--ds-danger);
    color: var(--ds-text-onBrand);
    border-radius: var(--ds-radius-pill);
    font-size: var(--ds-text-2xs);
    font-variant-numeric: tabular-nums;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px var(--ds-surface);
  }
}
</style>
