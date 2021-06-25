import { Notify } from 'quasar'
import {apolloClient} from 'src/apollo/client'
import {tokenStorage, userProfileStorage} from "src/localStorageService";
import {RefreshLoginUserWithEmail} from 'src/queries/account_management/mutation/RefreshUserToken'

const state = {
  navbarSearch: true,
  user: userProfileStorage.getUser() || {},
  token: tokenStorage.getAccessToken() || null,
  refreshToken: tokenStorage.getRefreshToken() || null
}

const mutations = {
  updateUserAffiliateLink (state, link) {
    let customUser = state.user
    customUser.affiliateSet.edges.push({ node: link })
    state.user = customUser 
    userProfileStorage.setUser(customUser)
  },
  updateUser (state, user) {
    // Set the user
    userProfileStorage.setUser(user)
    state.user = user
  },
  updateToken (state, token) {
    state.token = token
  },
  updateRefreshToken (state, refreshToken) {
    state.refreshToken = refreshToken
  },
  deleteData (state) {
    state.user = null
    state.token = null
    state.refreshToken = null
  },
  updateNavebarSearcgDialog (state, value) {
    state.navbarSearch = value
  }
}

const actions = {

  setUserAffiliateLinkAction ({ commit }, link) {
    commit('updateUserAffiliateLink', link)
  },

  setNavbarSearchAction ({ commit }, value) {
    commit('updateNavebarSearcgDialog', value)
  },

  setPasswordResetDialogAction ({ commit }, value) {
    commit('updatePasswordResetDialog', value)
  },

  SET_USER_DATA_ACTION ({ commit }, value) {
    commit('updateUser', value)
  },

  loginAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      let user = ''
      if (payload.user) {
        user = payload.user
      } else {
        user = payload.social ? payload.social.user: ''
      }
      const token = payload.token
      const refresh =  payload.refreshToken || ''
      const tokenObj = {
        token,
        refresh
      }
      // Set the token and the refreshToken authentication
      tokenStorage.setToken(tokenObj)
      // commit the change to the store
      commit('updateUser', user)
      // update the token
      commit('updateToken', token)
      // update the token
      commit('updateRefreshToken', refresh)

      resolve()
    })
  },

  RE_LOGIN_USER({context}, payload) {
    if (tokenStorage.getRefreshToken()) {
      return apolloClient.mutate({
        mutation: RefreshLoginUserWithEmail, 
        variables: {
          refreshToken: tokenStorage.getRefreshToken(),
        },
      }).then((data) => {
        // Result
        if (data.data.refreshToken.success) {
          tokenStorage.setToken({
            token: data.data.refreshToken.token,
            refresh: data.data.refreshToken.refreshToken
          })
          return true
  
        } else {
          return false
        }
      }).catch(e => {
      })
      
    } else {
      return true
    }

  },

  logOutAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      // Todo clear everything from window.LocalStorage
      tokenStorage.clearToken()
      commit('deleteData')
      Notify.create({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'top',
        message: 'Logged Out Successfully'
      })
      resolve()
    })
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  navbarSearch: state => state.navbarSearch
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
