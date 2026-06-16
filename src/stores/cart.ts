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

import type { CartEntry } from 'src/types/cart/types'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface CartState {
  shoppinCartDialog: boolean
  braintreeClientToken: string | null
  /**
   * Order payload returned by CreateNewOrderWithBulkOrderDetails. Kept
   * permissive (unknown) because the shape is not aliased in types/cart/types.
   */
  orderData: unknown
  totalPaymentFees: number
  checkoutOrderID: string | number | null
  shoppingCartDataList: CartEntry[]
}

export const useCartStore = defineStore('shoppingCart', {
  state: (): CartState => ({
    shoppinCartDialog: false,
    braintreeClientToken: null,
    orderData: null,
    totalPaymentFees: (SessionStorage.getItem<number>('totalPaymentFees') ?? 0.0),
    checkoutOrderID: (SessionStorage.getItem<string | number>('orderID') ?? null) as string | number | null,
    shoppingCartDataList: (SessionStorage.getItem<CartEntry[]>('shoppingCartList') ?? []),
  }),

  getters: {},

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    ORDER_DATA_MUTATION (value: unknown): void { this.orderData = value },
    BRAINTREE_CLIENT_TOKEN_MUTATION (value: string | null): void { this.braintreeClientToken = value },

    saveCheckoutOrderID (value: string | number | null): void {
      SessionStorage.set('orderID', value)
      this.checkoutOrderID = value
    },

    deleteShoppinCartDataList (): void {
      SessionStorage.set('shoppingCartList', [])
      this.shoppingCartDataList = []
      this.checkoutOrderID = null
      SessionStorage.set('orderID', null)
    },

    updateShoppinCartDataList (value: CartEntry[]): void {
      // Replace, don't merge. The original mutation cleared-then-assigned;
      // single assignment is atomic in Pinia and has the same outcome.
      this.shoppingCartDataList = value
      SessionStorage.set('shoppingCartList', this.shoppingCartDataList)
    },

    updateShoppinCartDialog (value: boolean): void { this.shoppinCartDialog = value },

    updateTotalPaymentFees (value: number): void {
      SessionStorage.set('totalPaymentFees', value)
      this.totalPaymentFees = value
    },

    updateShoppingCartDataList (value: CartEntry): void {
      // Preserves the quirky Vuex behavior exactly:
      // - if cart already has items and the new item is NOT a duplicate,
      //   show a warning ("complete or empty the cart before adding a new order").
      // - if cart is empty, push the new item.
      if (this.shoppingCartDataList.length > 0) {
        const res = this.shoppingCartDataList.filter((item) => {
          if (item.course && item.course.id === value.course.id) return item
        })
        if (res.length === 0) {
          Notify.create({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'bottom',
            message: 'لديك طلب مسبق في السله, قم باكماله او افراغ السله من اجل طلب جديد',
          })
        }
      } else {
        this.shoppingCartDataList.push(value)
        SessionStorage.set('shoppingCartList', this.shoppingCartDataList)
      }
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_ORDER_DATA_Action (value: unknown): void { this.ORDER_DATA_MUTATION(value) },
    SET_BRAINTREE_CLIENT_TOKEN_Action (value: string | null): void { this.BRAINTREE_CLIENT_TOKEN_MUTATION(value) },
    setSaveCheckoutOrderIDAction (value: string | number | null): void { this.saveCheckoutOrderID(value) },
    setShoppinCartDataListAction (value: CartEntry[]): void { this.updateShoppinCartDataList(value) },
    deleteShoppinCartDataListAction (): void { this.deleteShoppinCartDataList() },
    setShoppinCartDialogAction (value: boolean): void { this.updateShoppinCartDialog(value) },
    setShoppingCartDataListAction (value: CartEntry): void { this.updateShoppingCartDataList(value) },
    setTotalPaymentFeesAction (value: number): void { this.updateTotalPaymentFees(value) },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setCartDialog (v: boolean): void { return this.setShoppinCartDialogAction(v) },
    deleteCart (): void { return this.deleteShoppinCartDataListAction() },
    addCourseToCart (v: CartEntry): void { return this.setShoppingCartDataListAction(v) },
    setCartList (v: CartEntry[]): void { return this.setShoppinCartDataListAction(v) },
    setOrderData (v: unknown): void { return this.SET_ORDER_DATA_Action(v) },
    setBraintreeClientToken (v: string | null): void { return this.SET_BRAINTREE_CLIENT_TOKEN_Action(v) },
    setTotalPaymentFees (v: number): void { return this.setTotalPaymentFeesAction(v) },
    setSaveCheckoutOrderID (v: string | number | null): void { return this.setSaveCheckoutOrderIDAction(v) },
  },
})
