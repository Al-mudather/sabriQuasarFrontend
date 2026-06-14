<template>
  <section class="cart-payment" :aria-label="$t('الدفع')">
    <!-- Sub-view: Bankak (bank transfer attach) -->
    <div v-if="showBankakPayment" class="cart-payment__subview">
      <header class="cart-payment__subview-head">
        <DsButton variant="ghost" size="md" @click="goBackToOptions">
          ← {{ $t('رجوع') }}
        </DsButton>
        <div>
          <h2 class="cart-payment__subview-title">
            {{ $t('الدفع عن طريق ارفاق فاتورة البنك') }}
          </h2>
          <p class="cart-payment__subview-desc">
            {{ $t('ارفق صورة الإشعار البنكي وسيتم تفعيل الدورة خلال 48 ساعة') }}
          </p>
        </div>
      </header>
      <DsCard padding="lg">
        <bankak-payment />
      </DsCard>
    </div>

    <!-- Sub-view: Stripe card -->
    <div v-else-if="showStripePayment" class="cart-payment__subview">
      <header class="cart-payment__subview-head">
        <DsButton variant="ghost" size="md" @click="goBackToOptions">
          ← {{ $t('رجوع') }}
        </DsButton>
        <div>
          <h2 class="cart-payment__subview-title">
            {{ $t('الدفع بالبطاقة الائتمانية') }}
          </h2>
          <p class="cart-payment__subview-desc">
            {{ $t('ادفع بأمان عبر Visa أو Mastercard — تفعيل فوري للدورة.') }}
          </p>
        </div>
      </header>

      <DsCard padding="lg" class="cart-payment__stripe">
        <div class="cart-payment__stripe-amount">
          <span class="cart-payment__stripe-label">
            {{ $t('المبلغ المطلوب') }}
          </span>
          <span class="cart-payment__stripe-value">
            ${{ calculateDollarAmount() }}
            <span class="cart-payment__stripe-unit">USD</span>
          </span>
          <span class="cart-payment__stripe-note">
            {{ $t('سيتم التحويل تلقائياً حسب سعر الصرف') }}
          </span>
        </div>

        <ul class="cart-payment__assurances">
          <li><q-icon name="lock" size="1rem" /> {{ $t('دفع مشفر بتقنية SSL') }}</li>
          <li><q-icon name="bolt" size="1rem" /> {{ $t('تفعيل فوري للدورة') }}</li>
          <li><q-icon name="verified_user" size="1rem" /> {{ $t('محمي بواسطة Stripe') }}</li>
        </ul>

        <DsButton
          variant="accent"
          size="lg"
          full-width
          :loading="stripeLoading"
          :disabled="stripeLoading"
          @click="initiateStripePayment"
        >
          {{ $t('ادفع الآن') }}
        </DsButton>

        <p class="cart-payment__stripe-footer">
          {{ $t('بالضغط على "ادفع الآن" ستتم إعادة توجيهك إلى صفحة الدفع الآمنة.') }}
        </p>
      </DsCard>
    </div>

    <!-- Main view: choose method + summary -->
    <div v-else class="cart-payment__grid">
      <div class="cart-payment__methods">
        <header class="cart-payment__head">
          <h2 class="cart-payment__title">
            {{ $t('اختر طريقة الدفع المناسبة') }}
          </h2>
          <p class="cart-payment__desc">
            {{ $t('جميع المعاملات مشفرة ومحمية.') }}
          </p>
        </header>

        <ul class="cart-payment__list" role="radiogroup" :aria-label="$t('طريقة الدفع')">
          <li
            v-for="m in availableMethods"
            :key="m.id"
          >
            <button
              type="button"
              role="radio"
              :aria-checked="selectedMethod === m.id ? 'true' : 'false'"
              class="cart-payment__method"
              :class="{ 'is-selected': selectedMethod === m.id }"
              @click="selectedMethod = m.id"
            >
              <span class="cart-payment__method-indicator" aria-hidden="true">
                <span class="cart-payment__method-dot"></span>
              </span>
              <span class="cart-payment__method-icon" aria-hidden="true">
                <q-icon :name="m.icon" size="1.5rem" />
              </span>
              <span class="cart-payment__method-body">
                <span class="cart-payment__method-title">{{ m.title }}</span>
                <span class="cart-payment__method-sub">{{ m.subtitle }}</span>
              </span>
              <span v-if="m.badge" class="cart-payment__method-badge">
                {{ m.badge }}
              </span>
            </button>
          </li>
        </ul>

        <div class="cart-payment__actions">
          <DsButton
            variant="ghost"
            size="md"
            @click="$router.push({ name: 'user-info' })"
          >
            ← {{ $t('عودة') }}
          </DsButton>
          <DsButton
            variant="accent"
            size="lg"
            :disabled="!selectedMethod"
            @click="confirmMethod"
          >
            {{ $t('تأكيد الدفع') }}
          </DsButton>
        </div>
      </div>

      <aside class="cart-payment__summary-col" :aria-label="$t('ملخص الطلب')">
        <DsCard padding="md" class="cart-payment__summary">
          <h3 class="cart-payment__summary-title">
            {{ $t('ملخص الطلب') }}
          </h3>

          <ul class="cart-payment__summary-list">
            <li
              v-for="item in shoppingCartDataList"
              :key="item.course.id"
              class="cart-payment__summary-item"
            >
              <span class="cart-payment__summary-name">{{ (item.course as unknown as Record<string, unknown>).title ?? item.course.name }}</span>
              <PriceDisplay
                :amount="itemAmount(item)"
                :currency="currency"
                size="sm"
                variant="ink"
              />
            </li>
          </ul>

          <dl class="cart-payment__summary-totals">
            <div class="cart-payment__summary-row">
              <dt>{{ $t('المجموع الفرعي') }}</dt>
              <dd>
                <PriceDisplay
                  :amount="Number(totalPaymentFees) || 0"
                  :currency="currency"
                  size="sm"
                  variant="ink"
                />
              </dd>
            </div>
            <div class="cart-payment__summary-row cart-payment__summary-row--total">
              <dt>{{ $t('المجمــوع') }}</dt>
              <dd>
                <PriceDisplay
                  :amount="Number(totalPaymentFees) || 0"
                  :currency="currency"
                  size="lg"
                  variant="terracotta"
                />
              </dd>
            </div>
          </dl>

          <p class="cart-payment__assurance">
            <q-icon name="lock" size="0.95rem" />
            {{ $t('الدفع آمن ومشفر') }}
          </p>
        </DsCard>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { apolloClient } from 'src/apollo/client'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateStripeCheckout } from 'src/graphql/checkout_management/mutation/CreateStripeCheckout'
