<template>
  <section class="statiscs">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="chart">
                        <div class="row justify-center">
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <Statistcs-data :name="$t('طالب')" :query="GetTotalUsersStatistics"><span>K</span></Statistcs-data>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <Statistcs-data :name="$t('دكتور متخصص')" :query="GetAllInstructorsStatiscs"></Statistcs-data>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <Statistcs-data :name="$t('دوره تدريبيه')" :query="GetAllCoursesCountStatiscs"></Statistcs-data>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <Statistcs-data :name="$t('ساعه تدريبيه')"  :query="GetAllCoursesHoursStatistics"><span>K</span></Statistcs-data>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
  data () {
    return {
      GetAllCoursesCountStatiscs: GetAllCoursesCountStatiscs,
      GetAllInstructorsStatiscs: GetAllInstructorsStatiscs,
      GetAllCoursesHoursStatistics: GetAllCoursesHoursStatistics,
      GetTotalUsersStatistics: GetTotalUsersStatistics
    }
  },
  components: {
    'Statistcs-data': StatistcsData
  },
  props: {
  }
}
</script>
<style lang="scss">
.container {
    padding-right: 0 !important;
}
</style>
