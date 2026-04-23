<template>
  <ApolloQuery
    :query="GetAllCourses"
    :variables="{
      courseSpeciality: courseSpecialityID,
      execludeIds: [$_.get(courseData, '[pk]')],
      first: 4
    }"
    :skip="!courseSpecialityID"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <div v-if="loading" class="related-grid">
        <ds-card v-for="sk in 4" :key="'sk-' + sk" class="related-grid__skeleton">
          <template #media>
            <ds-skeleton shape="rect" height="100%" radius="0" />
          </template>
          <ds-skeleton shape="line" width="85%" />
          <ds-skeleton shape="line" width="50%" />
          <template #footer>
            <ds-skeleton shape="pill" width="100%" />
          </template>
        </ds-card>
      </div>

      <ds-empty-state
        v-else-if="error"
        :title="$t('تعذر تحميل الدورات ذات الصلة')"
        size="sm"
      />

      <div v-else-if="data" class="related-grid">
        <course-card
          v-for="course in $_.get(data.allCourses, '[edges]', [])"
          :key="course.node.id"
          :course="course.node"
          :name="course.node.title"
          :instructor="course.node.courseinstructorSet"
          :price="course.node.courseFee"
          unit="SD"
        />
      </div>

      <ds-empty-state
        v-else
        :title="$t('لا توجد دورات ذات صلة')"
        size="sm"
      />
    </template>
  </ApolloQuery>
</template>

<script>
import courseCard from 'src/components/utils/courseCard.vue'
import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses'

export default {
  name: 'RelatedCourses',
  props: ['courseData'],
  components: { courseCard },

  data () {
    return {
      GetAllCourses,
      courseSpecialityID: ''
    }
  },

  watch: {
    courseData (data) {
      this.courseSpecialityID = this.$_.get(data, '[courseSpeciality][id]', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--ds-space-5);
  align-items: stretch;

  &__skeleton {
    height: 100%;
  }
}
</style>
