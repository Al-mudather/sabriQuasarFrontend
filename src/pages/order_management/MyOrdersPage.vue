<template>
  <main class="orders-page">
    <!-- Head -->
    <header class="orders-page__head">
      <div>
        <h1 class="orders-page__title">طلباتي</h1>
        <p class="orders-page__subtitle">تتبّع حالة جميع طلباتك وفواتيرك.</p>
      </div>
    </header>

    <!-- Filter chips (MyCourses pattern) -->
    <nav
      class="orders-page__chips"
      role="tablist"
      aria-label="تصفية الطلبات حسب الحالة"
    >
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        role="tab"
        :aria-selected="activeFilter === f.key"
        :aria-pressed="activeFilter === f.key"
        :aria-label="`${f.label} (${f.count})`"
        class="chip"
        :class="{ 'chip--active': activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        <span class="chip__label">{{ f.label }}</span>
        <span class="chip__count">{{ f.count }}</span>
      </button>
    </nav>

    <section class="orders-page__body">
      <!-- Loading -->
      <div v-if="loading && orders.length === 0" class="orders-page__skeletons">
        <ds-skeleton v-for="i in 4" :key="i" shape="rect" height="10rem" />
      </div>

      <!-- Empty: filtered -->
      <ds-empty-state
        v-else-if="visibleOrders.length === 0 && activeFilter !== 'all'"
        variant="search"
        title="لا توجد طلبات في هذا التصنيف"
        description="جرّب تصنيفاً آخر لعرض طلباتك."
        size="md"
      />

      <!-- Empty: no orders at all -->
      <ds-empty-state
        v-else-if="orders.length === 0"
        title="لا توجد طلبات بعد"
        description="ابدأ بشراء كورس وستظهر جميع طلباتك هنا."
        size="md"
      >
        <template #actions>
          <ds-button variant="primary" @click="goToCoursesPage">
            تصفح الكورسات
          </ds-button>
        </template>
      </ds-empty-state>

      <!-- Grid -->
      <div v-else class="orders-page__grid">
        <article
          v-for="o in visibleOrders"
          :key="o.pk ?? o.order?.pk ?? ''"
          class="order-card"
          :class="[`order-card--${mapStatus(o)}`]"
          role="article"
        >
          <header class="order-card__head">
            <span
              class="order-card__status"
              :class="[`order-card__status--${mapStatus(o)}`]"
            >
              <span class="order-card__status-dot" aria-hidden="true"></span>
              {{ STATUS_LABEL[mapStatus(o)] }}
            </span>

            <div v-if="o.order?.totalAmount != null" class="order-card__amount">
              <span class="order-card__amount-value">{{ formatAmount(o.order.totalAmount) }}</span>
              <span class="order-card__amount-currency">{{ currencyLabel(o) }}</span>
            </div>
          </header>

          <div class="order-card__body">
            <h3 class="order-card__title">
              {{ o.order?.invoiceNumber ? `طلب رقم ${o.order.invoiceNumber}` : 'طلب' }}
            </h3>
            <p class="order-card__date">
              {{ formatDate(o.created ?? o.updated) }}
            </p>
          </div>

          <footer class="order-card__actions">
            <ds-button
              v-if="canReupload(o)"
              variant="secondary"
              size="sm"
              @click="openBill(o)"
            >
              إعادة إرفاق الفاتورة
            </ds-button>
            <ds-button
              variant="ghost"
              size="sm"
              @click="viewDetails(o)"
            >
              عرض التفاصيل
            </ds-button>
          </footer>
        </article>
      </div>
    </section>

    <!-- Reupload dialog -->
    <ds-modal v-model="billOpen" size="md" persistent close-label="إغلاق">
      <template #header>
        <div class="order-bill__header">
          <h3 class="order-bill__title">فاتورة الدفع</h3>
          <p class="order-bill__subtitle">
            يمكنك مراجعة الفاتورة الحالية أو رفع نسخة محدّثة.
          </p>
        </div>
      </template>

      <div class="order-bill">
        <img
          v-if="activeOrder && activeOrder.attachment"
          class="order-bill__img"
          :src="formatImage(activeOrder.attachment)"
          alt="فاتورة الدفع الحالية"
        />
        <div v-else class="order-bill__img order-bill__img--empty">
          لا توجد فاتورة مرفقة حالياً
        </div>

        <file-upload
          :imgeSize="4000000"
          :accept="'.png,.jpg, image/*'"
          label="إعادة إرفاق الفاتورة"
          @File_Handler="reuploadImageHandler"
        />
      </div>

      <template #footer>
        <ds-button variant="ghost" @click="billOpen = false">إلغاء</ds-button>
        <ds-button
          variant="primary"
          :loading="reuploadLoading"
          :disabled="!bankakBill"
          @click="reUploadTheTransactionBill"
        >
          إعادة إرفاق
        </ds-button>
      </template>
    </ds-modal>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'
