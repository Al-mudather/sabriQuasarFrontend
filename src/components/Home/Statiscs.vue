<template>
  <section class="home-stats">
    <div class="home-stats__inner">
      <statistcs-data :name="$t('طالب')" :value="totalUsers"><span>K</span></statistcs-data>
      <statistcs-data :name="$t('دكتور متخصص')" :value="allInstructorCount" />
      <statistcs-data :name="$t('دوره تدريبيه')" :value="allCoursesCount" />
      <statistcs-data :name="$t('ساعه تدريبيه')" :value="allCoursesHours"><span>K</span></statistcs-data>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import StatistcsData from 'src/components/Home/statiscs/StatistcsData.vue'
import { GetTotalUsersStatistics } from 'src/graphql/account_management/query/GetTotalUsers'
import { GetAllInstructorsStatiscs } from 'src/graphql/account_management/query/GetAllInstructorsStatiscs'
import { GetAllCoursesCountStatiscs } from 'src/graphql/course_management/query/GetAllCoursesStatiscs'
import { GetAllCoursesHoursStatistics } from 'src/graphql/course_management/query/GetAllCoursesHours'
import type {
  TotalUsersResult,
  TotalUsersVars,
  AllInstructorCountResult,
  AllInstructorCountVars,
  GetAllCoursesCountResult,
  GetAllCoursesCountVars,
  AllCoursesHoursResult,
  AllCoursesHoursVars,
} from 'src/types/courses/types'

const { result: totalUsersResult } = useQuery<TotalUsersResult, TotalUsersVars>(
  GetTotalUsersStatistics,
  {},
  { errorPolicy: 'all' },
)

const { result: instructorsResult } = useQuery<AllInstructorCountResult, AllInstructorCountVars>(
  GetAllInstructorsStatiscs,
  {},
  { errorPolicy: 'all' },
)

const { result: coursesCountResult } = useQuery<GetAllCoursesCountResult, GetAllCoursesCountVars>(
  GetAllCoursesCountStatiscs,
  {},
  { errorPolicy: 'all' },
)

const { result: hoursResult } = useQuery<AllCoursesHoursResult, AllCoursesHoursVars>(
  GetAllCoursesHoursStatistics,
  {},
  { errorPolicy: 'all' },
)

// totalUsers comes back as a string from the schema (String scalar)
const totalUsers = computed<number | null>(() => {
  const v = totalUsersResult.value?.totalUsers
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})

const allInstructorCount = computed<number | null>(() => {
  const v = instructorsResult.value?.allInstructorCount
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})

const allCoursesCount = computed<number | null>(() => {
  const v = coursesCountResult.value?.allCoursesCount
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})

const allCoursesHours = computed<number | null>(() => {
  const v = hoursResult.value?.allCoursesHours
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})
</script>

<style lang="scss" scoped>
.home-stats {
  padding: var(--ds-space-10) var(--ds-space-4);

  &__inner {
    max-inline-size: 1120px;
    margin-inline: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--ds-space-4);
  }
}
</style>
