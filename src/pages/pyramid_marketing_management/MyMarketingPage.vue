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

<script>
import { useSettingsStore } from 'src/stores/settings'
import { storeToRefs } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'
import _ from 'lodash'
import StatCard from 'src/components/shared/StatCard.vue'
import TransactionCard from 'src/components/shared/TransactionCard.vue'
import { MyPyramidBalance }     from 'src/graphql/pyramid_marketing_management/query/MyPyramidBalanceQuery'
import { MyPyramidWithdraws }   from 'src/graphql/pyramid_marketing_management/query/MyPyramidWithdrawsQuery'
import { MyPyramidAffiliates }  from 'src/graphql/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe'
import { MyPyramidAccount }     from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import { MyPyramidLedgerReward } from 'src/graphql/pyramid_marketing_management/query/MyPyramidLedgerRewardQuery'
import { WithdrawPyramidBalance } from 'src/graphql/pyramid_marketing_management/mutation/MakePyramidWithdraw'

/** @typedef {import('src/types/pyramid/types').PyramidAccount} PyramidAccount */
/** @typedef {import('src/types/pyramid/types').PyramidBalance} PyramidBalance */
/** @typedef {import('src/types/pyramid/types').PyramidWithdraw} PyramidWithdraw */
/** @typedef {import('src/types/pyramid/types').PyramidLedgerRewardValue} PyramidLedgerRewardValue */
/** @typedef {import('src/types/pyramid/types').PyramidLedgerPayload} PyramidLedgerPayload */
/** @typedef {import('src/types/pyramid/types').MyPyramidBalanceResult} MyPyramidBalanceResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidBalanceVars} MyPyramidBalanceVars */
/** @typedef {import('src/types/pyramid/types').MyPyramidWithdrawsResult} MyPyramidWithdrawsResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidWithdrawsVars} MyPyramidWithdrawsVars */
/** @typedef {import('src/types/pyramid/types').MyPyramidAccountResult} MyPyramidAccountResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidAccountVars} MyPyramidAccountVars */
/** @typedef {import('src/types/pyramid/types').MyPyramidLedgerRewardResult} MyPyramidLedgerRewardResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidLedgerRewardVars} MyPyramidLedgerRewardVars */
/** @typedef {import('src/types/pyramid/types').MyPyramidMarketersResult} MyPyramidMarketersResult */
/** @typedef {import('src/types/pyramid/types').MyPyramidMarketersVars} MyPyramidMarketersVars */
/** @typedef {import('src/types/pyramid/types').MakePyramidWithdrawResult} MakePyramidWithdrawResult */
/** @typedef {import('src/types/pyramid/types').MakePyramidWithdrawVars} MakePyramidWithdrawVars */

/**
 * Narrow the ledger-reward scalar safely. Backend may return number, a
 * JSON-encoded string keyed by currency, or (after a cache round-trip) a
 * pre-parsed object. Returns null for unparseable strings rather than
 * leaking a parse exception.
 *
 * @param {PyramidLedgerRewardValue} raw
 * @returns {PyramidLedgerPayload | number | null}
 */
function parseLedger (raw) {
  if (raw == null) return null
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return null }
  }
  return raw // already an object (cache-read parsed)
}

