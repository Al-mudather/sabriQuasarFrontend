<template>
  <div class="withdraws">
    <ds-empty-state
      v-if="withdrawEdges.length === 0"
      :title="$t('ليس لديك سجل سحب في الوقت الحالي')"
      size="md"
    >
      <template #illustration>
        <img src="~assets/img/Plain_credit_card_bro.png" alt="" />
      </template>
    </ds-empty-state>

    <div v-else class="withdraws__grid">
      <article v-for="order in withdrawEdges" :key="order.node.pk ?? order.node.id" class="withdraw-card">
        <header class="withdraw-card__head">
          <img src="~assets/img/clock.png" alt="" aria-hidden="true" />
          <time>{{ formatTime(order.node.created) }}</time>
        </header>
        <ds-badge v-if="order.node.isDone" variant="success">
          {{ $t('تم الدفع') }}
        </ds-badge>
        <ds-badge v-else variant="warning">
          {{ $t('في إنتظار المعالجة') }}
        </ds-badge>
        <div class="withdraw-card__amount">
          <span>{{ formatPrice(order.node.amount, 3) }}</span>
          <small>SDG</small>
        </div>
        <footer class="withdraw-card__via">
          <span>{{ $t('عن طريق') }}</span>
          <img src="~assets/img/esall.png" alt="" />
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { MyPyramidWithdraws } from 'src/graphql/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import type {
  MyPyramidWithdrawsResult,
  MyPyramidWithdrawsVars,
} from 'src/types/pyramid/types'

const { result } = useQuery<MyPyramidWithdrawsResult, MyPyramidWithdrawsVars>(
  MyPyramidWithdraws,
  {},
  { errorPolicy: 'all' },
)

type WithdrawEdgeNN = NonNullable<NonNullable<NonNullable<MyPyramidWithdrawsResult['myPyramidWithdraws']>['edges'][number]>> & {
  node: NonNullable<NonNullable<NonNullable<NonNullable<MyPyramidWithdrawsResult['myPyramidWithdraws']>['edges'][number]>>['node']>
}

const withdrawEdges = computed(() =>
  (result.value?.myPyramidWithdraws?.edges ?? [])
    .filter((e): e is WithdrawEdgeNN => !!e && !!e.node),
)

const priceLookup = [
  { value: 1, symbol: '' }, { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'B' },
] as const

function formatPrice(num: number | null | undefined, digits = 3): string {
  try {
    const n = Number(num)
    if (!Number.isFinite(n) || n === 0) return String(num)
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = [...priceLookup].reverse().find(it => n >= it.value)
    return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
  } catch { return String(num) }
}

function formatTime(time: string | null | undefined): string {
  if (!time) return 'Not Defined'
  // time arrives as an ISO string; take the date portion
  try {
    return new Date(time).toISOString().slice(0, 10)
  } catch { return time }
}
</script>

<style lang="scss" scoped>
.withdraws {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--ds-space-4);
  }
}

.withdraw-card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  box-shadow: var(--ds-shadow-xs);

  &__head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    color: var(--ds-text-muted);
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;

    img { block-size: 1rem; inline-size: auto; }
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    padding-block-start: var(--ds-space-2);
    border-block-start: 1px dashed var(--ds-border);

    span {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-2xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-brand-700);
      font-variant-numeric: tabular-nums;
    }
    small {
      font-size: var(--ds-text-xs);
      color: var(--ds-text-muted);
    }
  }

  &__via {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);

    img { block-size: 1.25rem; inline-size: auto; }
  }
}
</style>
