const state = {
  enrollmentId: ''
}

const mutations = {
  updateEnrollmentId (state, value) {
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
