<template>
    <div class="download">
        <!-- {{courseFiles} -->
        <!-- {{JSON.parse(courseFiles.modelValue)}} -->
        <div class="row justify-center">
            <div
                class="col-lg-3 col-xs-12"
                v-for="file in courseFiles"
                :key="file.id"
            >
                <div class="down">
                    <h3>{{ JSON.parse(file.modelValue).attachment }}</h3>
                    <button
                        ref="download"
                        @click="
                            downloadFile(JSON.parse(file.modelValue).attachment)
                        "
                    >
                        <a :data-file="JSON.parse(file.modelValue).attachment">
                            <div class="immag">
                                <img src="~assets/img/download.png" alt="" />
                            </div>
                            3.1MB
                        </a>
                    </button>
                </div>
            </div>
            <!-- <div
                class="col-lg-3 col-xs-12"
                v-for="unit in course.courseunitSet.edges"
                :key="unit.node.id"
            >
                <div class="down">
                    <h3>{{unit}}</h3>
                    <button>
                        <div class="immag">
                            <img src="~assets/img/download.png" alt="" />
                        </div>
                        3.1MB
                    </button>
                </div>
            </div> -->
            <!-- <div class="col-lg-3 col-xs-12">
                <div class="down">
                    <h3>ملخص علم الاعصاب الوحدة الاولي</h3>
                    <button>
                        <div class="immag">
                            <img src="~assets/img/download.png" alt="" />
                        </div>
                        3.1MB
                    </button>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
// import { exportFile } from 'quasar'

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

  mounted () {
    console.log('GGGGGGGGGGGGGGGG')
    console.log(this.course.courseunitSet.edges[0])
    console.log('GGGGGGGGGGGGGGGG')
  },

  methods: {
    downloadFile (fileURL) {
      //   console.log('FFFFFFFFF')
      //   console.log(e.target)
      //   console.log('FFFFFFFFF')
      //   const blob = new Blob([fileURL], { type: 'application/pdf' })
      //   const link = this.$refs.download
      //   link.href = URL.createObjectURL(blob)
      //   link.download = 'http://localhost:8000/' + fileURL

      window.open('http://localhost:8000' + fileURL)
      //   const status = exportFile(
      //     'file.pdf',
      //     'Some important content'
      //   )

      //   if (status === true) {
      //     // browser allowed it
      //   } else {
      //     // browser denied it
      //     console.log('Error: ' + status)
      //   }
    }
  }
}
</script>

<style></style>
