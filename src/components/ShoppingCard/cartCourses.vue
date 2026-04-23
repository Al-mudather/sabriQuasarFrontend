<template>
  <section class="cart-courses" aria-label="سلة التسوق">
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
            <DsCard tag="article" padding="sm" class="cart-courses__row">
              <div class="cart-courses__media">
                <img
                  v-if="item.course.cover"
                  :src="FORMAT_THE_IAMGE_URL(item.course.cover)"
                  :alt="item.course.title"
                  loading="lazy"
                />
                <div v-else class="cart-courses__media-fallback" aria-hidden="true">
                  <q-icon name="menu_book" size="1.5rem" />
                </div>
              </div>

              <div class="cart-courses__info">
                <h3 class="cart-courses__title">{{ item.course.title }}</h3>
                <p
                  v-if="instructorName(item)"
                  class="cart-courses__instructor"
                >
                  {{ instructorName(item) }}
                </p>
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
            </DsCard>
          </li>
        </ul>
      </div>

      <!-- Right: summary -->
      <aside class="cart-courses__summary-col" aria-label="ملخص الطلب">
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

            <div
              v-if="discountAmount > 0"
              class="cart-courses__summary-row cart-courses__summary-row--discount"
            >
              <dt>{{ $t('الخصم') }}</dt>
              <dd>
                −
                <PriceDisplay
                  :amount="discountAmount"
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

          <!-- Promo -->
          <div class="cart-courses__promo">
            <label class="cart-courses__promo-label" for="promo-input">
              {{ $t('كود الخصم') }}
            </label>
            <div class="cart-courses__promo-row">
              <DsInput
                id="promo-input"
                v-model="promoCode"
                :placeholder="$t('أدخل كود الخصم')"
                :disabled="promoApplied"
              />
              <DsButton
                variant="ghost"
                size="md"
                :disabled="!promoCode || promoApplied"
                @click="applyPromo"
              >
                {{ promoApplied ? $t('تمت الإضافة') : $t('تطبيق') }}
              </DsButton>
            </div>
            <p
              v-if="promoApplied"
              class="cart-courses__promo-hint cart-courses__promo-hint--ok"
            >
              <q-icon name="check_circle" size="1rem" />
              {{ $t('تم تطبيق الكود') }} ({{ promoCode }})
            </p>
          </div>

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

<script>
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { apolloClient } from 'src/apollo/client'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

import { CreateNewOrderWithBulkOrderDetails } from 'src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateBraintreeCheckout } from 'src/queries/checkout_management/mutation/CreateBraintreeCheckout.js'

import DsInput from 'src/design-system/components/DsInput.vue'
import PriceDisplay from 'src/components/shared/PriceDisplay.vue'

export default {
  name: 'cartCoursesPage',

  components: { DsInput, PriceDisplay },

  setup () {
    const cart = useCartStore()
    const settings = useSettingsStore()
    const { shoppingCartDataList } = storeToRefs(cart)
    const { isEnglish, currency } = storeToRefs(settings)
    return { cart, settings, shoppingCartDataList, isEnglish, currency }
  },

  data () {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      lodash: _,
      promoCode: '',
      promoApplied: false,
      discountAmount: 0
    }
  },

  computed: {
    hasItems () {
      return this.shoppingCartDataList && this.shoppingCartDataList.length > 0
    },

    subtotal () {
      if (!this.hasItems) return 0
      let sum = 0.0
      for (const item of this.shoppingCartDataList) {
        sum += this.itemAmount(item)
      }
      return sum
    },

    totalDue () {
      const t = this.subtotal - this.discountAmount
      return t > 0 ? t : 0
    }
  },

  watch: {
    subtotal: {
      immediate: true,
      handler (v) {
        // Persist total fees for downstream steps (unchanged behaviour).
        this.cart.setTotalPaymentFees(v)
      }
    }
  },

  mounted () {
    this.WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT()
  },

  methods: {
    itemAmount (item) {
      try {
        const map = JSON.parse(item.course.currency)
        return parseFloat(map[this.currency]) || 0
      } catch (_) {
        return 0
      }
    },

    instructorName (item) {
      const c = item.course || {}
      if (c.instructorName) return c.instructorName
      if (c.instructor) {
        if (typeof c.instructor === 'string') return c.instructor
        return c.instructor.fullName || c.instructor.name || ''
      }
      return ''
    },

    applyPromo () {
      // Placeholder promo logic — kept client-side until a backend mutation exists.
      // Preserves the UI contract (promo code input + applied state) without
      // forging a discount the server doesn't know about.
      if (!this.promoCode) return
      this.promoApplied = true
      this.discountAmount = 0
      this.$q.notify({
        type: 'info',
        progress: true,
        position: 'top',
        message: 'سيتم التحقق من كود الخصم في خطوة الدفع'
      })
    },

    async getBraintreePaymentUrlFromTheBackend (orderResult) {
      const braintreePaymentresult = await apolloClient.mutate({
        mutation: CreateBraintreeCheckout,
        variables: {
          orderId: orderResult.order.pk
        }
      })
      const braintreeDetails = braintreePaymentresult.data.createBraintreeCheckout
      if (this.$_.get(braintreeDetails, '[success]')) {
        return braintreeDetails.braintreeClientToken
      }
    },

    async buyTheCoursesUsingBraintree () {
      try {
        const courseIds = this.getOrdersIds()
        const orderResult = await this.getOrderResult(courseIds)
        const braintreeClientToken = await this.getBraintreePaymentUrlFromTheBackend(orderResult)
        this.cart.setBraintreeClientToken(braintreeClientToken)
        this.cart.setOrderData(orderResult)
      } catch (error) {
        // silent
      }
    },

    getOrdersIds () {
      return this.$_.map(this.shoppingCartDataList, '[course][pk]')
    },

    async getOrderResult (courseIds) {
      const result = await apolloClient.mutate({
        mutation: CreateNewOrderWithBulkOrderDetails,
        variables: { courseIds: courseIds }
      })
      const dataObj = result.data.createNewOrderWithBulkOrderDetails
      if (this.$_.get(dataObj, '[success]')) return dataObj
    },

    WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT () {
      this.shoppingCartDataList.map(item => {
        if (parseInt(item.course.courseFee) === 0 || parseInt(item.course.courseFeeInSdg) === 0) {
          this.removeCourseFromCart(item)
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'هذا الكورس تحت التحضير'
          })
        }
      })
    },

    goToAuthenticationCartPage () {
      if (this.shoppingCartDataList.length > 0) {
        this.$router.push({ name: 'login-cart' })
      } else {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'Please fill the basket first'
        })
      }
    },

    removeCourseFromCart (item) {
      const data = this.shoppingCartDataList
      this.lodash.remove(data, element => element.course.id === item.course.id)
      this.cart.setCartList(data)
    },

    deleteTheShoppCart () {
      this.cart.deleteCart()
    }
  }
}
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
