<template>
  <section class="statiscs">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="chart">
                        <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <dectors name="طالب وطالبة" number="500"><span>K</span></dectors>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <dectors name="دكتور متخصص" :query="GetAllInstructorsStatiscs"></dectors>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <dectors name="دوره تدريبي" :query="GetAllCoursesStatiscs"></dectors>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <dectors name="عدد الساعات التدربية" number="10"><span>K</span></dectors>
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
