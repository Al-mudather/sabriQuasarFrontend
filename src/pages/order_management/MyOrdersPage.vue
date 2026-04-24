<template>
  <main class="orders-page">
    <header class="orders-page__head">
      <div>
        <h1>{{ t('طلباتي') }}</h1>
        <p>{{ t('تتبّع حالة جميع طلباتك وفواتيرك.') }}</p>
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
        :title="t('لا توجد طلبات في هذا التصنيف')"
        :description="t('جرّب تصنيفاً آخر لعرض طلباتك.')"
        size="md"
      />

      <ds-empty-state
        v-else-if="orders.length === 0"
        :title="t('لا توجد طلبات بعد')"
        :description="t('ابدأ بشراء كورس وستظهر جميع طلباتك هنا.')"
        size="md"
      >
        <template #actions>
          <ds-button variant="primary" @click="goToCoursesPage">
            {{ t('تصفح الكورسات') }}
          </ds-button>
        </template>
      </ds-empty-state>

      <div v-else class="orders-page__grid">
        <transaction-card
          v-for="o in visibleOrders"
          :key="o.pk ?? o.order?.pk"
          :transaction="mapOrder(o)"
          :status="mapStatus(o)"
          :actions="buildActions(o)"
          @action-click="onAction"
        />
      </div>
    </section>

    <q-dialog v-model="billOpen" persistent>
      <q-card class="order-bill">
        <h3>{{ t('فاتورة الدفع') }}</h3>
        <img
          v-if="activeOrder && activeOrder.attachment"
          class="order-bill__img"
          :src="formatImage(activeOrder.attachment)"
          alt=""
        />
        <file-upload
          imgeSize="4000000"
          :accept="'.png,.jpg, image/*'"
          :label="t('إعادة إرفاق الفاتورة')"
          v-on:File_Handler="reuploadImageHandler"
        />
        <div class="order-bill__actions">
          <ds-button variant="ghost" @click="billOpen = false">
            {{ t('إلغاء') }}
          </ds-button>
          <ds-button
            variant="primary"
            :loading="reuploadLoading"
            @click="reUploadTheTransactionBill"
          >
            {{ t('إعادة إرفاق') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'src/stores/settings'
import { useAuthStore } from 'src/stores/auth'
import { MyAttachmentTransactions } from 'src/graphql/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import { ReUploadAttachmentTransaction } from 'src/graphql/attachment_transactions_management/mutation/ReUploadAttachmentTransaction'
import TransactionCard from 'src/components/shared/TransactionCard.vue'
import FileUpload from 'src/components/utils/FileUploader.vue'
import type {
  TheUserAttachmentTransactionsResult,
  TheUserAttachmentTransactionsVars,
  ReUploadAttachmentResult,
  ReUploadAttachmentVars,
  UserAttachmentTransaction,
} from 'src/types/attachments/types'

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const settings = useSettingsStore()
const auth = useAuthStore()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type OrderStatus = 'completed' | 'processing' | 'rejected' | 'pending'

interface TransactionDisplayItem {
  id: string | number | null | undefined
  courseName: string
  amount: number | null | undefined
  currency: string | null | undefined
  createdAt: string | null | undefined
  updatedAt: string | null | undefined
}

interface TransactionAction {
  key: string
  label: string
  variant: string
  size: string
  handler: () => void
}

interface FilterChip {
  key: string
  label: string
  count: number
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const activeFilter = ref<string>('all')
const billOpen = ref(false)
const activeOrder = ref<UserAttachmentTransaction | null>(null)
const reuploadLoading = ref(false)
const bankakBill = ref<File | null>(null)

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
const txQuery = useQuery<TheUserAttachmentTransactionsResult, TheUserAttachmentTransactionsVars>(
  MyAttachmentTransactions,
)
const loading = txQuery.loading

const orders = computed<UserAttachmentTransaction[]>(
  () => (txQuery.result.value?.myAttachmentTransactions?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node)
    .map(e => e.node as UserAttachmentTransaction),
)

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------
const reupload = useMutation<ReUploadAttachmentResult, ReUploadAttachmentVars>(
  ReUploadAttachmentTransaction,
  { refetchQueries: [{ query: MyAttachmentTransactions }] },
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mapStatus (o: UserAttachmentTransaction): OrderStatus {
  if (!o) return 'pending'
  if (o.doneVerification) return 'completed'
  if (o.retryPlease || o.pyramidRetryPlease) return 'rejected'
  if (o.marketerEndorse || o.pyramidManagerEndorse) return 'processing'
  return 'pending'
}

function mapOrder (o: UserAttachmentTransaction): TransactionDisplayItem {
  const order = o.order ?? null
  return {
    id: order?.invoiceNumber ?? o.pk,
    courseName: order?.invoiceNumber
      ? `${t('طلب رقم')} ${order.invoiceNumber}`
      : t('طلب'),
    amount: order?.totalAmount,
    currency: order?.currency ?? null,
    createdAt: o.created,
    updatedAt: o.updated,
  }
}

function buildActions (o: UserAttachmentTransaction): TransactionAction[] {
  const actions: TransactionAction[] = []
  if (o.retryPlease || o.pyramidRetryPlease) {
    actions.push({
      key: 'reupload',
      label: t('رؤية الفاتورة'),
      variant: 'secondary',
      size: 'sm',
      handler: () => openBill(o),
    })
  }
  actions.push({
    key: 'details',
    label: t('عرض التفاصيل'),
    variant: 'ghost',
    size: 'sm',
    handler: () => viewDetails(o),
  })
  return actions
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const statusCounts = computed(() => {
  const c: Record<string, number> = { all: orders.value.length, completed: 0, processing: 0, rejected: 0, pending: 0 }
  for (const o of orders.value) {
    const s = mapStatus(o)
    if (c[s] != null) c[s] += 1
  }
  return c
})

const filters = computed<FilterChip[]>(() => {
  const c = statusCounts.value
  return [
    { key: 'all',        label: t('الكل'),         count: c.all ?? 0 },
    { key: 'completed',  label: t('مكتملة'),       count: c.completed ?? 0 },
    { key: 'processing', label: t('قيد المعالجة'), count: c.processing ?? 0 },
    { key: 'rejected',   label: t('مرفوضة'),       count: c.rejected ?? 0 },
  ]
})

const visibleOrders = computed<UserAttachmentTransaction[]>(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(o => mapStatus(o) === activeFilter.value)
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function onAction (): void { /* handlers execute via action.handler */ }

function openBill (o: UserAttachmentTransaction): void {
  activeOrder.value = o
  billOpen.value = true
}

function viewDetails (o: UserAttachmentTransaction): void {
  const invoiceNumber = o.order?.invoiceNumber
  $q.notify({
    type: 'info',
    position: 'top',
    progress: true,
    message: `${t('رقم الطلب')}: ${invoiceNumber ?? o.pk}`,
  })
}

function reuploadImageHandler (val: File): void {
  bankakBill.value = val
}

function formatImage (imageUrl: string | null): string {
  if (!imageUrl) return ''
  if (process.env.NODE_ENV === 'development') return `http://localhost:8000/media/${imageUrl}`
  return `https://api.stc.training/media/${imageUrl}`
}

function errorHandler (errorsObj: unknown): void {
  if (errorsObj && typeof errorsObj === 'object' && 'message' in errorsObj) {
    const msg = (errorsObj as { message: unknown }).message
    if (typeof msg === 'string') {
      $q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: msg })
      return
    }
  }
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
}

async function reUploadTheTransactionBill (): Promise<void> {
  if (!activeOrder.value) return
  const orderId = activeOrder.value.pk
  if (orderId == null) return
  reuploadLoading.value = true
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
        message: t('تم إعادة إرفاق الفاتورة'),
      })
      billOpen.value = false
      activeOrder.value = null
      bankakBill.value = null
    } else if (payload?.errors) {
      errorHandler(payload.errors)
    }
  } catch { /* apollo surfaces */ } finally {
    reuploadLoading.value = false
  }
}

function goToCoursesPage (): void {
  if (!auth.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }
  router.push({ name: 'courses' })
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  settings.setActiveNav('BORD')
})
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
