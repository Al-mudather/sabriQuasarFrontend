<template>
 <section class="header">
      <div v-if="$_.isEmpty(data)" class="cn text-center">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide full_width">
                <Swiper-Header />
              </div>
            </div>
          </div>
      </div>
      <div v-else class="cn">
          <span class="coloor"></span>
          <PromotionSection :allSlidersData="data"/>
      </div>
    </section>
</template>

<script>
import SwiperHeader from 'src/components/Home/SwiperHeader.vue'
import PromotionSection from 'src/components/Home/PromotionSection.vue'
import {AllHomePageSliders} from 'src/queries/marketing_management/query/AllHomePageSliders.js'

export default {
  name: 'Header',
  data() {
    return {
      data: ''
    };
    },
  apollo: {
    allHomePageSliders: {
      query: AllHomePageSliders,
      variables: {
        orderBy: ["-id"]
      },
      result (res) {
        if (!res.loading) {
          this.data = res.data.allHomePageSliders.edges
        }
      }
    }
  },
  components: {
      SwiperHeader,
      PromotionSection
    },
}
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
@import "src/css/layout/_header.scss";
// .swiper-slide {
//   width: max-content !important;
// }

// .full_width {
//   width: 100% !important
// }

</style>
