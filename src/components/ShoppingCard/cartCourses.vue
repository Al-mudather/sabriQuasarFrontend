<template>
    <div>
        <div class="courses">
            <div
                v-for="item in shoppingCartDataList"
                :key="item.course.id"
                class="groupp"
            >
                <div class="man">
                    <div class="compon">
                        <div class="mag">
                            <!-- <img v-if="item.course.cover" :src="FORMAT_IMAGE(item.course.cover)" alt="" /> -->
                            <img v-if="item.course.cover" :src="FORMAT_THE_IAMGE_URL(item.course.cover)" alt="" />
                            <img v-else src="~assets/img/cart-img.png" alt="" />
                        </div>
                        <h2>{{ item.course.title }}</h2>
                        <h3>{{FORMAT_COUSRE_PRICE(JSON.parse(item.course.currency)[currency], 3) }}<span>{{currency}}</span></h3>
                    </div>
                </div>
                <div class="delate" @click="removeCourseFromCart(item)">
                    <img src="~assets/img/delete.png" alt="" />
                </div>
            </div>
            <div v-if="lodash.isEmpty(shoppingCartDataList)" class="notCources">
                <img src="~assets/img/inbox(1).png" alt="">
                <p>السلة فارغة قم بتعبئتها</p>
            </div>
        </div> 
        <!--Total Price-->
        <div class="total">
            <div class="price">
                <h2>{{$t('المجمــوع')}}</h2>
                <!-- <h3>{{ calculateTheTotalFees }}<span>{{currency}}</span></h3> -->
                <h3>{{ FORMAT_COUSRE_PRICE(calculateTheTotalFees(), 3) }}<span>{{currency}}</span></h3>
            </div>
            <div class="next" @click="goToAuthenticationCartPage">
                <a class="">
                    <svg
                        class="nexx"
                        xmlns="http://www.w3.org/2000/svg"
                        width="61.667"
                        height="54"
                        viewBox="0 0 61.667 54"
                    >
                        <g
                            id="Group_363"
                            data-name="Group 363"
                            transform="translate(0 54)"
                        >
                            <path
                                id="Path_55"
                                data-name="Path 595"
                                d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z"
                                fill="#fbc74b"
                                fill-rule="evenodd"
                            />
                            <path
                                id="Path_56"
                                data-name="Path 596"
                                d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z"
                                fill="#fbc74b"
                                fill-rule="evenodd"
                            />
                        </g>
                    </svg>
                    <img src="~assets/img/back.png" alt="" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import {FORMAT_THE_IAMGE_URL} from 'src/utils/functions.js'


import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateBraintreeCheckout } from 'src/queries/checkout_management/mutation/CreateBraintreeCheckout.js'

export default {
  data () {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      lodash: _
    }
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList']),
    ...mapState('settings',['isEnglish', 'currency']),
  },

  mounted () {
    this.WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT()
    //TODO: Get the autherization For braintree payment
    // this.buyTheCoursesUsingBraintree()
  },

  methods: {
    ...mapActions('shoppingCart', [
      'deleteShoppinCartDataListAction',
      'setShoppinCartDataListAction',
      'setTotalPaymentFeesAction',
      "SET_BRAINTREE_CLIENT_TOKEN_Action",
      "SET_ORDER_DATA_Action"
    ]),

     async getBraintreePaymentUrlFromTheBackend (orderResult) {
      // TODO: Get the braintree url
      const braintreePaymentresult = await this.$apollo.mutate({
          mutation: CreateBraintreeCheckout,
          variables: {
              orderId: orderResult.order.pk
          }
      });

      const braintreeDetails =
          braintreePaymentresult.data.createBraintreeCheckout;
      // if (this.$_.get(braintreeDetails, "[errors]")) {
      // }

      if (this.$_.get(braintreeDetails, "[success]")) {
          return braintreeDetails.braintreeClientToken
      }
    },

    async buyTheCoursesUsingBraintree () {
        try {
            //TODO: Get all the courses ids
            const courseIds = this.getOrdersIds();
            //TODO: Get the order id
            const orderResult = await this.getOrderResult(courseIds);

            //TODO: Get the braintree client token
            const braintreeClientToken = await this.getBraintreePaymentUrlFromTheBackend(
                orderResult
            );
            //TODO: Set the client token
            this.SET_BRAINTREE_CLIENT_TOKEN_Action(braintreeClientToken)
            //TODO: Set the order data
            this.SET_ORDER_DATA_Action(orderResult)

            // this.visible = false;
        } catch (error) {
            // console.log('kkkkkkkkkkk')
            // console.log(error)
            // console.log('kkkkkkkkkkk')
        }         
        
    },

    getOrdersIds () {
      return this.$_.map(this.shoppingCartDataList, "[course][pk]");
    },

    async getOrderResult (courseIds) {
        const result = await this.$apollo.mutate({
            mutation: CreateNewOrderWithBulkOrderDetails,
            variables: {
                courseIds: courseIds
            }
        });

        const dataObj = result.data.createNewOrderWithBulkOrderDetails;

        if (this.$_.get(dataObj, "[errors]")) {
            this.visible = false;
            // this.errorHandler(dataObj.errors)
            // alert(dataObj.errors.nonFieldErrors);
        }

        if (this.$_.get(dataObj, "[success]")) {
            return dataObj;
        }
    },

    FORMAT_IMAGE (imageUrl) {
      if (process.env.NODE_ENV == 'development') {
        return  `http://localhost:8000/media/${imageUrl}`
        
      } else {
        return `https://api.stc.training/media/${imageUrl}`
        // return location.origin  + `/media/${imageUrl}`
      }
    },

    WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT () {
      const re = this.shoppingCartDataList.map(item => {
        if (parseInt(item.course.courseFee) == 0 || parseInt(item.course.courseFeeInSdg) == 0 ) {
          //TODO: delete the course from the cart
          this.removeCourseFromCart(item)
          //TODO: notify the user
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: "هذا الكورس تحت التحضير"
          })
        }
      })
    },

    calculateTheTotalFees () {
      let sum = 0.0
      for (const item of this.shoppingCartDataList) {
        sum = sum + parseFloat(JSON.parse(item.course.currency)[this.currency])
      }
      this.setTotalPaymentFeesAction(sum)
      return sum
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

    goToAuthenticationCartPage () {
      if (this.shoppingCartDataList.length > 0) {
        this.$router.push({ name: 'login-cart' })
      } else {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: "Please fill the basket first"
        })
      }
    },

    removeCourseFromCart (item) {
      // You don't allowed to change the data from the store directlly
      const data = this.shoppingCartDataList
      // TODO: remove the selected course
      this.lodash.remove(data, element => {
        return element.course.id === item.course.id
      })

      this.setShoppinCartDataListAction(data)
    },

    deleteTheShoppCart () {
      this.deleteShoppinCartDataListAction()
    }
  }
}
</script>

<style lang="scss">

.next {
  cursor: pointer;
  & > a > svg > g > * {
    transition: all ease-in-out 0.3s;
  }
  &:hover > a > svg > g > * {
    fill: $green-4 !important;
  }
}

.delate {
  transition: all ease-in-out 0.3s;
  background-color: $color-grey-dark-2 !important;
  &:hover {
    transform: scale(1.1);
    background-color: $red !important;
  }
}
</style>
