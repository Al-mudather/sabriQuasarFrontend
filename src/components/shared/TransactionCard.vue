<template>
  <ds-card
    class="tx-card"
    :class="[`tx-card--${resolvedStatus}`, { 'tx-card--detailed': detailed }]"
    role="article"
    :aria-labelledby="courseTitleId"
    elevation="sm"
  >
    <div class="tx-card__inner">
      <!-- Row 1: header -->
      <header class="tx-card__head">
        <div class="tx-card__head-start">
          <ds-badge
            :variant="meta.variant"
            size="md"
            class="tx-card__badge"
            :class="{ 'tx-card__badge--breath': resolvedStatus === 'processing' }"
            :aria-label="meta.labelAr"
          >
            <span slot="icon" class="tx-card__badge-icon" v-html="meta.iconSvg"></span>
            {{ meta.labelAr }}
          </ds-badge>
          <h3
            v-if="courseName"
            :id="courseTitleId"
            class="tx-card__title"
          >
            {{ courseName }}
          </h3>
        </div>

        <div v-if="transaction.amount != null" class="tx-card__amount">
          <span class="tx-card__amount-value">{{ formattedAmount }}</span>
          <span v-if="!isFormattedCurrency" class="tx-card__amount-currency">
            {{ transaction.currency }}
          </span>
        </div>
      </header>

      <!-- Row 2: metadata -->
      <div v-if="hasMeta" class="tx-card__meta">
        <span v-if="transaction.id" class="tx-card__meta-id">
          {{ shortId(transaction.id) }}
        </span>
        <span v-if="transaction.id && (transaction.createdAt || transaction.updatedAt)" class="tx-card__meta-dot" aria-hidden="true">·</span>
        <span v-if="transaction.createdAt || transaction.updatedAt" class="tx-card__meta-date">
          {{ formatDate(transaction.createdAt || transaction.updatedAt) }}
        </span>
        <span v-if="(transaction.createdAt || transaction.updatedAt) && transaction.paymentMethod" class="tx-card__meta-dot" aria-hidden="true">·</span>
        <span v-if="transaction.paymentMethod" class="tx-card__meta-payment">
          {{ transaction.paymentMethod }}
        </span>
      </div>

      <!-- Row 3: conditional detail blocks -->
      <div
        v-if="transaction.rejectionReason"
        class="tx-card__message tx-card__message--danger"
        role="note"
      >
        <strong class="tx-card__message-label">{{ 'سبب الرفض' }}:</strong>
        <span>{{ transaction.rejectionReason }}</span>
      </div>

      <div
        v-if="transaction.notes && (detailed || !transaction.rejectionReason)"
        class="tx-card__message tx-card__message--taupe"
        role="note"
      >
        <strong class="tx-card__message-label">{{ 'ملاحظات' }}:</strong>
        <span>{{ transaction.notes }}</span>
      </div>

      <div v-if="transaction.attachmentUrl" class="tx-card__attachment">
        <a
          :href="transaction.attachmentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="tx-card__attachment-link"
        >
          <ds-tag variant="indigo" size="sm">
            <span slot="icon" class="tx-card__attach-icon" v-html="paperclipSvg"></span>
            عرض المرفق
          </ds-tag>
        </a>
      </div>

      <!-- Detailed body -->
      <div v-if="detailed" class="tx-card__details">
        <dl class="tx-card__details-list">
          <template v-if="transaction.courseId">
            <dt>{{ 'رقم الكورس' }}</dt>
            <dd class="tx-card__mono">{{ transaction.courseId }}</dd>
          </template>
          <template v-if="transaction.createdAt">
            <dt>{{ 'تاريخ الإنشاء' }}</dt>
            <dd>{{ formatDate(transaction.createdAt) }}</dd>
          </template>
          <template v-if="transaction.updatedAt">
            <dt>{{ 'آخر تحديث' }}</dt>
            <dd>{{ formatDate(transaction.updatedAt) }}</dd>
          </template>
          <template v-if="transaction.paymentMethod">
            <dt>{{ 'طريقة الدفع' }}</dt>
            <dd>{{ transaction.paymentMethod }}</dd>
          </template>
        </dl>
      </div>

      <!-- Row 4: actions -->
      <footer v-if="actions && actions.length" class="tx-card__actions">
        <ds-button
          v-for="(action, idx) in actions"
          :key="action.key || action.label || idx"
          :variant="action.variant || 'ghost'"
          :size="action.size || 'sm'"
          :loading="!!action.loading"
          :disabled="!!action.disabled"
          @click="onActionClick(action, $event)"
        >
          {{ action.label }}
        </ds-button>
      </footer>
    </div>
  </ds-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DsCard from 'src/design-system/components/DsCard.vue'
