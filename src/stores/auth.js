// Pinia shell for the `authentication` module. Action bodies are ported
// verbatim from src/store/authentication/index.js (mutations folded into
// actions). Track C migrates call sites off Vuex and onto `useAuthStore`.

import { defineStore } from 'pinia'
import _ from 'lodash'
import { Notify, SessionStorage } from 'quasar'

import { apolloClient } from 'src/apollo/client'
import { tokenStorage, userProfileStorage } from 'src/localStorageService'
import { RefreshLoginUserWithEmail } from 'src/queries/account_management/mutation/RefreshUserToken'
import { RevokeUserRefreshToken } from 'src/queries/account_management/mutation/RevokeUserRefreshToken.js'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData.js'

export const useAuthStore = defineStore('authentication', {
  state: () => ({
    navbarSearch: true,
    user: userProfileStorage.getUser() || {},
    token: tokenStorage.getAccessToken() || null,
    refreshToken: tokenStorage.getRefreshToken() || null
  }),

  getters: {
    userGetter: (state) => state.user,
    tokenGetter: (state) => state.token,
    navbarSearchGetter: (state) => state.navbarSearch
  },

  actions: {
    setUserAfterJoinPyramid (data) {
      this.user = data
      userProfileStorage.setUser(data)
    },

    setUser (user) {
      userProfileStorage.setUser(user)
      this.user = user
    },

    setToken (token) { this.token = token },
    setRefreshToken (refresh) { this.refreshToken = refresh },

    setNavbarSearch (value) { this.navbarSearch = value },

    clearAuthData () {
      this.user = null
      this.token = null
      this.refreshToken = null
    },

    async getMyProfileData () {
      const res = await apolloClient.query({ query: GetMyProfileData })
      this.setUser(_.get(res, '[data][me]'))
      return res
    },

    login (payload) {
      tokenStorage.clearToken()
      userProfileStorage.clearUserProfileStorage()

      const user = payload.user || (payload.social ? payload.social.user : '')
      const token = payload.token
      const refresh = payload.refreshToken || ''
      tokenStorage.setToken({ token, refresh })

      this.setUser(user)
      this.setToken(token)
      this.setRefreshToken(refresh)
    },

    async reLogin () {
      if (!tokenStorage.getRefreshToken()) return true
      try {
        const data = await apolloClient.mutate({
          mutation: RefreshLoginUserWithEmail,
          variables: { refreshToken: tokenStorage.getRefreshToken() }
        })
        if (data.data.refreshToken.success) {
          tokenStorage.setToken({
            token: data.data.refreshToken.token,
            refresh: data.data.refreshToken.refreshToken
          })
          return true
        }
        return false
      } catch (_) {
        return false
      }
    },

    destroyRefreshToken () {
      return apolloClient.mutate({
        mutation: RevokeUserRefreshToken,
        variables: { refreshToken: tokenStorage.getRefreshToken() }
      })
    },

    logOut () {
      tokenStorage.clearToken()
      userProfileStorage.clearUserProfileStorage()
      SessionStorage.set('shoppingCartList', [])
      this.clearAuthData()
      Notify.create({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'top',
        message: 'Logged Out Successfully'
      })
    }
  },

  persist: {
    paths: ['token', 'refreshToken']
  }
})
