<template>
  <section class="cart-courses" :aria-label="$t('سلة التسوق')">
    <!-- Empty state -->
    <DsEmptyState
      v-if="!hasItems"
      variant="search"
      :title="$t('السلة فارغة قم بتعبئتها')"
      :description="$t('تصفح الكورسات وأضف ما تريد إلى سلتك')"
      size="lg"
    >
      <template #actions>
        <DsButton
          variant="accent"
          size="lg"
          @click="$router.push({ name: 'courses' })"
        >
          {{ $t('تصفح الدورات') }}
        </DsButton>
      </template>
    </DsEmptyState>

    <!-- Two-column layout -->
    <div v-else class="cart-courses__grid">
      <!-- Left: line items -->
      <div class="cart-courses__items">
        <header class="cart-courses__section-head">
          <h2 class="cart-courses__section-title">
            {{ $t('الدورات في سلتك') }}
          </h2>
          <span class="cart-courses__count">
            {{ shoppingCartDataList.length }} {{ $t('عنصر') }}
          </span>
        </header>

        <ul class="cart-courses__list">
          <li
            v-for="item in shoppingCartDataList"
            :key="item.course.id"
          >
            <DsCard tag="article" elevation="sm">
              <div class="cart-courses__row">
                <div class="cart-courses__media">
                  <img
                    v-if="item.course.cover"
                    :src="FORMAT_THE_IAMGE_URL(item.course.cover)"
                    :alt="item.course.title ?? item.course.name"
                    loading="lazy"
                  />
                  <div v-else class="cart-courses__media-fallback" aria-hidden="true">
                    <q-icon name="menu_book" size="1.5rem" />
                  </div>
                </div>

                <div class="cart-courses__info">
                  <h3 class="cart-courses__title">{{ item.course.title ?? item.course.name }}</h3>
                  <PriceDisplay
                    :amount="itemAmount(item)"
                    :currency="currency"
                    size="sm"
                    variant="ink"
                  />
                </div>

                <button
                  type="button"
                  class="cart-courses__remove"
                  :aria-label="$t('إزالة من السلة')"
                  @click="removeCourseFromCart(item)"
                >
                  <q-icon name="delete_outline" size="1.25rem" />
                </button>
              </div>
            </DsCard>
          </li>
        </ul>
      </div>

      <!-- Right: summary -->
      <aside class="cart-courses__summary-col" :aria-label="$t('ملخص الطلب')">
        <DsCard padding="md" class="cart-courses__summary">
          <h2 class="cart-courses__summary-title">
            {{ $t('ملخص الطلب') }}
          </h2>

          <dl class="cart-courses__summary-rows">
            <div class="cart-courses__summary-row">
              <dt>{{ $t('المجموع الفرعي') }}</dt>
              <dd>
                <PriceDisplay
                  :amount="subtotal"
                  :currency="currency"
                  size="sm"
                  variant="ink"
                />
              </dd>
            </div>

            <div class="cart-courses__summary-row cart-courses__summary-row--total">
              <dt>{{ $t('المجمــوع') }}</dt>
              <dd>
                <PriceDisplay
                  :amount="totalDue"
                  :currency="currency"
                  size="lg"
                  variant="terracotta"
                />
              </dd>
            </div>
          </dl>

          <DsButton
            variant="accent"
            size="lg"
            full-width
            class="cart-courses__cta"
            @click="goToAuthenticationCartPage"
          >
            {{ $t('متابعة الشراء') }}
          </DsButton>

          <p class="cart-courses__assurance">
            <q-icon name="lock" size="0.95rem" />
            {{ $t('الدفع آمن ومشفر') }}
          </p>
        </DsCard>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { apolloClient } from 'src/apollo/client'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type {
  CartEntry,
  CreateBraintreeCheckoutResult,
  CreateBraintreeCheckoutVars,
  CreateOrderResult,
  CreateOrderVars,
} from 'src/types/cart/types'

import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateBraintreeCheckout } from 'src/graphql/checkout_management/mutation/CreateBraintreeCheckout.js'

import PriceDisplay from 'src/components/shared/PriceDisplay.vue'

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const settings = useSettingsStore()
const { shoppingCartDataList } = storeToRefs(cart)
const { currency } = storeToRefs(settings)

const hasItems = computed(() => shoppingCartDataList.value && shoppingCartDataList.value.length > 0)

function itemAmount (item: CartEntry): number {
  try {
    const raw = item.course.currency
    if (raw && typeof raw === 'object') {
      return parseFloat(String((raw as Record<string, number>)[currency.value])) || 0
    }
    return 0
  } catch {
    return 0
  }
}

const subtotal = computed((): number => {
  if (!hasItems.value) return 0
  let sum = 0.0
  for (const item of shoppingCartDataList.value) {
    sum += itemAmount(item)
  }
  return sum
})

const totalDue = computed((): number => subtotal.value)

watch(subtotal, (v) => {
  cart.setTotalPaymentFees(v)
}, { immediate: true })

