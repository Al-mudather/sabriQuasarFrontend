<template>
  <section class="statiscs">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="chart">
                        <div class="row justify-center">
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <dectors :name="$t('طالب و طالبه')" number="500"><span>K</span></dectors>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <dectors :name="$t('دكتور متخصص')" :query="GetAllInstructorsStatiscs"></dectors>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <dectors :name="$t('دوره تدريبيه')" :query="GetAllCoursesStatiscs"></dectors>
                            </div>
                            <div class="col-lg-3 col-md-5 col-sm-6 col-xs-11">
                                <dectors :name="$t('عدد الساعات التدريبيه')" number="10"><span>K</span></dectors>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dectors from 'components/Home/statiscs/dector'
import { GetAllCoursesStatiscs } from 'src/queries/course_management/query/GetAllCoursesStatiscs'
import { GetAllInstructorsStatiscs } from 'src/queries/account_management/query/GetAllInstructorsStatiscs'
export default {
  name: 'Statiscs',
  data () {
    return {
      GetAllCoursesStatiscs: GetAllCoursesStatiscs,
      GetAllInstructorsStatiscs: GetAllInstructorsStatiscs
    }
  },
  components: {
    dectors: Dectors
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
