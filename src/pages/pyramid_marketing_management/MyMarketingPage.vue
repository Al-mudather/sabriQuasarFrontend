<template>
  <main class="marketing-page">
    <!-- Page header -->
    <header class="marketing-page__head">
      <h1 class="marketing-page__title">{{ $t('التسويق الخاص بي') }}</h1>
      <p class="marketing-page__subtitle">
        {{ $t('إحالاتك، أرباحك، وسجل السحوبات في لوحة واحدة.') }}
      </p>
    </header>

    <!-- Compact metrics strip (no donuts, no tile cards) -->
    <section
      class="metrics-strip"
      role="group"
      :aria-label="$t('ملخص الأداء')"
    >
      <div class="metrics-strip__item">
        <span class="metrics-strip__figure" dir="ltr">
          <span class="metrics-strip__value">{{ formatNumber(activeBalance) }}</span>
          <span class="metrics-strip__suffix">{{ payoutCurrency }}</span>
        </span>
        <span class="metrics-strip__label">{{ $t('الرصيد الحالي') }}</span>
      </div>

      <span class="metrics-strip__divider" aria-hidden="true"></span>

      <div class="metrics-strip__item">
        <span class="metrics-strip__figure" dir="ltr">
          <span class="metrics-strip__value metrics-strip__value--accent">{{ formatNumber(totalEarnings) }}</span>
          <span class="metrics-strip__suffix">{{ payoutCurrency }}</span>
        </span>
        <span class="metrics-strip__label">{{ $t('إجمالي الأرباح') }}</span>
        <ds-button
          class="metrics-strip__action"
          variant="accent"
          size="sm"
          :loading="claiming"
          :disabled="totalEarnings <= 0"
          :aria-label="$t('تحصيل الأرباح إلى رصيدي')"
          @click="redeemEarnings"
        >
          {{ $t('تحصيل الأرباح') }}
        </ds-button>
      </div>

      <span class="metrics-strip__divider" aria-hidden="true"></span>

      <div class="metrics-strip__item">
        <span class="metrics-strip__figure" dir="ltr">
          <span class="metrics-strip__value">{{ formatNumber(pendingPayouts) }}</span>
        </span>
        <span class="metrics-strip__label">{{ $t('سحوبات قيد الانتظار') }}</span>
      </div>

      <span class="metrics-strip__divider" aria-hidden="true"></span>

      <div class="metrics-strip__item">
        <span class="metrics-strip__figure" dir="ltr">
          <span class="metrics-strip__value metrics-strip__value--accent">{{ formatNumber(affiliatesCount) }}</span>
        </span>
        <span class="metrics-strip__label">{{ $t('إحالات') }}</span>
      </div>
    </section>

    <!-- Referral code block (no ds-card wrapper) -->
    <section class="referral" :aria-label="$t('رمز الدعوة الخاص بك')">
      <div class="referral__head">
        <h2 class="referral__title">{{ $t('رمز الدعوة الخاص بك') }}</h2>
        <p class="referral__hint">
          {{ $t('شارك رمزك مع أصدقائك واكسب عمولة عند كل تسجيل.') }}
        </p>
      </div>

      <div class="referral__code-row">
        <div class="referral__code-field">
          <span class="referral__code-label">{{ $t('رمز الدعوة') }}</span>
          <code
            class="referral__code"
            dir="ltr"
            :aria-label="$t('رمز الدعوة')"
          >{{ referralCode || '—' }}</code>
        </div>

        <div class="referral__actions">
          <ds-button
            variant="ghost"
            size="sm"
            :disabled="!referralCode"
            :aria-label="$t('نسخ رمز الدعوة')"
            @click="copyCode"
          >
            <span class="referral__btn-inner">
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
              >
                <template v-if="copied">
                  <path d="M5 12l5 5L20 7" />
                </template>
                <template v-else>
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </template>
              </svg>
              <span>{{ copied ? $t('تم النسخ') : $t('نسخ') }}</span>
            </span>
          </ds-button>

          <ds-button
            variant="accent"
            size="sm"
            :disabled="!referralCode"
            @click="shareCode"
          >
            <span class="referral__btn-inner">
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              <span>{{ $t('مشاركة') }}</span>
            </span>
          </ds-button>
        </div>
      </div>

      <div v-if="shareUrl" class="referral__url">
        <div class="referral__url-text">
          <span class="referral__url-label">{{ $t('رابط الدعوة') }}</span>
          <span class="referral__url-value" dir="ltr">{{ shareUrl }}</span>
        </div>
        <button
          type="button"
          class="referral__url-copy"
          :aria-label="$t('نسخ رابط الدعوة')"
          @click="copyUrl"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
          >
            <template v-if="urlCopied">
              <path d="M5 12l5 5L20 7" />
            </template>
            <template v-else>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </template>
          </svg>
          <span>{{ urlCopied ? $t('تم النسخ') : $t('نسخ') }}</span>
        </button>
      </div>
    </section>

    <!-- Divider between sections -->
    <hr class="marketing-page__rule" aria-hidden="true" />

    <!-- Withdraws / sign-ups history -->
    <section class="withdraws">
      <header class="withdraws__head">
        <div>
          <h2 class="withdraws__title">{{ $t('سجل السحوبات') }}</h2>
          <p class="withdraws__subtitle">
            {{ $t('كل طلبات السحب السابقة وحالتها الحالية.') }}
          </p>
        </div>
        <ds-button
          variant="primary"
          size="sm"
          :disabled="activeBalance <= 0"
          @click="withdrawOpen = true"
        >
          {{ $t('طلب سحب') }}
        </ds-button>
      </header>

      <div v-if="loadingWithdraws && withdraws.length === 0" class="withdraws__skeletons">
        <ds-skeleton v-for="i in 3" :key="i" shape="rect" height="5.5rem" />
      </div>

      <ds-empty-state
        v-else-if="withdraws.length === 0"
        :title="$t('لا توجد سحوبات بعد')"
        :description="$t('اطلب أول عملية سحب عندما يتوفر رصيدك.')"
        size="md"
      />

      <ul v-else class="withdraws__list" role="list">
        <li
          v-for="w in withdraws"
          :key="w.pk ?? ''"
          class="withdraws__row"
        >
          <div class="withdraws__row-main">
            <span class="withdraws__row-id" dir="ltr">#{{ w.pk }}</span>
            <span class="withdraws__row-date">{{ formatDate(w.created) }}</span>
          </div>
          <div class="withdraws__row-amount" dir="ltr">
            <span class="withdraws__row-value">{{ formatNumber(Number(w.amount ?? 0)) }}</span>
            <span class="withdraws__row-currency">{{ payoutCurrency }}</span>
          </div>
          <span
            class="withdraws__status"
            :class="w.isDone ? 'withdraws__status--done' : 'withdraws__status--pending'"
          >
            {{ w.isDone ? $t('مكتمل') : $t('قيد المعالجة') }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Withdraw dialog -->
    <q-dialog v-model="withdrawOpen" persistent>
      <q-card class="withdraw-dialog">
        <h3 class="withdraw-dialog__title">{{ $t('طلب سحب') }}</h3>
        <p class="withdraw-dialog__hint">
          {{ $t('الرصيد المتاح') }}:
          <strong dir="ltr">{{ formatNumber(activeBalance) }} {{ payoutCurrency }}</strong>
        </p>
        <label class="withdraw-dialog__label" for="withdraw-amount">
          {{ $t('المبلغ') }}
        </label>
        <input
          id="withdraw-amount"
          class="withdraw-dialog__input"
          type="number"
          v-model.number="withdrawAmount"
          :placeholder="$t('المبلغ')"
          dir="ltr"
        />
        <div class="withdraw-dialog__actions">
          <ds-button variant="ghost" @click="cancelWithdraw">
            {{ $t('إلغاء') }}
          </ds-button>
          <ds-button
            variant="primary"
            :loading="withdrawLoading"
            @click="submitWithdraw"
          >
            {{ $t('تأكيد') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { MyPyramidBalance } from 'src/graphql/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { MyPyramidWithdraws } from 'src/graphql/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidAffiliates } from 'src/graphql/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import { MyPyramidLedgerReward } from 'src/graphql/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { WithdrawPyramidBalance } from 'src/graphql/pyramid_marketing_management/mutation/MakePyramidWithdraw'
import { ClaimPyramidLedgerBalance } from 'src/graphql/pyramid_marketing_management/mutation/ClaimPyramidLedgerBalance'
import type {
  MyPyramidBalanceResult,
  MyPyramidBalanceVars,
  MyPyramidWithdrawsResult,
  MyPyramidWithdrawsVars,
  MyPyramidAccountResult,
  MyPyramidAccountVars,
  MyPyramidLedgerRewardResult,
  MyPyramidLedgerRewardVars,
  MakePyramidWithdrawResult,
  MakePyramidWithdrawVars,
  ClaimPyramidLedgerBalanceResult,
  ClaimPyramidLedgerBalanceVars,
  PyramidWithdraw,
  MyPyramidAffiliatesResult,
  MyPyramidAffiliatesVars,
} from 'src/types/pyramid/types'

const $q = useQuasar()
const { t } = useI18n()
const auth = useAuthStore()

// Pyramid balances, earnings and withdrawals are denominated in the platform's
// fixed payout currency (Sudanese pound, SDG) — NOT the visitor's display
// currency preference (USD/SAR) used for course prices. The balance/withdraw
// GraphQL payloads carry no currency field, so this label is constant.
const payoutCurrency = 'SDG'

// ---------------------------------------------------------------------------
// Queries — all typed with explicit generics (CLAUDE.md rule #2).
// ---------------------------------------------------------------------------
const balanceQuery    = useQuery<MyPyramidBalanceResult, MyPyramidBalanceVars>(MyPyramidBalance)
const affiliatesQuery = useQuery<MyPyramidAffiliatesResult, MyPyramidAffiliatesVars>(MyPyramidAffiliates)
const accountQuery    = useQuery<MyPyramidAccountResult, MyPyramidAccountVars>(MyPyramidAccount)
const rewardQuery     = useQuery<MyPyramidLedgerRewardResult, MyPyramidLedgerRewardVars>(MyPyramidLedgerReward)
const withdrawsQuery  = useQuery<MyPyramidWithdrawsResult, MyPyramidWithdrawsVars>(MyPyramidWithdraws)

const loadingWithdraws = withdrawsQuery.loading

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------
const withdrawMutation = useMutation<MakePyramidWithdrawResult, MakePyramidWithdrawVars>(
  WithdrawPyramidBalance,
  {
    refetchQueries: [
      { query: MyPyramidBalance },
      { query: MyPyramidWithdraws },
    ],
  },
)

// Redeem accrued ledger rewards (total earnings) into the spendable balance.
// After it succeeds both the ledger reward (resets toward 0) and the balance
// (increases) change, so refetch both.
const claimMutation = useMutation<ClaimPyramidLedgerBalanceResult, ClaimPyramidLedgerBalanceVars>(
  ClaimPyramidLedgerBalance,
  {
    refetchQueries: [
      { query: MyPyramidLedgerReward },
      { query: MyPyramidBalance },
    ],
  },
)

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------
const myPyramidBalance = computed(() => balanceQuery.result.value?.myPyramidBalance ?? null)
const myPyramidAffiliates = computed(() => affiliatesQuery.result.value?.myPyramidAffiliates ?? 0)
const myPyramidAccount = computed(() => accountQuery.result.value?.myPyramidAccount ?? null)

/**
 * Ledger reward: schema types it as `Float` -> `number | null`.
 * No typePolicy parses this scalar; consume directly.
 */
const myPyramidLedgerReward = computed<number | null>(
  () => rewardQuery.result.value?.myPyramidLedgerReward ?? null,
)

const withdrawEdges = computed(() =>
  (withdrawsQuery.result.value?.myPyramidWithdraws?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node),
)

const referralCode = computed<string>(
  () => myPyramidAccount.value?.pyramidCode ?? '',
)

const shareUrl = computed<string>(() => {
  if (!referralCode.value) return ''
  try {
    return `${location.origin}/#/register?ref=${encodeURIComponent(referralCode.value)}`
  } catch { return '' }
})

const affiliatesCount = computed<number>(() => {
  const v = Number(myPyramidAffiliates.value)
  return Number.isFinite(v) ? v : 0
})

const activeBalance = computed<number>(() => {
  const v = Number(myPyramidBalance.value?.balance ?? 0)
  return Number.isFinite(v) ? v : 0
})

const totalEarnings = computed<number>(() => {
  const v = myPyramidLedgerReward.value
  if (v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
})

const withdraws = computed<PyramidWithdraw[]>(() => {
  const list = withdrawEdges.value
    .map(e => e.node)
    .filter((n): n is PyramidWithdraw => n !== null)
  // Most recent first: sort by created desc, falling back to pk desc when a
  // timestamp is missing/equal (pk is monotonic, so newer requests rank higher).
  return [...list].sort((a, b) => {
    const ta = a.created ? new Date(a.created).getTime() : 0
    const tb = b.created ? new Date(b.created).getTime() : 0
    if (tb !== ta) return tb - ta
    return Number(b.pk ?? 0) - Number(a.pk ?? 0)
  })
})

const pendingPayouts = computed<number>(
  () => withdraws.value.filter(w => !w.isDone).length,
)

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------
const copied = ref(false)
const urlCopied = ref(false)
const withdrawOpen = ref(false)
const withdrawAmount = ref<number | null>(null)
const withdrawLoading = ref(false)
const claiming = ref(false)

// ---------------------------------------------------------------------------
// Formatters — English numerals (CLAUDE.md requirement).
// ---------------------------------------------------------------------------
const numberFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
function formatNumber(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(Number(n))) return '0'
  return numberFmt.format(Number(n))
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d)
  } catch { return '—' }
}