import { StripePublishableKey } from 'src/graphql/checkout_management/query/StripePublishableKey'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import { CheckTheUserPermissionToUsePlatforme } from 'src/graphql/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'

import type {
  CartEntry,
  CreateStripeCheckoutResult,
  CreateStripeCheckoutVars,
  StripePublishableKeyResult,
  StripePublishableKeyVars,
  CreateOrderResult,
  CreateOrderVars,
  CheckPyramidAffiliateResult,
  CheckPyramidAffiliateVars,
} from 'src/types/cart/types'
import type {
  GetMyProfileResult,
  GetMyProfileVariables,
} from 'src/types/auth/types'

import bankakPayment from 'src/components/ShoppingCard/bankakPay.vue'
import PriceDisplay from 'src/components/shared/PriceDisplay.vue'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const cart = useCartStore()
const settings = useSettingsStore()
const { shoppingCartDataList, totalPaymentFees } = storeToRefs(cart)
const { currency } = storeToRefs(settings)

const showBankakPayment = ref<boolean>(false)
const showStripePayment = ref<boolean>(false)
const stripeLoading = ref<boolean>(false)
// Pre-selected: Bankak is the only active method, so the user can confirm
// directly without picking one.
const selectedMethod = ref<string | null>('bankak')

interface PaymentMethod {
  id: string
  title: string
  subtitle: string
  icon: string
  badge: string
}

// Credit-card (Stripe) is not activated yet — only Bankak is offered for now.
// The Stripe handlers below are kept intact so it can be re-enabled by adding
// its entry back here.
const availableMethods = computed((): PaymentMethod[] => [
  {
    id: 'bankak',
    title: t('إرفاق إشعار بنكي'),
    subtitle: t('البنوك السودانية — تفعيل خلال 48 ساعة'),
    icon: 'account_balance',
    badge: t('الأكثر استخداماً')
  }
])

function itemAmount (item: CartEntry): number {
  try {
    const raw = item.course.currency
    if (raw && typeof raw === 'object') {
      return parseFloat(String((raw as Record<string, number>)[currency.value])) || 0
    }
    return 0
  } catch {
    return 0
  }
}

function confirmMethod (): void {
  if (selectedMethod.value === 'bankak') {
    showBankakPayment.value = true
    showStripePayment.value = false
  } else if (selectedMethod.value === 'stripe') {
    showStripePayment.value = true
    showBankakPayment.value = false
  }
}

function goBackToOptions (): void {
  showBankakPayment.value = false
  showStripePayment.value = false
}

function calculateDollarAmount (): string {
  let sum = 0.0
  for (const item of shoppingCartDataList.value) {
    const c = item.course as unknown as Record<string, unknown>
    sum += parseFloat(String(c.courseFee ?? 0))
  }
  return sum.toFixed(2)
}

