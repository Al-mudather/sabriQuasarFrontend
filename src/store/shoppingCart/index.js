import { Notify } from 'quasar'

const state = {
  shoppinCartDialog: false,
  shopingCartDataList: []
}

const mutations = {
  updateShoppinCartDialog (state, value) {
    state.shoppinCartDialog = value
  },

  updateShopingCartDataList (state, value) {
    // TODO: If the course is not exists in the cart, add it
    if (state.shopingCartDataList.length > 0) {
      const res = state.shopingCartDataList.filter(item => {
        if (item.course.id === value.course.id) {
          return item
        }
      })

      if (res.length === 0) {
        state.shopingCartDataList.push(value)
      } else {
        Notify.create({
          type: 'warning',
          position: 'top',
          message: 'هذا الكورس موجود مسبقا في السله'
        })
      }
    } else {
      state.shopingCartDataList.push(value)
    }
  }
}

const actions = {

  setShoppinCartDialogAction ({ commit }, value) {
    commit('updateShoppinCartDialog', value)
  },

  setShopingCartDataListAction ({ commit }, value) {
    commit('updateShopingCartDataList', value)
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
