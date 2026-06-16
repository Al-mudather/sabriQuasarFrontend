<template>
  <div class="bk-pay">
    <!-- ------------------------------------------------------------------ -->
    <!-- Heading                                                              -->
    <!-- ------------------------------------------------------------------ -->
    <h2 class="bk-pay__heading">
      {{ currency === 'SDG' ? $t('إشعار بنكك') : $t('ارفق فاتورة الدفع') }}
    </h2>

    <!-- ------------------------------------------------------------------ -->
    <!-- Warning callout — Bankak SDG only                                   -->
    <!-- ------------------------------------------------------------------ -->
    <div class="bk-callout" role="note">
      <span class="bk-callout__icon" aria-hidden="true">
        <!-- Warning triangle SVG — inline, purposeful, small -->
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.13 3.46L2.04 15.17A1 1 0 0 0 2.9 16.7h14.18a1 1 0 0 0 .87-1.53L10.86 3.46a1 1 0 0 0-1.73 0z"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linejoin="round"
            fill="none"
          />
          <path d="M10 8v3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
        </svg>
      </span>
      <p class="bk-callout__text">
        {{ $t('يوجد نوعان من إشعارات بنكك: الأخضر والأبيض. يُرجى إرفاق الإشعار الأبيض فقط (إشعار المعاملات السابقة في تطبيق بنكك)، أما الإشعار الأخضر فغير مقبول.') }}
      </p>
    </div>

    <!-- ------------------------------------------------------------------ -->
    <!-- Helper text                                                          -->
    <!-- ------------------------------------------------------------------ -->
    <p class="bk-pay__helper">
      {{ $t('ارفع صورة واضحة لإيصال الدفع ليتمكن الفريق من التحقق من معاملتك.') }}
    </p>

    <!-- ------------------------------------------------------------------ -->
    <!-- File uploader                                                        -->
    <!-- ------------------------------------------------------------------ -->
    <file-upload
      :imgeSize="4000000"
      :accept="'.png,.jpg,image/*'"
      :label="currency === 'SDG' ? bankakLabel : othersLabel"
      @File_Handler="paymentImageHandler"
    />

    <!-- ------------------------------------------------------------------ -->
    <!-- Progress bar while submitting                                        -->
    <!-- ------------------------------------------------------------------ -->
    <ds-progress-bar
      v-if="visible"
      :indeterminate="true"
      size="sm"
      variant="brand"
      class="bk-pay__progress"
    />

    <!-- ------------------------------------------------------------------ -->
    <!-- Submit                                                               -->
    <!-- ------------------------------------------------------------------ -->
    <ds-button
      variant="primary"
      size="lg"
      :full-width="true"
      :loading="visible"
      :disabled="visible"
      @click="SEND_THE_PAYMENT"
    >
      {{ $t('إرسال') }}
    </ds-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from 'src/stores/cart'
import { useSettingsStore } from 'src/stores/settings'
import { usePyramidStore } from 'src/stores/pyramid'
import { apolloClient } from 'src/apollo/client'
import { CreateNewOrderWithBulkOrderDetails } from 'src/graphql/order_management/mutation/CreateNewOrderWithBulkOrderDetails'
import { UploadAttachmentTransaction } from 'src/graphql/checkout_management/mutation/UploadAttachmentTransaction'
import type {
  CreateOrderResult,
  CreateOrderVars,
  UploadAttachmentResult,
  UploadAttachmentVars,
} from 'src/types/cart/types'
import { toast } from 'src/design-system/toast'
import FileUpload from 'src/components/utils/FileUploader.vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsProgressBar from 'src/design-system/components/DsProgressBar.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const cart = useCartStore()
const settings = useSettingsStore()
const pyramid = usePyramidStore()
const { shoppingCartDataList } = storeToRefs(cart)
const { currency } = storeToRefs(settings)

/**
 * Route the user to the registration-code page with a clear reason. The
 * registration-code (PyramidAffiliate) requirement is the #1 reason a payment
 * is rejected; we detect it deterministically via the gate check below rather
 * than parsing the backend's error string (which is opaque and varied).
 */
function routeToRegistrationCode (): void {
  toast.warning(t('يرجى إدخال رمز الإحالة الخاص بك أولاً'))
  void router.push({ name: 'registeration-code', query: { redirect: route.fullPath } })
}

const visible = ref<boolean>(false)
const bankakBill = ref<File | null>(null)
const bankakLabel = t('إشعار بنكك الأبيض')
const othersLabel = t('اضغط للإرفاق فاتورة الدفع')

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
function paymentImageHandler (val: File | null): void {
  bankakBill.value = val
}

/**
 * Surface server validation errors. Returns the number of messages actually
 * shown so callers can fall back to a generic message when the payload has an
 * unexpected shape — guaranteeing the user is never left with no feedback.
 * Handles the common Django/Graphene shape `{ field: [{ message }] }` as well
 * as a bare `{ message }` or a plain string.
 */
function errorHandler (errorsObj: unknown): number {
  if (errorsObj == null) return 0
  if (typeof errorsObj === 'string') {
    if (errorsObj) { toast.warning(errorsObj); return 1 }
    return 0
  }
  if (typeof errorsObj !== 'object') return 0
  let shown = 0
  const top = errorsObj as Record<string, unknown>
  // Bare `{ message: '...' }`.
  if (typeof top.message === 'string' && top.message) {
    toast.warning(top.message)
    shown++
  }
  for (const key of Object.keys(top)) {
    const entries = top[key]
    if (!Array.isArray(entries)) continue
    for (const val of entries) {
      const v = val as Record<string, unknown>
      const msg = String(v?.message ?? '')
      if (msg) { toast.warning(msg); shown++ }
    }
  }
  return shown
}

