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
                <h3><span>{{currency}}</span>{{parseInt(JSON.parse(course.currency)[currency])}}</h3>
            </div>
            <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) ">{{$t('التفاصيل')}}</button>
            <div class="cart" @click="AddTheCourseToTheBasket" style="cursor: pointer">
                <img src="~assets/img/addCou.png" alt="">
            </div>
        </div>
        <div class="name">
            <div class="user">
                <img src="~assets/img/user.png" alt="">
                <h3>{{instructor}}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'courseCard',
  props: ['name', 'instructor', 'unit', 'price', 'course'],

  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('shoppingCart', ['shoppingCartDataList']),
    ...mapState('settings',['isEnglish', 'currency']),
    CALCULATE_IMAGE_URL () {
      return location.host + '/media/' + this.course.cover
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

<style>

</style>
