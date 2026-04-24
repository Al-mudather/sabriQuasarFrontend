<template>
  <div>
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

    <div v-else-if="relatedEdges.length" class="related-grid">
      <course-card
        v-for="edge in relatedEdges"
        :key="edge.node?.id ?? ''"
        :course="edge.node!"
        :name="edge.node?.title ?? ''"
        instructor="مركز دكتور صبري ابو قرون"
        :price="edge.node?.courseFee"
        unit="SD"
      />
    </div>

    <ds-empty-state
      v-else
      :title="$t('لا توجد دورات ذات صلة')"
      size="sm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import courseCard from 'src/components/utils/courseCard.vue'
import { GetAllCourses } from 'src/graphql/course_management/query/GetAllCourses'
import type {
  CourseDetail,
  GetAllCoursesResult,
  GetAllCoursesVars,
} from 'src/types/courses/types'

type CourseEdge = NonNullable<
  NonNullable<GetAllCoursesResult['allCourses']>['edges'][number]
>

const props = defineProps<{
  courseData: CourseDetail | null
}>()

const courseSpecialityID = computed<string>(
  () => props.courseData?.courseSpeciality?.id ?? '',
)

const { result, loading, error } = useQuery<GetAllCoursesResult, GetAllCoursesVars>(
  GetAllCourses,
  () => ({
    courseSpeciality: courseSpecialityID.value || undefined,
    execludeIds: props.courseData?.pk != null ? [props.courseData.pk] : [],
    first: 4,
  }),
  () => ({ enabled: !!courseSpecialityID.value }),
)

const relatedEdges = computed(
  () => (result.value?.allCourses?.edges ?? [])
    .filter((e): e is CourseEdge => !!e && !!e.node),
)
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
