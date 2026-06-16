<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('تسجيل الدخول') }}</h1>
      <p class="auth-card__subtitle">
        {{ t('أهلاً بعودتك. أدخل بياناتك لمتابعة رحلتك.') }}
      </p>
    </header>

    <!-- Primary sign-in — available to all users -->
    <div class="auth-card__social">
      <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />

      <ds-button
        type="button"
        native-type="button"
        variant="ghost"
        size="lg"
        full-width
        @click="goToSignUpPage"
      >
        {{ t('إنشاء حساب جديد') }}
      </ds-button>
    </div>

    <!-- "or" divider doubles as the toggle that reveals credential login
         (email/password — reserved for specific users, hidden by default). -->
    <button
      type="button"
      class="auth-card__divider auth-card__divider--toggle"
      :class="{ 'is-open': showCredentials }"
      :aria-expanded="showCredentials ? 'true' : 'false'"
      aria-controls="auth-credentials"
      @click="showCredentials = !showCredentials"
    >
      <span class="auth-card__divider-label">
        {{ t('أو') }}
        <svg class="auth-card__divider-caret" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <transition name="auth-reveal">
      <div v-show="showCredentials" id="auth-credentials" class="auth-card__credentials">
        <div v-if="apiError" class="auth-card__banner" role="alert">
          <span>{{ apiError }}</span>
        </div>

        <form @submit.prevent="loginUser" class="auth-card__form" novalidate>
          <ds-input
            v-model="email"
            type="email"
            :label="t('البريد الإلكتروني')"
            :error="fieldErrors.email"
            autocomplete="email"
            name="email"
          />

          <ds-input
            v-model="password"
            type="password"
            :label="t('كلمة المرور')"
            :error="fieldErrors.password"
            autocomplete="current-password"
            name="password"
          />

          <div class="auth-card__row">
            <label class="auth-card__remember">
              <input type="checkbox" v-model="remember" />
              <span>{{ t('تذكرني') }}</span>
            </label>
            <a class="auth-card__link" @click="goToPasswordResetPage">
              {{ t('نسيت كلمة المرور؟') }}
            </a>
          </div>

          <ds-button
            type="submit"
            native-type="submit"
            variant="accent"
            size="lg"
            full-width
            :loading="visible"
          >
            {{ t('تسجيل الدخول') }}
          </ds-button>
        </form>
      </div>
    </transition>

    <p class="auth-card__fineprint" @click="goToTermsPage">
      {{ $t('بمتابعتك فإنك توافق على شروط وأحكام المنصة.') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { usePyramidStore } from 'src/stores/pyramid'
import { LoginUserWithEmail } from 'src/graphql/account_management/mutation/LoginUserWithEmail'
import { CheckTheUserPermissionToUsePlatforme } from 'src/graphql/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { AllEnrollmentsForCurrentUser } from 'src/graphql/enrollment_management/query/AllEnrollmentsForCurrentUser'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication.vue'
import DsInput from 'src/design-system/components/DsInput.vue'
import { toast } from 'src/design-system/toast'
import type { LoginMutationResult, LoginVariables } from 'src/types/auth/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const pyramid = usePyramidStore()
const { isEnglish } = storeToRefs(settings)

const googleLabel = ref('تسجيل الدخول عن طريق Google')
const email = ref('')
const password = ref('')
const remember = ref(true)
const prevRoute = ref<string | null>(null)
const visible = ref(false)
const apiError = ref('')
const fieldErrors = ref({ email: '', password: '' })
// Credential (email/password) login is reserved for specific users and stays
// collapsed behind the "or" divider until the user opts in.
const showCredentials = ref(false)

onMounted(() => {
  if (isEnglish.value) {
    googleLabel.value = 'Login using Google'
  }
})

function goToTermsPage (): void {
  void router.push({ name: 'terms-and-conditions' })
}

function goToPasswordResetPage (): void {
  void router.push({ name: 'password-reset' })
}

function goToSignUpPage (): void {
  void router.push({ name: 'signUp' })
}

function resetErrors (): void {
  apiError.value = ''
  fieldErrors.value = { email: '', password: '' }
}

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  const generic: string[] = []
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      if (key === 'email' || key === 'password') {
        fieldErrors.value[key] = val.message
      } else {
        generic.push(val.message)
      }
    }
  }
  if (generic.length) apiError.value = generic.join(' — ')
}

