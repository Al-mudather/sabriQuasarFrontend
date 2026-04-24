<template>
  <div class="q-ma-lg">
    <div class="text-h4 text-center q-ma-sm" v-if="currency != 'SDG'">
      {{ $t("ارفق فاتورة الدفع") }}
    </div>
    <div v-else>
      <div class="text-h4 text-center q-ma-sm">إشعار بنكك</div>
      <div
        class="text-h6 text-center text-danger"
        style="font-family: 'cairoR'"
      >
        ملاحظه: في حالة إشعار بنكك, يقبل فقط الإشعار الأبيض من المعاملات السابقه
        في تطبيق بنكك. اي إشعار اخر سوف يتم رفضه.
      </div>
    </div>
    <file-upload
      :imgeSize="4000000"
      :accept="'.png,.jpg, image/*'"
      :label="currency === 'SDG' ? bankakLabel : othersLabel"
      v-on:File_Handler="paymentImageHandler"
    ></file-upload>
    <q-btn
      color="red"
      @click="SEND_THE_PAYMENT"
      icon-right="send"
      label="إرسال"
    />
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
import { useI18n } from 'vue-i18n'
import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { apolloClient } from 'src/apollo/client'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { UploadAttachmentTransaction } from 'src/graphql/checkout_management/mutation/UploadAttachmentTransaction'
import type {
  CreateOrderResult,
  CreateOrderVars,
  UploadAttachmentResult,
  UploadAttachmentVars,
} from 'src/types/cart/types'
import FileUpload from 'src/components/utils/FileUploader.vue'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const cart = useCartStore()
const settings = useSettingsStore()
const { shoppingCartDataList } = storeToRefs(cart)
const { currency } = storeToRefs(settings)

const visible = ref<boolean>(false)
const bankakBill = ref<string>('')
const bankakLabel = 'إشعار بنكك الأبيض'
const othersLabel = t('اضغط للإرفاق فاتورة الدفع')

function paymentImageHandler (val: File | null): void {
  bankakBill.value = val ? (val as unknown as string) : ''
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

function getOrdersIds (): number[] {
  return shoppingCartDataList.value
    .map(item => item.course.pk)
    .filter((pk): pk is number => pk != null)
}

async function getOrderResult (courseIds: number[]): Promise<NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']> | undefined> {
  try {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('User already has valid enrollment in the course')) {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'لديك اشتراك مسبق في هذا الكورس' })
    }
    return undefined
  }
}

async function SEND_THE_PAYMENT (): Promise<void> {
  try {
    visible.value = true
    if (!bankakBill.value) {
      $q.notify({ type: 'negative', progress: true, multiLine: true, position: 'top', message: 'You are not allowed to upload an empty data' })
      visible.value = false
      return
    }

    const courseIds = getOrdersIds()
    const orderResult = await getOrderResult(courseIds)
    if (!orderResult?.order?.pk) { visible.value = false; return }

    const bankakPaymentResult = await apolloClient.mutate<UploadAttachmentResult, UploadAttachmentVars>({
      mutation: UploadAttachmentTransaction,
      variables: {
        input: {
          order: orderResult.order.pk,
          attachment: bankakBill.value as unknown as File
        }
      }
    })

    const dataObj = bankakPaymentResult.data?.uploadAttachmentTransaction
    if (dataObj?.success) {
      visible.value = false
      cart.deleteCart()
      router.push({ name: 'cart-success' })
    } else {
      visible.value = false
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : ''
    $q.notify({ type: 'negative', progress: true, multiLine: true, position: 'top', message: msg })
    visible.value = false
    if (msg.includes('User already has valid enrollment in the course')) {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'لديك اشتراك مسبق في احد الكورسات اللتي قمت بشرائها, الرجاء قم بشراء كورس لم تمتلكه من قبل' })
    }
  }
}
</script>

<style lang="scss">
.q-btn {
  & > span {
    margin-right: 0 !important;
    margin-left: 0 !important;
    & > span {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }
  }
}

.q-icon {
  margin-left: 0 !important;
  margin-right: 0.3rem;
}
</style>
