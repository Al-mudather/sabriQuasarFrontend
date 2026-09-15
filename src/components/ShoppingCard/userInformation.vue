<template>
  <section class="user-info" :aria-label="$t('معلومات الفوترة')">
    <header class="user-info__header">
      <h2 class="user-info__title">{{ $t('معلوماتك الشخصية') }}</h2>
      <p class="user-info__subtitle">
        {{ $t('نستخدم هذه المعلومات للتواصل معك بشأن طلبك وتفعيل الدورات.') }}
      </p>
    </header>

    <DsCard padding="lg" class="user-info__card">
      <form
        class="user-info__form"
        novalidate
        @submit.prevent="UPDATE_THE_USER_PROFILE"
      >
        <DsInput
          v-model="fullName"
          dir="auto"
          :label="$t('الاسم الكامل')"
          :placeholder="$t('مثال: أحمد محمد')"
          :error="errors.fullName"
          required
        >
          <template #helper>{{ $t('باللغة العربية أو الإنجليزية') }}</template>
        </DsInput>

        <PhoneInput
          ref="whatsAppInput"
          v-model="whatsAppNumber"
          :label="$t('رقم واتساب')"
          :placeholder="$t('رقم الهاتف')"
          :error="errors.phone"
          :helper="$t('يفضل رقم متصل بواتساب')"
          required
        />

        <!-- Telegram follows the WhatsApp country until the user types a
             Telegram number — most students use one number for both. -->
        <PhoneInput
          ref="telegramInput"
          v-model="telegramNumber"
          :default-country="whatsAppInput?.country ?? 'SD'"
          :label="$t('رقم تلجرام (اختياري)')"
          :error="errors.telegram"
        />

        <div class="user-info__actions">
          <DsButton
            variant="ghost"
            size="md"
            @click="$router.push({ name: 'cart' })"
          >
            ← {{ $t('عودة إلى السلة') }}
          </DsButton>

          <DsButton
            type="submit"
            variant="accent"
            size="lg"
            :loading="submitting"
            :disabled="submitting"
            @click="UPDATE_THE_USER_PROFILE"
          >
            {{ $t('التالي — الدفع') }}
          </DsButton>
        </div>
      </form>
    </DsCard>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { apolloClient } from 'src/apollo/client'
import { UpdateUserProfile } from 'src/graphql/account_management/mutation/UpdateUserProfile'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import type {
  UpdateProfileMutationResult,
  UpdateProfileVariables,
  GetMyProfileResult,
  GetMyProfileVariables,
} from 'src/types/auth/types'

import DsInput from 'src/design-system/components/DsInput.vue'
import PhoneInput from 'src/components/shared/PhoneInput.vue'
import { isUnauthenticatedError } from 'src/utils/session'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

const fullName = ref<string>('')
// Both numbers are held and persisted as E.164 (PhoneInput's contract).
const whatsAppNumber = ref<string | null>(null)
const telegramNumber = ref<string | null>(null)
const submitting = ref<boolean>(false)
const errors = reactive({ fullName: '', phone: '', telegram: '' })

const whatsAppInput = ref<InstanceType<typeof PhoneInput> | null>(null)
const telegramInput = ref<InstanceType<typeof PhoneInput> | null>(null)

onMounted(async () => {
  try {
    const res = await apolloClient.query<GetMyProfileResult, GetMyProfileVariables>({
      query: GetMyProfileData
    })
    const me = res.data?.me
    if (me?.pk) {
      if (me.fullName && (me.phoneNumber2 || me.phoneNumber3)) {
        router.push({ name: 'payment' })
        return
      }
      fullName.value = me.fullName || ''
      whatsAppNumber.value = me.phoneNumber2 || null
      telegramNumber.value = me.phoneNumber3 || null
    }
  } catch {
    // silent — form will render empty
  }
})

function validate (): boolean {
  errors.fullName = ''
  errors.phone = ''
  errors.telegram = ''
  let ok = true

  // Any script (Arabic, Latin, Cyrillic, …): just a real name-ish string.
  if (!fullName.value || fullName.value.trim().length < 2 || !/\p{L}/u.test(fullName.value)) {
    errors.fullName = t('يرجى إدخال اسمك الكامل')
    ok = false
  }
  const waStatus = whatsAppInput.value?.status ?? 'empty'
  if (waStatus === 'empty') {
    errors.phone = t('يرجى إدخال رقم هاتف صحيح')
    ok = false
  } else if (waStatus === 'invalid') {
    errors.phone = t('الرقم غير صالح للدولة المختارة')
    ok = false
  }
  if ((telegramInput.value?.status ?? 'empty') === 'invalid') {
    errors.telegram = t('الرقم غير صالح للدولة المختارة')
    ok = false
  }
  return ok
}

// Server-side field errors land on the matching input; anything else is a
// plain toast (no more "message : nonFieldErrors").
const FIELD_ERROR_TARGET: Record<string, 'fullName' | 'phone' | 'telegram'> = {
  fullName: 'fullName',
  phoneNumber2: 'phone',
  phoneNumber3: 'telegram'
}

function errorHandler (errorsObj: unknown): void {
  if (typeof errorsObj !== 'object' || errorsObj == null) return
  for (const [key, entries] of Object.entries(errorsObj as Record<string, unknown>)) {
    if (!Array.isArray(entries)) continue
    for (const val of entries) {
      const v = (val ?? {}) as { message?: unknown; code?: string }
      const message = typeof v.message === 'object' && v.message !== null
        ? String((v.message as Record<string, unknown>).msg ?? JSON.stringify(v.message))
        : typeof v.message === 'string' ? v.message : ''
      // A dead session is handled globally (App.vue tells the user and sends
      // them to login) — a second toast here would only confuse.
      if (isUnauthenticatedError({ message, code: v.code })) return
      const msg = message || t('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى')
      const target = FIELD_ERROR_TARGET[key]
      if (target) errors[target] = msg
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'bottom', message: msg })
    }
  }
}

async function UPDATE_THE_USER_PROFILE (e?: Event): Promise<void> {
  if (e && e.preventDefault) e.preventDefault()
  if (!validate()) return

  submitting.value = true
  try {
    const res = await apolloClient.mutate<UpdateProfileMutationResult, UpdateProfileVariables>({
      mutation: UpdateUserProfile,
      variables: {
        input: {
          fullName: fullName.value,
          phoneNumber2: whatsAppNumber.value,
          phoneNumber3: telegramNumber.value || null
        }
      }
    })

    const payload = res.data?.updateUserProfile
    if (payload?.errors && typeof payload.errors === 'object' && Object.keys(payload.errors).length) {
      errorHandler(payload.errors)
      submitting.value = false
      return
    }

    $q.notify({ type: 'positive', multiLine: true, progress: true, position: 'bottom', message: 'تم حفظ بياناتك' })
    router.push({ name: 'payment' })
  } catch {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
  color: var(--ds-text);

  &__header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
  }

  &__subtitle {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: 1.6;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: var(--ds-space-2);
    flex-wrap: wrap;
  }
}
</style>
