<template>
    <div class="msPayment">
        <div class="options">
            <paypal-payment />
            <strip-payment />
            <syber-pay-payment />
            <div class="sele edit" style="display: none">
                <img src="~assets/img/STCPAY.png" alt="" />
            </div>
        </div>
        <!--details Payment-->
        <div class="details" style="display: none">
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
import syberPay from 'src/components/ShoppingCard/syberPay'
import paypalPayment from 'src/components/ShoppingCard/paypalPayment'
// import { openURL } from 'quasar'

export default {
    name:  "paymentCartpage",
  components: {
    'strip-payment': stripPayment,
    'syber-pay-payment': syberPay,
    'paypal-payment': paypalPayment
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
    // }
  },

  created () {
    this.$root.$emit('activateShoppingProgress', 'paymentData')
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList'])
  }
}
</script>

<style></style>
