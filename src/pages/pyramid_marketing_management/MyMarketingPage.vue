<template>
  <main class="marketing-page">
    <header class="marketing-page__head">
      <div>
        <h1>{{ $t('التسويق الخاص بي') }}</h1>
        <p>{{ $t('إحالاتك، أرباحك، وسجل السحوبات في لوحة واحدة.') }}</p>
      </div>
    </header>

    <!-- Stats row -->
    <section class="marketing-page__stats">
      <div class="marketing-stat">
        <stat-card :value="affiliatesCount" :label="$t('إحالات')" size="sm" variant="indigo" />
      </div>
      <div class="marketing-stat">
        <stat-card :value="totalEarnings" :label="$t('إجمالي الأرباح')" size="sm" variant="terracotta" :suffix="currency" />
      </div>
      <div class="marketing-stat">
        <stat-card :value="pendingPayouts" :label="$t('سحوبات قيد الانتظار')" size="sm" variant="indigo" />
      </div>
      <div class="marketing-stat">
        <stat-card :value="activeBalance" :label="$t('الرصيد الحالي')" size="sm" variant="terracotta" :suffix="currency" />
      </div>
    </section>

    <!-- Referral code card -->
    <ds-card class="referral-card" variant="default" elevation="sm">
      <div class="referral-card__head">
        <h2>{{ $t('رمز الدعوة الخاص بك') }}</h2>
        <p>{{ $t('شارك رمزك مع أصدقائك واكسب عمولة عند كل تسجيل.') }}</p>
      </div>

      <div class="referral-card__code-row">
        <code class="referral-card__code" :aria-label="$t('رمز الدعوة')">
          {{ referralCode || '—' }}
        </code>
        <div class="referral-card__actions">
          <ds-button
            variant="ghost"
            size="sm"
            :disabled="!referralCode"
            @click="copyCode"
          >
            {{ copied ? $t('تم النسخ') : $t('نسخ') }}
          </ds-button>
          <ds-button
            variant="accent"
            size="sm"
            :disabled="!referralCode"
            @click="shareCode"
          >
            {{ $t('مشاركة') }}
          </ds-button>
        </div>
      </div>

      <div v-if="shareUrl" class="referral-card__url">
        <span class="referral-card__url-label">{{ $t('رابط الدعوة') }}</span>
        <span class="referral-card__url-value">{{ shareUrl }}</span>
      </div>
    </ds-card>

    <!-- Withdraws / earnings -->
    <section class="marketing-page__section">
      <header class="marketing-page__section-head">
        <h2>{{ $t('سجل السحوبات') }}</h2>
        <ds-button
          variant="primary"
          size="sm"
          :disabled="Number(activeBalance) <= 0"
          @click="withdrawOpen = true"
        >
          {{ $t('طلب سحب') }}
        </ds-button>
      </header>

      <div v-if="loadingWithdraws && withdraws.length === 0" class="marketing-page__skeletons">
        <ds-skeleton v-for="i in 3" :key="i" shape="rect" height="6rem" />
      </div>

      <ds-empty-state
        v-else-if="withdraws.length === 0"
        :title="$t('لا توجد سحوبات بعد')"
        :description="$t('اطلب أول عملية سحب عندما يتوفر رصيدك.')"
        size="md"
      />

      <div v-else class="marketing-page__list">
        <transaction-card
          v-for="w in withdraws"
          :key="w.pk"
          :transaction="mapWithdraw(w)"
          :status="w.isDone ? 'completed' : 'processing'"
        />
      </div>
    </section>

    <q-dialog v-model="withdrawOpen" persistent>
      <q-card class="withdraw-dialog">
        <h3>{{ $t('طلب سحب') }}</h3>
        <p class="withdraw-dialog__hint">
          {{ $t('الرصيد المتاح') }}: <strong>{{ activeBalance }} {{ currency }}</strong>
        </p>
        <input
          class="withdraw-dialog__input"
          type="number"
          v-model.number="withdrawAmount"
          :placeholder="$t('المبلغ')"
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
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import StatCard from 'src/components/shared/StatCard.vue'
import TransactionCard from 'src/components/shared/TransactionCard.vue'
import { MyPyramidBalance } from 'src/graphql/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { MyPyramidWithdraws } from 'src/graphql/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidAffiliates } from 'src/graphql/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import { MyPyramidLedgerReward } from 'src/graphql/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { WithdrawPyramidBalance } from 'src/graphql/pyramid_marketing_management/mutation/MakePyramidWithdraw'
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
  PyramidWithdraw,
  MyPyramidAffiliatesResult,
  MyPyramidAffiliatesVars,
} from 'src/types/pyramid/types'

const $q = useQuasar()
const { t } = useI18n()
const auth = useAuthStore()
const settings = useSettingsStore()
const { currency } = storeToRefs(settings)

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
const balanceQuery = useQuery<MyPyramidBalanceResult, MyPyramidBalanceVars>(MyPyramidBalance)
const affiliatesQuery = useQuery<MyPyramidAffiliatesResult, MyPyramidAffiliatesVars>(MyPyramidAffiliates)
const accountQuery = useQuery<MyPyramidAccountResult, MyPyramidAccountVars>(MyPyramidAccount)
const rewardQuery = useQuery<MyPyramidLedgerRewardResult, MyPyramidLedgerRewardVars>(MyPyramidLedgerReward)
const withdrawsQuery = useQuery<MyPyramidWithdrawsResult, MyPyramidWithdrawsVars>(MyPyramidWithdraws)

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

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------
const myPyramidBalance = computed(() => balanceQuery.result.value?.myPyramidBalance ?? null)
const myPyramidAffiliates = computed(() => affiliatesQuery.result.value?.myPyramidAffiliates ?? 0)
const myPyramidAccount = computed(() => accountQuery.result.value?.myPyramidAccount ?? null)

