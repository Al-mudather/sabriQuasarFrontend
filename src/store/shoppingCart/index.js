const state = {
  shoppinCartDialog: false
}

const mutations = {
  updateShoppinCartDialog (state, value) {
    state.shoppinCartDialog = value
  }
}

const actions = {

  setShoppinCartDialogAction ({ commit }, value) {
    console.log('ggggggggggggggg')
    console.log(value)
    console.log('ggggggggggggggg')
    commit('updateShoppinCartDialog', value)
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
