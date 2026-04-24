<template>
  <section class="stats-wedges">
    <div class="stats-wedges__container">
      <div class="stats-wedges__intro">
        <span class="stats-wedges__kicker">أثر المركز</span>
        <h2 class="stats-wedges__heading">بالأرقام</h2>
      </div>

      <div class="stats-wedges__row">
        <template v-for="(s, i) in stats" :key="`wedge-${i}`">
          <div class="stats-wedges__cell">
            <stat-card
              :value="s.value"
              :label="s.label"
              :suffix="s.suffix || ''"
              :variant="s.variant"
              :max="s.max"
              :animated="true"
              size="md"
            />
          </div>
          <span
            v-if="i < stats.length - 1"
            class="stats-wedges__hair"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import StatCard from 'src/components/shared/StatCard.vue'
import { GetTotalUsersStatistics } from 'src/graphql/account_management/query/GetTotalUsers'
import { GetAllInstructorsStatiscs } from 'src/graphql/account_management/query/GetAllInstructorsStatiscs'
import { GetAllCoursesHoursStatistics } from 'src/graphql/course_management/query/GetAllCoursesHours'
import { GetAllCoursesCountStatiscs } from 'src/graphql/course_management/query/GetAllCoursesStatiscs'
import type {
  TotalUsersResult,
  TotalUsersVars,
  AllInstructorCountResult,
  AllInstructorCountVars,
  AllCoursesHoursResult,
  AllCoursesHoursVars,
  GetAllCoursesCountResult,
  GetAllCoursesCountVars,
} from 'src/types/courses/types'

// All four stat queries are present in generated.ts (AllCoursesHours, GetAllCoursesCount,
// AllInstructorCount, TotalUsers). Previous TODO comments about schema drift were incorrect —
// the operations exist with slightly different operation names than expected but map to
// the correct root fields on the live schema.

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

const { result: hoursResult } = useQuery<AllCoursesHoursResult, AllCoursesHoursVars>(
  GetAllCoursesHoursStatistics,
  {},
  { errorPolicy: 'all' },
)

// Using dedicated allCoursesCount stat query instead of allCourses connection
// (avoids fetching a full edge list just to read totalCount)
const { result: coursesCountResult } = useQuery<GetAllCoursesCountResult, GetAllCoursesCountVars>(
  GetAllCoursesCountStatiscs,
  {},
  { errorPolicy: 'all' },
)

// totalUsers / allCoursesHours / allCoursesCount are String scalars in the schema
const totalUsers = computed<number>(() => Number(totalUsersResult.value?.totalUsers) || 0)
const allInstructorCount = computed<number>(() => Number(instructorsResult.value?.allInstructorCount) || 0)
const allCoursesHours = computed<number>(() => Number(hoursResult.value?.allCoursesHours) || 0)
const coursesTotal = computed<number>(() => Number(coursesCountResult.value?.allCoursesCount) || 0)

interface StatEntry {
  value: number
  label: string
  suffix?: string
  variant: 'indigo' | 'terracotta'
  max: number
}

const stats = computed<StatEntry[]>(() => [
  {
    value: coursesTotal.value,
    label: 'دورة تدريبية',
    variant: 'indigo',
    max: Math.max(10, Math.ceil(coursesTotal.value * 1.2)),
  },
  {
    value: totalUsers.value,
    label: 'متعلم',
    variant: 'terracotta',
    max: Math.max(50, Math.ceil(totalUsers.value * 1.2)),
  },
  {
    value: allInstructorCount.value,
    label: 'مدرب',
    variant: 'indigo',
    max: Math.max(5, Math.ceil(allInstructorCount.value * 1.2)),
  },
  {
    value: allCoursesHours.value,
    label: 'ساعة تدريبية',
    variant: 'terracotta',
    max: Math.max(10, Math.ceil(allCoursesHours.value * 1.2)),
  },
])
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.stats-wedges {
  background: var(--ds-cream);
  padding-block: clamp(5rem, 10vw, 7rem);
  padding-block-start: clamp(6rem, 12vw, 9rem);
}

.stats-wedges__container {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.stats-wedges__intro {
  text-align: center;
  margin-block-end: clamp(2rem, 4vw, 3.5rem);
}

.stats-wedges__kicker {
  display: block;
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-xs);
  color: var(--ds-taupe);
  letter-spacing: 0.04em;
  margin-block-end: var(--ds-space-2);
}

.stats-wedges__heading {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2rem);
  color: var(--ds-ink);
  margin: 0;
  line-height: 1.25;
}

.stats-wedges__row {
  display: grid;
  grid-template-columns: repeat(7, auto);
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  @media (max-width: $ds-bp-md) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: $ds-bp-sm) {
    grid-template-columns: 1fr;
  }
}

.stats-wedges__cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-wedges__hair {
  inline-size: 1px;
  block-size: 120px;
  background: var(--ds-taupe);
  opacity: 0.2;

  @media (max-width: $ds-bp-md) {
    display: none;
  }
}
</style>
