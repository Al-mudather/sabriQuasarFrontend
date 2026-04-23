<template>
  <div class="promo">
    <swiper
      v-if="allSlidersData && allSlidersData.length"
      ref="promoSwiper"
      class="promo__swiper"
      :options="swiperOptions"
    >
      <swiper-slide
        v-for="slide in allSlidersData"
        :key="slide.node.pk"
        class="promo__slide"
      >
        <SliderItem :slider="slide.node" />
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination promo__pagination"></div>
    </swiper>

    <DsSkeleton v-else height="280px" rounded />
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'

import SliderItem from 'src/components/Home/SliderItem.vue'

export default {
  name: 'PromotionSection',
  data () {
    return {
      autoplay: false,
      slide: 0,
      swiperOptions: {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 16,
        pagination: {
          el: '.promo__pagination',
          clickable: true
        },
        autoplay: {
          delay: 8000,
          disableOnInteraction: false
        }
      }
    }
  },

  props: ['allSlidersData'],

  components: {
    Swiper,
    SwiperSlide,
    SliderItem
  },

  watch: {
    allSlidersData (val) {
      if (val && val[0] && val[0].node) {
        this.slide = val[0].node.pk
      }
    }
  },

  methods: {
    CHANGE_THE_SLIDER () {
      const parent = this.$jquery('.parientSlider')
      const activeChild = parent.find('.active')
      const nextChild = activeChild.next()
      if (activeChild.length > 0) {
        if (nextChild.length) {
          nextChild.addClass('active')
        } else {
          parent.children().first().addClass('active')
        }
        activeChild.removeClass('active')
      } else {
        parent.children().first().addClass('active')
      }
    }
  }
}
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
