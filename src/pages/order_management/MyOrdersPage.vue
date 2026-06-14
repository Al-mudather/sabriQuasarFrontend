<template>
  <main class="orders-page">
    <!-- Head -->
    <header class="orders-page__head">
      <div>
        <h1 class="orders-page__title">{{ $t('طلباتي') }}</h1>
        <p class="orders-page__subtitle">{{ $t('تتبّع حالة جميع طلباتك وفواتيرك.') }}</p>
      </div>
    </header>

    <!-- Filter chips (MyCourses pattern) -->
    <nav
      class="orders-page__chips"
      role="tablist"
      :aria-label="$t('تصفية الطلبات حسب الحالة')"
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
        :title="$t('لا توجد طلبات في هذا التصنيف')"
        :description="$t('جرّب تصنيفاً آخر لعرض طلباتك.')"
        size="md"
      />

      <!-- Empty: no orders at all -->
      <ds-empty-state
        v-else-if="orders.length === 0"
        :title="$t('لا توجد طلبات بعد')"
        :description="$t('ابدأ بشراء كورس وستظهر جميع طلباتك هنا.')"
        size="md"
      >
        <template #actions>
          <ds-button variant="primary" @click="goToCoursesPage">
            {{ $t('تصفح الدورات') }}
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
          :aria-label="$t('طلب {n} — {s}', { n: o.order?.invoiceNumber ?? '', s: STATUS_LABEL[mapStatus(o)] })"
        >
          <header class="order-card__head">
            <span
              class="order-card__status"
              :class="[`order-card__status--${mapStatus(o)}`]"
            >
              <span class="order-card__status-dot" aria-hidden="true"></span>
              <span class="order-card__status-label">
                {{ STATUS_LABEL[mapStatus(o)] }}
              </span>
            </span>

            <div v-if="o.order?.totalAmount != null" class="order-card__amount">
              <span class="order-card__amount-value">{{ formatAmount(o.order.totalAmount) }}</span>
              <span class="order-card__amount-currency">{{ currencyLabel(o) }}</span>
            </div>
          </header>

          <div class="order-card__body">
            <dl class="order-card__meta">
              <div class="order-card__meta-row">
                <dt class="order-card__meta-label">{{ $t('رقم الفاتورة') }}</dt>
                <dd class="order-card__meta-value order-card__meta-value--mono">
                  {{ o.order?.invoiceNumber ?? '—' }}
                </dd>
              </div>
              <div class="order-card__meta-row">
                <dt class="order-card__meta-label">{{ $t('تاريخ الطلب') }}</dt>
                <dd class="order-card__meta-value">
                  {{ formatDate(o.created ?? o.updated) }}
                </dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { useSettingsStore } from 'src/stores/settings'
import { useAuthStore } from 'src/stores/auth'
import { useIntl } from 'src/composables/useIntl'
import { MyAttachmentTransactions } from 'src/graphql/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import type {
  TheUserAttachmentTransactionsResult,
  TheUserAttachmentTransactionsVars,
  UserAttachmentTransaction,
} from 'src/types/attachments/types'

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------
const router = useRouter()
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

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
// cache-and-network: show cached orders instantly, but always refetch the
// latest from the server so a just-placed order appears without a hard reload.
const txQuery = useQuery<TheUserAttachmentTransactionsResult, TheUserAttachmentTransactionsVars>(
  MyAttachmentTransactions,
  {},
  { fetchPolicy: 'cache-and-network' },
)
const loading = txQuery.loading

const orders = computed<UserAttachmentTransaction[]>(
  () => (txQuery.result.value?.myAttachmentTransactions?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node)
    .map(e => e.node as UserAttachmentTransaction)
    // Newest first — the backend returns oldest-first, so a new order would
    // otherwise land at the bottom of the list.
    .slice()
    .sort((a, b) => {
      const ta = a.created ? new Date(a.created).getTime() : 0
      const tb = b.created ? new Date(b.created).getTime() : 0
      return tb - ta
    }),
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

const { formatNumber, formatDate: fmtDateLocale } = useIntl()

function formatAmount (value: number | null | undefined): string {
  if (value == null) return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  return formatNumber(n, { maximumFractionDigits: 2 })
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
  return fmtDateLocale(iso, { year: 'numeric', month: 'long', day: 'numeric' })
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--ds-space-4);
    align-items: stretch;
  }

  &__skeletons {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--ds-space-3);
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

/* ---------- Order card (editorial) ---------- */
.order-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
  padding: var(--ds-space-5) var(--ds-space-5) var(--ds-space-5);
  background: var(--ds-surface-elevated, #fff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg, 14px);
  box-shadow: var(--ds-shadow-xs);
  transition:
    box-shadow var(--ds-duration-fast, 150ms) ease,
    border-color var(--ds-duration-fast, 150ms) ease,
    transform var(--ds-duration-fast, 150ms) ease;

  &:hover {
    box-shadow: var(--ds-shadow-md, var(--ds-shadow-sm));
    border-color: var(--ds-brand-600, #322873);
    transform: translateY(-1px);
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  /* Status as an inline dot + word (no pill), leading the card */
  &__status {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-semibold);
    line-height: 1.2;
  }

  &__status-dot {
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 18%, transparent);
    flex-shrink: 0;
  }

  &__status-label { line-height: 1; }

  &__status--completed  { color: var(--ds-success, #5a8e3a); }
  &__status--processing { color: var(--ds-warning, #b8862a); }
  &__status--rejected   { color: var(--ds-danger,  #9e3524); }
  &__status--pending    { color: var(--ds-brand-600, #322873); }

  /* Hero amount: large, tabular, indigo */
  &__amount {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
    flex-shrink: 0;
  }

  &__amount-value {
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-2xl, 24px);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-600, #322873);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  &__amount-currency {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
    font-weight: var(--ds-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__body {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }

  /* Metadata block: label + value rows */
  &__meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-2);
    margin: 0;
    padding-block-start: var(--ds-space-3);
    border-block-start: 1px solid var(--ds-border);
  }

  &__meta-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }

  &__meta-label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
    font-weight: var(--ds-weight-medium);
    letter-spacing: 0.02em;
  }

  &__meta-value {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-ink, var(--ds-text));
    font-weight: var(--ds-weight-medium);
    text-align: end;
  }

  &__meta-value--mono {
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-variant-numeric: tabular-nums;
    color: var(--ds-taupe, var(--ds-text-muted));
    font-size: var(--ds-text-sm);
  }
}
</style>
