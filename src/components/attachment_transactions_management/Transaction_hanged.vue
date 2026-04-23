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
          {{ FORMAT_COUSRE_PRICE(customerTrans.order.totalAmount, 3) }}
          <small>{{ customerTrans.order.currency }}</small>
        </span>
      </div>

      <ds-button variant="primary" size="sm" @click="bill = true">
        {{ $t('إشعار الدفع') }}
      </ds-button>
    </div>

    <q-dialog v-model="bill" persistent>
      <q-card class="tx-bill">
        <img class="tx-bill__img" :src="FORMAT_IMAGE(customerTrans.attachment)" alt="" />
        <div class="tx-bill__actions">
          <ds-button variant="primary" :loading="loading" @click="CONFIRM_OR_REJECT_TRANSACTION(confirm)">
            {{ $t('تأكيد الدفع') }}
          </ds-button>
          <ds-button variant="danger" :loading="loading" @click="CONFIRM_OR_REJECT_TRANSACTION(reject)">
            {{ $t('غير معتمد') }}
          </ds-button>
          <ds-button variant="ghost" @click="bill = false">
            {{ $t('إلغاء') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>

    <TransactionDetails v-if="detail" :customerTrans="customerTrans" v-on:close="detail = false" />
  </article>
</template>

<script>
import { MarketerConfirmAttachmentTransaction } from 'src/queries/attachment_transactions_management/mutation/marketerConfirmAttachmentTransaction'
import { AllMarketerAttachmentTransaction } from 'src/queries/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import TransactionDetails from 'src/components/attachment_transactions_management/Transaction_details.vue'

const priceLookup = [
  { value: 1, symbol: '' }, { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'B' }
]

export default {
  name: 'TransactionHanged',
  components: { TransactionDetails },
  props: ['customerTrans'],

  data () {
    return {
      bill: false,
      detail: false,
      loading: false,
      confirm: { marketerEndorse: true,  retryPlease: false },
      reject:  { marketerEndorse: false, retryPlease: true  }
    }
  },

  methods: {
    FORMAT_COUSRE_PRICE (num, digits = 3) {
      const n = Number(num)
      if (!Number.isFinite(n) || n === 0) return String(num)
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      const item = priceLookup.slice().reverse().find(it => n >= it.value)
      return item ? (n / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
    },

    FORMAT_IMAGE (imageUrl) {
      if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl}`
      return location.origin + `/media/${imageUrl}`
    },

    async CONFIRM_OR_REJECT_TRANSACTION (data) {
      this.loading = true
      try {
        const res = await this.$apollo.mutate({
          mutation: MarketerConfirmAttachmentTransaction,
          variables: { id: this.customerTrans.pk, input: data },
          refetchQueries: [{ query: AllMarketerAttachmentTransaction }]
        })
        const { success, errors } = res.data.marketerAttachmentTransactionConfirmation
        if (success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: 'The transaction has been confirmed by you'
          })
          this.bill = false
        }
      } catch (e) { /* apolloProvider surfaces error */ }
      finally { this.loading = false }
    }
  }
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
