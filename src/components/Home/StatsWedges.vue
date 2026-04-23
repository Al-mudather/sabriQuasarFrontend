<template>
  <section class="stats-wedges">
    <div class="stats-wedges__container">
      <div class="stats-wedges__intro">
        <span class="stats-wedges__kicker">أثر المركز</span>
        <h2 class="stats-wedges__heading">بالأرقام</h2>
      </div>

      <div class="stats-wedges__row">
        <template v-for="(s, i) in stats">
          <div :key="`wedge-${i}`" class="stats-wedges__cell">
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
            :key="`hair-${i}`"
            class="stats-wedges__hair"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import StatCard from 'src/components/shared/StatCard.vue'
import { GetTotalUsersStatistics } from 'src/queries/account_management/query/GetTotalUsers'
import { GetAllInstructorsStatiscs } from 'src/queries/account_management/query/GetAllInstructorsStatiscs'
import { GetAllCoursesHoursStatistics } from 'src/queries/course_management/query/GetAllCoursesHours'
import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses'

export default {
  name: 'StatsWedges',
  components: { StatCard },
  data () {
    return {
      totalUsers: 0,
      allInstructorCount: 0,
      allCoursesHours: 0,
      coursesTotal: 0
    }
  },
  apollo: {
    totalUsers: {
      query: GetTotalUsersStatistics,
      update: data => Number(data.totalUsers) || 0,
      error () {}
    },
    allInstructorCount: {
      query: GetAllInstructorsStatiscs,
      update: data => Number(data.allInstructorCount) || 0,
      error () {}
    },
    allCoursesHours: {
      query: GetAllCoursesHoursStatistics,
      update: data => Number(data.allCoursesHours) || 0,
      error () {}
    },
    coursesTotal: {
      query: GetAllCourses,
      variables: { first: 1, isDraft: false },
      update: data => (data.allCourses && Number(data.allCourses.totalCount)) || 0,
      error () {}
    }
  },
  computed: {
    stats () {
      return [
        { value: this.coursesTotal,     label: 'دورة تدريبية', variant: 'indigo',     max: Math.max(10, Math.ceil(this.coursesTotal * 1.2)) },
        { value: this.totalUsers,       label: 'متعلم',        variant: 'terracotta', max: Math.max(50, Math.ceil(this.totalUsers * 1.2)) },
        { value: this.allInstructorCount, label: 'مدرب',       variant: 'indigo',     max: Math.max(5, Math.ceil(this.allInstructorCount * 1.2)) },
        { value: this.allCoursesHours,  label: 'ساعة تدريبية', variant: 'terracotta', max: Math.max(10, Math.ceil(this.allCoursesHours * 1.2)) }
      ]
    }
  }
}
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
