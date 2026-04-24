<template>
    <div class="sele edit" @click="buyTheCoursesUsingSyberPay">
        <img src="~assets/img/credit-cards.png" alt="" />
        <h3>SyberPay</h3>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script setup lang="ts">
// Syberpay: CreateSyberpayCheckout / CaptureSyberpayCheckout are not yet in
// generated.ts (see TODO in src/types/cart/types.ts). The mutation call is
// typed via an inline interface until the backend/codegen is updated.
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar, openURL } from 'quasar'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { CreateSyberpayCheckout } from 'src/graphql/checkout_management/mutation/CreateSyberpayCheckout'
import type {
  CreateOrderResult,
  CreateOrderVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { apolloClient } from 'src/apollo/client'

// Syberpay mutation result shape (not yet in generated.ts)
interface CreateSyberpayCheckoutResult {
  createSyberpayCheckout?: {
    success?: boolean | null
    errors?: unknown
    paymentUrl?: string | null
  } | null
}
interface CreateSyberpayCheckoutVars {
  orderId: number
}

const $q = useQuasar()
const cart = useCartStore()
const { shoppingCartDataList } = storeToRefs(cart)

const visible = ref<boolean>(false)

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
  if (dataObj?.errors) { visible.value = false }
  if (dataObj?.success) return dataObj
  return undefined
}

async function getSyberPayPaymentUrl (orderPk: number): Promise<string | null | undefined> {
  const result = await apolloClient.mutate<CreateSyberpayCheckoutResult, CreateSyberpayCheckoutVars>({
    mutation: CreateSyberpayCheckout,
    variables: { orderId: orderPk }
  })
  const details = result.data?.createSyberpayCheckout
  if (details?.errors) { visible.value = false }
  if (details?.success) return details.paymentUrl
  return null
}

async function buyTheCoursesUsingSyberPay (): Promise<void> {
  visible.value = true
  const courseIds = getOrdersIds()
  const orderResult = await getOrderResult(courseIds)
  if (!orderResult?.order?.pk) { visible.value = false; return }
  const paymentUrl = await getSyberPayPaymentUrl(orderResult.order.pk)
  if (paymentUrl) openURL(paymentUrl)
  visible.value = false
}
</script>

<style></style>
