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
                <h3><span>{{currency}}</span>{{FORMAT_COUSRE_PRICE(parseFloat(JSON.parse(course.currency)[currency]), 3)}}</h3>
            </div>
            <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) ">{{$t('التفاصيل')}}</button>
            <div class="cart" @click="AddTheCourseToTheBasket">
                <img src="~assets/img/addCou.png" alt="">
            </div>
        </div>

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

    FORMAT_COUSRE_PRICE(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];

      if ( (num.toString().split('.')[0] == 0) || num == 0 ) {
        return num
      }
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });

      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    },

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
