<template>
    <div class="parent">
        <div class="imag">
            <div class="overlay"></div>
            <img v-if="course.cover" :src="CALCULATE_IMAGE_URL" alt="">
            <img v-else src="~assets/img/person.png" alt="">
            <div class="magtxt">
                <h4>{{name}}</h4>
                <img src="~assets/img/play.png" alt="">
            </div>
        </div>
        <div class="pric">
            <div class="detai">
                <h3><span>{{unit}}</span>{{parseFloat(JSON.parse(course.currency)[currency]).toFixed(3) }}</h3>
            </div>
            <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) ">{{$t('التفاصيل')}}</button>
            <div class="cart" @click="AddTheCourseToTheBasket">
                <img src="~assets/img/addCou.png" alt="">
            </div>
        </div>
        <!-- <div v-if="instructor.edges.length > 1" class="name">
            <div v-for="instructor in instructor.edges" :key="instructor.node.id" class="user">
                <img src="~assets/img/user.png" alt="">
                <h3 >{{instructor.node.instructor.firstName}}</h3>
            </div>
        </div>
        <div v-else class="name">
            <div class="user">
                <img src="~assets/img/user.png" alt="">
                <h3 v-if="instructor.edges.length == 1">{{instructor.edges[0].node.instructor.firstName || "Not defined"}}</h3>
                <h3 v-else>Not defined</h3>
            </div>
        </div> -->
        <div class="name">
            <div class="user">
                <img src="~assets/img/user.png" alt="">
                <h3>مركز صبري ابو قرون</h3>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'relatedCourseCard',
  props: ['name', 'instructor', 'unit', 'price', 'course'],

  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('shoppingCart', ['shoppingCartDataList']),
    ...mapState('settings',['isEnglish', 'currency']),

    CALCULATE_IMAGE_URL () {
        if (process.env.NODE_ENV == 'development') {
            return 'http://localhost:8000/media/' + this.course.cover
        }
        return location.origin + '/media/' + this.course.cover
    }
  },
  mounted () {
    this.changeTheLayoutStyle(this.isEnglish)
  },
  watch: {
    isEnglish (val) {
      this.changeTheLayoutStyle(val)
    },
  },
  methods: {
    ...mapActions('shoppingCart', ['setShoppingCartDataListAction']),

    changeTheLayoutStyle(value) {
        if (value) {
            this.$jquery('.cart > img').css({
                'transform': 'translateX(48%)'
            })
        } else {
            this.$jquery('.cart > img').css({
                'transform': 'translateX(0)'
            })
        }
    },

    AddTheCourseToTheBasket (){
      const data = {
        user: this.user,
        course: this.course
      }

      this.setShoppingCartDataListAction(data)
    }
  }
}
</script>

<style lang="scss">
.cart > img {
    transform: translate(-50%, -40%) !important;
}

</style>
