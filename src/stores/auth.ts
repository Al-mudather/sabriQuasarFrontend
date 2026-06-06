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
import { Notify } from 'quasar'

import { apolloClient, resetApolloSession } from 'src/apollo/client'
import { tokenStorage, userProfileStorage, purgeClientStorage } from 'src/localStorageService'
import { RefreshLoginUserWithEmail } from 'src/graphql/account_management/mutation/RefreshUserToken'
import { RevokeUserRefreshToken } from 'src/graphql/account_management/mutation/RevokeUserRefreshToken.js'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData.js'

import type {
  AuthSessionUser,
  LoginResult,
  SocialAuthResult,
} from 'src/types/auth/types'

// Load the pinia-plugin-persistedstate module augmentation so `persist: false`
// is accepted as a valid option on DefineStoreOptions.
import 'pinia-plugin-persistedstate'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface AuthState {
  navbarSearch: boolean
  user: AuthSessionUser | null
  token: string | null
  refreshToken: string | null
}

// ---------------------------------------------------------------------------
// Payload type for loginAction — covers email login, social auth, and any
// legacy shape callers may pass (refresh token field names vary by flow).
// ---------------------------------------------------------------------------
type LoginPayload =
  | (LoginResult & { social?: { user: AuthSessionUser } })
  | (SocialAuthResult & { token: string; refreshToken?: string; user?: AuthSessionUser })
  | { token: string; refresh?: string; refreshToken?: string; user?: AuthSessionUser; social?: { user: AuthSessionUser } }

export const useAuthStore = defineStore('authentication', {
  state: (): AuthState => ({
    navbarSearch: true,
    user: userProfileStorage.getUser() || null,
    token: tokenStorage.getAccessToken() || null,
    refreshToken: tokenStorage.getRefreshToken() || null,
  }),

  getters: {
    // Name-parity with Vuex `getters.user` / `getters.token` / `getters.navbarSearch`.
    // State field names already match, so these getters are thin aliases for
    // call sites that used `mapGetters('authentication', ['user', 'token'])`.
    userGetter: (state): AuthSessionUser | null => state.user,
    tokenGetter: (state): string | null => state.token,
    navbarSearchGetter: (state): boolean => state.navbarSearch,
    // Single source of truth for "is the user logged in?". Components must
    // consult this before any action that relies on session identity
    // (add to cart, enrol, open classroom, view profile, etc.).
    isAuthenticated: (state): boolean => !!(state.token && state.user),
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    updateUser (user: AuthSessionUser): void {
      userProfileStorage.setUser(user)
      this.user = user
    },
    updateToken (token: string | null): void { this.token = token },
    updateRefreshToken (refreshToken: string | null): void { this.refreshToken = refreshToken },
    updateNavebarSearcgDialog (value: boolean): void { this.navbarSearch = value },
    deleteData (): void {
      this.user = null
      this.token = null
      this.refreshToken = null
    },
    UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM (data: AuthSessionUser): void {
      this.user = data
      userProfileStorage.setUser(data)
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION (data: AuthSessionUser): void {
      this.UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM(data)
    },

    setNavbarSearchAction (value: boolean): void {
      this.updateNavebarSearcgDialog(value)
    },

    SET_USER_DATA_ACTION (value: AuthSessionUser): void {
      this.updateUser(value)
    },

    async GET_MY_PROFILE_DATA_ACTION (): Promise<unknown> {
      const res = await apolloClient.query({ query: GetMyProfileData })
      this.updateUser(_.get(res, '[data][me]') as AuthSessionUser)
      return res
    },

    loginAction (payload: LoginPayload): Promise<void> {
      // Clear any stale token before writing the new one so the auth link
      // doesn't race a half-logged-in state on the next Apollo op.
      tokenStorage.clearToken()
      userProfileStorage.clearUserProfileStorage()

      const p = payload as Record<string, unknown>
      const user = (p['user'] || (p['social'] ? (p['social'] as Record<string, unknown>)['user'] : '')) as AuthSessionUser
      const token = p['token'] as string
      const refresh = (p['refreshToken'] as string | undefined) || ''

      tokenStorage.setToken({ token, refresh })
      this.updateUser(user)
      this.updateToken(token)
      this.updateRefreshToken(refresh)

      // Preserve the Promise-returning signature so existing
      // `.loginAction(...).then(...)` call sites keep working.
      return Promise.resolve()
    },

    async RE_LOGIN_USER (): Promise<boolean> {
      if (!tokenStorage.getRefreshToken()) return true
      try {
        const data = await apolloClient.mutate({
          mutation: RefreshLoginUserWithEmail,
          variables: { refreshToken: tokenStorage.getRefreshToken() },
        })
        const rt = (data.data as Record<string, Record<string, unknown>>)['refreshToken']
        if (rt && rt['success']) {
          tokenStorage.setToken({
            token: rt['token'] as string,
            refresh: rt['refreshToken'] as string,
          })
          this.updateToken(rt['token'] as string)
          this.updateRefreshToken(rt['refreshToken'] as string)
          return true
        }
        return false
      } catch (_) {
        return false
      }
    },

    DESTROY_THE_USER_REFRESH_TOKEN (): Promise<unknown> {
      return apolloClient.mutate({
        mutation: RevokeUserRefreshToken,
        variables: { refreshToken: tokenStorage.getRefreshToken() },
      })
    },

    // The single, complete "fresh session" logout. Every step is wrapped so a
    // failure in one (e.g. a slow backend revoke) can never block the rest of
    // the wipe. Order matters: revoke must run BEFORE tokens are wiped (it
    // needs the refresh token) and before the Apollo cache is cleared.
    async logOutAction (): Promise<void> {
      // 1. Best-effort server-side revoke — time-boxed so a slow/failed call
      //    never holds up logout. Fire only if we actually have a refresh token.
      if (tokenStorage.getRefreshToken()) {
        try {
          await Promise.race([
            this.DESTROY_THE_USER_REFRESH_TOKEN(),
            new Promise((resolve) => setTimeout(resolve, 2500)),
          ])
        } catch (_e) { /* ignore — logout proceeds regardless */ }
      }

      // 2. Tear down Apollo: clear cache (no refetch), stop queries, drop the
      //    subscription socket so nothing of the old user survives.
      try {
        await resetApolloSession()
      } catch (_e) { /* ignore */ }

      // 3. Wipe all client storage + cookies, keeping only language/currency
      //    display prefs so the UI doesn't flip language on logout.
      purgeClientStorage({ keepLocalStorageKeys: ['isEnglish', 'pinia_settings'] })

      // 4. Reset in-memory auth state.
      this.deleteData()

      Notify.create({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'top',
        message: 'Logged Out Successfully',
      })
    },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    // C1 and C2 adopted the idiomatic Pinia convention of dropping the `*Action`
    // suffix when they rewrote their mapActions() calls. These aliases preserve
    // both call styles so neither agent's work has to be revisited.
    login (payload: LoginPayload): Promise<void> { return this.loginAction(payload) },
    logOut (): Promise<void> { return this.logOutAction() },
    setUser (value: AuthSessionUser): void { return this.SET_USER_DATA_ACTION(value) },
    setUserAfterJoinPyramid (data: AuthSessionUser): void { return this.SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION(data) },
    async getMyProfileData (): Promise<unknown> { return this.GET_MY_PROFILE_DATA_ACTION() },
    setNavbarSearch (value: boolean): void { return this.setNavbarSearchAction(value) },
  },

  persist: false,
})