function getOrdersIds (): number[] {
  return shoppingCartDataList.value
    .map(item => item.course.pk)
    .filter((pk): pk is number => pk != null)
}

function removeCourseFromCart (item: CartEntry): void {
  const data = shoppingCartDataList.value.filter(el => el.course.id !== item.course.id)
  cart.setCartList(data)
}

function errorHandler (errorsObj: unknown): void {
  if (typeof errorsObj !== 'object' || errorsObj == null) return
  for (const key of Object.keys(errorsObj as Record<string, unknown>)) {
    const entries = (errorsObj as Record<string, unknown[]>)[key]
    if (!Array.isArray(entries)) continue
    for (const val of entries) {
      const v = val as Record<string, unknown>
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: String(v.message ?? '') })
    }
  }
}

async function getOrderResult (courseIds: number[]): Promise<NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']> | undefined> {
  const result = await apolloClient.mutate<CreateOrderResult, CreateOrderVars>({
    mutation: CreateNewOrderWithBulkOrderDetails,
    variables: { courseIds }
  })
  const dataObj = result.data?.createNewOrderWithBulkOrderDetails
  if (dataObj?.errors) {
    stripeLoading.value = false
    errorHandler(dataObj.errors)
  }
  if (dataObj?.success) return dataObj
  return undefined
}

async function getStripeKeyFromTheBackend (): Promise<string> {
  const stripeKeyResult = await apolloClient.query<StripePublishableKeyResult, StripePublishableKeyVars>({
    query: StripePublishableKey
  })
  const raw = stripeKeyResult.data?.stripePublishableKey
  if (raw && typeof raw === 'object') {
    return (raw as unknown as Record<string, string>).publisableKey ?? ''
  }
  return ''
}

async function getStripePaymentUrl (orderResult: NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']>): Promise<string | null | undefined> {
  if (!orderResult.order?.pk) return null
  const result = await apolloClient.mutate<CreateStripeCheckoutResult, CreateStripeCheckoutVars>({
    mutation: CreateStripeCheckout,
    variables: {
      orderId: orderResult.order.pk,
      currency: 'USD',
      successUrl: location.origin + '/#/cart/success',
      cancelUrl: location.origin + '/#/cart/cancel'
    }
  })
  const details = result.data?.createStripeCheckout
  if (details?.errors) {
    stripeLoading.value = false
    $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه' })
  }
  if (details?.success) return details.paymentUrl
  return null
}

async function initiateStripePayment (): Promise<void> {
  try {
    stripeLoading.value = true

    // Runtime guard for the Stripe SDK injected by index.html.
    const stripeGlobal = (window as unknown as Record<string, unknown>)['Stripe']
    if (typeof stripeGlobal !== 'function') {
      throw new Error('Stripe not loaded')
    }

    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) { stripeLoading.value = false; return }

    cart.setSaveCheckoutOrderID(orderResult.order.pk)

    const stripeKey = await getStripeKeyFromTheBackend()
    const stripe = (stripeGlobal as (key: string) => { redirectToCheckout: (opts: { sessionId: string }) => void })(stripeKey)
    const sessionId = await getStripePaymentUrl(orderResult)

    if (sessionId) stripe.redirectToCheckout({ sessionId })

    stripeLoading.value = false
  } catch (error: unknown) {
    stripeLoading.value = false
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'Stripe not loaded') {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'Stripe غير محمل، يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى' })
    } else {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى' })
    }
  }
}

async function checkPyramidRegistration (): Promise<void> {
  try {
    await apolloClient.query<CheckPyramidAffiliateResult, CheckPyramidAffiliateVars>({
      query: CheckTheUserPermissionToUsePlatforme
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('PyramidAffiliate matching query does not exist.')) {
      router.push({ name: 'registeration-code' })
    }
  }
}

function purgeZeroCostItems (): void {
  shoppingCartDataList.value.forEach(item => {
    const c = item.course as unknown as Record<string, unknown>
    const fee = parseInt(String(c.courseFee ?? ''), 10)
    const feeSDG = parseInt(String(c.courseFeeInSdg ?? ''), 10)
    if (fee === 0 || feeSDG === 0) {
      removeCourseFromCart(item)
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'هذا الكورس تحت التحضير' })
    }
  })
}

onMounted(async () => {
  checkPyramidRegistration()

  try {
    const res = await apolloClient.query<GetMyProfileResult, GetMyProfileVariables>({ query: GetMyProfileData })
    const me = res.data?.me
    if (me?.pk && !(me.fullName && (me.phoneNumber2 || me.phoneNumber3))) {
      $q.notify({ type: 'negative', progress: true, multiLine: true, position: 'top', message: 'يجب ان تكمل بياناتك الشخصيه' })
      router.push({ name: 'user-info' })
    }
  } catch { /* silent */ }

  purgeZeroCostItems()

  if (shoppingCartDataList.value.length === 0) {
    $q.notify({ type: 'negative', progress: true, multiLine: true, position: 'top', message: 'لا يمكنك شراء لا شيء' })
    router.push({ name: 'Home' })
  }
})
</script>

