<template>
  <div class="account">
    <img src="~assets/img/sim.png" alt="">
    <div class="taxt">
      <h4>{{$t('حسابــي')}}</h4>
      <h3> <span>{{myBalance}}</span>USD </h3>
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
          <div class="text-h6 text-center">{{$t('الكميه')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="amount" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-btn flate  style="margin-right: 6rem" flat borderd color="negative" label="Cancel" v-close-popup />
        <q-btn flate class="q-ma-md" flat color="success" label="order" @click="ORDER_BALANCE_WITHDRAW" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { MyPyramidBalance } from 'src/queries/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { WithdrawPyramidBalance } from 'src/queries/pyramid_marketing_management/mutation/MakePyramidWithdraw'

export default {
  name: "MyBalance",
  data() {
    return {
      lodash: this.$_,
      withdraw: false,
      myBalance: 0.0,
      amount: ''
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
            },
            refetchQueries: [{query: MyPyramidBalance}]
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
          message: "what is the amount that you want to withdraw"
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