/**
 * Ledger reward leak fix.
 * Schema: `myPyramidLedgerReward: Float` — codegen types it `number | null`.
 * No typePolicy in Apollo client parses this field (only CourseNode.currency
 * has a policy). The value arrives as a plain number from the server, so we
 * consume it directly as `number | null`. The old `JSON.parse` was defensive
 * code against an earlier string-encoded payload — the current schema (Float)
 * makes it unnecessary and the type wouldn't allow it.
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

/**
 * totalEarnings — consumes the typed Float directly.
 * The old code had: `JSON.parse(raw)` then currency-keyed lookup.
 * Since `myPyramidLedgerReward` is `Float | null` in the schema, no parsing
 * is needed; we read the number and return it (no currency keying).
 */
const totalEarnings = computed<number>(() => {
  const v = myPyramidLedgerReward.value
  if (v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
})

const withdraws = computed<PyramidWithdraw[]>(() =>
  withdrawEdges.value.map(e => e.node),
)

const pendingPayouts = computed<number>(
  () => withdraws.value.filter(w => !w.isDone).length,
)

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------
const copied = ref(false)
const withdrawOpen = ref(false)
const withdrawAmount = ref<number | null>(null)
const withdrawLoading = ref(false)

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function mapWithdraw(w: PyramidWithdraw) {
  return {
    id: w.pk,
    courseName: `${t('طلب سحب')} #${w.pk}`,
    amount: w.amount,
    currency: currency.value,
    createdAt: w.created,
    updatedAt: w.updated,
  }
}

async function copyCode(): Promise<void> {
  if (!auth.isAuthenticated) return
  if (!referralCode.value) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(referralCode.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = referralCode.value
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1600)
    $q.notify({ type: 'positive', position: 'top', progress: true, message: t('تم نسخ رمز الدعوة') })
  } catch {
    $q.notify({ type: 'warning', position: 'top', progress: true, message: t('تعذر النسخ') })
  }
}

async function shareCode(): Promise<void> {
  if (!auth.isAuthenticated) return
  if (!referralCode.value) return
  const text = `${t('انضم معي إلى مركز د. صبري أبوقرون للتدريب')}\n${shareUrl.value}`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'STC', text, url: shareUrl.value })
      return
    }
  } catch { /* user cancelled */ }
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    $q.notify({ type: 'info', position: 'top', progress: true, message: t('تم نسخ رابط الدعوة') })
  } catch { /* noop */ }
}

function cancelWithdraw(): void {
  withdrawAmount.value = null
  withdrawOpen.value = false
}

function errorHandler(errorsObj: Record<string, Array<{ message: string | { msg: string } }>>): void {
  if (errorsObj && (errorsObj as { message?: string }).message) {
    const msg = (errorsObj as { message: string }).message
    if (typeof msg !== 'object') {
      $q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: msg })
      return
    }
  }
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      const msg = typeof val.message === 'object' && val.message ? val.message.msg : val.message
      $q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: msg })
    }
  }
}

async function submitWithdraw(): Promise<void> {
  const amt = Number(withdrawAmount.value)
  if (!Number.isFinite(amt) || amt <= 0 || amt > activeBalance.value) {
    $q.notify({
      type: 'warning',
      position: 'top',
      progress: true,
      multiLine: true,
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
        type: 'positive',
        position: 'top',
        progress: true,
        multiLine: true,
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
.marketing-page {
  background: var(--ds-cream, var(--ds-surface-muted));
  min-block-size: 100vh;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-6);

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

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--ds-space-4);
    margin-block-end: var(--ds-space-6);

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__section {
    margin-block-start: var(--ds-space-8);
  }

  &__section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-end: var(--ds-space-4);
    flex-wrap: wrap;

    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-2xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-ink, var(--ds-text));
      margin: 0;
    }
  }

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--ds-space-4);
  }
}

.marketing-stat {
  display: flex;
  justify-content: center;
  padding: var(--ds-space-4);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-xs);
}

.referral-card {
  margin-block-end: var(--ds-space-6);

  :deep(.ds-card__body) {
    padding: var(--ds-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__head {
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
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

  &__code-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
    padding: var(--ds-space-4);
    background: var(--ds-cream, var(--ds-surface-muted));
    border: 1px dashed var(--ds-border);
    border-radius: var(--ds-radius-md);
  }

  &__code {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700, #322873);
    letter-spacing: 0.08em;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: inline-flex;
    gap: var(--ds-space-2);
  }

  &__url {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--ds-space-3);
    background: var(--ds-surface-sunken, var(--ds-surface));
    border-radius: var(--ds-radius-md);
  }

  &__url-label {
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
  }

  &__url-value {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    overflow-wrap: anywhere;
  }
}

.withdraw-dialog {
  inline-size: 100%;
  max-inline-size: 400px;
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  h3 {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
  }

  &__hint {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    strong {
      color: var(--ds-ink, var(--ds-text));
      font-family: var(--ds-font-mono);
    }
  }

  &__input {
    inline-size: 100%;
    padding: 0.65rem 0.9rem;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-md);
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    color: var(--ds-text);

    &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-2);
  }
}
</style>
