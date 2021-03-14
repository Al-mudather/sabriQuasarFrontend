// import { LocalStorage, Notify } from 'quasar'
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

  loginAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const user = payload.user || payload.social.user
      const token = payload.token
      const refresh =  payload.refreshToken || null
      const tokenObj = {
        token,
        refresh
      }
      // Set the user
      userProfileStorage.setUser(user)
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

    console.log("Refresh Apollo Client")

    return apolloClient.mutate({
      mutation: RefreshLoginUserWithEmail,
      variables: {
        refreshToken: tokenStorage.getRefreshToken(),
      },
    }).then((data) => {

      // Result
      tokenStorage.setToken({
        token: data.data.refreshToken.token,
        refresh: data.data.refreshToken.refreshToken
      })

      // Notify.create({
      //   type: 'positive',
      //   message: `logged in successfully`
      // })

    }).catch(e => {
      console.log('ggggggggggggggggg')
      console.log(e)
      console.log('ggggggggggggggggg')
    })

  },

  logOutAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      // Todo clear everything from window.LocalStorage
      tokenStorage.clearToken()
      // LocalStorage.clear()
      commit('deleteData')
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
