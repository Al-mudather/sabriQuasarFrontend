<template>
  <div class="promo">
    <swiper
      v-if="validSliders.length"
      ref="promoSwiper"
      class="promo__swiper"
      :modules="swiperModules"
      :slides-per-view="1"
      :space-between="16"
      :loop="false"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 8000, disableOnInteraction: false }"
    >
      <swiper-slide
        v-for="node in validSliders"
        :key="node.pk ?? node.id"
        class="promo__slide"
      >
        <SliderItem :slider="node" />
      </swiper-slide>
    </swiper>

    <DsSkeleton v-else height="280px" rounded />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import SliderItem from 'src/components/Home/SliderItem.vue'
import type { AllHomePageSlidersResult, HomePageSlider } from 'src/types/marketing-content/types'

// Edge type extracted from the sliders query result
type SliderEdge = NonNullable<
  NonNullable<AllHomePageSlidersResult['allHomePageSliders']>['edges'][number]
>

interface Props {
  allSlidersData?: SliderEdge[] | null
}

const props = withDefaults(defineProps<Props>(), {
  allSlidersData: null,
})

const swiperModules = [Pagination, Autoplay]
const currentPk = ref<number | null>(null)

const validSliders = computed<HomePageSlider[]>(() =>
  (props.allSlidersData ?? []).flatMap((e) => (e.node ? [e.node] : []))
)

watch(
  () => props.allSlidersData,
  (val) => {
    const first = val?.[0]?.node
    if (first && first.pk != null) currentPk.value = first.pk
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.promo {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-block: var(--ds-space-6, 1.5rem);
  padding-inline: var(--ds-space-4, 1rem);
}

.promo__swiper {
  border-radius: var(--ds-radius-lg, 16px);
  background: var(--ds-color-surface, #ffffff);
  box-shadow: var(--ds-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04));
  overflow: hidden;
}

.promo__slide {
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.promo__pagination {
  margin-block-start: var(--ds-space-3, 0.75rem);
  text-align: center;
}
</style>