// ---------------------------------------------------------------------------
// Clipboard helpers
// ---------------------------------------------------------------------------
async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'absolute'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

async function copyCode(): Promise<void> {
  if (!auth.isAuthenticated || !referralCode.value) return
  try {
    await writeClipboard(referralCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1600)
    $q.notify({ type: 'positive', position: 'bottom', progress: true, message: t('تم نسخ رمز الدعوة') })
  } catch {
    $q.notify({ type: 'warning', position: 'bottom', progress: true, message: t('تعذر النسخ') })
  }
}

async function copyUrl(): Promise<void> {
  if (!shareUrl.value) return
  try {
    await writeClipboard(shareUrl.value)
    urlCopied.value = true
    setTimeout(() => { urlCopied.value = false }, 1600)
    $q.notify({ type: 'positive', position: 'bottom', progress: true, message: t('تم نسخ رابط الدعوة') })
  } catch {
    $q.notify({ type: 'warning', position: 'bottom', progress: true, message: t('تعذر النسخ') })
  }
}

async function shareCode(): Promise<void> {
  if (!auth.isAuthenticated || !referralCode.value) return
  const text = `${t('انضم معي إلى مركز د. صبري أبوقرون للتدريب')}\n${shareUrl.value}`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'STC', text, url: shareUrl.value })
      return
    }
  } catch { /* user cancelled */ }
  try {
    await writeClipboard(shareUrl.value)
    $q.notify({ type: 'info', position: 'bottom', progress: true, message: t('تم نسخ رابط الدعوة') })
  } catch { /* noop */ }
}

