const state = {
  enrollmentId: ''
}

const mutations = {
  updateEnrollmentId (state, value) {
    console.log('llllllllllllllllllllll')
    console.log(value)
    console.log('llllllllllllllllllllll')
    state.enrollmentId = value
  },
}

const actions = {

  setUpdateEnrollmentIdAction ({ commit }, value) {
    commit('updateEnrollmentId', value)
  },
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
