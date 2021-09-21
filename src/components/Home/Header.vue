<template>
 <section class="header">

        <div class="cn">
            <span class="coloor"></span>
            <PromotionSection />
        </div>
    </section>
</template>

<script>
// import SwiperHeader from 'src/components/Home/SwiperHeader.vue'
import PromotionSection from 'src/components/Home/PromotionSection.vue'
export default {
  name: 'Header',
  data() {
    return {
    };
    },
  props: {
  },
  components: {
      // SwiperHeader
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
