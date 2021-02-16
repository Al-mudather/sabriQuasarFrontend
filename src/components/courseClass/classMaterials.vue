<template>
    <div class="download">
        <div v-if="!lodash.isEmpty(allCourseUnitContentsByCourseContentFile)" class="row justify-center">
            <div
                class="col-lg-3 col-xs-12"
                v-for="file in lodash.get(allCourseUnitContentsByCourseContentFile,'[edges]')"
                :key="file.node.id"
            >
                <div class="down">
                    <h3>{{ formatTitle(file.node.modelValue) }}</h3>
                    <button
                        @click="
                            downloadFile(JSON.parse(lodash(file.node,'[modelValue]')).attachment)
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
</template>

<script>
import _ from 'lodash'
import { AllCourseUnitContentsByCourseContentFile } from 'src/queries/course_management/query/GetAllCourseUnitContentsByCourseContentFile'
import { mapState, mapActions } from 'vuex'
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
      openURL('http://localhost:8000' + fileURL)
    },

    formatTitle (file) {
      const title = JSON.parse(file).attachment
      return title.split('/attachment/')[1]
    },

    formatFileSize (file) {
      return parseFloat(JSON.parse(file).fileSize)
    }
  }
}
</script>

<style></style>
