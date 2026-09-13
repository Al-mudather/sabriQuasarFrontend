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

        <PhoneInput
          ref="telegramInput"
          v-model="telegramNumber"
          :label="$t('رقم تلجرام (اختياري)')"
          :error="errors.telegram"
        />

        <DsInput
          v-model="email"
          type="email"
          dir="ltr"
          :label="$t('البريد الإلكتروني')"
          :placeholder="$t('example@mail.com')"
          :error="errors.email"
        />

        <div class="user-info__row user-info__row--two">
          <DsInput
            v-model="country"
            :label="$t('الدولة')"
            :placeholder="$t('السعودية')"
          />
          <DsInput
            v-model="city"
            :label="$t('المدينة')"
            :placeholder="$t('الرياض')"
          />
        </div>

        <DsTextarea
          v-model="notes"
          :label="$t('ملاحظات (اختياري)')"
          :placeholder="$t('أي معلومات إضافية تودّ إخبارنا بها')"
          :rows="3"
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
import DsTextarea from 'src/design-system/components/DsTextarea.vue'
import PhoneInput from 'src/components/shared/PhoneInput.vue'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

const fullName = ref<string>('')
const email = ref<string>('')
// Both numbers are held and persisted as E.164 (PhoneInput's contract).
const whatsAppNumber = ref<string | null>(null)
const telegramNumber = ref<string | null>(null)
const country = ref<string>('')
const city = ref<string>('')
const notes = ref<string>('')
const submitting = ref<boolean>(false)
const errors = reactive({ fullName: '', phone: '', telegram: '', email: '' })

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
      email.value = me.email || ''
    }
  } catch {
    // silent — form will render empty
  }
})

function validate (): boolean {
  errors.fullName = ''
  errors.phone = ''
  errors.telegram = ''
  errors.email = ''
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
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = t('صيغة البريد الإلكتروني غير صحيحة')
    ok = false
  }
  return ok
}

function errorHandler (errorsObj: unknown): void {
  if (typeof errorsObj !== 'object' || errorsObj == null) return
  for (const key of Object.keys(errorsObj as Record<string, unknown>)) {
    const entries = (errorsObj as Record<string, unknown[]>)[key]
    if (!Array.isArray(entries)) continue
    for (const val of entries) {
      const v = val as Record<string, unknown>
      const msg = typeof v.message === 'object'
        ? ((v.message as Record<string, unknown>).msg as string ?? JSON.stringify(v.message))
        : `${v.message} : ${key}`
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

  &__row {
    display: grid;
    gap: var(--ds-space-3);

    &--two {
      grid-template-columns: 1fr 1fr;
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
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
