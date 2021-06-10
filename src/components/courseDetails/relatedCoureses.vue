<template>
  <div class="rate">
    <ApolloQuery
      :query="GetAllCourses"
      :variables="{
        courseSpeciality: courseSpecialityID,
        execludeIds: [courseData.pk],
        first: 4
      }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">
          <div class="row justify-center">
            <skeletonCard
              class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              v-for="sk in 4"
              :key="sk"
            />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!-- {{data.allCourses.edges}} -->
          <div class="row justify-center">
            <div
              v-for="course in lodash.get(data.allCourses, '[edges]')"
              :key="course.node.id"
              class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
            >
              <relatedCourseCard
                class="hvr-bounce-in"
                style="cursor: pointer"
                :name="course.node.title"
                :instructor="course.node.courseinstructorSet"
                :course="course.node"
                :price="course.node.courseFee"
                unit="SD"
              />
            </div>
          </div>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import relatedCourseCard from "src/components/utils/relatedCourseCard";
import skeletonCard from "src/components/skeleton/skeletonCard";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";

export default {
  data() {
    return {
      GetAllCourses: GetAllCourses,
      courseSpecialityID: "",
      lodash: this.$_
    };
  },
  props: ["courseData"],
  components: {
    relatedCourseCard,
    skeletonCard
  },
  watch: {
    courseData(data) {
      this.courseSpecialityID = data.courseSpeciality.id;
    }
  }
};
</script>

<style></style>
