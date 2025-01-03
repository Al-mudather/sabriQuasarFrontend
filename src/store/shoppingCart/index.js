import { Notify, SessionStorage } from 'quasar'

const state = {
  shoppinCartDialog: false,
  braintreeClientToken: null,
  orderData: null,
  totalPaymentFees: SessionStorage.getItem('totalPaymentFees') || 0.0,
  checkoutOrderID: SessionStorage.getItem('orderID') || null,
  shoppingCartDataList: SessionStorage.getItem('shoppingCartList') || []
}

const mutations = {

  ORDER_DATA_MUTATION (state, value) {
    state.orderData = value
  },

  BRAINTREE_CLIENT_TOKEN_MUTATION (state, value) {
    state.braintreeClientToken = value
  },

  saveCheckoutOrderID (state, value) {
    SessionStorage.set('orderID', value) || []
    state.checkoutOrderID = value
  },

  deleteShoppinCartDataList (state) {
    // SessionStorage.set('shoppingCartList', state.shoppingCartDataList)
    SessionStorage.set('shoppingCartList', [])
    // TODO: Delete the order
    state.shoppingCartDataList = []
    state.checkoutOrderID = null
    // TODO: Delete the order from the SessionStorage
    SessionStorage.set('orderID', null)
  },

  updateShoppinCartDataList (state, value) {
    // TODO: remove all the data
    state.shoppingCartDataList = []
    // TODO: assign the new data
    state.shoppingCartDataList = value
    // TODO: save the data to the local storage
    SessionStorage.set('shoppingCartList', state.shoppingCartDataList)
  },

  updateShoppinCartDialog (state, value) {
    state.shoppinCartDialog = value
  },

  updateTotalPaymentFees (state, value) {
    SessionStorage.set('totalPaymentFees', value)
    state.totalPaymentFees = value
  },

  updateShoppingCartDataList (state, value) {
    // TODO: If the cart empty add the course to is
    if (state.shoppingCartDataList.length > 0) {
      //TODO: Is this course exists in the basket
      const res = state.shoppingCartDataList.filter(item => {
        if (item.course.id === value.course.id) {
          return item
        }
      })

      if (res.length === 0) {
        Notify.create({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'لديك طلب مسبق في السله, قم باكماله او افراغ السله من اجل طلب جديد'
        })
      } else {
      }

      // //TODO: if no add it, if yes refuse to add it
      // if (res.length === 0) {
      //   state.shoppingCartDataList.push(value)
      //   SessionStorage.set('shoppingCartList', state.shoppingCartDataList)
      // } else {
      //   Notify.create({
      //     type: 'warning',
      //     progress: true,
      //     multiLine: true,
      //     position: 'top',
      //     message: 'هذا الكورس موجود مسبقا في السله'
      //   })
      // }
    } else {
      state.shoppingCartDataList.push(value)
      SessionStorage.set('shoppingCartList', state.shoppingCartDataList)
    }
  }
}

const actions = {

  SET_ORDER_DATA_Action ({ commit }, value) {
    commit('ORDER_DATA_MUTATION', value)
  },

  SET_BRAINTREE_CLIENT_TOKEN_Action ({ commit }, value) {
    commit('BRAINTREE_CLIENT_TOKEN_MUTATION', value)
  },

  setSaveCheckoutOrderIDAction ({ commit }, value) {
    commit('saveCheckoutOrderID', value)
  },

  setShoppinCartDataListAction ({ commit }, value) {
    commit('updateShoppinCartDataList', value)
  },

  deleteShoppinCartDataListAction ({ commit }) {
    commit('deleteShoppinCartDataList')
  },

  setShoppinCartDialogAction ({ commit }, value) {
    commit('updateShoppinCartDialog', value)
  },

  setShoppingCartDataListAction ({ commit }, value) {
    commit('updateShoppingCartDataList', value)
  },

  setTotalPaymentFeesAction ({ commit }, value) {
    commit('updateTotalPaymentFees', value)
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
