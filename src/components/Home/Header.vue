<template>
  <section class="home-header">
    <div v-show="isEmpty" class="home-header__fallback">
      <SwiperHeader />
    </div>

    <div v-show="!isEmpty" class="home-header__promos">
      <PromotionSection :allSlidersData="data" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import SwiperHeader from 'src/components/Home/SwiperHeader.vue'
import PromotionSection from 'src/components/Home/PromotionSection.vue'
import { AllHomePageSliders } from 'src/graphql/marketing_management/query/AllHomePageSliders.js'
import type {
  AllHomePageSlidersResult,
  AllHomePageSlidersVars,
} from 'src/types/marketing-content/types'

const { result } = useQuery<AllHomePageSlidersResult, AllHomePageSlidersVars>(
  AllHomePageSliders,
  {},
  { errorPolicy: 'all' },
)

const data = computed(
  () => (result.value?.allHomePageSliders?.edges ?? []).filter(
    (e): e is NonNullable<typeof e> => e !== null && e !== undefined,
  ),
)
const isEmpty = computed(() => !data.value.length)
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
