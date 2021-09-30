<template>
  <div>
    <div v-if="!lodash.isEmpty(lodash.get(allCourseUnitContentsByCourseContentFile,'[edges]'))" class="download">
        <div class="row justify-center">
            <div
                class="col-lg-3 col-xs-12"
                v-for="file in lodash.get(allCourseUnitContentsByCourseContentFile,'[edges]')"
                :key="file.node.id"
            >
                <div v-if="formatTitle(file.node.modelValue)" class="down">
                    <h3>{{ formatTitle(file.node.modelValue) }}</h3>
                    <button
                        @click="
                            downloadFile(JSON.parse(lodash.get(file.node,'[modelValue]')).attachment)
                        "
                    >
                        <div class="immag">
                            <img src="~assets/img/download.png" alt="" />
                        </div>
                        {{  formatFileSize(file.node.modelValue).toFixed(2) }} MB
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="notice">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="imageees">
                        <img src="~assets/img/noText.png" alt="">
                        <h3>There is no, text matterial here yeat</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { AllCourseUnitContentsByCourseContentFile } from 'src/queries/course_management/query/GetAllCourseUnitContentsByCourseContentFile'
import { mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
  data () {
    return {
      lodash: _,
      courseFiles: []
    }
  },
  props: ['course'],

  apollo: {
      allCourseUnitContentsByCourseContentFile: {
          query() {
              return AllCourseUnitContentsByCourseContentFile;
          },

          variables() {
              return {
                  courseId: this.course.pk
              };
          }
      }
  },

  beforeDestroy () {
    // TODO: reset the file course array so it will not be repeated when the content is been loaded again
    this.setDeleteCourseFilesArrayAction('')
  },

  methods: {
    ...mapActions('courseManagement', [
      'setDeleteCourseFilesArrayAction',
    ]),
 
    downloadFile (fileURL) {
      openURL(location.origin + fileURL)
    },

    formatTitle (file) {
      try {
        const title = JSON.parse(file).attachment
        return title.split('/attachment/')[1]

      } catch {
        return null
      }
    },

    formatFileSize (file) {
      return parseFloat(JSON.parse(file).fileSize)
    }
  }
}
</script>

<style></style>
