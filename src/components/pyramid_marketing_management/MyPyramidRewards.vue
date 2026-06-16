<template>
  <div class="rewards-card">
    <h3 class="rewards-card__title">{{ $t('الأرباح المستحقة') }}</h3>
    <div class="rewards-card__amount">
      <span class="rewards-card__value">{{ formatPrice(myRewards, 3) }}</span>
      <span class="rewards-card__currency">SDG</span>
    </div>
    <ds-button variant="accent" :loading="collecting" @click="collectMyRewards">
      <template #leading>
        <img src="~assets/img/money.png" alt="" aria-hidden="true" style="block-size: 1rem; inline-size: auto;" />
      </template>
      {{ $t('تحصيل ارباحي') }}
    </ds-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { MyPyramidLedgerReward } from 'src/graphql/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { ClaimPyramidLedgerBalance } from 'src/graphql/pyramid_marketing_management/mutation/ClaimPyramidLedgerBalance'
import type {
  MyPyramidLedgerRewardResult,
  MyPyramidLedgerRewardVars,
  ClaimPyramidLedgerBalanceResult,
  ClaimPyramidLedgerBalanceVars,
} from 'src/types/pyramid/types'

const $q = useQuasar()
const { t } = useI18n()

const { result } = useQuery<MyPyramidLedgerRewardResult, MyPyramidLedgerRewardVars>(
  MyPyramidLedgerReward,
  {},
  { errorPolicy: 'all' },
)
const myRewards = computed<number>(() => {
  const v = result.value?.myPyramidLedgerReward
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
})

const claimMutation = useMutation<ClaimPyramidLedgerBalanceResult, ClaimPyramidLedgerBalanceVars>(
  ClaimPyramidLedgerBalance,
  { refetchQueries: [{ query: MyPyramidLedgerReward }] },
)

const collecting = ref(false)

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

function errorHandler(errorsObj: Record<string, Array<{ message: string | { msg: string } }>>) {
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      const msg = typeof val.message === 'object' && val.message ? val.message.msg : val.message
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'bottom', message: msg })
    }
  }
}

async function collectMyRewards(): Promise<void> {
  collecting.value = true
  try {
    const res = await claimMutation.mutate({ input: {} })
    const payload = res?.data?.claimPyramidLedgerBalance
    if (payload?.success) {
      $q.notify({
        type: 'positive',
        position: 'bottom',
        progress: true,
        multiLine: true,
        message: t('تم تحصيل الارباح'),
      })
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string | { msg: string } }>>)
    }
  } catch { /* Apollo surfaces */ }
  finally { collecting.value = false }
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