function cancelWithdraw(): void {
  withdrawAmount.value = null
  withdrawOpen.value = false
}

function errorHandler(errorsObj: Record<string, Array<{ message: string | { msg: string } }>>): void {
  if (errorsObj && (errorsObj as unknown as { message?: string }).message) {
    const msg = (errorsObj as unknown as { message: string }).message
    if (typeof msg !== 'object') {
      $q.notify({ type: 'warning', position: 'bottom', progress: true, multiLine: true, message: msg })
      return
    }
  }
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      const msg = typeof val.message === 'object' && val.message ? val.message.msg : val.message
      $q.notify({ type: 'warning', position: 'bottom', progress: true, multiLine: true, message: msg })
    }
  }
}

async function redeemEarnings(): Promise<void> {
  if (claiming.value || totalEarnings.value <= 0) return
  claiming.value = true
  try {
    const res = await claimMutation.mutate({ input: {} })
    const payload = res?.data?.claimPyramidLedgerBalance
    if (payload?.success) {
      $q.notify({
        type: 'positive', position: 'bottom', progress: true, multiLine: true,
        message: t('تم تحصيل الأرباح إلى رصيدك'),
      })
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string | { msg: string } }>>)
    }
  } catch { /* apollo surfaces */ }
  finally { claiming.value = false }
}

