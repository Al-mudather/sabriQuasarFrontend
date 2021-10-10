<template>
  <div class="record">
    <div class="row">
      <div class="col-lg-12">
        <div class="oper" v-if="$_.get(withdrawLists,'[edges]').length > 0">
          <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12" v-for="order in $_.get(withdrawLists,'[edges]')" :key="order.node.pk">
              <div class="all">
                <img class="ground" src="~assets/img/sahb.png" alt="">
                <div class="clock">
                    <h3> <img src="~assets/img/clock.png" alt=""> {{ formatTime(order.node.created) }}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="43.415" height="9.957" viewBox="0 0 43.415 9.957">
                        <g id="Group_65624" data-name="Group 65624" transform="translate(17.292)">
                          <path id="Path_151295" data-name="Path 151295" d="M203.919,96.419a5.619,5.619,0,0,1-7.946,0l-1.648-1.647a22.747,22.747,0,0,0-16.086-6.664h43.415a22.752,22.752,0,0,0-16.088,6.664Z" transform="translate(-195.531 -88.107)" fill="#b1b1b1"/>
                        </g>
                    </svg>                                      
                </div>
                <h3 v-if="order.node.isDone"><img src="~assets/img/secces.png" alt="">{{$t('تم الدفع')}} </h3>
                <h3 v-else><img src="~assets/img/watinig.png" al t="">{{$t('في إنتظار المعالجة')}}</h3>
                <div class="amount">
                    <h3>SDG <span>{{ FORMAT_COUSRE_PRICE(order.node.amount, 3) }}</span></h3>
                </div>
                <span>{{$t('عن طريق')}}</span>
                <img src="~assets/img/esall.png" alt="">
              </div>
            </div>
          </div>
        </div>

        <div class="request" v-else>
          <img src="~assets/img/Plain_credit_card_bro.png" alt="">
          <h3>{{$t('ليس لديك سجل سحب في الوقت الحالي')}} </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MyPyramidWithdraws } from 'src/queries/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import moment from 'moment'

export default {
  name: "MyBalance",
  data() {
    return {
      lodash: this.$_,
      withdrawLists: [],
    };
  },
  apollo: {
    myPyramidWithdraws: {
      query () {
        return MyPyramidWithdraws
      },
      result (result) {
        if (!result.loading) {
          this.withdrawLists = result.data.myPyramidWithdraws
        }
      }
    }
  },
  methods: {
    FORMAT_COUSRE_PRICE(num, digits) {
      try {
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
      } catch (error) {
        return num
      }
    },

    formatTime (time) {
			// if (time) return moment(time, 'HH:mm:ss').format('YYYY-MM-DD HH:mm a')
			if (time) return moment(time, 'HH:mm:ss').format('YYYY-MM-DD')
			return 'Not Defined'
		},
      errorHandler(errorsObj) { 
        if (typeof errorsObj == 'object') {
          this.$q.notify({
              type: 'warning',
              progress: true,
              multiLine: true,
              position: 'top',
              message: errorsObj.message
          })
        } else {
          for (const key in errorsObj) {
              for (const val of errorsObj[key]) {
                  if (typeof val.message == 'object') {
                      this.$q.notify({
                          type: 'warning',
                          progress: true,
                          multiLine: true,
                          position: 'top',
                          message: val.message.msg
                      })
                  } else {
                      this.$q.notify({
                          type: 'warning',
                          progress: true,
                          multiLine: true,
                          position: 'top',
                          message: val.message
                      })
                  }
              }
          }

        }   
    },
    async ORDER_BALANCE_WITHDRAW () {
      if (this.amount) {
        const withdraw_res = await this.$apollo.mutate({
            mutation: WithdrawPyramidBalance,
            variables: {
                amount: this.amount,
                input: {}
            }
        })
        const errors = withdraw_res.data.makePyramidWithdraw.errors
        const success = withdraw_res.data.makePyramidWithdraw.success

        if (success) {
          this.$q.notify({
            type: 'warning',
            position: 'top',
            progress: true,
            multiLine: true,
            message: "The withdraw order has been requested."
          })
        } else if (errors) {
          this.errorHandler(errors)
        }
      } else {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          progress: true,
          multiLine: true,
          message: this.$t('ماهي الكميه اللتي تريد سحبها')
        })
      }
    }
  }
};
</script>

<style lang="scss">
.actionBtn {
  outline: none;
  border: none;
  background: transparent;
  box-shadow: none;
}

.q-card__section label {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.q-btn > .q-btn__wrapper span {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
</style>
