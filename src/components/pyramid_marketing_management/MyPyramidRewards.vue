<template>
  <div class="rewards-card">
    <h3 class="rewards-card__title">{{ $t('الأرباح المستحقة') }}</h3>
    <div class="rewards-card__amount">
      <span class="rewards-card__value">{{ FORMAT_COUSRE_PRICE(myRewards, 3) }}</span>
      <span class="rewards-card__currency">SDG</span>
    </div>
    <ds-button variant="accent" :loading="visible" @click="COLLECT_MY_REWARDS">
      <template #leading>
        <img src="~assets/img/money.png" alt="" aria-hidden="true" style="block-size: 1rem; inline-size: auto;" />
      </template>
      {{ $t('تحصيل ارباحي') }}
    </ds-button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { MyPyramidLedgerReward } from 'src/graphql/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { ClaimPyramidLedgerBalance } from 'src/graphql/pyramid_marketing_management/mutation/ClaimPyramidLedgerBalance'
import { apolloClient } from 'src/apollo/client'

const priceLookup = [
  { value: 1, symbol: '' }, { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'B' }
]

export default {
  name: 'MyPyramidRewards',

  setup () {
    const { result } = useQuery(MyPyramidLedgerReward, null, { errorPolicy: 'all' })
    const myRewards = computed(() => result.value?.myPyramidLedgerReward || 0.0)
    return { myRewards }
  },

  data () { return { visible: false } },

  methods: {
    errorHandler (errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.$q.notify({
            type: 'warning', progress: true, multiLine: true, position: 'top', message: val.message
          })
        }
      }
    },

    FORMAT_COUSRE_PRICE (num, digits = 3) {
      try {
        const n = Number(num)
        if (!Number.isFinite(n) || n === 0) return String(num)
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
        const item = priceLookup.slice().reverse().find(it => n >= it.value)
        return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
      } catch (e) { return num }
    },

    async COLLECT_MY_REWARDS () {
      this.visible = true
      try {
        const res = await apolloClient.mutate({
          mutation: ClaimPyramidLedgerBalance,
          variables: { input: {} },
          refetchQueries: [{ query: MyPyramidLedgerReward }]
        })
        const { success, errors } = res.data.claimPyramidLedgerBalance
        if (success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تم تحصيل الارباح')
          })
        } else if (errors) this.errorHandler(errors)
      } catch (e) { /* apolloProvider surfaces */ }
      finally { this.visible = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.rewards-card {
  background: linear-gradient(135deg, var(--ds-accent-300), var(--ds-accent-500));
  color: var(--ds-brand-800);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  box-shadow: var(--ds-shadow-md);
  min-block-size: 180px;

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-brand-900);
    margin: 0;
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  &__value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-800);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__currency {
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-700);
  }
}
</style>
