// Pinia equivalent of the legacy Vuex `pyramid_management` module.
// Action names preserved 1:1 with the Vuex version so migration is mechanical.
//
// No Pinia persist plugin — the store writes directly to localStorage in the
// action bodies (matching the Vuex behavior) and reads the keys in `state()`.

import { defineStore } from 'pinia'
import { apolloClient } from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

export const usePyramidStore = defineStore('pyramidManagement', {
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
    UPDATE_MY_MARKETING_CODE_MUTATION (value) {
      localStorage.setItem('myMarketingCode', value)
      this.myMarketingCode = value
    },
    UPDATE_REGISTERATION_CODE_MUTATION (value) {
      localStorage.setItem('registerationCode', value)
      this.registerationCode = value
    },

    // ---- Vuex actions, names preserved --------------------------------------
    SET_MY_MARKETING_CODE_ACCOUNT_ACTION (value) {
      this.UPDATE_MY_MARKETING_CODE_MUTATION(value)
    },
    SET_REGISTERATION_CODE_ACTION (value) {
      this.UPDATE_REGISTERATION_CODE_MUTATION(value)
    },

    async GET_MY_MARKETING_CODE_ACCOUNT_ACTION () {
      try {
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
    setMyMarketingCode (v) { return this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(v) },
    setRegisterationCode (v) { return this.SET_REGISTERATION_CODE_ACTION(v) },
    async fetchMyMarketingCode () { return this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION() }
  }
})
