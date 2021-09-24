<template>
  <div class="container">
      <!-- <q-carousel
        swipeable
        animated
        v-model="slide"
        :autoplay="autoplay"
        ref="carousel"
        infinite
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        
      >
      <div class="carousel">
            <div class="carousel-item slide active">
          <q-carousel-slide :name="slide.node.pk" v-for="slide in allSlidersData" :key="slide.node.pk">
              <Slider-item :slider="slide.node" />
          </q-carousel-slide>
            </div>
          
      </div>
      </q-carousel> -->
      <!-- <div class="carousel-inner parientSlider">
          <div class="carousel-item slide" v-for="slide in allSlidersData" :key="slide.node.pk">
            <Slider-item :slider="slide.node" />
          </div>
      </div> -->
  </div>
</template>

<script>
// import SliderItem from 'src/components/Home/SliderItem.vue'

export default {
  name: "PromotionSection",
  data() {
    return {
      autoplay: false,
      slide: 0
    };
  },

  props:['allSlidersData'],
  
  mounted () {
    // window.setTimeout(() => {
    //   this.START_THE_SLIDER()
    // }, 2000);
  },
  components: {
    // "Slider-item": SliderItem
  },

  watch: {
    allSlidersData (val) {
      console.log('////////////')
      console.log(val)
      console.log('////////////')
      this.slide = val[0].node.pk
    }
  },
  methods: {

    START_THE_SLIDER () {
      //TODO: Make the first child of the slider active
      const parent = this.$jquery('.parientSlider')
      const children = parent.children()
      //TODO: Make the first child active
      children.first().addClass('active')
      if (children.length > 1) {
        window.setInterval(() => {
          this.CHANGE_THE_SLIDER()
        }, 10000);
      }
    },

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

.slide {
  position: absolute;
  top: 0;
  left: 0;
  display: none !important;

  transition: 0.5 all ease-in-out;
}

.active {
  display: block !important;
}

</style>
