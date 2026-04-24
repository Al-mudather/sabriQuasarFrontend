// Pinia equivalent of the legacy Vuex `pyramid_management` module.
// Action names preserved 1:1 with the Vuex version so migration is mechanical.
//
// No Pinia persist plugin — the store writes directly to localStorage in the
// action bodies (matching the Vuex behavior) and reads the keys in `state()`.

import { defineStore } from 'pinia'
import { apolloClient } from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'

/** @typedef {import('src/types/pyramid/types').MyPyramidAccountResult} MyPyramidAccountResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidAccountVars} MyPyramidAccountVars */
/** @typedef {import('src/types/pyramid/types').PyramidAccount} PyramidAccount */

/**
 * @typedef {Object} PyramidStoreState
 * @property {string} myMarketingCode   Caller's affiliate/referral code, mirrored to localStorage.
 * @property {string} registerationCode Referral code the caller used when registering (upline), mirrored to localStorage.
 */

export const usePyramidStore = defineStore('pyramidManagement', {
  /** @returns {PyramidStoreState} */
  state: () => ({
    myMarketingCode: localStorage.getItem('myMarketingCode') || '',
    registerationCode: localStorage.getItem('registerationCode') || ''
  }),

  getters: {
    // Kept for parity with the Vuex `getters.myPyramidAccount`. The original
    // getter pointed at a non-existent `state.myPyramidAccount` and therefore
    // always returned `undefined`; we preserve that behavior to avoid
    // surprising any consumer that relied on the always-undefined read.
    myPyramidAccount: () => undefined
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    /** @param {string} value */
    UPDATE_MY_MARKETING_CODE_MUTATION (value) {
      localStorage.setItem('myMarketingCode', value)
      this.myMarketingCode = value
    },
    /** @param {string} value */
    UPDATE_REGISTERATION_CODE_MUTATION (value) {
      localStorage.setItem('registerationCode', value)
      this.registerationCode = value
    },

    // ---- Vuex actions, names preserved --------------------------------------
    /** @param {string} value */
    SET_MY_MARKETING_CODE_ACCOUNT_ACTION (value) {
      this.UPDATE_MY_MARKETING_CODE_MUTATION(value)
    },
    /** @param {string} value */
    SET_REGISTERATION_CODE_ACTION (value) {
      this.UPDATE_REGISTERATION_CODE_MUTATION(value)
    },

    /**
     * Fetch the caller's pyramid account and mirror its `pyramidCode` into
     * local state + localStorage.
     * @returns {Promise<string | undefined>}
     */
    async GET_MY_MARKETING_CODE_ACCOUNT_ACTION () {
      try {
        /** @type {import('@apollo/client/core').ApolloQueryResult<MyPyramidAccountResult>} */
        const res = await apolloClient.query({ query: MyPyramidAccount })
        if (res.data.myPyramidAccount) {
          this.UPDATE_MY_MARKETING_CODE_MUTATION(res.data.myPyramidAccount.pyramidCode)
          return res.data.myPyramidAccount.pyramidCode
        }
        this.UPDATE_MY_MARKETING_CODE_MUTATION('')
      } catch (_) {
        this.UPDATE_MY_MARKETING_CODE_MUTATION('')
      }
    },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    /** @param {string} v */
    setMyMarketingCode (v) { return this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(v) },
    /** @param {string} v */
    setRegisterationCode (v) { return this.SET_REGISTERATION_CODE_ACTION(v) },
    async fetchMyMarketingCode () { return this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION() }
  }
})
