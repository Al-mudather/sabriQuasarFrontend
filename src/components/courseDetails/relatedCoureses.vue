<template>
    <div class="rate">
        <div class="row justify-center">
            <div
                v-if="!allCourses.edges"
            >
                <skeletonCard class="col-lg-3 col-md-6 col-sm-6 col-xs-12" v-for="sk in 4" :key="sk"/>
            </div>
            <div
                v-for="course in allCourses.edges"
                :key="course.node.id"
                class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
            >
                <relatedCourseCard
                    :name="course.node.title"
                    :instructor="course.node.courseinstructorSet"
                    :course="course.node"
                    :price="course.node.courseFee"
                    unit="SD"
                />

            </div>
        </div>
    </div>
</template>

<script>
import relatedCourseCard from 'src/components/utils/relatedCourseCard'
// import skeletonCard from 'src/components/skeleton/skeletonCard'
import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses'

export default {
  data () {
    return {
      allCourses: []
    }
  },
  props: ['courseData'],
  components: {
    relatedCourseCard
    // skeletonCard
  },
  watch: {
    courseData (data) {
      this.$apollo
        .query({
          query: GetAllCourses,
          variables: {
            courseSpeciality: data.courseSpeciality.id,
            execludeIds: [this.courseData.pk], // TODO: Give me all courses except this one
            first: 4
          }

        })
        .then(res => {
          this.allCourses = res.data.allCourses
        })
    }
  }
}
</script>

<style></style>