async function submitWithdraw(): Promise<void> {
  const amt = Number(withdrawAmount.value)
  if (!Number.isFinite(amt) || amt <= 0 || amt > activeBalance.value) {
    $q.notify({
      type: 'warning', position: 'bottom', progress: true, multiLine: true,
      message: t('يرجى إدخال مبلغ صالح ضمن رصيدك المتاح.'),
    })
    return
  }
  withdrawLoading.value = true
  try {
    const res = await withdrawMutation.mutate({ amount: amt, input: {} })
    const payload = res?.data?.makePyramidWithdraw
    if (payload?.success) {
      $q.notify({
        type: 'positive', position: 'bottom', progress: true, multiLine: true,
        message: t('تم إرسال طلب السحب'),
      })
      withdrawOpen.value = false
      withdrawAmount.value = null
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string | { msg: string } }>>)
    }
  } catch { /* apollo surfaces */ }
  finally { withdrawLoading.value = false }
}
</script>

<style lang="scss" scoped>
// The page sits inside UserLayout's `.user-layout__main` surface, which
// already provides a cream card chrome (background + border + radius +
// shadow). We DO NOT add another card around the whole page; sections are
// laid out flush to that surface with intentional spacing. The referral
// block and stats strip are inline groups, not nested cards.

.marketing-page {
  inline-size: 100%;
  font-family: var(--ds-font-body);
  color: var(--ds-ink);
}

