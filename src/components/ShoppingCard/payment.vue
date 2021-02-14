<template>
    <div class="msPayment">
        <div class="options">
            <div class="sele">
                <img src="~assets/img/paypal.png" alt="" />
            </div>
            <strip-payment />
            <div class="sele edit">
                <img src="~assets/img/credit-cards.png" alt="" />
                <h3>بطاقة بنكيــة</h3>
            </div>
            <div class="sele edit">
                <img src="~assets/img/STCPAY.png" alt="" />
            </div>
        </div>
        <!--details Payment-->
        <div class="details">
            <div class="error">
                <h3>
                    <img src="~assets/img/error.png" alt="" />رقم البطاقة غير
                    صحيح أعد المحاولة
                </h3>
            </div>
            <div class="logoPay">
                <img src="~assets/img/discover.png" alt="" />
            </div>
            <!-- <form>
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <input type="number" placeholder="رقم البطاقة">
                        </div>
                    </div>
                    <div class="col-lg-7 col-xs-12 noPadding">
                        <div class="inp">
                            <input type="number" placeholder="تاريخ الإنتهاء">
                        </div>
                    </div>
                    <div class="col-lg-5 col-xs-12 noPadding">
                        <div class="inp">
                            <input type="number" placeholder="CCV">
                            <img src="~assets/img/question.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="but">
                    <h3><img src="~assets/img/payment.png" alt="">دفـــع</h3>
                </div>
            </form> -->
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { CreateNewOrderWithBulkOrderDetails } from 'src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
// import { CreateSyberpayCheckout } from 'src/queries/checkout_management/mutation/CreateSyberpayCheckout'
import { CreateStripeCheckout } from 'src/queries/checkout_management/mutation/CreateStripeCheckout'
import { StripePublishableKey } from 'src/queries/checkout_management/query/StripePublishableKey'
import stripPayment from 'src/components/ShoppingCard/stripPayment'
// import { openURL } from 'quasar'

export default {
  components: {
    'strip-payment': stripPayment
  },

  methods: {
    // async buyTheCoursesUsingSyperPay () {
    //   // TODO: Extract all courses ids
    //   const courseIds = this.shoppingCartDataList.map((item) => {
    //     return item.course.pk
    //   })
    //   // TODO: Make the order
    //   const orderResult = await this.$apollo.mutate({
    //     mutation: CreateNewOrderWithBulkOrderDetails,
    //     variables: {
    //       courseIds: courseIds
    //     }
    //   })
    //   const details = orderResult.data.createNewOrderWithBulkOrderDetails

    //   // TODO: IF there is an errors show them
    //   if (details.errors) {
    //     alert('Please fix these errors first', details.errors.nonFieldErrors)
    //   }

    //   // IF every thing is ok, procced to the payment
    //   if (details.success) {
    //     const siberPaymentresult = await this.$apollo.mutate({
    //       mutation: CreateSyberpayCheckout,
    //       variables: {
    //         orderId: details.order.pk
    //       }
    //     })

    //     const siberDetails = siberPaymentresult.data.createSyberpayCheckout
    //     if (siberDetails.errors) {
    //       alert('Please fix these errors first', details.errors.nonFieldErrors)
    //     }

    //     if (siberDetails.success) {
    //       openURL(siberDetails.paymentUrl)
    //     }
    //   }
    // },

    // async buyTheCoursesUsingStripe () {
    //   // TODO: Extract all courses ids
    //   const courseIds = this.shoppingCartDataList.map((item) => {
    //     return item.course.pk
    //   })
    //   // TODO: Make the order
    //   const orderResult = await this.$apollo.mutate({
    //     mutation: CreateNewOrderWithBulkOrderDetails,
    //     variables: {
    //       courseIds: courseIds
    //     }
    //   })
    //   const details = orderResult.data.createNewOrderWithBulkOrderDetails

    //   // TODO: IF there is an errors show them
    //   if (details.errors) {
    //     alert(details.errors.nonFieldErrors)
    //   }

    //   // IF every thing is ok, procced to the payment
    //   if (details.success) {
    //     // TODO: Get the strip id first from the backend
    //     const stripKeyResult = await this.$apollo.query({
    //       query: StripePublishableKey
    //     })

    //     const stripKey = JSON.parse(this.$_.get(stripKeyResult, '[data][stripePublishableKey]')).publisableKey

    //     const stripe = this.$Stripe(stripKey)
    //     const stripPaymentresult = await this.$apollo.mutate({
    //       mutation: CreateStripeCheckout,
    //       variables: {
    //         orderId: details.order.pk,
    //         successUrl: location.origin + '/cart/success',
    //         cancelUrl: location.origin + '/cart/cancel'
    //       }
    //     })

    //     const stripDetails = stripPaymentresult.data.createStripeCheckout

    //     if (stripDetails.errors) {
    //       alert(details.errors.nonFieldErrors)
    //     }

    //     if (stripDetails.success) {
    //       // openURL(stripDetails.paymentUrl)
    //       stripe.redirectToCheckout({ sessionId: stripDetails.paymentUrl })
    //     }
    //   }
    // }

  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList'])
  }
}
</script>

<style></style>
