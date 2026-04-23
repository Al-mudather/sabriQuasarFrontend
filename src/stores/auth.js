// Pinia equivalent of the legacy Vuex `authentication` module.
//
// Mutations are folded into actions (Pinia has no mutations). State shape and
// every action name are preserved 1:1 with the Vuex version so migrating
// call sites in C1 / C2 is mechanical:
//
//   Vuex:   mapActions('authentication', ['loginAction'])
//           this.loginAction(payload)
//   Pinia:  const auth = useAuthStore()
//           auth.loginAction(payload)
//
// Persistence note: `token` and `refreshToken` are already persisted by
// `tokenStorage` in localStorage, and `state()` reads them back on load.
// We therefore do NOT double-persist with the Pinia persist plugin.

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
    // Name-parity with Vuex `getters.user` / `getters.token` / `getters.navbarSearch`.
    // State field names already match, so these getters are thin aliases for
    // call sites that used `mapGetters('authentication', ['user', 'token'])`.
    userGetter: (state) => state.user,
    tokenGetter: (state) => state.token,
    navbarSearchGetter: (state) => state.navbarSearch
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    updateUser (user) {
      userProfileStorage.setUser(user)
      this.user = user
    },
    updateToken (token) { this.token = token },
    updateRefreshToken (refreshToken) { this.refreshToken = refreshToken },
    updateNavebarSearcgDialog (value) { this.navbarSearch = value },
    deleteData () {
      this.user = null
      this.token = null
      this.refreshToken = null
    },
    UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM (data) {
      this.user = data
      userProfileStorage.setUser(data)
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION (data) {
      this.UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM(data)
    },

    setNavbarSearchAction (value) {
      this.updateNavebarSearcgDialog(value)
    },

    SET_USER_DATA_ACTION (value) {
      this.updateUser(value)
    },

    async GET_MY_PROFILE_DATA_ACTION () {
      const res = await apolloClient.query({ query: GetMyProfileData })
      this.updateUser(_.get(res, '[data][me]'))
      return res
    },

    loginAction (payload) {
      // Clear any stale token before writing the new one so the auth link
      // doesn't race a half-logged-in state on the next Apollo op.
      tokenStorage.clearToken()
      userProfileStorage.clearUserProfileStorage()

      const user = payload.user || (payload.social ? payload.social.user : '')
      const token = payload.token
      const refresh = payload.refreshToken || ''

      tokenStorage.setToken({ token, refresh })
      this.updateUser(user)
      this.updateToken(token)
      this.updateRefreshToken(refresh)

      // Preserve the Promise-returning signature so existing
      // `.loginAction(...).then(...)` call sites keep working.
      return Promise.resolve()
    },

    async RE_LOGIN_USER () {
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
          this.updateToken(data.data.refreshToken.token)
          this.updateRefreshToken(data.data.refreshToken.refreshToken)
          return true
        }
        return false
      } catch (_) {
        return false
      }
    },

    DESTROY_THE_USER_REFRESH_TOKEN () {
      return apolloClient.mutate({
        mutation: RevokeUserRefreshToken,
        variables: { refreshToken: tokenStorage.getRefreshToken() }
      })
    },

    logOutAction () {
      return new Promise((resolve) => {
        tokenStorage.clearToken()
        userProfileStorage.clearUserProfileStorage()
        SessionStorage.set('shoppingCartList', [])
        this.deleteData()
        Notify.create({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'Logged Out Successfully'
        })
        resolve()
      })
    },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    // C1 and C2 adopted the idiomatic Pinia convention of dropping the `*Action`
    // suffix when they rewrote their mapActions() calls. These aliases preserve
    // both call styles so neither agent's work has to be revisited.
    login (payload) { return this.loginAction(payload) },
    logOut () { return this.logOutAction() },
    setUser (value) { return this.SET_USER_DATA_ACTION(value) },
    setUserAfterJoinPyramid (data) { return this.SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION(data) },
    async getMyProfileData () { return this.GET_MY_PROFILE_DATA_ACTION() },
    setNavbarSearch (value) { return this.setNavbarSearchAction(value) }
  },

  persist: false
})
