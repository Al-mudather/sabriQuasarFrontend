const state = {
  dataCreated: true,
  selectedClassUnitContent: {},
  currentContent: {},
  contentLists: [],
  courseFiles: []
}

const mutations = {
  updateDataCreated (state, value) {
    state.dataCreated = value
  },

  deleteCourseFilesArray (state, value) {
    state.courseFiles = []
  },

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
  },

  resetContentLists (state) {
    state.contentLists = []
  }
}

const actions = {

  setDeleteCourseFilesArrayAction ({ commit }, value) {
    commit('deleteCourseFilesArray', value)
  },

  setDataCreatedAction ({ commit }, value) {
    commit('updateDataCreated', value)
  },

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
  },

  resetContentListsAction ({ commit }) {
    commit('resetContentLists')
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