async function getBraintreeClientToken (orderId: number): Promise<string | null | undefined> {
  const result = await apolloClient.mutate<CreateBraintreeCheckoutResult, CreateBraintreeCheckoutVars>({
    mutation: CreateBraintreeCheckout,
    variables: { orderId }
  })
  const details = result.data?.createBraintreeCheckout
  if (details?.success) return details.braintreeClientToken
  return null
}

async function getOrderResult (courseIds: number[]): Promise<NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']> | undefined> {
  const result = await apolloClient.mutate<CreateOrderResult, CreateOrderVars>({
    mutation: CreateNewOrderWithBulkOrderDetails,
    variables: { courseIds }
  })
  const dataObj = result.data?.createNewOrderWithBulkOrderDetails
  if (dataObj?.success) return dataObj
  return undefined
}

function getOrdersIds (): number[] {
  return shoppingCartDataList.value
    .map(item => item.course.pk)
    .filter((pk): pk is number => pk != null)
}

async function buyTheCoursesUsingBraintree (): Promise<void> {
  try {
    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) return
    const token = await getBraintreeClientToken(orderResult.order.pk)
    cart.setBraintreeClientToken(token ?? null)
    cart.setOrderData(orderResult)
  } catch {
    // silent
  }
}

function removeCourseFromCart (item: CartEntry): void {
  const data = shoppingCartDataList.value.filter(el => el.course.id !== item.course.id)
  cart.setCartList(data)
}

function purgeZeroCostItems (): void {
  shoppingCartDataList.value.forEach(item => {
    const c = item.course as unknown as Record<string, unknown>
    const fee = parseInt(String(c.courseFee ?? ''), 10)
    const feeSDG = parseInt(String(c.courseFeeInSdg ?? ''), 10)
    if (fee === 0 || feeSDG === 0) {
      removeCourseFromCart(item)
      $q.notify({
        type: 'warning',
        progress: true,
        multiLine: true,
        position: 'top',
        message: 'هذا الكورس تحت التحضير'
      })
    }
  })
}

function goToAuthenticationCartPage (): void {
  if (shoppingCartDataList.value.length > 0) {
    router.push({ name: 'login-cart' })
  } else {
    $q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'top',
      message: 'Please fill the basket first'
    })
  }
}

onMounted(() => {
  purgeZeroCostItems()
})
</script>

<style lang="scss" scoped>
.cart-courses {
  color: var(--ds-text);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-6);
    align-items: flex-start;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1fr) 22rem;
      gap: var(--ds-space-8);
    }
  }

  &__section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-3);
    margin-block-end: var(--ds-space-4);
  }

  &__section-title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-text);
  }

  &__count {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--ds-space-3);
  }

  &__row {
    display: grid;
    grid-template-columns: 4.75rem 1fr auto;
    align-items: center;
    gap: var(--ds-space-4);
  }

  &__media {
    width: 4.75rem;
    height: 4.75rem;
    border-radius: var(--ds-radius-md);
    overflow: hidden;
    background: var(--ds-surface-muted);
    flex-shrink: 0;

    img,
    &-fallback {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ds-taupe);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__instructor {
    margin: 0;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--ds-radius-pill);
    background: var(--ds-surface-muted);
    color: var(--ds-text-muted);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background var(--ds-duration-fast) var(--ds-ease-out),
      color var(--ds-duration-fast) var(--ds-ease-out),
      transform var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      background: var(--ds-danger-bg, #fde2dc);
      color: var(--ds-danger, #c1623c);
      transform: scale(1.05);
    }
  }

  /* --- Summary --- */
  &__summary-col {
    position: relative;

    @media (min-width: 960px) {
      position: sticky;
      inset-block-start: calc(var(--ds-space-6) + 2rem);
    }
  }

  &__summary {
    border: 1px solid var(--ds-indigo, #322873);
  }

  &__summary-title {
    margin: 0 0 var(--ds-space-4);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-indigo, #322873);
  }

  &__summary-rows {
    margin: 0 0 var(--ds-space-4);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);

    dt { color: var(--ds-text-muted); }
    dd { margin: 0; }

    &--discount { color: var(--ds-success, #2c7a4b); }

    &--total {
      padding-block-start: var(--ds-space-3);
      border-block-start: 1px solid var(--ds-border);
      font-weight: var(--ds-weight-semibold);

      dt {
        color: var(--ds-ink);
        font-family: var(--ds-font-heading);
      }
    }
  }

  &__promo {
    margin-block-end: var(--ds-space-4);
    padding-block: var(--ds-space-3);
    border-block: 1px dashed var(--ds-border);
  }

  &__promo-label {
    display: block;
    margin-block-end: var(--ds-space-2);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__promo-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--ds-space-2);
    align-items: start;
  }

  &__promo-hint {
    margin: var(--ds-space-2) 0 0;
    font-size: var(--ds-text-xs);
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);

    &--ok { color: var(--ds-success, #2c7a4b); }
  }

  &__cta { margin-block-start: var(--ds-space-2); }

  &__assurance {
    margin: var(--ds-space-3) 0 0;
    text-align: center;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    justify-content: center;
    width: 100%;
  }
}
</style>
