const state = {
  selectedClassUnitContent: {},
  currentContent: {},
  contentLists: [],
  courseFiles: []
}

const mutations = {
  updateCourseFiles (state, value) {
    state.courseFiles.push(value)
  },

  updateSelectedClassUnitContent (state, value) {
    state.selectedClassUnitContent = value
  },

  updateCurrentContent (state, value) {
    state.currentContent = value
  },

  updateContentLists (state, value) {
    state.contentLists.push(value)
  }
}

const actions = {

  setSelectedClassUnitContentAction ({ commit }, value) {
    commit('updateSelectedClassUnitContent', value)
  },

  setCourseFilesAction ({ commit }, value) {
    commit('updateCourseFiles', value)
  },

  setCurrentContentAction ({ commit }, value) {
    commit('updateCurrentContent', value)
  },

  setContentListsAction ({ commit }, value) {
    commit('updateContentLists', value)
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
