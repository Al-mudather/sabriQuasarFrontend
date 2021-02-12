<template>
    <div class="download">
        <div v-if="!lodash.isEmpty(courseFiles)" class="row justify-center">
            <div
                class="col-lg-3 col-xs-12"
                v-for="file in courseFiles"
                :key="file.id"
            >
                <div class="down">
                    <h3>{{ formatTitle(file.modelValue) }}</h3>
                    <button
                        @click="
                            downloadFile(JSON.parse(file.modelValue).attachment)
                        "
                    >
                        <div class="immag">
                            <img src="~assets/img/download.png" alt="" />
                        </div>
                        <!-- 3.1MB -->
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      lodash: _
    }
  },
  props: ['course'],

  computed: {
    ...mapState('courseManagement', ['courseFiles'])
  },

  beforeDestroy () {
    // TODO: reset the file course array so it will not be repeated when the content is been loaded again
    this.setDeleteCourseFilesArrayAction('')
  },

  methods: {
    ...mapActions('courseManagement', [
      'setDeleteCourseFilesArrayAction',
      'setSelectedClassUnitContentAction',
      'setCurrentContentAction',
      'setContentListsAction',
      'setCourseFilesAction'
    ]),

    downloadFile (fileURL) {
      window.open('http://localhost:8000' + fileURL)
    },

    formatTitle (file) {
      const title = JSON.parse(file).attachment
      return title.split('/attachment/')[1]
    }
  }
}
</script>

<style></style>