import DsBadge from 'src/design-system/components/DsBadge.vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsTag from 'src/design-system/components/DsTag.vue'

type StatusKey = 'completed' | 'processing' | 'rejected' | 'hanged' | 'pending'

interface StatusMeta {
  variant: string
  labelAr: string
  iconSvg: string
}

const STATUS_META: Record<StatusKey, StatusMeta> = {
  completed: {
    variant: 'success',
    labelAr: 'مكتمل',
    iconSvg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  processing: {
    variant: 'indigo',
    labelAr: 'قيد المعالجة',
    iconSvg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5 V8 L10.5 9.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  },
  rejected: {
    variant: 'danger',
    labelAr: 'مرفوض',
    iconSvg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M4 4 L12 12 M12 4 L4 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  hanged: {
    variant: 'warning',
    labelAr: 'معلق',
    iconSvg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><rect x="4" y="3" width="2.6" height="10" rx="0.6" fill="currentColor"/><rect x="9.4" y="3" width="2.6" height="10" rx="0.6" fill="currentColor"/></svg>'
  },
  pending: {
    variant: 'taupe',
    labelAr: 'في الانتظار',
    iconSvg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M4 2 H12 M4 14 H12 M5 2 V5 L8 8 L11 5 V2 M5 14 V11 L8 8 L11 11 V14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
}

const PAPERCLIP_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M10.5 5 L6 9.5 a1.8 1.8 0 0 0 2.5 2.5 L13 7.5 a3.2 3.2 0 0 0 -4.5 -4.5 L4 7.5 a4.6 4.6 0 0 0 6.5 6.5 L14 10.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

// Generate stable per-instance uid without instance-level counter
const uid = Math.random().toString(36).slice(2, 8)
const paperclipSvg = PAPERCLIP_SVG

interface TransactionAction {
  key?: string
  label?: string
  variant?: string
  size?: string
  loading?: boolean
  disabled?: boolean
  handler?: (event: Event, transaction: Record<string, unknown>) => void
}

interface Transaction {
  status?: string
  courseName?: string
  id?: string
  createdAt?: string
  updatedAt?: string
  paymentMethod?: string
  amount?: number | null
  currency?: string
  rejectionReason?: string
  notes?: string
  attachmentUrl?: string
  courseId?: string
}

interface Props {
  transaction?: Transaction
  status?: StatusKey | null
  detailed?: boolean
  actions?: TransactionAction[]
}

const props = withDefaults(defineProps<Props>(), {
  transaction: () => ({}),
  status: null,
  detailed: false,
  actions: () => []
})

const emit = defineEmits<{
  (e: 'action-click', val: { action: TransactionAction; transaction: Transaction | undefined; event: Event }): void
}>()

const resolvedStatus = computed<StatusKey>(() => {
  const raw = (props.status || props.transaction?.status || 'pending') as StatusKey
  return STATUS_META[raw] ? raw : 'pending'
})

const meta = computed(() => STATUS_META[resolvedStatus.value])
const courseName = computed(() => props.transaction?.courseName ?? '')
const courseTitleId = computed(() => `tx-card-title-${uid}`)

const hasMeta = computed(() => {
  const t = props.transaction ?? {}
  return !!(t.id || t.createdAt || t.updatedAt || t.paymentMethod)
})

const formattedAmount = computed(() => {
  const { amount, currency } = props.transaction ?? {}
  if (amount == null) return ''
  return formatAmount(amount, currency)
})

const isFormattedCurrency = computed(() => {
  const { amount, currency } = props.transaction ?? {}
  if (amount == null || !currency) return false
  try {
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount)
    return true
  } catch (e) {
    return false
  }
})

function formatAmount (value: number, currency?: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  try {
    if (currency) {
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(n)
    }
    return new Intl.NumberFormat('ar-SA').format(n)
  } catch (e) {
    return new Intl.NumberFormat('ar-SA').format(n)
  }
}

function formatDate (iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  try {
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
  } catch (e) {
    return d.toLocaleString('ar-EG')
  }
}

function shortId (id?: string): string {
  const s = String(id ?? '')
  return `...${s.slice(-6)}`
}

function onActionClick (action: TransactionAction, event: Event): void {
  if (action && typeof action.handler === 'function') {
    action.handler(event, props.transaction as unknown as Record<string, unknown>)
  }
  emit('action-click', { action, transaction: props.transaction, event })
}
</script>

<style lang="scss" scoped>
.tx-card {
  // DsCard supplies surface/radius/elevation. We tune padding here.
  :deep(.ds-card__body) {
    padding: var(--ds-space-6);
    gap: var(--ds-space-4);
    line-height: var(--ds-leading-arabic);
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  // --- Row 1: header ---
  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-4);
    flex-wrap: wrap;
  }

  &__head-start {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ds-space-2);
    min-inline-size: 0;
    flex: 1 1 auto;
  }

  &__badge-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 12px;
    block-size: 12px;
    :deep(svg) { inline-size: 12px; block-size: 12px; }
  }

  &__badge--breath {
    animation: tx-card-breath var(--ds-duration-breath) var(--ds-ease-in-out) infinite;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: 16px;
    color: var(--ds-ink);
    margin: 0;
    line-height: var(--ds-leading-arabic);
    overflow-wrap: anywhere;
  }

  &__amount {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
    flex-shrink: 0;
  }

  &__amount-value {
    font-family: var(--ds-font-mono);
    font-size: 18px;
    font-weight: var(--ds-weight-medium);
    color: var(--ds-terracotta);
    font-variant-numeric: tabular-nums;
  }

  &__amount-currency {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe);
  }

  // --- Row 2: metadata ---
  &__meta {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: 13px;
    color: var(--ds-taupe);
    line-height: var(--ds-leading-arabic);
  }

  &__meta-id {
    font-family: var(--ds-font-mono);
    font-variant-numeric: tabular-nums;
  }

  &__meta-dot {
    color: var(--ds-neutral-300);
  }

  // --- Row 3: messages / attachment ---
  &__message {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
    padding: var(--ds-space-3) var(--ds-space-4);
    border-radius: var(--ds-radius-md);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-ink);
    line-height: var(--ds-leading-arabic);

    &--danger {
      background: var(--ds-danger-bg);
      border-inline-start: 3px solid var(--ds-danger);
    }
    &--taupe {
      background: var(--ds-surface-sunken);
      border-inline-start: 3px solid var(--ds-neutral-300);
      color: var(--ds-text);
    }
  }

  &__message-label {
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-ink);
  }

  &__attachment {
    display: flex;
  }

  &__attachment-link {
    text-decoration: none;
    display: inline-flex;
    border-radius: var(--ds-radius-pill);
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { transform: translateY(-1px); }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__attach-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  // --- Detailed body ---
  &__details {
    padding-block-start: var(--ds-space-3);
    border-block-start: 1px solid var(--ds-border);
  }

  &__details-list {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--ds-space-2) var(--ds-space-4);
    margin: 0;
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-arabic);

    dt {
      font-family: var(--ds-font-body);
      font-weight: var(--ds-weight-medium);
      color: var(--ds-taupe);
    }
    dd {
      margin: 0;
      color: var(--ds-ink);
      overflow-wrap: anywhere;
    }
  }

  &__mono {
    font-family: var(--ds-font-mono);
    font-variant-numeric: tabular-nums;
  }

  // --- Row 4: actions ---
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
    justify-content: flex-end;
    padding-block-start: var(--ds-space-2);
  }
}

@keyframes tx-card-breath {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.78; }
}

@media (prefers-reduced-motion: reduce) {
  .tx-card__badge--breath { animation: none; }
}
</style>
