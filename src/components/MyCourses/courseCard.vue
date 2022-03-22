<template>
    <div class="card">
        <!-- <a :href="GO_TO_THE_COURSE_CLASS_ROOM" class="card-img-top" style="cursor: pointer; text-decoration: none;"> -->
        <div class="card-img-top">
            <div class="overlay"></div>
                <!-- <img v-if="course.cover" :src="CALCULATE_IMAGE_URL" alt=""> -->
                <img v-if="course.cover" :src="FORMAT_THE_IAMGE_URL(course.cover)" alt="">
                <img v-else src="~assets/img/imagback.png" alt="Card image cap" />
        </div>
            <!-- </a> -->
        <div class="pro">
            <span>{{calculateTheTotalProgress}}%</span>
            <div class="progress">
                <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: calculateTheTotalProgress + '%' }"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
        <!-- <div class="card-body" style="cursor: pointer" @click="goToCourseLecture"> -->
        <a :href="GO_TO_THE_COURSE_CLASS_ROOM" class="card-body" style="cursor: pointer; text-decoration: none;">
            <h5 class="card-title">{{course.title}}</h5>
            <a class="btn">
                <h3>{{$t('اذهب الى الدرس')}}</h3>
                <img src="~assets/img/send.png" alt="">
            </a>
        <!-- </div> -->
        </a>
    </div>
</template>
   
<script>
import {mapGetters} from 'vuex'
import {FORMAT_THE_IAMGE_URL} from 'src/utils/functions.js'

export default {
    name: "CourseCard",

    data () {
        return {
            FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL
        }
    },

    props: ['course', 'totalFinishedCourseContents'],

    computed: {
        ...mapGetters("authentication", ["token"]),

        calculateTheTotalProgress () {
            let totalCourseContents = 0

            this.course.courseunitSet.edges.map(unit => {
                totalCourseContents += unit.node.courseunitcontentSet.totalCount
            })
            if (totalCourseContents > 0) {
                return parseInt( (this.totalFinishedCourseContents / totalCourseContents ) * 100 )
            }
            return 0
        },

        CALCULATE_IMAGE_URL () {
            if (process.env.NODE_ENV == 'development') {
                return 'http://localhost:8000/media/' + this.course.cover
            }
            // return location.origin + '/media/' + this.course.cover
            return 'https://api.stc.training' + '/media/' + this.course.cover
        },

        GO_TO_THE_COURSE_CLASS_ROOM () {
        
            // return `http://localhost:8082/#/class/${this.course.pk}/`
            return `${location.origin}/classroom/#/class/${this.course.pk}/`
        }
    },

    methods: {
        goToCourseLecture () {
            this.$router.push({ name: 'course-class', params: { pk: this.course.pk, id: this.course.id }, query:{ tab: 'tutorial' } })
        },

        
    }
};
</script>
<style lang="scss">
</style>
