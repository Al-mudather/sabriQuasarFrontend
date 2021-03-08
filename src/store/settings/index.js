import { LocalStorage } from 'quasar'

const state = {
  isEnglish:  LocalStorage.getItem('isEnglish')|| false,
  openMenu: false
}

const mutations = {

  updateIsEnglish (state, value) {
    LocalStorage.set('isEnglish', value)
    state.isEnglish = value
  },

  updateOpenMenu (state, value) {
    state.openMenu = value
  }
}

const actions = {

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
