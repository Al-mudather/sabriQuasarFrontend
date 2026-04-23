<template>
  <div class="balance-card">
    <img src="~assets/img/sim.png" alt="" class="balance-card__sim" />
    <div class="balance-card__body">
      <h3>{{ $t('حسابــي') }}</h3>
      <div class="balance-card__amount">
        <span class="balance-card__value">{{ FORMAT_COUSRE_PRICE(myBalance, 3) }}</span>
        <span class="balance-card__currency">SDG</span>
      </div>
      <ds-button variant="accent" size="sm" full-width @click="withdraw = true">
        {{ $t('طلب سحب') }}
      </ds-button>
    </div>

    <q-dialog v-model="withdraw" persistent>
      <q-card class="balance-dialog">
        <h3>{{ $t('الكميه') }}</h3>
        <q-input
          rounded outlined
          type="number"
          v-model="amount"
          autofocus
          :hint="$t('الرصيد المتاح') + ': ' + myBalance"
        />
        <div class="balance-dialog__actions">
          <ds-button variant="ghost" @click="cancelWithdraw">
            {{ $t('إلغاء') }}
          </ds-button>
          <ds-button variant="primary" @click="ORDER_BALANCE_WITHDRAW">
            {{ $t('تأكيد') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { MyPyramidWithdraws } from 'src/queries/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidBalance } from 'src/queries/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { WithdrawPyramidBalance } from 'src/queries/pyramid_marketing_management/mutation/MakePyramidWithdraw'

const priceLookup = [
  { value: 1, symbol: '' }, { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'B' }
]

export default {
  name: 'MyBalance',

  data () { return { withdraw: false, myBalance: 0.0, amount: null } },

  apollo: {
    myPyramidBalance: {
      query () { return MyPyramidBalance },
      result (result) {
        if (!result.loading) this.myBalance = result.data.myPyramidBalance.balance
      }
    }
  },

  methods: {
    FORMAT_COUSRE_PRICE (num, digits = 3) {
      try {
        const n = Number(num)
        if (!Number.isFinite(n) || n === 0) return String(num)
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
        const item = priceLookup.slice().reverse().find(it => n >= it.value)
        return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
      } catch (e) { return num }
    },

    cancelWithdraw () {
      this.amount = null
      this.withdraw = false
    },

    errorHandler (errorsObj) {
      if (typeof errorsObj === 'object' && errorsObj && errorsObj.message) {
        this.$q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: errorsObj.message })
      } else {
        for (const key in errorsObj) {
          for (const val of errorsObj[key]) {
            const msg = (typeof val.message === 'object' && val.message.msg) ? val.message.msg : val.message
            this.$q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: msg })
          }
        }
      }
    },

    async ORDER_BALANCE_WITHDRAW () {
      if (this.amount > this.myBalance || this.amount <= 0) {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          progress: true,
          multiLine: true,
          message: "You can't withdraw what you don't have (-_-), or 0 cash"
        })
        return
      }
      const res = await this.$apollo.mutate({
        mutation: WithdrawPyramidBalance,
        variables: { amount: this.amount, input: {} },
        refetchQueries: [
          { query: MyPyramidBalance },
          { query: MyPyramidWithdraws }
        ]
      })
      const { success, errors } = res.data.makePyramidWithdraw
      if (success) {
        this.$q.notify({
          type: 'positive',
          position: 'top',
          progress: true,
          multiLine: true,
          message: 'The withdraw order has been requested.'
        })
        this.withdraw = false
      } else if (errors) {
        this.errorHandler(errors)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.balance-card {
  background: linear-gradient(135deg, var(--ds-brand-700), var(--ds-brand-900));
  border-radius: var(--ds-radius-xl);
  padding: var(--ds-space-5);
  color: var(--ds-text-onBrand);
  box-shadow: var(--ds-shadow-md);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  min-block-size: 180px;

  &__sim {
    position: absolute;
    inset-block-start: var(--ds-space-4);
    inset-inline-end: var(--ds-space-4);
    block-size: 2rem;
    inline-size: auto;
    opacity: 0.7;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);

    h3 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-sm);
      font-weight: var(--ds-weight-medium);
      margin: 0;
      color: rgba(255, 255, 255, 0.75);
    }
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
    color: var(--ds-accent-300);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__currency {
    font-size: var(--ds-text-sm);
    color: rgba(255, 255, 255, 0.7);
  }
}

.balance-dialog {
  inline-size: 100%;
  max-inline-size: 380px;
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  h3 {
    text-align: center;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: var(--ds-space-2);
    justify-content: flex-end;
  }
}
</style>
