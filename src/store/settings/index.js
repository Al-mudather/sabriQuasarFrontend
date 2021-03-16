import { LocalStorage } from 'quasar'

const state = {
  isEnglish:  LocalStorage.getItem('isEnglish')|| false,
  currency:  'USD',
  openMenu: false
}

const mutations = {

  updateIsEnglish (state, value) {
    LocalStorage.set('isEnglish', value)
    state.isEnglish = value
  },

  updateOpenMenu (state, value) {
    state.openMenu = value
  },

  updateCurrency (state, value) {
    state.currency = value
  }
}

const actions = {

  setCurrencyAction ({ commit }, value) {
    commit('updateCurrency', value)
  },

  setOpenMenuAction ({ commit }, value) {
    commit('updateOpenMenu', value)
  },

  setIsEnglishAction ({ commit }, value) {
    commit('updateIsEnglish', value)
  }
}

const getters = {
  isEnglish:  state => state.isEnglish
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
