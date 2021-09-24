<template>
  <div class="account">
    <img src="~assets/img/sim.png" alt="">
    <div class="taxt">
      <h4>{{$t('حسابــي')}}</h4>
      <h3> <span>{{ FORMAT_COUSRE_PRICE(myBalance, 3) }}</span>SDG </h3>
      <!-- <h3> <span>{{myBalance}}</span> </h3> -->
    </div>
    <div class="taslsl">
        <img src="~assets/img/taslsl.png" alt="">
    </div>
    <a style="cursor: pointer" @click="withdraw = true">
      <h3>طلب سحب
        <img src="~assets/img/request.png" alt="">
      </h3>
    </a>

    <q-dialog v-model="withdraw" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-center" style="color: grey-6">{{$t('الكميه')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input mask="###################" dense v-model="amount" autofocus @keyup.enter="prompt = false" />
        </q-card-section>
 
        <q-btn  style="margin-right: 3rem" @click="amount = null " color="negative" label="Cancel" v-close-popup />
        <q-btn class="q-ma-md" color="success" @click="ORDER_BALANCE_WITHDRAW" icon-right="send" label="order" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { MyPyramidWithdraws } from 'src/queries/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidBalance } from 'src/queries/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { WithdrawPyramidBalance } from 'src/queries/pyramid_marketing_management/mutation/MakePyramidWithdraw'

export default {
  name: "MyBalance",
  data() {
    return {
      lodash: this.$_,
      withdraw: false,
      myBalance: 0.0,
      amount: null
    };
  },
  apollo: {
    myPyramidBalance: {
      query () {
        return MyPyramidBalance
      },
      result (result) {
        if (!result.loading) {
          this.myBalance = result.data.myPyramidBalance.balance 
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
      if (this.amount <= this.myBalance && this.amount > 0) {
        const withdraw_res = await this.$apollo.mutate({
            mutation: WithdrawPyramidBalance,
            variables: {
              amount: this.amount,
              input: {}
            },
            refetchQueries: [
              {query: MyPyramidBalance},
              {query: MyPyramidWithdraws}
            ]
        })
        const errors = withdraw_res.data.makePyramidWithdraw.errors
        const success = withdraw_res.data.makePyramidWithdraw.success

        if (success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: "The withdraw order has been requested."
          })
          //TODO: Close the withdraw
          this.withdraw = false
        } else if (errors) {
          this.errorHandler(errors)
        }
      } else {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          progress: true,
          multiLine: true,
          message: "You can't withdraw what you don't have (-_-), or 0 cash"
        })
      }
    }
  }
};
</script>

<style lang="scss">

.q-btn {
    &> span {
        margin-right: 0 !important;
        margin-left: 0 !important;
        &> span {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
    }
}

.q-icon {
  margin-left: 0 !important;
  margin-right: 0.3rem;

}

.q-field__inner {
  margin-right: 1rem;
}

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
