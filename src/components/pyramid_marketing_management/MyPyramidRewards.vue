<template>
  <div class="profit">
    <div class="taxt">
      <h4>{{$t('الأرباح المستحقة')}}</h4>
      <h3> <span>{{ FORMAT_COUSRE_PRICE(myRewards, 3) }}</span>SDG </h3>
      <button @click="COLLECT_MY_REWARDS"><img src="~assets/img/money.png" alt=""> {{$t('تحصيل ارباحي')}} </button>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-hourglass color="primary" size="70px" />
    </q-inner-loading>
  </div>
</template>

<script>
import { MyPyramidLedgerReward } from 'src/queries/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { ClaimPyramidLedgerBalance } from 'src/queries/pyramid_marketing_management/mutation/ClaimPyramidLedgerBalance'

export default {
  name: "MyPyramidRewards",
  data() {
    return {
      visible: false,
      myRewards: 0.0
    };
  },
  apollo: {
    myPyramidLedgerReward: {
      query () {
        return MyPyramidLedgerReward
      },
      result (result) {
        if (!result.loading) {
          this.myRewards = result.data.myPyramidLedgerReward 
        }
      }
    }
  },
  methods: {
    errorHandler(errorsObj) {
        for (const key in errorsObj) {
            for (const val of errorsObj[key]) {
                console.log(val)
                this.$q.notify({
                    type: 'warning',
                    progress: true,
                    multiLine: true,
                    position: 'top',
                    message: val.message
                })
            }
        }
    },

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

    async COLLECT_MY_REWARDS () {
      try {
        this.visible = true
        const rewards_res = await this.$apollo.mutate({
          mutation: ClaimPyramidLedgerBalance,
          variables: {
            input: {}
          },
          refetchQueries: [{ query: MyPyramidLedgerReward }]
        })
        const errors = rewards_res.data.claimPyramidLedgerBalance.errors
        const success = rewards_res.data.claimPyramidLedgerBalance.success
  
        if (success) {
          this.visible = false
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تم تحصيل الارباح')
          })
        } else if (errors) {
          this.visible = false
          this.errorHandler(errors)
        }
        
      } catch (error) {
        this.visible = false
      }
    }
  }
};
</script>

<style lang="scss">
</style>
