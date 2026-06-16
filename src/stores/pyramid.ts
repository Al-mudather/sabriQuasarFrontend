// Pinia equivalent of the legacy Vuex `pyramid_management` module.
// Action names preserved 1:1 with the Vuex version so migration is mechanical.
//
// No Pinia persist plugin — the store writes directly to localStorage in the
// action bodies (matching the Vuex behavior) and reads the keys in `state()`.

import { defineStore } from 'pinia'
import { apolloClient } from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import { CheckTheUserPermissionToUsePlatforme } from 'src/graphql/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'

import type { MyPyramidAccountResult, PyramidAccount } from 'src/types/pyramid/types'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface PyramidStoreState {
  /** Caller's affiliate/referral code, mirrored to localStorage. */
  myMarketingCode: string
  /** Referral code the caller used when registering (upline), mirrored to localStorage. */
  registerationCode: string
  /**
   * Whether the current user is linked to a PyramidAffiliate (has entered a
   * registration code and may use the platform). `null` = not yet checked this
   * session; `true`/`false` = cached verdict so the router guard reads it
   * cheaply. Reset to `null` on logout (useLogout → $reset) and login.
   */
  hasPlatformAccess: boolean | null
}

export const usePyramidStore = defineStore('pyramidManagement', {
  state: (): PyramidStoreState => ({
    myMarketingCode: localStorage.getItem('myMarketingCode') || '',
    registerationCode: localStorage.getItem('registerationCode') || '',
    hasPlatformAccess: null,
  }),

  getters: {
    // Kept for parity with the Vuex `getters.myPyramidAccount`. The original
    // getter pointed at a non-existent `state.myPyramidAccount` and therefore
    // always returned `undefined`; we preserve that behavior to avoid
    // surprising any consumer that relied on the always-undefined read.
    myPyramidAccount: (): PyramidAccount | undefined => undefined,
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    UPDATE_MY_MARKETING_CODE_MUTATION (value: string): void {
      localStorage.setItem('myMarketingCode', value)
      this.myMarketingCode = value
    },
    UPDATE_REGISTERATION_CODE_MUTATION (value: string): void {
      localStorage.setItem('registerationCode', value)
      this.registerationCode = value
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_MY_MARKETING_CODE_ACCOUNT_ACTION (value: string): void {
      this.UPDATE_MY_MARKETING_CODE_MUTATION(value)
    },
    SET_REGISTERATION_CODE_ACTION (value: string): void {
      this.UPDATE_REGISTERATION_CODE_MUTATION(value)
    },

    /**
     * Fetch the caller's pyramid account and mirror its `pyramidCode` into
     * local state + localStorage.
     */
    async GET_MY_MARKETING_CODE_ACCOUNT_ACTION (): Promise<string | undefined> {
      try {
        const res = await apolloClient.query<MyPyramidAccountResult>({ query: MyPyramidAccount })
        if (res.data.myPyramidAccount) {
          const code = res.data.myPyramidAccount.pyramidCode ?? ''
          this.UPDATE_MY_MARKETING_CODE_MUTATION(code)
          return code || undefined
        }
        this.UPDATE_MY_MARKETING_CODE_MUTATION('')
      } catch (_) {
        this.UPDATE_MY_MARKETING_CODE_MUTATION('')
      }
      return undefined
    },

    // ---- Registration-code (PyramidAffiliate) gate --------------------------
    /**
     * Verify (and cache) whether the current user may use the platform, i.e. is
     * linked to a PyramidAffiliate. `CheckPyramidAffiliate` succeeds when the
     * link exists and throws `PyramidAffiliate matching query does not exist`
     * when it doesn't. Network-only so a stale Apollo cache entry can't mask a
     * revoked/absent affiliate (the old inline checks used cache-first and
     * leaked). Caches the verdict in `hasPlatformAccess`.
     *
     * Fail-open on transient/unknown errors (network down, unexpected shape) so
     * a blip never traps a legitimate user — the backend still enforces the
     * constraint server-side at order/payment time.
     */
    async verifyPlatformAccess (force = false): Promise<boolean> {
      if (!force && this.hasPlatformAccess !== null) return this.hasPlatformAccess
      try {
        const res = await apolloClient.query<{ checkPyramidAffiliate: unknown }>({
          query: CheckTheUserPermissionToUsePlatforme,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        })
        // The Apollo client default is `errorPolicy: 'all'`, so a GraphQL error
        // does NOT throw — it arrives in `res.errors` with `res.data` possibly
        // null. The very first authenticated request right after login can fail
        // transiently; reading that as "no code" (`data.checkPyramidAffiliate`
        // being null/undefined → false) wrongly bounced a legitimate user to the
        // registration-code page. So: any errors → FAIL OPEN and do NOT cache a
        // verdict (re-check on the next navigation).
        if (res.errors && res.errors.length) return true
        // Clean response: the backend returns SUCCESS with
        // `checkPyramidAffiliate: null` when the user has NO registration code.
        // A non-null object means they're linked to a PyramidAffiliate.
        this.hasPlatformAccess = res.data?.checkPyramidAffiliate != null
      } catch (_e: unknown) {
        // Network/unknown throw → fail OPEN so a transient blip can't lock a
        // legitimate user out of the whole app (the backend still enforces the
        // gate server-side at order/payment time). Do not cache a hard verdict.
        return true
      }
      return this.hasPlatformAccess
    },

    /** Call after a successful JoinPlatform — the user now has access. */
    markPlatformAccessGranted (): void {
      this.hasPlatformAccess = true
    },

    /** Force a re-check on next read (e.g. after login / account switch). */
    resetPlatformAccess (): void {
      this.hasPlatformAccess = null
    },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setMyMarketingCode (v: string): void { return this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(v) },
    setRegisterationCode (v: string): void { return this.SET_REGISTERATION_CODE_ACTION(v) },
    async fetchMyMarketingCode (): Promise<string | undefined> { return this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION() },
  },
})
