<template>
  <div class="profit">
    <div class="taxt">
      <h4>الأرباح المستحقة من الهرم</h4>
      <h3> <span>{{myRewards}}</span>USD </h3>
      <button @click="COLLECT_MY_REWARDS"><img src="~assets/img/money.png" alt="">  تحصيل ارباحي  </button>
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
            message: "Your rewards are been collected"
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
