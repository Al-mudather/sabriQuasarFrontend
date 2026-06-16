<template>
    <div>
        <!-- <div id="paypal-button-container"></div>
        <div class="sele" v-show="btnVisible" @click="buyTheCoursesUsingBraintree">
            <img src="~assets/img/paypal.png"  alt="" />
        </div> -->
        <v-braintree
        class="q-ma-md"
            :authorization="braintreeClientToken"
            @success="START_THE_PAYMENT_AFTER_GETING_THE_CLIENT_TOKEN"
            @error="onError"
        >
            <template v-slot:button="slotProps">
                <div>
                    <q-btn @click="slotProps.submit" label="Pay" color="success" />
                </div>
            </template>
        </v-braintree>
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
import { CaptureBraintreeCheckout } from 'src/graphql/checkout_management/mutation/CaptureBraintreeCheckout.js'
import type {
  CaptureBraintreeCheckoutResult,
  CaptureBraintreeCheckoutVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { apolloClient } from 'src/apollo/client'

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const { braintreeClientToken, orderData } = storeToRefs(cart)

const visible = ref<boolean>(false)
const btnVisible = ref<boolean>(true)

function errorHandler (errorsObj: unknown): void {
  if (typeof errorsObj !== 'object' || errorsObj == null) return
  for (const key of Object.keys(errorsObj as Record<string, unknown>)) {
    const entries = (errorsObj as Record<string, unknown[]>)[key]
    if (!Array.isArray(entries)) continue
    for (const val of entries) {
      const v = val as Record<string, unknown>
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'bottom', message: String(v.PaymentUrl ?? '') })
    }
  }
}

async function START_THE_PAYMENT_AFTER_GETING_THE_CLIENT_TOKEN (payload: { nonce: string }): Promise<void> {
  const od = orderData.value as Record<string, unknown> | null
  const orderPk = (od?.order as Record<string, unknown> | undefined)?.pk as number | undefined
  if (orderPk == null) return

  const result = await apolloClient.mutate<CaptureBraintreeCheckoutResult, CaptureBraintreeCheckoutVars>({
    mutation: CaptureBraintreeCheckout,
    variables: {
      orderId: orderPk,
      nonce: payload.nonce
    }
  })

  const success = result.data?.captureBraintreeCheckout?.success
  const errors = result.data?.captureBraintreeCheckout?.errors

  if (success) {
    cart.setOrderData(null)
    router.push({ name: 'cart-success' })
  }

  if (errors) {
    errorHandler(errors)
  }
}

function onError (): void {}
</script>

<style></style>
