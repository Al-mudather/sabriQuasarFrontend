import {apolloClient} from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

const state = {
  myMarketingCode: localStorage.getItem('myMarketingCode') ||  null
}

const mutations = {

  UPDATE_MY_MARKETING_CODE_MUTATION (state, value) {
    localStorage.setItem('myMarketingCode', value)
    state.myMarketingCode = value
  }

}

const actions = {
  SET_MY_MARKETING_CODE_ACCOUNT_ACTION ({ commit }, value) {
    commit('UPDATE_MY_MARKETING_CODE_MUTATION', value)
  },


  GET_MY_MARKETING_CODE_ACCOUNT_ACTION ({ commit }, value) {
    return apolloClient.query({
      query: MyPyramidAccount
    }).then( (res) => {
      if (res.data.myPyramidAccount) {
        commit('UPDATE_MY_MARKETING_CODE_MUTATION', res.data.myPyramidAccount.pyramidCode)
        return res.data.myPyramidAccount.pyramidCode
      } else {
        commit('UPDATE_MY_MARKETING_CODE_MUTATION', null)
      }
      } 
    ).catch( (error) => {
      throw Error(error)
    })
  }
}

const getters = {
  myPyramidAccount:  state => state.myPyramidAccount
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
