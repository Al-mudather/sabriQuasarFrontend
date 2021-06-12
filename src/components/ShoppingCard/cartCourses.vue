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
                            <img src="~assets/img/cart-img.png" alt="" />
                        </div>
                        <h2>{{ item.course.title }}</h2>
                        <h3>{{ item.course.courseFee }}<span>SDG</span></h3>
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
                <h3>{{ calculateTheTotalFees }}<span>SDG</span></h3>
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

export default {
  data () {
    return {
      lodash: _
    }
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList']),

    calculateTheTotalFees () {
      let totalFees = 0
      for (const item of this.shoppingCartDataList) {
        totalFees = totalFees + parseInt(item.course.courseFee)
      }
      return totalFees
    }
  },

  methods: {
    ...mapActions('shoppingCart', [
      'deleteShoppinCartDataListAction',
      'setShoppinCartDataListAction'
    ]),

    goToAuthenticationCartPage () {
      if (this.calculateTheTotalFees > 0) {
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