import { useAuthStore } from 'src/stores/auth'
import { MyAttachmentTransactions } from 'src/graphql/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import { ReUploadAttachmentTransaction } from 'src/graphql/attachment_transactions_management/mutation/ReUploadAttachmentTransaction'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import DsModal from 'src/design-system/components/DsModal.vue'
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
const settings = useSettingsStore()
const auth = useAuthStore()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type OrderStatus = 'completed' | 'processing' | 'rejected' | 'pending'

interface FilterChip {
  key: OrderStatus | 'all'
  label: string
  count: number
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  completed: 'مكتملة',
  processing: 'قيد المعالجة',
  rejected: 'مرفوضة',
  pending: 'في الانتظار',
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const activeFilter = ref<FilterChip['key']>('all')
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

function canReupload (o: UserAttachmentTransaction): boolean {
  return !!(o.retryPlease || o.pyramidRetryPlease)
}

function formatAmount (value: number | null | undefined): string {
  if (value == null) return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  // English digits for numerals (per brief).
  try {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
  } catch {
    return String(n)
  }
}

function currencyLabel (o: UserAttachmentTransaction): string {
  const raw = o.order?.currency as unknown
  if (!raw) return ''
  if (typeof raw === 'string') return raw
  if (typeof raw === 'object') {
    const rec = raw as Record<string, unknown>
    if (typeof rec.name === 'string') return rec.name
    if (typeof rec.code === 'string') return rec.code
  }
  return ''
}

function formatDate (iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  try {
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(d)
  } catch {
    return d.toLocaleDateString('ar-EG')
  }
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const statusCounts = computed(() => {
  const c: Record<FilterChip['key'], number> = {
    all: orders.value.length,
    completed: 0,
    processing: 0,
    rejected: 0,
    pending: 0,
  }
  for (const o of orders.value) {
    const s = mapStatus(o)
    c[s] += 1
  }
  return c
})

const filters = computed<FilterChip[]>(() => {
  const c = statusCounts.value
  return [
    { key: 'all',        label: 'الكل',          count: c.all },
    { key: 'completed',  label: 'مكتملة',        count: c.completed },
    { key: 'processing', label: 'قيد المعالجة',  count: c.processing },
    { key: 'rejected',   label: 'مرفوضة',        count: c.rejected },
  ]
})

const visibleOrders = computed<UserAttachmentTransaction[]>(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(o => mapStatus(o) === activeFilter.value)
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function openBill (o: UserAttachmentTransaction): void {
  activeOrder.value = o
  bankakBill.value = null
  billOpen.value = true
}

function viewDetails (o: UserAttachmentTransaction): void {
  const invoiceNumber = o.order?.invoiceNumber
  $q.notify({
    type: 'info',
    position: 'top',
    progress: true,
    message: `رقم الطلب: ${invoiceNumber ?? o.pk ?? ''}`,
  })
}

function reuploadImageHandler (val: File | null): void {
  if (!val) return
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
        message: 'تم إعادة إرفاق الفاتورة',
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
  background: var(--ds-surface, var(--ds-cream));
  min-block-size: 100vh;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  /* ---------- Head ---------- */
  &__head {
    margin-block-end: var(--ds-space-5);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-1);
    line-height: var(--ds-leading-arabic);
  }

  &__subtitle {
    margin: 0;
    color: var(--ds-taupe, var(--ds-text-muted));
    font-size: var(--ds-text-sm);
    font-family: var(--ds-font-body);
    line-height: var(--ds-leading-arabic);
  }

  /* ---------- Chips ---------- */
  &__chips {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-6);
  }

  /* ---------- Grid ---------- */
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-4);
    align-items: stretch;

