<template>
  <section class="home-stats">
    <div class="home-stats__inner">
      <statistcs-data :name="$t('طالب')" :query="GetTotalUsersStatistics"><span>K</span></statistcs-data>
      <statistcs-data :name="$t('دكتور متخصص')" :query="GetAllInstructorsStatiscs" />
      <statistcs-data :name="$t('دوره تدريبيه')" :query="GetAllCoursesCountStatiscs" />
      <statistcs-data :name="$t('ساعه تدريبيه')" :query="GetAllCoursesHoursStatistics"><span>K</span></statistcs-data>
    </div>
  </section>
</template>

<script>
import StatistcsData from 'src/components/Home/statiscs/StatistcsData.vue'
import { GetAllCoursesCountStatiscs } from 'src/queries/course_management/query/GetAllCoursesStatiscs'
import { GetAllCoursesHoursStatistics } from 'src/queries/course_management/query/GetAllCoursesHours'
import { GetAllInstructorsStatiscs } from 'src/queries/account_management/query/GetAllInstructorsStatiscs'
import { GetTotalUsersStatistics } from 'src/queries/account_management/query/GetTotalUsers'

export default {
  name: 'Statiscs',
  components: { 'statistcs-data': StatistcsData },
  data () {
    return {
      GetAllCoursesCountStatiscs,
      GetAllInstructorsStatiscs,
      GetAllCoursesHoursStatistics,
      GetTotalUsersStatistics
    }
  }
}
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
