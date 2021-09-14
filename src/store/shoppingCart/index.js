import { Notify, LocalStorage } from 'quasar'

const state = {
  shoppinCartDialog: false,
  totalPaymentFees: LocalStorage.getItem('totalPaymentFees') || 0.0,
  checkoutOrderID: LocalStorage.getItem('orderID') || null,
  shoppingCartDataList: LocalStorage.getItem('shoppingCartList') || []
}

const mutations = {

  saveCheckoutOrderID (state, value) {
    LocalStorage.set('orderID', value) || []
    state.checkoutOrderID = value
    
  },

  deleteShoppinCartDataList (state) {
    // LocalStorage.set('shoppingCartList', state.shoppingCartDataList)
    LocalStorage.set('shoppingCartList', [])
    // TODO: Delete the order
    state.shoppingCartDataList = []
    state.checkoutOrderID = null
    // TODO: Delete the order from the localstorage
    LocalStorage.set('orderID', null)
  },

  updateShoppinCartDataList (state, value) {
    // TODO: remove all the data
    state.shoppingCartDataList = []
    // TODO: assign the new data
    state.shoppingCartDataList = value
    // TODO: save the data to the local storage
    LocalStorage.set('shoppingCartList', state.shoppingCartDataList)
  },

  updateShoppinCartDialog (state, value) {
    state.shoppinCartDialog = value
  },

  updateTotalPaymentFees (state, value) {
    LocalStorage.set('totalPaymentFees', value)
    state.totalPaymentFees = value
  },

  updateShoppingCartDataList (state, value) {
    // TODO: If the course is not exists in the cart, add it
    if (state.shoppingCartDataList.length > 0) {
      const res = state.shoppingCartDataList.filter(item => {
        if (item.course.id === value.course.id) {
          return item
        }
      })

      if (res.length === 0) {
        state.shoppingCartDataList.push(value)
        LocalStorage.set('shoppingCartList', state.shoppingCartDataList)
      } else {
        Notify.create({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'هذا الكورس موجود مسبقا في السله'
        })
      }
    } else {
      state.shoppingCartDataList.push(value)
      LocalStorage.set('shoppingCartList', state.shoppingCartDataList)
    }
  }
}

const actions = {

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