// ---------- Header -------------------------------------------------------
.marketing-page__head {
  margin-block-end: var(--ds-space-6);
}

.marketing-page__title {
  font-family: var(--ds-font-heading);
  font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
  font-weight: var(--ds-weight-bold);
  color: var(--ds-indigo);
  margin: 0 0 var(--ds-space-1);
  letter-spacing: -0.005em;
}

.marketing-page__subtitle {
  margin: 0;
  color: var(--ds-taupe);
  font-size: var(--ds-text-sm);
  line-height: 1.7;
}

.marketing-page__rule {
  border: 0;
  block-size: 1px;
  background: var(--ds-border);
  margin-block: var(--ds-space-7);
}

// ---------- Metrics strip (replaces 4 donut stat cards) ------------------
.metrics-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--ds-space-3) var(--ds-space-5);
  padding: var(--ds-space-4) var(--ds-space-5);
  background: var(--ds-surface-sunken);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  margin-block-end: var(--ds-space-7);

  // Each item is a consistent two-line block: the figure (value + currency
  // suffix on ONE baseline-aligned row) on top, the label below. Keeping the
  // suffix inline with the value means money items (with SDG) and count items
  // (no suffix) are the same height, so all four labels align on one row.
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ds-space-1);
    flex: 1 1 auto;
    min-inline-size: 120px;
  }

  &__figure {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
  }

  &__value {
    font-family: var(--ds-font-mono);
    font-size: clamp(1.5rem, 1.2vw + 1.1rem, 1.875rem);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-indigo);
    line-height: 1;
    font-variant-numeric: tabular-nums;

    &--accent {
      color: var(--ds-terracotta);
    }
  }

  &__suffix {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe);
  }

  // Redeem-earnings action sits under the "Total earnings" figure: it claims
  // the accrued ledger reward into the spendable balance.
  &__action {
    margin-block-start: var(--ds-space-2);
  }

  &__divider {
    inline-size: 1px;
    align-self: stretch;
    background: var(--ds-border);
    display: none;
  }

  @media (min-width: 720px) {
    flex-wrap: nowrap;

    &__divider { display: block; }

    &__item {
      flex: 1 1 0;
    }
  }
}

