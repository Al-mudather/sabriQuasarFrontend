// Pinia shell for the `pyramid_management` module. Behavior parity with the
// Vuex version.

import { defineStore } from 'pinia'
import { apolloClient } from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

export const usePyramidStore = defineStore('pyramidManagement', {
  state: () => ({
    myMarketingCode: localStorage.getItem('myMarketingCode') || '',
    registerationCode: localStorage.getItem('registerationCode') || ''
  }),

  actions: {
    setMyMarketingCode (value) {
      localStorage.setItem('myMarketingCode', value)
      this.myMarketingCode = value
    },
    setRegisterationCode (value) {
      localStorage.setItem('registerationCode', value)
      this.registerationCode = value
    },

    async fetchMyMarketingCode () {
      try {
        const res = await apolloClient.query({ query: MyPyramidAccount })
        if (res.data.myPyramidAccount) {
          this.setMyMarketingCode(res.data.myPyramidAccount.pyramidCode)
          return res.data.myPyramidAccount.pyramidCode
        }
        this.setMyMarketingCode('')
      } catch (_) {
        this.setMyMarketingCode('')
      }
    }
  }
})