function getOrdersIds (): number[] {
  return shoppingCartDataList.value
    .map(item => item.course.pk)
    .filter((pk): pk is number => pk != null)
}

async function getOrderResult (
  courseIds: number[]
): Promise<NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']> | undefined> {
  try {
    const result = await apolloClient.mutate<CreateOrderResult, CreateOrderVars>({
      mutation: CreateNewOrderWithBulkOrderDetails,
      variables: { courseIds },
    })
    const dataObj = result.data?.createNewOrderWithBulkOrderDetails
    if (dataObj?.success) return dataObj
    // Order creation failed — surface it instead of returning silently. If the
    // errors payload had no readable message, still show a generic reason.
    if (!dataObj?.errors || errorHandler(dataObj.errors) === 0) {
      toast.danger(t('تعذّر إنشاء الطلب، يرجى المحاولة مجدداً أو التواصل مع الدعم'))
    }
    return undefined
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('User already has valid enrollment in the course')) {
      toast.warning(t('لديك اشتراك مسبق في هذا الكورس'))
    } else {
      toast.danger(t('حدث خطأ أثناء إنشاء الطلب، يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً'))
    }
    return undefined
  }
}

async function SEND_THE_PAYMENT (): Promise<void> {
  try {
    visible.value = true
    if (!bankakBill.value) {
      toast.danger(t('الرجاء إرفاق صورة إيصال الدفع قبل الإرسال'))
      visible.value = false
      return
    }

    const courseIds = getOrdersIds()
    if (courseIds.length === 0) {
      toast.danger(t('لا توجد كورسات في سلة المشتريات'))
      visible.value = false
      return
    }

    // Registration-code gate — check BEFORE creating an order so a no-code user
    // is told to enter their code (not left with a misleading "image unclear"
    // error after the upload, and no orphaned pending order is created). This is
    // deterministic: it re-checks the PyramidAffiliate link instead of guessing
    // from the server's rejection wording.
    if (!(await pyramid.verifyPlatformAccess(true))) {
      visible.value = false
      routeToRegistrationCode()
      return
    }

    const orderResult = await getOrderResult(courseIds)
    // getOrderResult already surfaced the reason on failure — just stop here.
    if (!orderResult?.order?.pk) { visible.value = false; return }
    cart.setSaveCheckoutOrderID(orderResult.order.pk)

    const bankakPaymentResult = await apolloClient.mutate<UploadAttachmentResult, UploadAttachmentVars>({
      mutation: UploadAttachmentTransaction,
      variables: {
        input: {
          order: orderResult.order.pk,
          attachment: bankakBill.value,
        },
      },
    })

    const dataObj = bankakPaymentResult.data?.uploadAttachmentTransaction
    if (dataObj?.success) {
      visible.value = false
      cart.deleteCart()
      router.push({ name: 'cart-success' })
    } else {
      // The receipt was rejected. The most common reason is the missing
      // registration code — re-check the gate deterministically (the server
      // error shape is opaque and was hiding the real reason behind a generic
      // "image unclear" message). Otherwise surface the server's own message.
      visible.value = false
      if (!(await pyramid.verifyPlatformAccess(true))) {
        routeToRegistrationCode()
        return
      }
      const shown = dataObj?.errors ? errorHandler(dataObj.errors) : 0
      if (shown === 0) {
        // Never leave the user with no feedback (the original silent bug).
        toast.danger(t('لم يتم قبول الإيصال، يرجى التأكد من وضوح الصورة والمحاولة مجدداً'))
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : ''
    visible.value = false
    if (msg.includes('User already has valid enrollment in the course')) {
      toast.warning(t('لديك اشتراك مسبق في أحد الكورسات التي قمت بشرائها، الرجاء شراء كورس لم تمتلكه من قبل'))
    } else if (!(await pyramid.verifyPlatformAccess(true))) {
      // A thrown rejection that's really the missing-code case.
      routeToRegistrationCode()
    } else {
      // Surface the raw server reason if we have one (the old system showed it
      // verbatim) instead of always blaming the connection.
      toast.danger(msg || t('حدث خطأ أثناء إرسال الدفعة'))
    }
  }
}
</script>

<style lang="scss" scoped>
// ---------------------------------------------------------------------------
// Root — vertical rhythm only, no card wrapper (parent DsCard owns the box)
// ---------------------------------------------------------------------------
.bk-pay {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
  padding-block: var(--ds-space-2);
}

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------
.bk-pay__heading {
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-xl);
  font-weight: var(--ds-weight-semibold);
  color: var(--ds-text);
  line-height: var(--ds-leading-tight);
  margin: 0;
  text-align: center;
}

// ---------------------------------------------------------------------------
// Helper text
// ---------------------------------------------------------------------------
.bk-pay__helper {
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text-muted);
  line-height: var(--ds-leading-arabic);
  margin: 0;
  text-align: center;
}

// ---------------------------------------------------------------------------
// Warning callout (Bankak SDG only)
// Tinted background + icon — NO side stripe border.
// ---------------------------------------------------------------------------
.bk-callout {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-4);
  background: var(--ds-warning-bg);
  border: 1px solid rgba(184, 134, 42, 0.25);
  border-radius: var(--ds-radius-md);
  color: var(--ds-ink);

  &__icon {
    flex-shrink: 0;
    margin-block-start: 0.1em;
    color: var(--ds-warning);
    inline-size: 1.2rem;
    block-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      inline-size: 100%;
      block-size: 100%;
    }
  }

  &__text {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-ink);
    margin: 0;
  }
}

// ---------------------------------------------------------------------------
// Progress bar spacing
// ---------------------------------------------------------------------------
.bk-pay__progress {
  margin-block: calc(var(--ds-space-2) * -1);
}
</style>