<style lang="scss" scoped>
.cart-payment {
  color: var(--ds-text);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-6);
    align-items: flex-start;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1fr) 22rem;
      gap: var(--ds-space-8);
    }
  }

  &__head {
    margin-block-end: var(--ds-space-4);
    text-align: center;
  }

  &__title {
    margin: 0 0 var(--ds-space-2);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
  }

  &__desc {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__list {
    list-style: none;
    margin: 0 0 var(--ds-space-5);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__method {
    display: grid;
    grid-template-columns: auto 2.75rem 1fr auto;
    align-items: center;
    gap: var(--ds-space-3);
    width: 100%;
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-surface);
    border: 1.5px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    cursor: pointer;
    text-align: start;
    font-family: inherit;
    color: var(--ds-text);
    transition:
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow var(--ds-duration-fast) var(--ds-ease-out),
      background var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { border-color: var(--ds-indigo, #322873); }

    &.is-selected {
      border-color: var(--ds-indigo, #322873);
      background: color-mix(in srgb, var(--ds-cream, #f6f1ea) 60%, white);
      box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.08);

      .cart-payment__method-dot {
        background: var(--ds-indigo, #322873);
        transform: scale(1);
      }
    }
  }

  &__method-indicator {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    border: 2px solid var(--ds-indigo, #322873);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__method-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: transparent;
    transform: scale(0);
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
  }

  &__method-icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--ds-radius-md);
    background: var(--ds-cream, #f6f1ea);
    color: var(--ds-indigo, #322873);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__method-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__method-title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-semibold);
    line-height: 1.3;
  }

  &__method-sub {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__method-badge {
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-medium);
    padding: 0.25rem 0.5rem;
    border-radius: var(--ds-radius-pill);
    background: var(--ds-cream, #f6f1ea);
    color: var(--ds-terracotta, #c1623c);
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  /* --- Summary --- */
  &__summary-col {
    @media (min-width: 960px) {
      position: sticky;
      inset-block-start: calc(var(--ds-space-6) + 2rem);
    }
  }

  &__summary {
    border: 1px solid var(--ds-indigo, #322873);
  }

  &__summary-title {
    margin: 0 0 var(--ds-space-3);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-indigo, #322873);
  }

  &__summary-list {
    list-style: none;
    margin: 0 0 var(--ds-space-3);
    padding: 0 0 var(--ds-space-3);
    border-block-end: 1px solid var(--ds-border);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    max-height: 14rem;
    overflow-y: auto;
  }

  &__summary-item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--ds-space-3);
    align-items: center;
    font-size: var(--ds-text-sm);
  }

  &__summary-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ds-text);
  }

  &__summary-totals {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);

    dt { color: var(--ds-text-muted); }
    dd { margin: 0; }

    &--total {
      padding-block-start: var(--ds-space-2);
      border-block-start: 1px solid var(--ds-border);
      font-weight: var(--ds-weight-semibold);

      dt {
        color: var(--ds-ink);
        font-family: var(--ds-font-heading);
      }
    }
  }

  &__assurance {
    margin: var(--ds-space-3) 0 0;
    text-align: center;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    justify-content: center;
    width: 100%;
  }

  /* --- Sub-views --- */
  &__subview {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }

  &__subview-head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
    flex-wrap: wrap;
  }

  &__subview-title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    color: var(--ds-text);
  }

  &__subview-desc {
    margin: var(--ds-space-1) 0 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__stripe {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    align-items: stretch;
  }

  &__stripe-amount {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-1);
    padding-block: var(--ds-space-4);
    border-block-end: 1px solid var(--ds-border);
  }

  &__stripe-label {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__stripe-value {
    font-family: var(--ds-font-heading);
    font-size: 2.75rem;
    font-weight: var(--ds-weight-bold);
    color: var(--ds-terracotta, #c1623c);
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-2);
  }

  &__stripe-unit {
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-regular);
    color: var(--ds-text-muted);
  }

  &__stripe-note {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__assurances {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--ds-space-2);
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-size: var(--ds-text-sm);
      color: var(--ds-text);
      background: var(--ds-cream, #f6f1ea);
      padding: var(--ds-space-2) var(--ds-space-3);
      border-radius: var(--ds-radius-md);

      .q-icon { color: var(--ds-indigo, #322873); }
    }
  }

  &__stripe-footer {
    margin: 0;
    text-align: center;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }
}
</style>
