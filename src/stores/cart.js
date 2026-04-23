// Pinia shell for the `shoppingCart` module. Behavior is ported from the
// Vuex version verbatim (mutations folded into actions).

import { defineStore } from 'pinia'
import { Notify, SessionStorage } from 'quasar'

export const useCartStore = defineStore('shoppingCart', {
  state: () => ({
    shoppinCartDialog: false,
    braintreeClientToken: null,
    orderData: null,
    totalPaymentFees: SessionStorage.getItem('totalPaymentFees') || 0.0,
    checkoutOrderID: SessionStorage.getItem('orderID') || null,
    shoppingCartDataList: SessionStorage.getItem('shoppingCartList') || []
  }),

  actions: {
    setOrderData (v) { this.orderData = v },
    setBraintreeClientToken (v) { this.braintreeClientToken = v },

    setSaveCheckoutOrderID (v) {
      SessionStorage.set('orderID', v)
      this.checkoutOrderID = v
    },

    deleteCart () {
      SessionStorage.set('shoppingCartList', [])
      this.shoppingCartDataList = []
      this.checkoutOrderID = null
      SessionStorage.set('orderID', null)
    },

    setCartList (value) {
      this.shoppingCartDataList = value || []
      SessionStorage.set('shoppingCartList', this.shoppingCartDataList)
    },

    setCartDialog (v) { this.shoppinCartDialog = v },

    setTotalPaymentFees (v) {
      SessionStorage.set('totalPaymentFees', v)
      this.totalPaymentFees = v
    },

    addCourseToCart (value) {
      if (this.shoppingCartDataList.length > 0) {
        const exists = this.shoppingCartDataList.some(item => item.course && item.course.id === value.course.id)
        if (!exists) {
          Notify.create({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'لديك طلب مسبق في السله, قم باكماله او افراغ السله من اجل طلب جديد'
          })
        }
      } else {
        this.shoppingCartDataList.push(value)
        SessionStorage.set('shoppingCartList', this.shoppingCartDataList)
      }
    }
  }
})
