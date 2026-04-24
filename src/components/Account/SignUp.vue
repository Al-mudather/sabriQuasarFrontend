<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('إنشاء حساب جديد') }}</h1>
      <p class="auth-card__subtitle">
        {{ t('ابدأ رحلتك العلمية في دقيقة واحدة.') }}
      </p>
    </header>

    <div v-if="apiError" class="auth-card__banner" role="alert">{{ apiError }}</div>

    <form @submit.prevent="registerNewUser" class="auth-card__form" novalidate>
      <ds-input
        v-model="fullName"
        type="text"
        :label="t('الاسم الكامل')"
        :error="fieldErrors.fullName"
        autocomplete="name"
        required
      />

      <ds-input
        v-model="email"
        type="email"
        :label="t('البريد الإلكتروني')"
        :error="fieldErrors.email"
        autocomplete="email"
        required
      />

      <div class="auth-card__phone">
        <div class="auth-card__phone-code">
          <label class="auth-card__phone-label">{{ t('الكود') }}</label>
          <select v-model="countryCode" class="auth-card__phone-select">
            <option value="+249">+249</option>
            <option value="+966">+966</option>
            <option value="+971">+971</option>
            <option value="+20">+20</option>
            <option value="+962">+962</option>
            <option value="+974">+974</option>
            <option value="+965">+965</option>
          </select>
        </div>
        <div class="auth-card__phone-number">
          <ds-input
            v-model="phone"
            type="tel"
            :label="t('رقم الهاتف')"
            :error="fieldErrors.phone"
            autocomplete="tel"
          />
        </div>
      </div>

      <ds-input
        v-model="password1"
        type="password"
        :label="t('كلمة المرور')"
        :error="fieldErrors.password1"
        autocomplete="new-password"
        required
      />

      <ds-input
        v-model="password2"
        type="password"
        :label="t('تأكيد كلمة المرور')"
        :error="fieldErrors.password2"
        autocomplete="new-password"
        required
      />

      <label class="auth-card__terms">
        <input type="checkbox" v-model="agreed" />
        <span>
          {{ t('أوافق على') }}
          <a @click.stop.prevent="goTerms">{{ t('الشروط والأحكام') }}</a>
          {{ t('و') }}
          <a @click.stop.prevent="goPrivacy">{{ t('سياسة الخصوصية') }}</a>
        </span>
      </label>

      <ds-button
        type="submit"
        native-type="submit"
        variant="accent"
        size="lg"
        full-width
        :loading="visible"
        :disabled="!agreed"
      >
        {{ t('إنشاء الحساب') }}
      </ds-button>
    </form>

    <div class="auth-card__social">
      <div class="auth-card__divider"><span>{{ t('أو') }}</span></div>
      <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
    </div>

    <p class="auth-card__switch">
      <span>{{ t('لديك حساب بالفعل؟') }}</span>
      <a @click="goLogin">{{ t('تسجيل الدخول') }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { RegisterNewUser } from 'src/graphql/account_management/mutation/RegisterNewUser'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication.vue'
import DsInput from 'src/design-system/components/DsInput.vue'
import type {
  RegisterMutationResult,
  RegisterVariables,
  GetMyProfileResult,
  GetMyProfileVariables,
} from 'src/types/auth/types'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

const googleLabel = ref('إنشاء حساب جديد بإستخدام Google')
const visible = ref(false)
const prevRoute = ref<string | null>(null)
const fullName = ref('')
const email = ref('')
const countryCode = ref('+249')
const phone = ref('')
const password1 = ref('')
const password2 = ref('')
const agreed = ref(false)
const apiError = ref('')
const fieldErrors = ref({ fullName: '', email: '', phone: '', password1: '', password2: '' })

onMounted(() => {
  if (isEnglish.value) googleLabel.value = 'Sign up using Google'
})

function goTerms (): void {
  void router.push({ name: 'terms-and-conditions' })
}

function goPrivacy (): void {
  void router.push('/privacyPolicy').catch(() => router.push({ name: 'terms-and-conditions' }))
}

function goLogin (): void {
  void router.push({ name: 'login' })
}

function resetErrors (): void {
  apiError.value = ''
  fieldErrors.value = { fullName: '', email: '', phone: '', password1: '', password2: '' }
}

type FieldKey = 'fullName' | 'email' | 'phone' | 'password1' | 'password2'

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  const generic: string[] = []
  const map: Record<string, FieldKey> = {
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    password1: 'password1',
    password2: 'password2',
    newPassword2: 'password2',
  }
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      const target = map[key]
      if (target) fieldErrors.value[target] = val.message
      else generic.push(val.message)
    }
  }
  if (generic.length) apiError.value = generic.join(' — ')
}

