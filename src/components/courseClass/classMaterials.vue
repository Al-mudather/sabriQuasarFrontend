<template>
    <div class="download">
        <div class="row justify-center">
            <div
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
            </div>
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

export default {

  data () {
    return {
      lodash: _
    }
  },
  props: ['course'],

  mounted () {
    console.log('GGGGGGGGGGGGGGGG')
    console.log(this.course.courseunitSet.edges[0])
    console.log('GGGGGGGGGGGGGGGG')
  }
}
</script>

<style></style>
