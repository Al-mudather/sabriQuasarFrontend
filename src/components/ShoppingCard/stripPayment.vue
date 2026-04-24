<template>
  <div class="sele edit" @click="buyTheCoursesUsingStripe">
    <div class="" style="text-align: left" v-if="errorMessages.length > 0">
      Please fix these <strong>error first</strong>
      <ul>
        <li v-for="(message, index) in errorMessages" :key="index">
          {{ message }}<br />
        </li>
      </ul>
    </div>
    <img src="~assets/img/visa.png" alt="" />
    <q-inner-loading :showing="visible">
      <q-spinner-hourglass size="70px" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateStripeCheckout } from 'src/graphql/checkout_management/mutation/CreateStripeCheckout'
import { StripePublishableKey } from 'src/graphql/checkout_management/query/StripePublishableKey'
import type {
  CreateStripeCheckoutResult,
  CreateStripeCheckoutVars,
  StripePublishableKeyResult,
  StripePublishableKeyVars,
  CreateOrderResult,
  CreateOrderVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { apolloClient } from 'src/apollo/client'

const $q = useQuasar()
const cart = useCartStore()
const settings = useSettingsStore()
const { shoppingCartDataList } = storeToRefs(cart)
const { currency } = storeToRefs(settings)

const errorMessages = ref<string[]>([])
const alert = ref<boolean>(false)
const visible = ref<boolean>(false)

watch(errorMessages, (value) => {
  if (value.length > 0) alert.value = true
})

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

function getOrdersIds (): number[] {
  return shoppingCartDataList.value
    .map(item => item.course.pk)
    .filter((pk): pk is number => pk != null)
}

async function getOrderResult (courseIds: number[]): Promise<NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']> | undefined> {
  const result = await apolloClient.mutate<CreateOrderResult, CreateOrderVars>({
    mutation: CreateNewOrderWithBulkOrderDetails,
    variables: { courseIds }
  })
  const dataObj = result.data?.createNewOrderWithBulkOrderDetails
  if (dataObj?.errors) { visible.value = false; errorHandler(dataObj.errors) }
  if (dataObj?.success) return dataObj
  return undefined
}

async function getStripeKeyFromTheBackend (): Promise<string> {
  const result = await apolloClient.query<StripePublishableKeyResult, StripePublishableKeyVars>({
    query: StripePublishableKey
  })
  const raw = result.data?.stripePublishableKey
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
      currency: currency.value,
      successUrl: location.origin + '/#/cart/success',
      cancelUrl: location.origin + '/#/cart/cancel'
    }
  })
  const details = result.data?.createStripeCheckout
  if (details?.errors) {
    visible.value = false
    $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه' })
  }
  if (details?.success) return details.paymentUrl
  return null
}

async function buyTheCoursesUsingStripe (): Promise<void> {
  try {
    visible.value = true

    const stripeGlobal = (window as unknown as Record<string, unknown>)['Stripe']
    if (typeof stripeGlobal !== 'function') {
      throw new Error('Stripe not loaded')
    }

    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) { visible.value = false; return }

    cart.setSaveCheckoutOrderID(orderResult.order.pk)

    const stripeKey = await getStripeKeyFromTheBackend()
    const stripe = (stripeGlobal as (key: string) => { redirectToCheckout: (opts: { sessionId: string }) => void })(stripeKey)
    const sessionId = await getStripePaymentUrl(orderResult)

    if (sessionId) stripe.redirectToCheckout({ sessionId })

    visible.value = false
  } catch (error: unknown) {
    visible.value = false
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'Stripe not loaded') {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'Stripe غير محمل، يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى' })
    } else {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى' })
    }
  }
}
</script>

<style></style>