function validate (): boolean {
  resetErrors()
  let ok = true
  if (!fullName.value) { fieldErrors.value.fullName = t('الاسم مطلوب'); ok = false }
  if (!email.value) { fieldErrors.value.email = t('البريد مطلوب'); ok = false }
  if (!password1.value) { fieldErrors.value.password1 = t('كلمة المرور مطلوبة'); ok = false }
  if (password1.value && password1.value.length < 6) { fieldErrors.value.password1 = t('كلمة المرور قصيرة جداً'); ok = false }
  if (password1.value !== password2.value) { fieldErrors.value.password2 = t('كلمتا المرور غير متطابقتين'); ok = false }
  return ok
}

async function registerNewUser (): Promise<void> {
  if (!validate()) return
  visible.value = true
  try {
    const signUpRes = await apolloClient.mutate<RegisterMutationResult, RegisterVariables>({
      mutation: RegisterNewUser,
      variables: {
        email: email.value,
        fullName: fullName.value,
        password1: password1.value,
        password2: password2.value,
      }
    })
    const register = signUpRes?.data?.register
    if (register?.success) {
      const tokenAuth = {
        token: register.token,
        refresh: register.refreshToken
      }
      await auth.login(tokenAuth)
      try {
        const profile = await apolloClient.query<GetMyProfileResult, GetMyProfileVariables>({
          query: GetMyProfileData
        })
        auth.setUser(profile.data?.me)
      } catch { /* non-blocking */ }
      void router.push({ name: 'registeration-code' })
    } else if (register?.errors) {
      errorHandler(register.errors as Record<string, Array<{ message: string }>>)
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    apiError.value = err.message === 'GraphQL error: UNIQUE constraint failed: account_manager_user.email'
      ? t('هذا الحساب مسجل مسبقاً')
      : t('حدث خطأ، يرجى المحاولة لاحقاً')
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
    gap: var(--ds-space-3);
  }

  &__phone {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: var(--ds-space-2);
    align-items: end;
  }

  &__phone-label {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    display: block;
    margin-block-end: var(--ds-space-2);
  }

  &__phone-select {
    inline-size: 100%;
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-taupe);
    border-radius: var(--ds-radius-sm);
    padding: 0.75rem var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    outline: none;

    &:focus {
      border-color: var(--ds-brand-600);
      box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.18);
    }
  }

  &__terms {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-arabic);
    cursor: pointer;

    input {
      margin-block-start: 3px;
      accent-color: var(--ds-brand-600);
      inline-size: 16px;
      block-size: 16px;
    }

    a {
      color: var(--ds-brand-600);
      text-decoration: underline;
      cursor: pointer;
      margin-inline: 2px;
    }
  }

  &__social {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    color: var(--ds-text-muted);
    font-size: var(--ds-text-xs);
    font-family: var(--ds-font-heading);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-block-end: var(--ds-space-2);

    &::before, &::after {
      content: '';
      flex: 1;
      block-size: 1px;
      background: var(--ds-border);
    }
  }

  &__switch {
    text-align: center;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;

    a {
      color: var(--ds-brand-600);
      font-weight: var(--ds-weight-medium);
      margin-inline-start: var(--ds-space-1);
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }
  }
}
</style>
