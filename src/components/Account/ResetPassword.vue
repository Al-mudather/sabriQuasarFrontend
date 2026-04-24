<template>
  <div class="auth-card">
    <template v-if="!sent">
      <header class="auth-card__head">
        <h1 class="auth-card__title">{{ t('استعادة كلمة المرور') }}</h1>
        <p class="auth-card__subtitle">
          {{ t('أدخل بريدك الإلكتروني وسنرسل إليك رابطاً لإعادة تعيين كلمة المرور.') }}
        </p>
      </header>

      <div v-if="apiError" class="auth-card__banner" role="alert">{{ apiError }}</div>

      <form @submit.prevent="sendEmailConfirmation" class="auth-card__form" novalidate>
        <ds-input
          v-model="email"
          type="email"
          :label="t('البريد الإلكتروني')"
          :error="fieldError"
          autocomplete="email"
          required
        />

        <ds-button
          type="submit"
          native-type="submit"
          variant="accent"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ t('إرسال رابط الاستعادة') }}
        </ds-button>

        <ds-button
          type="button"
          native-type="button"
          variant="ghost"
          size="lg"
          full-width
          @click="goLogin"
        >
          {{ t('العودة إلى تسجيل الدخول') }}
        </ds-button>
      </form>
    </template>

    <template v-else>
      <div class="auth-card__success">
        <div class="auth-card__success-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="24" cy="24" r="20" />
            <path d="M14 24l7 7 14-14" />
          </svg>
        </div>
        <h1 class="auth-card__title">{{ t('تم إرسال الرابط إلى بريدك') }}</h1>
        <p class="auth-card__subtitle">
          {{ t('تحقق من صندوق الوارد — الرابط صالح لمدة قصيرة. إن لم تجده، راجع مجلد الرسائل غير المرغوبة.') }}
        </p>
        <ds-button variant="ghost" size="lg" full-width @click="goLogin">
          {{ t('العودة إلى تسجيل الدخول') }}
        </ds-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { UserPasswordResetEmail } from 'src/graphql/account_management/mutation/UserPasswordResetEmail'
import DsInput from 'src/design-system/components/DsInput.vue'
import type { PasswordResetEmailResult, PasswordResetEmailVariables } from 'src/types/auth/types'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const visible = ref(false)
const sent = ref(false)
const apiError = ref('')
const fieldError = ref('')

const { mutate: sendResetEmail } = useMutation<PasswordResetEmailResult, PasswordResetEmailVariables>(
  UserPasswordResetEmail
)

function goLogin (): void {
  void router.push({ name: 'login' })
}

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  const generic: string[] = []
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      if (key === 'email') fieldError.value = val.message
      else generic.push(val.message)
    }
  }
  if (generic.length) apiError.value = generic.join(' — ')
}

async function sendEmailConfirmation (): Promise<void> {
  apiError.value = ''
  fieldError.value = ''
  visible.value = true
  try {
    const res = await sendResetEmail({ email: email.value })
    const payload = res?.data?.sendPasswordResetEmail
    if (payload?.success) {
      sent.value = true
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string }>>)
    }
  } catch {
    apiError.value = t('تعذر إرسال البريد الإلكتروني، حاول مجدداً')
  } finally {
    visible.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__head { text-align: start; }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-2xl);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-2);
  }

  &__subtitle {
    font-size: var(--ds-text-md);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-arabic);
  }

  &__banner {
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-accent-50);
    color: var(--ds-accent-500);
    border-inline-start: 3px solid var(--ds-accent-300);
    border-radius: var(--ds-radius-sm);
    font-size: var(--ds-text-sm);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__success {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    align-items: flex-start;
    text-align: start;
  }

  &__success-icon {
    inline-size: 64px;
    block-size: 64px;
    border-radius: 50%;
    background: var(--ds-brand-50);
    color: var(--ds-brand-600);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
