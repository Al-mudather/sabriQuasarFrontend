<template>
  <section class="home-header">
    <div v-show="$_.isEmpty(data)" class="home-header__fallback">
      <SwiperHeader />
    </div>

    <div v-show="!$_.isEmpty(data)" class="home-header__promos">
      <PromotionSection :allSlidersData="data" />
    </div>
  </section>
</template>

<script>
import SwiperHeader from 'src/components/Home/SwiperHeader.vue'
import PromotionSection from 'src/components/Home/PromotionSection.vue'
import { AllHomePageSliders } from 'src/queries/marketing_management/query/AllHomePageSliders.js'

export default {
  name: 'Header',
  data () {
    return {
      data: ''
    }
  },
  apollo: {
    allHomePageSliders: {
      query: AllHomePageSliders,
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
  }
}
</script>

<style lang="scss" scoped>
.home-header {
  position: relative;
  inline-size: 100%;
  background: var(--ds-color-surface-muted, transparent);
}

.home-header__fallback,
.home-header__promos {
  inline-size: 100%;
}
</style>
