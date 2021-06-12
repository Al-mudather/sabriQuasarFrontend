<template>
    <div class="parent">
        <div class="imag">
            <div class="overlay"></div>
            <img src="~assets/img/person.png" alt="">
            <div class="magtxt">
                <h4>{{name}}</h4>
                <img src="~assets/img/play.png" alt="">
            </div>
        </div>
        <div class="pric">
            <div class="detai">
                <h3><span>{{unit}}</span>{{ parseInt(price)}}</h3>
            </div>
            <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) ">{{$t('التفاصيل')}}</button>
            <!-- <button @click=" $router.push( { name: 'course-details', params: { pk: course.pk, id: course.id } } ) ">Details</button> -->
            <div class="cart" @click="AddTheCourseToTheBasket">
                <!-- <svg class="sala" xmlns="http://www.w3.org/2000/svg" width="36.023" height="33.215" viewBox="0 0 36.023 33.215">
                    <g id="Group_282" data-name="Group 282" transform="translate(-24.557 -104.864)">
                        <path id="Path_406" data-name="Path 406" d="M93.284-112.494a14.141,14.141,0,0,1,1.508,1.164.4.4,0,0,0,.565-.034.4.4,0,0,0-.034-.565,14.92,14.92,0,0,0-1.594-1.23.4.4,0,0,0-.555.11A.4.4,0,0,0,93.284-112.494Z" transform="translate(-39.767 219.317)" fill="#fafafa" fill-rule="evenodd"/>
                        <path id="Path_407" data-name="Path 407" d="M98.226-108.142a14.025,14.025,0,0,1,3.462,9.243,14.045,14.045,0,0,1-.884,4.92,14.035,14.035,0,0,1-.924,1.985.4.4,0,0,0,.152.545.4.4,0,0,0,.545-.152,14.83,14.83,0,0,0,.977-2.1,14.84,14.84,0,0,0,.935-5.2,14.823,14.823,0,0,0-3.658-9.769.4.4,0,0,0-.564-.038A.4.4,0,0,0,98.226-108.142Z" transform="translate(-41.907 217.433)" fill="#fafafa" fill-rule="evenodd"/>
                        <path id="Path_408" data-name="Path 408" d="M75.645-88.41a.74.74,0,0,0-.344-.625.741.741,0,0,0-.712-.044,13.374,13.374,0,0,1-1.642.646,2.286,2.286,0,0,0-1.613,2.184h-.018a2.566,2.566,0,0,1-2.566,2.566h0a2.566,2.566,0,0,1-2.566-2.566h0a2.3,2.3,0,0,0-1.625-2.2h0a.841.841,0,0,0-.751.123.841.841,0,0,0-.344.679v3.238a1.494,1.494,0,0,1-1.494,1.494,1.494,1.494,0,0,1-1.494-1.494v-5.463a1.4,1.4,0,0,0-.508-1.077h0a.3.3,0,0,0-.317-.04.3.3,0,0,0-.171.27c0,.525,0,1.177,0,1.177a1.187,1.187,0,0,1-1.187,1.187h0A1.187,1.187,0,0,1,57.1-89.543v-.727a17.066,17.066,0,0,0-1.193-6.268,13.691,13.691,0,0,1-.952-5.036,13.8,13.8,0,0,1,13.792-13.792A13.8,13.8,0,0,1,82.54-101.573a13.719,13.719,0,0,1-2.1,7.32A10.882,10.882,0,0,0,78.8-88.521a.491.491,0,0,0-.019.111,1.57,1.57,0,0,1-.46,1.11,1.57,1.57,0,0,1-1.11.46h0a1.57,1.57,0,0,1-1.11-.46,1.57,1.57,0,0,1-.46-1.11Z" transform="translate(-23.51 220.229)" fill="#fff" fill-rule="evenodd"/>
                        <path id="Path_409" data-name="Path 409" d="M54.654-87.013a18.319,18.319,0,0,0-.625-1.872,13.977,13.977,0,0,1-.972-5.14,14.123,14.123,0,0,1,.292-2.863.4.4,0,0,0-.311-.473.4.4,0,0,0-.473.311,14.92,14.92,0,0,0-.308,3.025,14.775,14.775,0,0,0,1.028,5.434,17.533,17.533,0,0,1,.6,1.791.4.4,0,0,0,.492.28A.4.4,0,0,0,54.654-87.013Z" transform="translate(-22.359 212.56)" fill="#fafafa" fill-rule="evenodd"/>
                        <path id="Path_410" data-name="Path 410" d="M94.15-62.188a1.57,1.57,0,0,0-1.57-1.57h0a1.57,1.57,0,0,0-1.57,1.57v.461a1.57,1.57,0,0,0,1.57,1.57h0a1.57,1.57,0,0,0,1.57-1.57Z" transform="translate(-38.873 198.236)" fill="#fff" fill-rule="evenodd"/>
                        <path id="Path_412" data-name="Path 412" d="M43.352-104.159l2.606,1.278a1.224,1.224,0,0,1,.671,1.285,20.857,20.857,0,0,0,.092,8.157.719.719,0,0,0,.89.49.719.719,0,0,0,.49-.89,19.211,19.211,0,0,1-.053-7.534,2.664,2.664,0,0,0-1.458-2.8l-2.607-1.277a.718.718,0,0,0-.961.329A.719.719,0,0,0,43.352-104.159Z" transform="translate(-18.392 216.034)" fill="#fff" fill-rule="evenodd"/>
                    </g>
                </svg>  -->
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
    ...mapState('settings',['isEnglish', 'currency'])
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
