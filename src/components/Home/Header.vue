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
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import SwiperHeader from 'src/components/Home/SwiperHeader.vue'
import PromotionSection from 'src/components/Home/PromotionSection.vue'
import { AllHomePageSliders } from 'src/queries/marketing_management/query/AllHomePageSliders.js'

export default {
  name: 'Header',
  setup () {
    const { result } = useQuery(AllHomePageSliders, null, { errorPolicy: 'all' })
    const data = computed(() => result.value?.allHomePageSliders?.edges || '')
    return { data }
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
