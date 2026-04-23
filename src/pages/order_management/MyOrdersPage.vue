<template>
  <main class="orders-page">
    <header class="orders-page__head">
      <h1>
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('طلبـاتي') }}</span>
      </h1>
    </header>

    <section class="orders-page__body">
      <div v-if="loading && orders.length === 0" class="orders-page__skeletons">
        <ds-skeleton v-for="i in 4" :key="i" shape="rect" height="9rem" />
      </div>

      <ds-empty-state
        v-else-if="orders.length === 0"
        :title="$t('لا توجد طلبات بعد')"
        :description="$t('ابدأ بشراء كورس وستظهر جميع طلباتك هنا.')"
        size="md"
      >
        <template #actions>
          <ds-button variant="primary" @click="GO_TO_COURSES_PAGE">
            {{ $t('تصفح الكورسات') }}
          </ds-button>
        </template>
      </ds-empty-state>

      <div v-else class="orders-page__grid">
        <Transaction-order-detail
          v-for="myOrder in orders"
          :key="myOrder.node.pk"
          :myOrder="myOrder.node"
        />
      </div>
    </section>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { MyAttachmentTransactions } from 'src/queries/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import { MarketerConfirmAttachmentTransaction } from 'src/queries/attachment_transactions_management/mutation/marketerConfirmAttachmentTransaction'
import { AllMarketerAttachmentTransaction } from 'src/queries/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import TransactionOrderDetail from 'src/components/orders_management/transactionOrderDetail.vue'

export default {
  name: 'MyOrders',
  components: { 'Transaction-order-detail': TransactionOrderDetail },

  data () {
    return {
      bill: false,
      loading: true,
      confirm: { marketerEndorse: true, retryPlease: false },
      reject:  { marketerEndorse: false, retryPlease: true },
      myTransactionsOrders: [],
      allEnrollmentsForCurrentUser: {}
    }
  },

  computed: {
    orders () { return this.$_.get(this.myTransactionsOrders, 'edges', []) || [] }
  },

  apollo: {
    myAttachmentTransactions: {
      query () { return MyAttachmentTransactions },
      result (result) {
        this.loading = result.loading
        if (!result.loading) this.myTransactionsOrders = result.data.myAttachmentTransactions
      }
    }
  },

  mounted () { this.setActiveNavAction('BORD') },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),

    FORMAT_IMAGE (imageUrl) {
      if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl}`
      return location.origin + `/media/${imageUrl}`
    },

    async CONFIRM_OR_REJECT_TRANSACTION (data) {
      this.loading = true
      const confirm_res = await this.$apollo.mutate({
        mutation: MarketerConfirmAttachmentTransaction,
        variables: { id: this.customerTrans.pk, input: data },
        refetchQueries: [{ query: AllMarketerAttachmentTransaction }]
      })
      const errors = confirm_res.data.marketerAttachmentTransactionConfirmation.errors
      const success = confirm_res.data.marketerAttachmentTransactionConfirmation.success
      if (success) {
        this.loading = false
        this.bill = false
        this.$q.notify({
          type: 'positive',
          position: 'top',
          progress: true,
          multiLine: true,
          message: 'The transaction has been confirmed by you'
        })
      } else if (errors) {
        this.loading = false
        this.bill = false
        this.errorHandler(errors)
      }
    },

    GO_TO_COURSES_PAGE () { this.$router.push({ name: 'courses' }) }
  }
}
</script>

<style lang="scss" scoped>
.orders-page {
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

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--ds-space-4);
    align-items: stretch;
  }
}
</style>
