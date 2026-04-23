// Pinia equivalent of the legacy Vuex `shoppingCart` module. State shape and
// action names match 1:1 so C1 / C2 can mechanically rewrite:
//
//   Vuex:  mapActions('shoppingCart', ['setShoppinCartDataListAction'])
//   Pinia: const cart = useCartStore(); cart.setShoppinCartDataListAction(v)
//
// Cart state is session-scoped (SessionStorage) and the store reads those
// keys at init. No Pinia persist plugin — the existing SessionStorage writes
// are the canonical persistence and we must not drift from them.

import { defineStore } from 'pinia'
import { Notify, SessionStorage } from 'quasar'

/**
 * Feature-level type aliases for the cart store. Pulled from the type-only
 * module at src/features/cart/types.ts so the Pinia state is annotated with
 * the same shapes the checkout components import.
 *
 * @typedef {import('src/features/cart/types').CartEntry} CartEntry
 */

export const useCartStore = defineStore('shoppingCart', {
  state: () => ({
    /** @type {boolean} */
    shoppinCartDialog: false,
    /** @type {string | null} */
    braintreeClientToken: null,
    /**
     * Order payload returned by CreateNewOrderWithBulkOrderDetails. Kept
     * permissive (unknown) because the shape is not aliased in features/cart/types.
     * @type {unknown}
     */
    orderData: null,
    /** @type {number} */
    totalPaymentFees: SessionStorage.getItem('totalPaymentFees') || 0.0,
    /** @type {string | number | null} */
    checkoutOrderID: SessionStorage.getItem('orderID') || null,
    /** @type {CartEntry[]} */
    shoppingCartDataList: SessionStorage.getItem('shoppingCartList') || []
  }),

  getters: {},

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    ORDER_DATA_MUTATION (value) { this.orderData = value },
    BRAINTREE_CLIENT_TOKEN_MUTATION (value) { this.braintreeClientToken = value },

    saveCheckoutOrderID (value) {
      SessionStorage.set('orderID', value)
      this.checkoutOrderID = value
    },

    deleteShoppinCartDataList () {
      SessionStorage.set('shoppingCartList', [])
      this.shoppingCartDataList = []
      this.checkoutOrderID = null
      SessionStorage.set('orderID', null)
    },

    updateShoppinCartDataList (value) {
      // Replace, don't merge. The original mutation cleared-then-assigned;
      // single assignment is atomic in Pinia and has the same outcome.
      this.shoppingCartDataList = value
      SessionStorage.set('shoppingCartList', this.shoppingCartDataList)
    },

    updateShoppinCartDialog (value) { this.shoppinCartDialog = value },

    updateTotalPaymentFees (value) {
      SessionStorage.set('totalPaymentFees', value)
      this.totalPaymentFees = value
    },

    updateShoppingCartDataList (value) {
      // Preserves the quirky Vuex behavior exactly:
      // - if cart already has items and the new item is NOT a duplicate,
      //   show a warning ("complete or empty the cart before adding a new order").
      // - if cart is empty, push the new item.
      // - the commented-out legacy branch that warned on duplicate is kept
      //   commented-out intentionally (product decision baked into the Vuex
      //   version; we are not re-opening that decision here).
      if (this.shoppingCartDataList.length > 0) {
        const res = this.shoppingCartDataList.filter(item => {
          if (item.course && item.course.id === value.course.id) return item
        })
        if (res.length === 0) {
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
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_ORDER_DATA_Action (value) { this.ORDER_DATA_MUTATION(value) },
    SET_BRAINTREE_CLIENT_TOKEN_Action (value) { this.BRAINTREE_CLIENT_TOKEN_MUTATION(value) },
    setSaveCheckoutOrderIDAction (value) { this.saveCheckoutOrderID(value) },
    setShoppinCartDataListAction (value) { this.updateShoppinCartDataList(value) },
    deleteShoppinCartDataListAction () { this.deleteShoppinCartDataList() },
    setShoppinCartDialogAction (value) { this.updateShoppinCartDialog(value) },
    setShoppingCartDataListAction (value) { this.updateShoppingCartDataList(value) },
    setTotalPaymentFeesAction (value) { this.updateTotalPaymentFees(value) },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setCartDialog (v) { return this.setShoppinCartDialogAction(v) },
    deleteCart () { return this.deleteShoppinCartDataListAction() },
    addCourseToCart (v) { return this.setShoppingCartDataListAction(v) },
    setCartList (v) { return this.setShoppinCartDataListAction(v) },
    setOrderData (v) { return this.SET_ORDER_DATA_Action(v) },
    setBraintreeClientToken (v) { return this.SET_BRAINTREE_CLIENT_TOKEN_Action(v) },
    setTotalPaymentFees (v) { return this.setTotalPaymentFeesAction(v) },
    setSaveCheckoutOrderID (v) { return this.setSaveCheckoutOrderIDAction(v) }
  }
})
