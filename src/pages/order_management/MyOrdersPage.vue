<template>
  <main class="orders-page">
    <header class="orders-page__head">
      <div>
        <h1>{{ $t('طلباتي') }}</h1>
        <p>{{ $t('تتبّع حالة جميع طلباتك وفواتيرك.') }}</p>
      </div>
    </header>

    <nav class="orders-page__filters" role="tablist" aria-label="orders filters">
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeFilter === f.key }"
        role="tab"
        :aria-selected="activeFilter === f.key ? 'true' : 'false'"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
        <span class="filter-chip__count">{{ f.count }}</span>
      </button>
    </nav>

    <section class="orders-page__body">
      <div v-if="loading && orders.length === 0" class="orders-page__skeletons">
        <ds-skeleton v-for="i in 4" :key="i" shape="rect" height="9rem" />
      </div>

      <ds-empty-state
        v-else-if="visibleOrders.length === 0 && activeFilter !== 'all'"
        variant="search"
        :title="$t('لا توجد طلبات في هذا التصنيف')"
        :description="$t('جرّب تصنيفاً آخر لعرض طلباتك.')"
        size="md"
      />

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
        <transaction-card
          v-for="o in visibleOrders"
          :key="o.pk"
          :transaction="mapOrder(o)"
          :status="mapStatus(o)"
          :actions="buildActions(o)"
          @action-click="onAction"
        />
      </div>
    </section>

    <q-dialog v-model="billOpen" persistent>
      <q-card class="order-bill">
        <h3>{{ $t('فاتورة الدفع') }}</h3>
        <img
          v-if="activeOrder && activeOrder.attachment"
          class="order-bill__img"
          :src="FORMAT_IMAGE(activeOrder.attachment)"
          alt=""
        />
        <file-upload
          imgeSize="4000000"
          :accept="'.png,.jpg, image/*'"
          :label="$t('إعادة إرفاق الفاتورة')"
          v-on:File_Handler="reuploadImageHandler"
        />
        <div class="order-bill__actions">
          <ds-button variant="ghost" @click="billOpen = false">
            {{ $t('إلغاء') }}
          </ds-button>
          <ds-button
            variant="primary"
            :loading="reuploadLoading"
            @click="RE_UPLOAD_THE_TRANSACTION_BILL"
          >
            {{ $t('إعادة إرفاق') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script>
import { useSettingsStore } from 'src/stores/settings'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'
import _ from 'lodash'
import { MyAttachmentTransactions } from 'src/graphql/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import { ReUploadAttachmentTransaction } from 'src/graphql/attachment_transactions_management/mutation/ReUploadAttachmentTransaction'
import TransactionCard from 'src/components/shared/TransactionCard.vue'
import FileUpload from 'src/components/utils/FileUploader.vue'

/** @typedef {import('src/types/attachments/types').UserAttachmentTransaction} UserAttachmentTransaction */
/** @typedef {import('src/types/attachments/types').TheUserAttachmentTransactionsResult} TheUserAttachmentTransactionsResult */
/** @typedef {import('src/types/attachments/types').TheUserAttachmentTransactionsVars} TheUserAttachmentTransactionsVars */
/** @typedef {import('src/types/attachments/types').ReUploadAttachmentResult} ReUploadAttachmentResult */
/** @typedef {import('src/types/attachments/types').ReUploadAttachmentVars} ReUploadAttachmentVars */

export default {
  name: 'MyOrders',
  components: { TransactionCard, FileUpload },

  setup () {
    const settings = useSettingsStore()

    /** @type {ReturnType<typeof useQuery<TheUserAttachmentTransactionsResult, TheUserAttachmentTransactionsVars>>} */
    const txQuery = useQuery(MyAttachmentTransactions)
    const myTransactionsOrders = computed(
      () => txQuery.result.value?.myAttachmentTransactions || null
    )
    const loading = txQuery.loading

    /** @type {ReturnType<typeof useMutation<ReUploadAttachmentResult, ReUploadAttachmentVars>>} */
    const reupload = useMutation(ReUploadAttachmentTransaction, {
      refetchQueries: [{ query: MyAttachmentTransactions }]
    })

    return {
      settings,
      myTransactionsOrders,
      loading,
      _reupload: reupload
    }
  },

  data () {
    return {
      activeFilter: 'all',
      billOpen: false,
      activeOrder: null,
      reuploadLoading: false,
      bankakBill: null
    }
  },

  computed: {
    orders () {
      return (_.get(this.myTransactionsOrders, 'edges', []) || []).map(e => e.node)
    },
    statusCounts () {
      const c = { all: this.orders.length, completed: 0, processing: 0, rejected: 0, pending: 0 }
      for (const o of this.orders) {
        const s = this.mapStatus(o)
        if (c[s] != null) c[s] += 1
      }
      return c
    },
    filters () {
      const c = this.statusCounts
      return [
        { key: 'all',        label: this.$t('الكل'),         count: c.all },
        { key: 'completed',  label: this.$t('مكتملة'),       count: c.completed },
        { key: 'processing', label: this.$t('قيد المعالجة'), count: c.processing },
        { key: 'rejected',   label: this.$t('مرفوضة'),       count: c.rejected }
      ]
    },
    visibleOrders () {
      if (this.activeFilter === 'all') return this.orders
      return this.orders.filter(o => this.mapStatus(o) === this.activeFilter)
    }
  },

  mounted () { this.settings.setActiveNav('BORD') },

  methods: {
    mapStatus (o) {
      if (!o) return 'pending'
      if (o.doneVerification) return 'completed'
      if (o.retryPlease || o.pyramidRetryPlease) return 'rejected'
      if (o.marketerEndorse || o.pyramidManagerEndorse) return 'processing'
      return 'pending'
    },

    mapOrder (o) {
      const order = o.order || {}
      return {
        id: order.invoiceNumber || o.pk,
        courseName: order.invoiceNumber ? `${this.$t('طلب رقم')} ${order.invoiceNumber}` : this.$t('طلب'),
        amount: order.totalAmount,
        currency: order.currency,
        createdAt: o.created,
        updatedAt: o.updated
      }
    },

    buildActions (o) {
      const actions = []
      if (o.retryPlease || o.pyramidRetryPlease) {
        actions.push({
          key: 'reupload',
          label: this.$t('رؤية الفاتورة'),
          variant: 'secondary',
          size: 'sm',
          handler: () => this.openBill(o)
        })
      }
      actions.push({
        key: 'details',
        label: this.$t('عرض التفاصيل'),
        variant: 'ghost',
        size: 'sm',
        handler: () => this.viewDetails(o)
      })
      return actions
    },

    onAction () { /* handlers execute via action.handler */ },

    openBill (o) {
      this.activeOrder = o
      this.billOpen = true
    },

    viewDetails (o) {
      // Lightweight: surface an info toast; details drawer out of scope.
      this.$q.notify({
        type: 'info',
        position: 'top',
        progress: true,
        message: `${this.$t('رقم الطلب')}: ${(o.order && o.order.invoiceNumber) || o.pk}`
      })
    },

    reuploadImageHandler (val) { this.bankakBill = val },

    FORMAT_IMAGE (imageUrl) {
      if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl}`
      return `https://api.stc.training/media/${imageUrl}`
    },

    errorHandler (errorsObj) {
      if (errorsObj && errorsObj.message && typeof errorsObj.message !== 'object') {
        this.$q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: errorsObj.message })
        return
      }
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: val.message
          })
        }
      }
    },

    async RE_UPLOAD_THE_TRANSACTION_BILL () {
      if (!this.activeOrder) return
      this.reuploadLoading = true
      try {
        const res = await this._reupload.mutate({
          id: this.activeOrder.pk,
          input: { attachment: this.bankakBill }
        })
        const { success, errors } = res.data.reUploadAttachmentTransaction
        if (success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تم إعادة إرفاق الفاتورة')
          })
          this.billOpen = false
          this.activeOrder = null
          this.bankakBill = null
        } else if (errors) {
          this.errorHandler(errors)
        }
      } catch (e) { /* apollo surfaces */ }
      finally { this.reuploadLoading = false }
    },

    GO_TO_COURSES_PAGE () { this.$router.push({ name: 'courses' }) }
  }
}
</script>

<style lang="scss" scoped>
.orders-page {
  background: var(--ds-cream, var(--ds-surface-muted));
  min-block-size: 100vh;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-5);

    h1 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-ink, var(--ds-text));
      margin: 0 0 var(--ds-space-1);
    }
    p {
      margin: 0;
      color: var(--ds-taupe, var(--ds-text-muted));
      font-size: var(--ds-text-sm);
    }
  }

  &__filters {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-5);
  }

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--ds-space-4);
    align-items: stretch;
  }
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-1);
  padding: 0.45rem 0.95rem;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { background: var(--ds-surface-sunken); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
  &--active {
    background: var(--ds-brand-700, #322873);
    color: var(--ds-text-onBrand, #fff);
    border-color: var(--ds-brand-700, #322873);
  }

  &__count {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    opacity: 0.85;
    padding-inline-start: var(--ds-space-1);
  }
}

.order-bill {
  padding: var(--ds-space-5);
  max-inline-size: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  h3 {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
  }

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
    gap: var(--ds-space-2);
    justify-content: flex-end;
  }
}
</style>
