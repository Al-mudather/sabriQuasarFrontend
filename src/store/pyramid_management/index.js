import { LocalStorage } from 'quasar'


const state = {
  myPyramidAccount:  null
}

const mutations = {

  UPDATE_MY_PYRAMID_ACCOUNT (state, value) {
    state.myPyramidAccount = value
  }
}

const actions = {

  SET_MY_PYRAMID_ACCOUNT_ACTION ({ commit }, value) {
    commit('UPDATE_MY_PYRAMID_ACCOUNT', value)
  }
}

const getters = {
  myPyramidAccount:  state => state.myPyramidAccount
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
