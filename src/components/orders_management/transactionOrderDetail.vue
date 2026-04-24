<template>
  <article class="order-card">
    <header class="order-card__head">
      <span class="order-card__invoice">
        ID · <strong>{{ myOrder.order.invoiceNumber }}</strong>
      </span>
    </header>

    <!-- 3-step purchase progress -->
    <ol class="order-card__steps">
      <li class="step step--done">
        <CheckDot :done="true" />
        <span>{{ t('شراء') }}</span>
      </li>
      <li class="step" :class="{ 'step--done': myOrder.marketerEndorse }">
        <CheckDot :done="myOrder.marketerEndorse" />
        <span>{{ t('معالجة') }}</span>
      </li>
      <li class="step" :class="{ 'step--done': myOrder.doneVerification }">
        <CheckDot :done="myOrder.doneVerification" />
        <span>{{ t('مكتمل') }}</span>
      </li>
    </ol>

    <div class="order-card__amount">
      <span class="label">{{ t('المدفوع') }}</span>
      <span class="value">
        {{ formatCoursePrice(myOrder.order.totalAmount, 3) }}
        <small>{{ myOrder.order.currency }}</small>
      </span>
    </div>

    <ds-button v-if="myOrder.retryPlease" variant="secondary" size="sm" full-width @click="bill = true">
      {{ t('رؤية فاتورة الدفع') }}
    </ds-button>

    <q-dialog v-model="bill" persistent>
      <q-card class="order-bill">
        <img class="order-bill__img" :src="formatImage(myOrder.attachment)" alt="" />
        <file-upload
          :imgeSize="4000000"
          :accept="'.png,.jpg, image/*'"
          :label="bankakBillName"
          v-on:File_Handler="reuploadImageHandler"
        />
        <div class="order-bill__actions">
          <ds-button variant="primary" :loading="loading" @click="reUploadTheTransactionBill">
            {{ t('إعادة ارفاق الفاتوره') }}
          </ds-button>
          <ds-button variant="ghost" @click="bill = false">
            {{ t('إلغاء') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </article>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import FileUpload from 'src/components/utils/FileUploader.vue'
import { ReUploadAttachmentTransaction } from 'src/graphql/attachment_transactions_management/mutation/ReUploadAttachmentTransaction'
import { MyAttachmentTransactions } from 'src/graphql/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import type {
  ReUploadAttachmentResult,
  ReUploadAttachmentVars,
  UserAttachmentTransaction,
} from 'src/types/attachments/types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  myOrder: UserAttachmentTransaction
}
const props = defineProps<Props>()

// ---------------------------------------------------------------------------
// Inline functional sub-component: CheckDot
// ---------------------------------------------------------------------------
const CheckDot = (checkProps: { done: boolean }) => {
  const cls = ['dot', checkProps.done ? 'dot--done' : 'dot--pending']
  const inner = checkProps.done
    ? h('path', {
        d: 'M3 8.2l3.3 3.3L13 5',
        stroke: 'currentColor',
        'stroke-width': '2',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      })
    : h('circle', { cx: '8', cy: '8', r: '3', fill: 'currentColor' })
  return h('span', { class: cls }, [
    h('svg', { viewBox: '0 0 16 16', 'aria-hidden': 'true' }, [inner]),
  ])
}

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------
const $q = useQuasar()
const { t } = useI18n()

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const bill = ref(false)
const loading = ref(false)
const bankakBill = ref<File | null>(null)
const bankakBillName = t('فاتورة بنكك')

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------
const reupload = useMutation<ReUploadAttachmentResult, ReUploadAttachmentVars>(
  ReUploadAttachmentTransaction,
  { refetchQueries: [{ query: MyAttachmentTransactions }] },
)

// ---------------------------------------------------------------------------
// Price lookup table
// ---------------------------------------------------------------------------
const priceLookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
]

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function reuploadImageHandler (val: File | null): void {
  if (!val) return
  bankakBill.value = val
}

function formatCoursePrice (num: number | null | undefined, digits = 3): string {
  const n = Number(num)
  if (!Number.isFinite(n) || n === 0) return String(num)
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = priceLookup.slice().reverse().find(it => n >= it.value)
  return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

function formatImage (imageUrl: string | null | undefined): string {
  if (!imageUrl) return ''
  if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl}`
  return `https://api.stc.training/media/${imageUrl}`
}

function errorHandler (errorsObj: unknown): void {
  if (typeof errorsObj === 'object' && errorsObj !== null && !('message' in errorsObj)) {
    const errMap = errorsObj as Record<string, Array<{ message: string }>>
    for (const key in errMap) {
      for (const val of errMap[key]) {
        $q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: val.message,
        })
      }
    }
  } else {
    const msg = (errorsObj as { message?: string })?.message ?? String(errorsObj)
    $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: msg })
  }
}

async function reUploadTheTransactionBill (): Promise<void> {
  const orderId = props.myOrder.pk
  if (orderId == null) return
  loading.value = true
  try {
    const res = await reupload.mutate({
      id: orderId,
      input: { attachment: bankakBill.value },
    })
    const payload = res?.data?.reUploadAttachmentTransaction
    if (payload?.success) {
      $q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        multiLine: true,
        message: 'The transaction has been reuploaded',
      })
      bill.value = false
    } else if (payload?.errors) {
      errorHandler(payload.errors)
    }
  } catch { /* apolloProvider surfaces error */ } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  box-shadow: var(--ds-shadow-xs);
  block-size: 100%;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__invoice {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    font-variant-numeric: tabular-nums;
    strong { color: var(--ds-text); }
  }

  &__steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--ds-space-2);
  }

  &__amount {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-block: var(--ds-space-2);
    border-block-start: 1px dashed var(--ds-border);

    .label {
      font-size: var(--ds-text-xs);
      color: var(--ds-text-muted);
    }
    .value {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-accent-600);
      font-variant-numeric: tabular-nums;
      small {
        font-size: var(--ds-text-xs);
        color: var(--ds-text-muted);
        margin-inline-start: 0.25rem;
      }
    }
  }
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-1);
  font-size: var(--ds-text-xs);
  color: var(--ds-text-muted);
  text-align: center;
  flex: 1;

  :deep(.dot) {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--ds-border);
    background: var(--ds-surface);
    color: var(--ds-text-muted);

    svg { inline-size: 0.9rem; block-size: 0.9rem; }

    &--done {
      background: var(--ds-success);
      border-color: var(--ds-success);
      color: var(--ds-text-onBrand);
    }
  }

  &--done {
    color: var(--ds-text);
  }
}

.order-bill {
  padding: var(--ds-space-5);
  max-inline-size: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__img {
    inline-size: 100%;
    block-size: auto;
    max-block-size: 50vh;
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
