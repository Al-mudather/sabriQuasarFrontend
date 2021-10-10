import {apolloClient} from 'src/apollo/client.js'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

const state = {
  myMarketingCode: localStorage.getItem('myMarketingCode') ||  '',
  registerationCode: localStorage.getItem('registerationCode') ||  ''
}

const mutations = {

  UPDATE_MY_MARKETING_CODE_MUTATION (state, value) {
    localStorage.setItem('myMarketingCode', value)
    state.myMarketingCode = value
    console.log('llllllllllllllllll')
    console.log('myMarketing code: ', value)
    console.log('llllllllllllllllll')
  },

  UPDATE_REGISTERATION_CODE_MUTATION (state, value) {
    localStorage.setItem('registerationCode', value)
    state.registerationCode = value
    console.log('llllllllllllllllll')
    console.log('Registration code: ', value)
    console.log('llllllllllllllllll')
  }

}

const actions = {
  SET_MY_MARKETING_CODE_ACCOUNT_ACTION ({ commit }, value) {
    commit('UPDATE_MY_MARKETING_CODE_MUTATION', value)
  },

  SET_REGISTERATION_CODE_ACTION ({ commit }, value) {
    commit('UPDATE_REGISTERATION_CODE_MUTATION', value)
  },


  GET_MY_MARKETING_CODE_ACCOUNT_ACTION ({ commit }, value) {
    return apolloClient.query({
      query: MyPyramidAccount
    }).then( (res) => {
      if (res.data.myPyramidAccount) {
        commit('UPDATE_MY_MARKETING_CODE_MUTATION', res.data.myPyramidAccount.pyramidCode)
        return res.data.myPyramidAccount.pyramidCode
      } else {
        commit('UPDATE_MY_MARKETING_CODE_MUTATION', '')
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
