<template>
    <div>
        <div
            class=""
            style="text-align:left"
            v-if="errorMessages.length > 0"
        >
            Please fix these <strong>error first</strong>
            <ul>
                <li
                    v-for="(message, index) in errorMessages"
                    :key="index"
                >
                    {{ message }}<br />
                </li>
            </ul>
        </div>
        <div id="paypal-button-container"></div>
        <div class="sele" v-show="btnVisible" @click="buyTheCoursesUsingPaypal">
            <img src="~assets/img/paypal.png"  alt="" />
        </div>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { PaypalPublishableKey } from 'src/graphql/checkout_management/query/PaypalPublishableKey'
import { CreatePaypalCheckout } from 'src/graphql/checkout_management/mutation/CreatePaypalCheckout'
import { CapturePaypalCheckout } from 'src/graphql/checkout_management/mutation/CapturePaypalCheckout'
import type {
  CapturePaypalCheckoutResult,
  CapturePaypalCheckoutVars,
  PaypalPublishableKeyResult,
  PaypalPublishableKeyVars,
  CreateOrderResult,
  CreateOrderVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { apolloClient } from 'src/apollo/client'

// Runtime type for the PayPal JS SDK injected by index.html.
interface PayPalButtonsConfig {
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
}
interface PayPalSDK {
  Buttons: (config: PayPalButtonsConfig) => { render: (selector: string) => void }
}

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const { shoppingCartDataList } = storeToRefs(cart)

const visible = ref<boolean>(false)
const errorMessages = ref<string[]>([])
const btnVisible = ref<boolean>(true)

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
  if (dataObj?.errors) {
    visible.value = false
    errorHandler(dataObj.errors)
  }
  if (dataObj?.success) return dataObj
  return undefined
}

async function getPaypalPaymentUrl (orderPk: number): Promise<string | null | undefined> {
  const result = await apolloClient.mutate({
    mutation: CreatePaypalCheckout,
    variables: { orderId: orderPk }
  })
  const details = (result.data as Record<string, unknown>)?.createPaypalCheckout as Record<string, unknown> | null | undefined
  if (details?.errors) { visible.value = false }
  if (details?.success) return details.paymentUrl as string
  return null
}

async function buyTheCoursesUsingPaypal (): Promise<void> {
  visible.value = true
  btnVisible.value = false
  errorMessages.value = []

  try {
    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) { visible.value = false; return }

    const paypalPaymentUrl = await getPaypalPaymentUrl(orderResult.order.pk)
    if (!paypalPaymentUrl) { visible.value = false; return }

    // Runtime guard for the PayPal SDK injected by index.html.
    const paypalSDK = (window as Record<string, unknown>)['paypal'] as PayPalSDK | undefined
    if (!paypalSDK?.Buttons) {
      throw new Error('paypal is not defined')
    }

    paypalSDK.Buttons({
      createOrder: async () => paypalPaymentUrl,
      onApprove: async (data) => {
        const paypalResult = await apolloClient.mutate<CapturePaypalCheckoutResult, CapturePaypalCheckoutVars>({
          mutation: CapturePaypalCheckout,
          variables: { orderId: data.orderID }
        })
        if (paypalResult.data?.capturePaypalCheckout?.success) {
          router.push({ name: 'cart-success' })
        }
      }
    }).render('#paypal-button-container')

    visible.value = false
  } catch (error: unknown) {
    visible.value = false
    btnVisible.value = true
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'Network error: Network Error' || msg === 'paypal is not defined') {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه' })
    }
  }
}
</script>

<style></style>