// ---------- Referral block (no ds-card wrapper) --------------------------
.referral {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  padding-block-end: var(--ds-space-2);

  &__head {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink);
    margin: 0;
  }

  &__hint {
    margin: 0;
    color: var(--ds-taupe);
    font-size: var(--ds-text-sm);
    line-height: 1.7;
  }

  &__code-row {
    display: flex;
    align-items: stretch;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  &__code-field {
    flex: 1 1 260px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-ivory);
    border: 1px dashed var(--ds-border-strong);
    border-radius: var(--ds-radius-md);
    min-inline-size: 0;
  }

  &__code-label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__code {
    font-family: var(--ds-font-mono);
    font-size: clamp(1.25rem, 1.5vw + 0.75rem, 1.75rem);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-indigo);
    letter-spacing: 0.06em;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  &__actions {
    display: inline-flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    align-items: center;
  }

  &__btn-inner {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);

    svg { flex: 0 0 auto; }
  }

  &__url {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-surface-sunken);
    border-radius: var(--ds-radius-md);
    flex-wrap: wrap;
  }

  &__url-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-inline-size: 0;
    flex: 1 1 220px;
  }

  &__url-label {
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__url-value {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-sm);
    color: var(--ds-ink);
    overflow-wrap: anywhere;
  }

  &__url-copy {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    padding: var(--ds-space-1) var(--ds-space-3);
    background: transparent;
    border: 1px solid var(--ds-border-strong);
    border-radius: var(--ds-radius-sm);
    color: var(--ds-indigo);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-medium);
    cursor: pointer;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out),
                color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover,
    &:focus-visible {
      background: var(--ds-brand-50);
      outline: none;
    }
  }
}

// ---------- Withdraws section -------------------------------------------
.withdraws {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink);
    margin: 0 0 2px;
  }

  &__subtitle {
    margin: 0;
    color: var(--ds-taupe);
    font-size: var(--ds-text-sm);
  }

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-ivory);
    overflow: hidden;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-4);

    & + & {
      border-block-start: 1px solid var(--ds-border);
    }

    @media (max-width: 520px) {
      grid-template-columns: 1fr auto;
    }
  }

  &__row-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-inline-size: 0;
  }

  &__row-id {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink);
  }

  &__row-date {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
  }

  &__row-amount {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-1);
    font-family: var(--ds-font-mono);
    font-variant-numeric: tabular-nums;
  }

  &__row-value {
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-indigo);
  }

  &__row-currency {
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__status {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-medium);
    padding: 2px var(--ds-space-2);
    border-radius: 999px;
    white-space: nowrap;

    &--done {
      color: var(--ds-success);
      background: var(--ds-success-bg);
    }

    &--pending {
      color: var(--ds-warning);
      background: var(--ds-warning-bg);
    }

    @media (max-width: 520px) {
      grid-column: 1 / -1;
      justify-self: start;
    }
  }
}

// ---------- Withdraw dialog ---------------------------------------------
.withdraw-dialog {
  inline-size: 100%;
  max-inline-size: 420px;
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  background: var(--ds-ivory);

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink);
  }

  &__hint {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe);

    strong {
      color: var(--ds-indigo);
      font-family: var(--ds-font-mono);
      font-variant-numeric: tabular-nums;
    }
  }

  &__label {
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__input {
    inline-size: 100%;
    padding: 0.65rem 0.9rem;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-md);
    background: var(--ds-surface);
    border: 1px solid var(--ds-border-strong);
    border-radius: var(--ds-radius-md);
    color: var(--ds-ink);

    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-2);
    margin-block-start: var(--ds-space-2);
  }
}
</style>
