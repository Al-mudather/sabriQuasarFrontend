import { LocalStorage } from 'quasar'

const state = {
  loginDialog: false,
  signUpDialog: false,
  navbarSearch: true,
  registerationDialog: false,
  passwordResetDialog: false,
  user: LocalStorage.getItem('user') || null,
  token: LocalStorage.getItem('token') || null,
  refreshToken: LocalStorage.getItem('refreshToken') || null
}

const mutations = {
  updateUser (state, user) {
    state.user = user
  },
  updateToken (state, token) {
    state.token = token
  },
  updateRefreshToken (state, refreshToken) {
    state.refreshToken = refreshToken
  },
  deleteData (state) {
    state.token = null
    state.refreshToken = null
  },
  updateLoginDialog (state, value) {
    state.loginDialog = value
  },
  updatePasswordResetDialog (state, value) {
    state.passwordResetDialog = value
  },
  updateSignUpDialog (state, value) {
    state.signUpDialog = value
  },
  updateregisterationDialog (state, value) {
    state.registerationDialog = value
  },
  updateNavebarSearcgDialog (state, value) {
    state.navbarSearch = value
  }
}

const actions = {

  setNavbarSearchAction ({ commit }, value) {
    commit('updateNavebarSearcgDialog', value)
  },

  setLoginDialogAction ({ commit }, value) {
    commit('updateLoginDialog', value)
  },

  setPasswordResetDialogAction ({ commit }, value) {
    commit('updatePasswordResetDialog', value)
  },

  setSignUpDialogAction ({ commit }, value) {
    commit('updateSignUpDialog', value)
  },

  setRegisterationDialogAction ({ commit }, value) {
    commit('updateregisterationDialog', value)
  },

  loginAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const user = payload.user || payload.social.user
      const token = 'JWT ' + payload.token
      const refreshToken = 'JWT ' + payload.refreshToken || null
      // Set the user
      LocalStorage.set('user', user)
      // Set the token authentication
      LocalStorage.set('token', token)
      // Set the refreshToken authentication
      LocalStorage.set('refreshToken', token)
      // commit the change to the store
      commit('updateUser', user)
      // update the token
      commit('updateToken', token)
      // update the token
      commit('updateRefreshToken', refreshToken)

      resolve()
    })
  },

  logOutAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      // Todo clear everything from window.LocalStorage
      LocalStorage.clear()
      commit('deleteData')
      resolve()
    })
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  navbarSearch: state => state.navbarSearch,
  errorMessages: state => state.errorMessages
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
