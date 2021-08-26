import { LocalStorage } from 'quasar'

 
const state = {
  isEnglish:  LocalStorage.getItem('isEnglish')|| false,
  currency:  'SDG',
  openMenu: false,
  activeNav: LocalStorage.getItem('activeNav')|| ''
}

const mutations = {

  updateActiveNav (state, value) {
    LocalStorage.set('activeNav', JSON.stringify(value))
    state.activeNav = value
  },

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

  setActiveNavAction ({ commit }, value) {
    commit('updateActiveNav', value)
  },

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
