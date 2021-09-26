<template>
  <div class="container">
    <b-carousel
      id="carousel-fade"
      style="text-shadow: 0px 0px 2px #000"
      fade
      indicators
      img-width="1024"
      img-height="480"
      class="carousel"
    >
        <div class="carousel-item slide active" v-for="slide in allSlidersData" :key="slide.node.pk">
          <Slider-item :slider="slide.node" />
        </div>
    </b-carousel>
  </div>
</template>

<script>
import SliderItem from 'src/components/Home/SliderItem.vue'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: "PromotionSection",
  data() {
    return {
      autoplay: false,
      slide: 0
    };
  },

  props:['allSlidersData'],

  components: {
    "Slider-item": SliderItem
  },

  watch: {
    allSlidersData (val) {
      this.slide = val[0].node.pk
    }
  },
  methods: {

    // START_THE_SLIDER () {
    //   //TODO: Make the first child of the slider active
    //   const parent = this.$jquery('.parientSlider')
    //   const children = parent.children()
    //   //TODO: Make the first child active
    //   children.first().addClass('active')
    //   if (children.length > 1) {
    //     window.setInterval(() => {
    //       this.CHANGE_THE_SLIDER()
    //     }, 10000);
    //   }
    // },

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
};
</script>

<style lang="scss">
.parientSlider {
  position: relative;
}

// .slide {
//   position: absolute;
//   top: 0;
//   left: 0;
//   display: none !important;

//   transition: 0.5 all ease-in-out;
// }

.active {
  display: block !important;
}

</style>
