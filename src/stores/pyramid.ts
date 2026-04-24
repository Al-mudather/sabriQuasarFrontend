// Pinia equivalent of the legacy Vuex `pyramid_management` module.
// Action names preserved 1:1 with the Vuex version so migration is mechanical.
//
// No Pinia persist plugin — the store writes directly to localStorage in the
// action bodies (matching the Vuex behavior) and reads the keys in `state()`.

import { defineStore } from 'pinia'
import { apolloClient } from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'

import type { MyPyramidAccountResult, PyramidAccount } from 'src/types/pyramid/types'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface PyramidStoreState {
  /** Caller's affiliate/referral code, mirrored to localStorage. */
  myMarketingCode: string
  /** Referral code the caller used when registering (upline), mirrored to localStorage. */
  registerationCode: string
}

export const usePyramidStore = defineStore('pyramidManagement', {
  state: (): PyramidStoreState => ({
    myMarketingCode: localStorage.getItem('myMarketingCode') || '',
    registerationCode: localStorage.getItem('registerationCode') || '',
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

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setMyMarketingCode (v: string): void { return this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(v) },
    setRegisterationCode (v: string): void { return this.SET_REGISTERATION_CODE_ACTION(v) },
    async fetchMyMarketingCode (): Promise<string | undefined> { return this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION() },
  },
})
