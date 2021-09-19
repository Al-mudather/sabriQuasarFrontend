<template> 
    <div class="parent q-mb-lg">
      <img class="pattern" src="~assets/img/patternn.png" alt="">
      <div class="parent-img-top">
          <img class="plays" src="~assets/img/play.png" alt="">
          <img src="~assets/img/moza.png" alt="Card image cap">
          <img v-if="course.cover" :src="CALCULATE_IMAGE_URL" alt="">
          <img v-else src="~assets/img/moza.png" alt="Card image cap">
      </div>
      <div class="parent-body">
        <h5 class="parent-title"> {{name}}</h5>
        <div class="detai">
          <h3><span>{{currency}}</span>{{FORMAT_COUSRE_PRICE(parseFloat(JSON.parse(course.currency)[currency]), 3)}}</h3>
          <div class="added">
              <svg xmlns="http://www.w3.org/2000/svg" width="148.279" height="45.39" viewBox="0 0 148.279 45.39">
                  <g id="Group_65702" data-name="Group 65702" transform="translate(-1165.277 -153.588)">
                    <path id="Path_158448" data-name="Path 158448" d="M788.9,564.961l-6.771-3.433v6.011h7.347v-1.617A1.093,1.093,0,0,0,788.9,564.961Z" transform="translate(524.077 -407.94)" fill="#4a5999"/>
                    <path id="Path_158449" data-name="Path 158449" d="M641.2,606.918H752.779c20.945,0,36.7-15.751,36.7-35.18v-4.957H674.83a25.69,25.69,0,0,0-23.791,16Z" transform="translate(524.077 -407.94)" fill="#667bd1"/>
                  </g>
              </svg>
              <button v-if="openCourse" @click="GO_TO_THE_COURSE_LEARNING_CLASS">{{$t('الى الدرس')}}</button>
              <button v-else @click="AddTheCourseToTheBasket"> <img src="~assets/img/add.png" alt=""> إضافة للسلة</button>
          </div> 
        </div>
        <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) " class="details"> {{$t('التفاصيل')}} <img src="~assets/img/leftArraw.png" alt=""></button>                                                
      </div>
    </div>
</template>

 
<script>
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'

import { mapState, mapActions } from 'vuex'
import { concatAST } from 'graphql'

export default {
  name: 'relatedCourseCard',
  props: ['name', 'instructor', 'unit', 'price', 'course'],

  data () {
    return {
      openCourse: false
    }
  },

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

    // TODO: IS THE USER HAS VALED INROLLMENT IN THIS COURSE
    this.IS_THE_USER_HAS_VALED_INROLLMENT_IN_THIS_COURSE()
  },
  watch: {
    isEnglish (val) {
      this.changeTheLayoutStyle(val)
    },
  },
  methods: {
    ...mapActions('shoppingCart', ['setShoppingCartDataListAction']),

    GO_TO_THE_COURSE_LEARNING_CLASS () {
      this.$router.push({ name: 'course-class', params: { pk: this.course.pk, id: this.course.id }, query:{ tab: 'tutorial' } })
    },

    async IS_THE_USER_HAS_VALED_INROLLMENT_IN_THIS_COURSE () {
      try {
        const res = await this.$apollo.query({
          query: AllEnrollmentsForCurrentUser,
        })

        res.data.allEnrollmentsForCurrentUser.edges.map(enroll => {
          if (enroll.node.course.pk == this.course.pk) {
            this.openCourse = true
          }
        })
      } catch (error) {
      }
    },

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

      // TODO: Go to the shopping cart
      this.$router.push({ name: 'cart' })
    }
  }
}
</script>

<style lang="scss">
.cart > img {
    transform: translate(-50%, -40%) !important;
}

</style>
