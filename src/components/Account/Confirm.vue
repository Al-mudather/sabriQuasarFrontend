<template>
  <div class="auth-card">
    <div class="auth-card__icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="12" width="36" height="26" rx="3" />
        <path d="M6 14l18 14 18-14" />
      </svg>
    </div>

    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('تم إرسال رابط التفعيل') }}</h1>
      <p class="auth-card__subtitle">
        {{ t('أرسلنا لك رابط تفعيل على بريدك الإلكتروني. افتح الرابط لإكمال التحقق من الحساب.') }}
      </p>
      <p class="auth-card__hint">
        {{ t('لم يصلك الرابط؟ أعد الإرسال من هنا.') }}
      </p>
    </header>

    <div v-if="showResend" class="auth-card__form">
      <ds-input
        v-model="email"
        type="email"
        :label="t('البريد الإلكتروني')"
        autocomplete="email"
        autofocus
        @keydown.enter="resendUserEmail"
      />
      <ds-button
        variant="accent"
        size="lg"
        full-width
        :loading="loader"
        @click="resendUserEmail"
      >
        {{ t('إرسال') }}
      </ds-button>
      <ds-button variant="ghost" size="lg" full-width @click="showResend = false">
        {{ t('إلغاء') }}
      </ds-button>
    </div>

    <div v-else class="auth-card__actions">
      <ds-button variant="accent" size="lg" full-width @click="showResend = true">
        {{ t('إعادة الإرسال') }}
      </ds-button>
      <ds-button variant="ghost" size="lg" full-width @click="goToHomePage">
        {{ t('العودة إلى الرئيسية') }}
      </ds-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useMutation } from '@vue/apollo-composable'
import { ResendActivationEmail } from 'src/graphql/account_management/mutation/ResendActivationEmail'
import DsInput from 'src/design-system/components/DsInput.vue'
import type { ResendActivationEmailResult, ResendActivationEmailVariables } from 'src/types/auth/types'

const { t } = useI18n()
const router = useRouter()
const $q = useQuasar()

const showResend = ref(false)
const loader = ref(false)
const email = ref('')

const { mutate: resendEmail } = useMutation<ResendActivationEmailResult, ResendActivationEmailVariables>(
  ResendActivationEmail
)

function goToHomePage (): void {
  void router.push({ name: 'Home' })
}

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      $q.notify({
        type: 'warning',
        progress: true,
        multiLine: true,
        position: 'bottom',
        message: val.message
      })
    }
  }
}

async function resendUserEmail (): Promise<void> {
  if (!email.value) {
    $q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'bottom',
      message: t('بريدك الإلكتروني مطلوب')
    })
    return
  }
  loader.value = true
  try {
    const result = await resendEmail({ email: email.value })
    const payload = result?.data?.resendActivationEmail
    if (payload?.success) {
      $q.notify({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'bottom',
        message: t('تم إرسال البريد بنجاح')
      })
      showResend.value = false
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string }>>)
    }
  } catch (error: unknown) {
    const err = error as { errors?: Record<string, Array<{ message: string }>> }
    if (err.errors) errorHandler(err.errors)
  } finally {
    loader.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__icon {
    inline-size: 56px;
    block-size: 56px;
    border-radius: 50%;
    background: var(--ds-brand-50);
    color: var(--ds-brand-600);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__head { text-align: start; }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-2);
  }

  &__subtitle {
    font-size: var(--ds-text-md);
    color: var(--ds-text-muted);
    margin: 0 0 var(--ds-space-2);
    line-height: var(--ds-leading-arabic);
  }

  &__hint {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;
  }

  &__form,
  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }
}
</style>