export default {
  name: 'MyMarketingPage',
  components: { StatCard, TransactionCard },

  setup () {
    const settings = useSettingsStore()
    const { currency } = storeToRefs(settings)

    /** @type {ReturnType<typeof useQuery<MyPyramidBalanceResult, MyPyramidBalanceVars>>} */
    const balanceQuery    = useQuery(MyPyramidBalance)
    /** @type {ReturnType<typeof useQuery<MyPyramidMarketersResult, MyPyramidMarketersVars>>} */
    const affiliatesQuery = useQuery(MyPyramidAffiliates)
    /** @type {ReturnType<typeof useQuery<MyPyramidAccountResult, MyPyramidAccountVars>>} */
    const accountQuery    = useQuery(MyPyramidAccount)
    /** @type {ReturnType<typeof useQuery<MyPyramidLedgerRewardResult, MyPyramidLedgerRewardVars>>} */
    const rewardQuery     = useQuery(MyPyramidLedgerReward)
    /** @type {ReturnType<typeof useQuery<MyPyramidWithdrawsResult, MyPyramidWithdrawsVars>>} */
    const withdrawsQuery  = useQuery(MyPyramidWithdraws)

    /** @type {import('vue').ComputedRef<PyramidBalance | null>} */
    const myPyramidBalance = computed(() => balanceQuery.result.value?.myPyramidBalance || null)
    /** @type {import('vue').ComputedRef<number>} */
    const myPyramidAffiliates = computed(() => affiliatesQuery.result.value?.myPyramidAffiliates || 0)
    /** @type {import('vue').ComputedRef<PyramidAccount | null>} */
    const myPyramidAccount = computed(() => accountQuery.result.value?.myPyramidAccount || null)
    /** @type {import('vue').ComputedRef<PyramidLedgerRewardValue>} */
    const myPyramidLedgerReward = computed(() => rewardQuery.result.value?.myPyramidLedgerReward || null)
    const myPyramidWithdraws = computed(() => withdrawsQuery.result.value?.myPyramidWithdraws || null)
    const loadingWithdraws = withdrawsQuery.loading

    /** @type {ReturnType<typeof useMutation<MakePyramidWithdrawResult, MakePyramidWithdrawVars>>} */
    const withdrawMutation = useMutation(WithdrawPyramidBalance, {
      refetchQueries: [
        { query: MyPyramidBalance },
        { query: MyPyramidWithdraws }
      ]
    })

    return {
      currency,
      myPyramidBalance,
      myPyramidAffiliates,
      myPyramidAccount,
      myPyramidLedgerReward,
      myPyramidWithdraws,
      loadingWithdraws,
      _withdraw: withdrawMutation
    }
  },

  data () {
    return {
      // UI
      copied: false,
      withdrawOpen: false,
      withdrawAmount: null,
      withdrawLoading: false
    }
  },

  computed: {
    referralCode () {
      return _.get(this.myPyramidAccount, 'pyramidCode') || ''
    },

    shareUrl () {
      if (!this.referralCode) return ''
      try {
        return `${location.origin}/#/register?ref=${encodeURIComponent(this.referralCode)}`
      } catch (e) { return '' }
    },

    affiliatesCount () {
      const v = Number(this.myPyramidAffiliates)
      return Number.isFinite(v) ? v : 0
    },

    activeBalance () {
      const v = Number(_.get(this.myPyramidBalance, 'balance', 0))
      return Number.isFinite(v) ? v : 0
    },

    // Earnings may arrive as a JSON string keyed by currency, or a flat number.
    totalEarnings () {
      /** @type {PyramidLedgerRewardValue} */
      const raw = this.myPyramidLedgerReward
      const parsed = parseLedger(raw)
      if (parsed == null) return 0
      if (typeof parsed === 'number') return Number.isFinite(parsed) ? parsed : 0
      if (typeof parsed === 'object') {
        const byCurrency = parsed[this.currency]
        if (byCurrency != null) {
          const n = Number(byCurrency)
          return Number.isFinite(n) ? n : 0
        }
        if (typeof parsed.amount === 'number' && Number.isFinite(parsed.amount)) {
          return parsed.amount
        }
      }
      return 0
    },

    withdraws () {
      return (_.get(this.myPyramidWithdraws, 'edges', []) || []).map(e => e.node)
    },

    pendingPayouts () {
      return this.withdraws.filter(w => !w.isDone).length
    }
  },

  methods: {
    /** @param {PyramidWithdraw} w */
    mapWithdraw (w) {
      return {
        id: w.pk,
        courseName: `${this.$t('طلب سحب')} #${w.pk}`,
        amount: w.amount,
        currency: this.currency,
        createdAt: w.created,
        updatedAt: w.updated
      }
    },

    async copyCode () {
      if (!this.referralCode) return
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.referralCode)
        } else {
          const ta = document.createElement('textarea')
          ta.value = this.referralCode
          ta.setAttribute('readonly', '')
          ta.style.position = 'absolute'
          ta.style.left = '-9999px'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        this.copied = true
        setTimeout(() => { this.copied = false }, 1600)
        this.$q.notify({
          type: 'positive',
          position: 'top',
          progress: true,
          message: this.$t('تم نسخ رمز الدعوة')
        })
      } catch (e) {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          progress: true,
          message: this.$t('تعذر النسخ')
        })
      }
    },

    async shareCode () {
      if (!this.referralCode) return
      const text = `${this.$t('انضم معي إلى مركز د. صبري أبوقرون للتدريب')}\n${this.shareUrl}`
      try {
        if (navigator.share) {
          await navigator.share({ title: 'STC', text, url: this.shareUrl })
          return
        }
      } catch (e) { /* user cancelled */ }
      // Fallback — copy the share URL
      try {
        await navigator.clipboard.writeText(this.shareUrl)
        this.$q.notify({
          type: 'info',
          position: 'top',
          progress: true,
          message: this.$t('تم نسخ رابط الدعوة')
        })
      } catch (e) { /* noop */ }
    },

    cancelWithdraw () {
      this.withdrawAmount = null
      this.withdrawOpen = false
    },

    errorHandler (errorsObj) {
      if (errorsObj && errorsObj.message && typeof errorsObj.message !== 'object') {
        this.$q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: errorsObj.message })
        return
      }
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          const msg = (typeof val.message === 'object' && val.message && val.message.msg) ? val.message.msg : val.message
          this.$q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: msg })
        }
      }
    },

    async submitWithdraw () {
      const amt = Number(this.withdrawAmount)
      if (!Number.isFinite(amt) || amt <= 0 || amt > this.activeBalance) {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          progress: true,
          multiLine: true,
          message: this.$t('يرجى إدخال مبلغ صالح ضمن رصيدك المتاح.')
        })
        return
      }
      this.withdrawLoading = true
      try {
        const res = await this._withdraw.mutate({ amount: amt, input: {} })
        const { success, errors } = res.data.makePyramidWithdraw
        if (success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تم إرسال طلب السحب')
          })
          this.withdrawOpen = false
          this.withdrawAmount = null
        } else if (errors) {
          this.errorHandler(errors)
        }
      } catch (e) { /* apollo surfaces */ }
      finally { this.withdrawLoading = false }
    }
  }
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
