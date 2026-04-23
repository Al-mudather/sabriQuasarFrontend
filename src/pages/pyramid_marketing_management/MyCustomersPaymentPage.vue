<template>
  <main class="customers-payment-page">
    <header class="customers-payment-page__head">
      <h1>
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('عمـليات الدفع') }}</span>
      </h1>
    </header>

    <section class="customers-payment-page__body">
      <div v-if="transactions.length > 0" class="customers-payment-page__grid">
        <template v-for="tx in transactions">
          <Transaction-completed
            v-if="tx.node.doneVerification"
            :key="tx.node.pk"
            :customerTrans="tx.node"
          />
          <Transaction-under-processing
            v-else-if="tx.node.marketerEndorse && !tx.node.pyramidManagerEndorse"
            :key="tx.node.pk"
            :customerTrans="tx.node"
          />
          <Transaction-rejected
            v-else-if="tx.node.pyramidRetryPlease"
            :key="tx.node.pk"
            :label="rejectedByTheManager"
            :customerTrans="tx.node"
          />
          <Transaction-rejected
            v-else-if="tx.node.retryPlease || tx.node.pyramidRetryPlease"
            :key="tx.node.pk"
            :label="rejectedByTheMe"
            :customerTrans="tx.node"
          />
          <Transaction-hanged
            v-else
            :key="tx.node.pk"
            :customerTrans="tx.node"
          />
        </template>
      </div>

      <ds-empty-state
        v-else
        :title="$t('ليس لديك عمليات دفع في الوقت الحالي')"
        size="md"
      >
        <template #illustration>
          <img src="~assets/img/Cash Payment-bro.png" alt="" />
        </template>
      </ds-empty-state>
    </section>
  </main>
</template>

<script>
import { AllMarketerAttachmentTransaction } from 'src/queries/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import Transaction_completed from 'src/components/attachment_transactions_management/Transaction_completed.vue'
import Transaction_under_processing from 'src/components/attachment_transactions_management/Transaction_under_processing.vue'
import Transaction_rejected from 'src/components/attachment_transactions_management/Transaction_rejected.vue'
import Transaction_hanged from 'src/components/attachment_transactions_management/Transaction_hanged.vue'

export default {
  name: 'MyCustomersPaymentPage',

  components: {
    'Transaction-completed': Transaction_completed,
    'Transaction-under-processing': Transaction_under_processing,
    'Transaction-rejected': Transaction_rejected,
    'Transaction-hanged': Transaction_hanged
  },

  data () {
    return {
      rejectedByTheManager: this.$t('الطلب مرفوض من الإداره'),
      rejectedByTheMe: this.$t('الطلب مرفوض بواسطتي'),
      customersTransactionsList: []
    }
  },

  computed: {
    transactions () { return this.$_.get(this.customersTransactionsList, 'edges', []) || [] }
  },

  apollo: {
    allMarketerAttachmentTransaction: {
      query () { return AllMarketerAttachmentTransaction },
      result (result) {
        if (!result.loading) {
          this.customersTransactionsList = result.data.allMarketerAttachmentTransaction
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.customers-payment-page {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-6);
    h1 {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
      img { block-size: 1.75rem; inline-size: auto; }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--ds-space-4);
    align-items: stretch;
  }
}
</style>
