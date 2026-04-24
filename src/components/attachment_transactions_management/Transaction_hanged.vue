<template>
  <article class="tx-card tx-card--hanging">
    <header class="tx-card__head">
      <span class="tx-card__invoice">
        <img src="~assets/img/hash.png" alt="" aria-hidden="true" />
        <span>{{ customerTrans.order.invoiceNumber }}</span>
      </span>
      <button type="button" class="tx-card__details" @click="detail = true">
        {{ $t('التفاصيل') }}
      </button>
    </header>

    <div class="tx-card__body">
      <img src="~assets/img/mgl.png" alt="" aria-hidden="true" />
      <ds-badge variant="neutral">{{ $t('معلقه') }}</ds-badge>

      <div class="tx-card__amount">
        <span class="label">{{ $t('المدفوع') }}</span>
        <span class="value">
          {{ formatCoursePrice(customerTrans.order.totalAmount, 3) }}
          <small>{{ customerTrans.order.currency }}</small>
        </span>
      </div>

      <ds-button variant="primary" size="sm" @click="bill = true">
        {{ $t('إشعار الدفع') }}
      </ds-button>
    </div>

    <q-dialog v-model="bill" persistent>
      <q-card class="tx-bill">
        <img class="tx-bill__img" :src="formatImage(customerTrans.attachment)" alt="" />
        <div class="tx-bill__actions">
          <ds-button variant="primary" :loading="loading" @click="confirmOrRejectTransaction(confirmPayload)">
            {{ $t('تأكيد الدفع') }}
          </ds-button>
          <ds-button variant="danger" :loading="loading" @click="confirmOrRejectTransaction(rejectPayload)">
            {{ $t('غير معتمد') }}
          </ds-button>
          <ds-button variant="ghost" @click="bill = false">
            {{ $t('إلغاء') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>

    <TransactionDetails v-if="detail" :customerTrans="customerTrans" @close="detail = false" />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import TransactionDetails from 'src/components/attachment_transactions_management/Transaction_details.vue'
import { MarketerConfirmAttachmentTransaction } from 'src/graphql/attachment_transactions_management/mutation/marketerConfirmAttachmentTransaction'
import { AllMarketerAttachmentTransaction } from 'src/graphql/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import type {
  AttachmentTransaction,
  MarketerConfirmAttachmentResult,
  MarketerConfirmAttachmentVars,
} from 'src/types/attachments/types'

interface Props {
  customerTrans: AttachmentTransaction
}

const props = defineProps<Props>()

const $q = useQuasar()

const bill = ref(false)
const detail = ref(false)
const loading = ref(false)

const confirmPayload = { marketerEndorse: true, retryPlease: false }
const rejectPayload = { marketerEndorse: false, retryPlease: true }

const priceLookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
]

function formatCoursePrice (num: unknown, digits = 3): string {
  const n = Number(num)
  if (!Number.isFinite(n) || n === 0) return String(num)
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = priceLookup.slice().reverse().find(it => n >= it.value)
  return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

function formatImage (imageUrl: string | null | undefined): string {
  if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl ?? ''}`
  return location.origin + `/media/${imageUrl ?? ''}`
}

const { mutate: confirmMutation } = useMutation<MarketerConfirmAttachmentResult, MarketerConfirmAttachmentVars>(
  MarketerConfirmAttachmentTransaction,
  () => ({
    refetchQueries: [{ query: AllMarketerAttachmentTransaction }],
  }),
)

async function confirmOrRejectTransaction (data: { marketerEndorse: boolean; retryPlease: boolean }): Promise<void> {
  loading.value = true
  try {
    const res = await confirmMutation({
      id: props.customerTrans.pk,
      input: data,
    })
    if (res?.data?.marketerAttachmentTransactionConfirmation?.success) {
      $q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        multiLine: true,
        message: 'The transaction has been confirmed by you',
      })
      bill.value = false
    }
  } catch { /* apolloProvider surfaces error */ }
  finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
@import './tx-card.scss';

.tx-card__amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-1);

  .label {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }
  .value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700);
    font-variant-numeric: tabular-nums;
    small {
      font-size: var(--ds-text-sm);
      color: var(--ds-text-muted);
      margin-inline-start: 0.25rem;
    }
  }
}

.tx-bill {
  padding: var(--ds-space-5);
  max-inline-size: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__img {
    inline-size: 100%;
    block-size: auto;
    max-block-size: 60vh;
    object-fit: contain;
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface-muted);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}
</style>
