import { LocalStorage } from 'quasar'

const state = {
  isEnglish:  LocalStorage.getItem('isEnglish')|| false
}

const mutations = {

  updateIsEnglish (state, value) {
    LocalStorage.set('isEnglish', value)
    state.isEnglish = value
  }
}

const actions = {

  setIsEnglishAction ({ commit }, value) {
    commit('updateIsEnglish', value)
  }
}

const getters = {
  isEnglish: state => state.isEnglish
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
