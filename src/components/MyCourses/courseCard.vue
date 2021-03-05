<template>
    <div class="card">
        <div class="card-img-top">
            <div class="overlay"></div>
            <img src="~assets/img/imagback.png" alt="Card image cap" />
        </div>
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
        <div class="card-body" style="cursor: pointer" @click="goToCourseLecture">
            <h5 class="card-title">{{course.title}}</h5>
            <a class="btn">
                <h3>{{$t('اذهب الى الدرس')}}</h3>
                <img src="~assets/img/send.png" alt="">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseCard",

    data () {
        return {
        }
    },

    props: ['course', 'totalFinishedCourseContents'],

    computed: {
        calculateTheTotalProgress () {
            let totalCourseContents = 0

            this.course.courseunitSet.edges.map(unit => {
                totalCourseContents += unit.node.courseunitcontentSet.totalCount
            })
            if (totalCourseContents > 0) {
                return parseInt( (this.totalFinishedCourseContents / totalCourseContents ) * 100 )
            }
            return 0
        }
    },

    methods: {
        goToCourseLecture () {
            this.$router.push({ name: 'course-class', params: { pk: this.course.pk, id: this.course.id }, query:{ tab: 'tutorial' } })
        }
    }
};
</script>
<style lang="scss">
</style>
