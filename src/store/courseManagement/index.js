
import {apolloClient} from 'src/apollo/client.js'

import { EndLearningUnit } from 'src/queries/learning_management/mutation/EndLearningUnit';
import { StartLearningUnit } from 'src/queries/learning_management/mutation/StartLearningUnit';
import { GetAllLearningProgressByCourse } from 'src/queries/learning_management/query/GetAllLearningProgressByCourse';

import _ from 'lodash';

const state = {
  dataCreated: true,
  startLearningTrackingID: null,
  fileData: null,
  selectedClassUnitContent: {},
  currentContent: {},
  contentLists: [],
  courseFiles: []
}

const mutations = {
  SET_FILE_DATA_MUTATION (state, value) {
    state.fileData = value
  },

  SET_START_LEARNING_TRACKING_ID_MUTATION (state, value) {
    state.startLearningTrackingID = value
  },

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

  START_LEARNING_UNIT_TRAKING_ACTION ({ commit }, progressData) {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
            mutation: StartLearningUnit,
            variables: {
              progressData: progressData
            }
        }).then(startTrackingResult => {
          const success = _.get(startTrackingResult,'[data][startLearningUnit][success]')
          const errors = _.get(startTrackingResult,'[data][startLearningUnit][errors]')
            if (success) {
              resolve( _.get(
                startTrackingResult,
                '[data][startLearningUnit][learning][pk]'
                )
              )
            }
            if (errors)
            {
              reject (errors)
            }
        })
    })
  },

  END_LEARNING_UNIT_TRAKING_ACTION ({ commit }, ending_data) {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
          mutation: EndLearningUnit,
          variables: {
            progressData: ending_data.progressData,
            progressId: ending_data.progressId
          }, 
          refetchQueries: [
              {
                  query: GetAllLearningProgressByCourse,
                  variables: {
                      enrollmentId: ending_data.progressData.enrollmentId,
                      courseId: ending_data.progressData.courseId
                  }
              }
          ]
        }).then(endTrackingResult => {
          const success = _.get(endTrackingResult,'[data][endLearningUnit][success]')
          const errors = _.get(endTrackingResult,'[data][endLearningUnit][errors]')
            if (success) {
              resolve(success)
            }
            if (errors)
            {
              reject (errors)
            }
        })
    })
  },

  SET_FILE_DATA_ACTION ({ commit }, value) {
    commit('SET_FILE_DATA_MUTATION', value)
  },

  SET_START_LEARNING_TRACKING_ID_ACTION ({ commit }, value) {
    commit('SET_START_LEARNING_TRACKING_ID_MUTATION', value)
  },

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