function redirectAfterLogin (fallback?: string): boolean {
  const target = route.query?.redirect
  if (target) {
    void router.push(target as string).catch(() => {})
    return true
  }
  if (fallback) void router.push(fallback).catch(() => {})
  return false
}

async function isUserEnrolled (): Promise<boolean> {
  try {
    const res = await apolloClient.query({ query: AllEnrollmentsForCurrentUser })
    return (res.data?.allEnrollmentsForCurrentUser?.edges?.length ?? 0) > 0
  } catch {
    return false
  }
}

async function checkRegistrationCode (): Promise<void> {
  try {
    await apolloClient.query({ query: CheckTheUserPermissionToUsePlatforme })
    pyramid.fetchMyMarketingCode()
    const hasCourses = await isUserEnrolled()
    pyramid.setMyMarketingCode('')
    void router.push({ name: hasCourses ? 'my-courses' : 'Home' })
  } catch (e: unknown) {
    const err = e as { message?: string }
    if (err.message === 'GraphQL error: PyramidAffiliate matching query does not exist.') {
      void router.push({ name: 'registeration-code' })
    }
  }
}

async function loginUser (): Promise<void> {
  resetErrors()
  visible.value = true
  try {
    const result = await apolloClient.mutate<LoginMutationResult, LoginVariables>({
      mutation: LoginUserWithEmail,
      variables: { email: email.value, password: password.value }
    })
    const tokenAuth = result?.data?.tokenAuth
    if (tokenAuth?.success) {
      if (tokenAuth.user?.verified) {
        try {
          const userCur = tokenAuth.user.userCurrency
          if (userCur) settings.setCurrency(userCur === 'SDG' ? 'SDG' : 'USD')
          const userEmail = tokenAuth.user.email
          if (userEmail && typeof window !== 'undefined' && 'OneSignal' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any).OneSignal.push(function () {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(window as any).OneSignal.setExternalUserId(userEmail)
            })
          }
        } catch { /* OneSignal optional */ }

        await auth.login(tokenAuth)
        // Success toast (the notification persists across the redirect).
        toast.success(t('تم تسجيل الدخول بنجاح'))
        if (redirectAfterLogin()) return
        await checkRegistrationCode()
      } else {
        void router.push({ name: 'password-confirm' })
      }
    } else if (tokenAuth?.errors) {
      errorHandler(tokenAuth.errors as Record<string, Array<{ message: string }>>)
      // Surface the failure as a toast too, not only the inline field errors.
      toast.danger(apiError.value || t('تعذر تسجيل الدخول. تحقق من بياناتك وحاول مجدداً.'))
    }
  } catch {
    apiError.value = t('تعذر تسجيل الدخول. تحقق من بياناتك وحاول مجدداً.')
    toast.danger(apiError.value)
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
    line-height: var(--ds-leading-arabic);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: calc(-1 * var(--ds-space-2));
  }

  &__remember {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    cursor: pointer;

    input {
      accent-color: var(--ds-brand-600);
      inline-size: 16px;
      block-size: 16px;
      cursor: pointer;
    }
  }

  &__link {
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-600);
    cursor: pointer;
    text-decoration: none;
    font-weight: var(--ds-weight-medium);
    &:hover { text-decoration: underline; }
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

  &__divider--toggle {
    inline-size: 100%;
    padding: 0;
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    margin-block: var(--ds-space-1);
    transition: color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { color: var(--ds-brand-600); }
    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 4px;
      border-radius: var(--ds-radius-sm);
    }
  }

  &__divider-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
  }

  &__divider-caret {
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
  }

  &__divider--toggle.is-open &__divider-caret {
    transform: rotate(180deg);
  }

  &__credentials {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__fineprint {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    text-align: center;
    margin: 0;
    cursor: pointer;
    &:hover { color: var(--ds-brand-600); text-decoration: underline; }
  }
}

/* Reveal animation for the collapsible credential block */
.auth-reveal-enter-active,
.auth-reveal-leave-active {
  transition:
    opacity var(--ds-duration-fast) var(--ds-ease-out),
    transform var(--ds-duration-fast) var(--ds-ease-out);
}

.auth-reveal-enter-from,
.auth-reveal-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
