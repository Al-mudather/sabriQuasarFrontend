<template>
  <div class="balance-card">
    <img src="~assets/img/sim.png" alt="" class="balance-card__sim" />
    <div class="balance-card__body">
      <h3>{{ $t('حسابــي') }}</h3>
      <div class="balance-card__amount">
        <span class="balance-card__value">{{ formatPrice(myBalance, 3) }}</span>
        <span class="balance-card__currency">SDG</span>
      </div>
      <ds-button variant="accent" size="sm" full-width @click="withdrawOpen = true">
        {{ $t('طلب سحب') }}
      </ds-button>
    </div>

    <q-dialog v-model="withdrawOpen" persistent>
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
          <ds-button variant="primary" @click="orderBalanceWithdraw">
            {{ $t('تأكيد') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { MyPyramidWithdraws } from 'src/graphql/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidBalance } from 'src/graphql/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { WithdrawPyramidBalance } from 'src/graphql/pyramid_marketing_management/mutation/MakePyramidWithdraw'
import type {
  MyPyramidBalanceResult,
  MyPyramidBalanceVars,
  MakePyramidWithdrawResult,
  MakePyramidWithdrawVars,
} from 'src/types/pyramid/types'

const $q = useQuasar()
const { t } = useI18n()

const { result } = useQuery<MyPyramidBalanceResult, MyPyramidBalanceVars>(
  MyPyramidBalance,
  undefined,
  { errorPolicy: 'all' },
)
const myBalance = computed<number>(() => {
  const v = result.value?.myPyramidBalance?.balance
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
})

const withdrawMutation = useMutation<MakePyramidWithdrawResult, MakePyramidWithdrawVars>(
  WithdrawPyramidBalance,
  {
    refetchQueries: [
      { query: MyPyramidBalance },
      { query: MyPyramidWithdraws },
    ],
  },
)

const withdrawOpen = ref(false)
const amount = ref<number | null>(null)

const priceLookup = [
  { value: 1, symbol: '' }, { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'B' },
] as const

function formatPrice(num: number, digits = 3): string {
  try {
    const n = Number(num)
    if (!Number.isFinite(n) || n === 0) return String(num)
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = [...priceLookup].reverse().find(it => n >= it.value)
    return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
  } catch { return String(num) }
}

function cancelWithdraw(): void {
  amount.value = null
  withdrawOpen.value = false
}

function errorHandler(errorsObj: Record<string, Array<{ message: string | { msg: string } }>>): void {
  if (typeof errorsObj === 'object' && errorsObj && (errorsObj as { message?: string }).message) {
    $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: (errorsObj as { message: string }).message })
  } else {
    for (const key in errorsObj) {
      for (const val of errorsObj[key]) {
        const msg = typeof val.message === 'object' && val.message ? val.message.msg : val.message
        $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: msg })
      }
    }
  }
}

async function orderBalanceWithdraw(): Promise<void> {
  const amt = Number(amount.value)
  if (!Number.isFinite(amt) || amt > myBalance.value || amt <= 0) {
    $q.notify({
      type: 'warning',
      position: 'top',
      progress: true,
      multiLine: true,
      message: t("You can't withdraw what you don't have (-_-), or 0 cash"),
    })
    return
  }
  const res = await withdrawMutation.mutate({ amount: amt, input: {} })
  const payload = res?.data?.makePyramidWithdraw
  if (payload?.success) {
    $q.notify({
      type: 'positive',
      position: 'top',
      progress: true,
      multiLine: true,
      message: t('The withdraw order has been requested.'),
    })
    withdrawOpen.value = false
  } else if (payload?.errors) {
    errorHandler(payload.errors as Record<string, Array<{ message: string | { msg: string } }>>)
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
