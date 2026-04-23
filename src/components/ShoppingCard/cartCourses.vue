<template>
  <section class="cart-courses">
    <ul v-if="shoppingCartDataList && shoppingCartDataList.length" class="cart-courses__list">
      <li
        v-for="item in shoppingCartDataList"
        :key="item.course.id"
        class="cart-courses__row"
      >
        <div class="cart-courses__media">
          <img
            v-if="item.course.cover"
            :src="FORMAT_THE_IAMGE_URL(item.course.cover)"
            :alt="item.course.title"
          />
          <img v-else src="~assets/img/cart-img.png" :alt="item.course.title" />
        </div>

        <div class="cart-courses__info">
          <h3 class="cart-courses__title">{{ item.course.title }}</h3>
          <p class="cart-courses__price">
            <span>{{ FORMAT_COUSRE_PRICE(JSON.parse(item.course.currency)[currency], 3) }}</span>
            <span class="cart-courses__currency">{{ currency }}</span>
          </p>
        </div>

        <button
          type="button"
          class="cart-courses__remove"
          :aria-label="$t('إزالة')"
          @click="removeCourseFromCart(item)"
        >
          <q-icon name="delete_outline" size="1.25rem" />
        </button>
      </li>
    </ul>

    <DsEmptyState
      v-else
      :title="$t('السلة فارغة قم بتعبئتها')"
      :description="$t('تصفح الكورسات وأضف ما تريد إلى سلتك')"
    />

    <div v-if="shoppingCartDataList && shoppingCartDataList.length" class="cart-courses__summary">
      <div class="cart-courses__total">
        <span class="cart-courses__total-label">{{ $t('المجمــوع') }}</span>
        <span class="cart-courses__total-value">
          {{ FORMAT_COUSRE_PRICE(calculateTheTotalFees(), 3) }}
          <span class="cart-courses__currency">{{ currency }}</span>
        </span>
      </div>

      <DsButton
        variant="primary"
        size="lg"
        full-width
        @click.native="goToAuthenticationCartPage"
      >
        {{ $t('متابعة') }}
      </DsButton>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

import { CreateNewOrderWithBulkOrderDetails } from 'src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateBraintreeCheckout } from 'src/queries/checkout_management/mutation/CreateBraintreeCheckout.js'

export default {
  name: 'cartCoursesPage',

  data () {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      lodash: _
    }
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList']),
    ...mapState('settings', ['isEnglish', 'currency'])
  },

  mounted () {
    this.WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT()
  },

  methods: {
    ...mapActions('shoppingCart', [
      'deleteShoppinCartDataListAction',
      'setShoppinCartDataListAction',
      'setTotalPaymentFeesAction',
      'SET_BRAINTREE_CLIENT_TOKEN_Action',
      'SET_ORDER_DATA_Action'
    ]),

    async getBraintreePaymentUrlFromTheBackend (orderResult) {
      const braintreePaymentresult = await this.$apollo.mutate({
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
        this.SET_BRAINTREE_CLIENT_TOKEN_Action(braintreeClientToken)
        this.SET_ORDER_DATA_Action(orderResult)
      } catch (error) {
        // silent
      }
    },

    getOrdersIds () {
      return this.$_.map(this.shoppingCartDataList, '[course][pk]')
    },

    async getOrderResult (courseIds) {
      const result = await this.$apollo.mutate({
        mutation: CreateNewOrderWithBulkOrderDetails,
        variables: { courseIds: courseIds }
      })

      const dataObj = result.data.createNewOrderWithBulkOrderDetails

      if (this.$_.get(dataObj, '[errors]')) {
        this.visible = false
      }

      if (this.$_.get(dataObj, '[success]')) {
        return dataObj
      }
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

    calculateTheTotalFees () {
      let sum = 0.0
      for (const item of this.shoppingCartDataList) {
        sum = sum + parseFloat(JSON.parse(item.course.currency)[this.currency])
      }
      this.setTotalPaymentFeesAction(sum)
      return sum
    },

    FORMAT_COUSRE_PRICE (num, digits) {
      const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' }
      ]

      if ((num.toString().split('.')[0] == 0) || num == 0) {
        return num
      }
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value
      })

      return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
    },

    goToAuthenticationCartPage () {
      if (this.shoppingCartDataList.length > 0) {
        this.$root.$emit('activateShoppingProgress', 'loginCart')
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
      this.lodash.remove(data, element => {
        return element.course.id === item.course.id
      })
      this.setShoppinCartDataListAction(data)
    },

    deleteTheShoppCart () {
      this.deleteShoppinCartDataListAction()
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-courses {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
  color: var(--ds-text);

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--ds-space-3);
  }

  &__row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--ds-space-4);
    padding: var(--ds-space-3);
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-xs);
    transition: box-shadow var(--ds-duration-fast) var(--ds-ease-out),
                border-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { box-shadow: var(--ds-shadow-sm); border-color: var(--ds-border-strong); }
  }

  &__media {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: var(--ds-radius-md);
    overflow: hidden;
    background: var(--ds-surface-muted);
    flex-shrink: 0;

    img { width: 100%; height: 100%; object-fit: cover; display: block; }
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
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__price {
    margin: 0;
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700);
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
  }

  &__currency {
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-regular);
    color: var(--ds-text-muted);
    margin-inline-start: var(--ds-space-1);
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
    transition: background var(--ds-duration-fast) var(--ds-ease-out),
                color var(--ds-duration-fast) var(--ds-ease-out),
                transform var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      background: var(--ds-danger-bg);
      color: var(--ds-danger);
      transform: scale(1.05);
    }
  }

  &__summary {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    padding-block-start: var(--ds-space-4);
    border-block-start: 1px solid var(--ds-border);
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-4);
  }

  &__total-label {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    color: var(--ds-text);
  }

  &__total-value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700);
  }
}
</style>
