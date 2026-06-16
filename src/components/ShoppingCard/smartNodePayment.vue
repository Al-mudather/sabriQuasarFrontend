<template>
    <div class="sele edit" @click="buyTheCoursesUsingSmartNode">
        <img src="~assets/img/credit-cards.png" alt="" />
        <h3>Sudanies Bank</h3>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar, openURL } from 'quasar'
import { CreateSmartNodeCheckout } from 'src/graphql/checkout_management/mutation/CreateSmartNodeCheckout'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import type {
  CreateSmartNodeCheckoutResult,
  CreateSmartNodeCheckoutVars,
  CreateOrderResult,
  CreateOrderVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { apolloClient } from 'src/apollo/client'

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

async function makeSmartNodePayment (orderPk: number): Promise<string | null | undefined> {
  const result = await apolloClient.mutate<CreateSmartNodeCheckoutResult, CreateSmartNodeCheckoutVars>({
    mutation: CreateSmartNodeCheckout,
    variables: { card: '', expDate: '', ipin: null, orderId: orderPk }
  })
  const details = result.data?.createSmartNodeCheckout
  if (details?.errors) { visible.value = false }
  // CreateSmartNodeCheckoutMutation doesn't include paymentUrl in the selection
  // (generated.ts only returns success + errors). Cast for now until backend
  // adds paymentUrl to the SmartNode mutation response.
  const detailsExt = details as (typeof details & { paymentUrl?: string | null }) | null | undefined
  if (detailsExt?.success) return detailsExt.paymentUrl
  return null
}

async function buyTheCoursesUsingSmartNode (): Promise<void> {
  try {
    visible.value = true
    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) { visible.value = false; return }
    const paymentUrl = await makeSmartNodePayment(orderResult.order.pk)
    if (paymentUrl) openURL(paymentUrl)
    visible.value = false
  } catch {
    visible.value = false
    $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'bottom', message: 'انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه' })
  }
}
</script>

<style></style>