    @media (min-width: 640px) {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  &__skeletons {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-3);

    @media (min-width: 640px) {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }
}

/* ---------- Chip (MyCourses pattern) ---------- */
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding-block: 6px;
  padding-inline: var(--ds-space-3);
  background: transparent;
  border: 1px solid var(--ds-border);
  border-radius: 999px;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text-muted, var(--ds-taupe));
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast, 150ms) ease,
    color var(--ds-duration-fast, 150ms) ease,
    border-color var(--ds-duration-fast, 150ms) ease,
    box-shadow var(--ds-duration-fast, 150ms) ease;

  &:hover,
  &:focus-visible {
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-300, #897dc3);
    background: rgba(50, 40, 115, 0.04);
  }

  &:focus-visible {
    outline: 2px solid var(--ds-brand-300, #897dc3);
    outline-offset: 2px;
  }

  &--active {
    background: var(--ds-surface-elevated, #fff);
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-600, #322873);
    box-shadow: var(--ds-shadow-xs);
  }

  &--active:hover,
  &--active:focus-visible {
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-600, #322873);
    background: var(--ds-surface-elevated, #fff);
  }

  &__label { line-height: 1; }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.5rem;
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: 999px;
    background: var(--ds-border);
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: var(--ds-text-muted, var(--ds-taupe));
    line-height: 1;
  }

  &:hover &__count,
  &:focus-visible &__count {
    color: var(--ds-brand-600, #322873);
  }

  &--active &__count {
    background: var(--ds-brand-600, #322873);
    color: var(--ds-ivory, #fbf6ee);
  }
}

/* ---------- Order card ---------- */
.order-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  padding: var(--ds-space-5);
  background: var(--ds-surface-elevated, #fff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg, 14px);
  box-shadow: var(--ds-shadow-xs);
  transition:
    box-shadow var(--ds-duration-fast, 150ms) ease,
    transform  var(--ds-duration-fast, 150ms) ease;

  &:hover {
    box-shadow: var(--ds-shadow-sm);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding-block: 4px;
    padding-inline: var(--ds-space-3);
    border-radius: 999px;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-semibold);
    line-height: 1;
  }

  &__status-dot {
    inline-size: 6px;
    block-size: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  &__status--completed {
    color: var(--ds-success, #5a8e3a);
    background: var(--ds-success-bg, #e8efde);
  }
  &__status--processing {
    color: var(--ds-brand-600, #322873);
    background: var(--ds-brand-50, #ece9f5);
  }
  &__status--rejected {
    color: var(--ds-danger, #9e3524);
    background: var(--ds-danger-bg, #f2dad4);
  }
  &__status--pending {
    color: var(--ds-warning, #b8862a);
    background: var(--ds-warning-bg, #f5ead1);
  }

  &__amount {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
    flex-shrink: 0;
  }

  &__amount-value {
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-xl, 20px);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-ink, var(--ds-text));
    font-variant-numeric: tabular-nums;
  }

  &__amount-currency {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    font-weight: var(--ds-weight-medium);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    min-inline-size: 0;
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg, 17px);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-ink, var(--ds-text));
    line-height: var(--ds-leading-arabic);
    overflow-wrap: anywhere;
  }

  &__date {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    line-height: var(--ds-leading-arabic);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
    justify-content: flex-end;
    padding-block-start: var(--ds-space-2);
    border-block-start: 1px solid var(--ds-border);
  }
}

/* ---------- Bill modal ---------- */
.order-bill {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__header { display: flex; flex-direction: column; gap: var(--ds-space-1); }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    line-height: var(--ds-leading-arabic);
  }

  &__subtitle {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    line-height: var(--ds-leading-arabic);
  }

  &__img {
    inline-size: 100%;
    block-size: auto;
    max-block-size: 50vh;
    object-fit: contain;
    border-radius: var(--ds-radius-md, 10px);
    background: var(--ds-surface-sunken, #efe8dc);
    border: 1px solid var(--ds-border);

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-block: var(--ds-space-6);
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      color: var(--ds-taupe, var(--ds-text-muted));
    }
  }
}
</style>
