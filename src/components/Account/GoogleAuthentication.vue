<template>
  <div class="social">
    <q-btn class="full-width" :label="label" icon="la la-google" @click="helloGoogleAuth" color="deep-orange" />
    <q-inner-loading :showing="visible">
      <q-spinner-hourglass color="primary" size="70px" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toast } from 'src/design-system/toast'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { usePyramidStore } from 'src/stores/pyramid'
import { SocialAuth } from 'src/graphql/account_management/mutation/CreateSocailAuth'
import { AllEnrollmentsForCurrentUser } from 'src/graphql/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { CheckTheUserPermissionToUsePlatforme } from 'src/graphql/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import type { SocialAuthMutationResult, SocialAuthVariables } from 'src/types/auth/types'

interface Props {
  prevRoute?: string | null
  label?: string
}

defineProps<Props>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const pyramid = usePyramidStore()

const visible = ref(false)

// Backstop timer: clears the spinner if the whole flow ever hangs (e.g. the GIS
// popup never returns a callback). Normal cancel/error already resolve fast via
// GIS error_callback, so this only fires in a genuinely stuck state.
let timeoutId: ReturnType<typeof setTimeout> | null = null
function clearTimer (): void {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
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
  // If the user arrived at login via a redirect (e.g. unauthenticated enrol),
  // honor that redirect first — mirrors Login.vue's redirectAfterLogin().
  const redirectTarget = route.query?.redirect
  if (redirectTarget) {
    void router.push(redirectTarget as string).catch(() => {})
    return
  }

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

async function loginAuthMutation (accessToken: string, provider: string, email = ''): Promise<void> {
  // `visible` is already true (set the instant the button was clicked) so the
  // spinner spans the whole flow, not just this mutation.
  try {
    const authRes = await apolloClient.mutate<SocialAuthMutationResult, SocialAuthVariables>({
      mutation: SocialAuth,
      variables: { provider, accessToken, email }
    })
    const userData = authRes?.data?.socialAuth
    if (!userData || !userData.token) {
      // Backend accepted the call but returned no session — never silent.
      toast.danger(t('تعذر تسجيل الدخول عبر Google. حاول مجدداً.'))
      return
    }

    await auth.login({ ...userData, token: userData.token })
    try {
      const userCur = userData.social?.user?.userCurrency
      if (userCur) settings.setCurrency(userCur === 'SDG' ? 'SDG' : 'USD')

      const userEmail = userData.social?.user?.email
      if (userEmail && typeof window !== 'undefined' && 'OneSignal' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).OneSignal.push(function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).OneSignal.setExternalUserId(userEmail)
        })
      }
    } catch { /* OneSignal optional */ }

    toast.success(t('تم تسجيل الدخول بنجاح'))
    await checkRegistrationCode()
  } catch (error: unknown) {
    const err = error as { message?: string }
    if (err.message === 'GraphQL error: UNIQUE constraint failed: account_manager_user.email') {
      toast.warning(t('هذا الحساب مسجل مسبقا'))
    } else {
      toast.danger(t('تعذر تسجيل الدخول عبر Google. حاول مجدداً.'))
    }
  } finally {
    visible.value = false
  }
}

function helloGoogleAuth (): void {
  if (typeof window === 'undefined') return

  // The `window.hello` shim (boot/hello.js) bridges to Google Identity Services
  // (boot/socail_auth.js). Guard its presence before calling.
  const helloFn = (window as unknown as { hello?: (network: string) => {
    login: (opts: { scope: string; force: boolean }) => Promise<{ access_token?: string }>
    getAuthResponse: () => { access_token?: string }
  } }).hello

  if (!helloFn) {
    toast.danger(t('تعذّر الاتصال بـ Google. حاول مجدداً.'))
    return
  }

  // Immediate feedback: the spinner shows the instant the button is clicked,
  // covering the entire popup + token + mutation span (was the "did I click?
  // where's the progress?" gap).
  visible.value = true

  // `finished` guards against the backstop timer and the real callback both
  // acting on the same attempt.
  let finished = false
  clearTimer()
  timeoutId = setTimeout(() => {
    if (finished) return
    finished = true
    timeoutId = null
    visible.value = false
    toast.danger(t('تعذّر الاتصال بـ Google. حاول مجدداً.'))
  }, 45000)

  helloFn('google')
    .login({ scope: 'email', force: true })
    .then((res) => {
      if (finished) return
      finished = true
      clearTimer()
      const token = res?.access_token || helloFn('google').getAuthResponse().access_token
      if (!token) {
        visible.value = false
        toast.danger(t('تعذر تسجيل الدخول عبر Google. حاول مجدداً.'))
        return
      }
      void loginAuthMutation(token, 'google-oauth2')
    })
    .catch((e: unknown) => {
      if (finished) return
      finished = true
      clearTimer()
      visible.value = false
      const err = e as { cancelled?: boolean }
      if (err?.cancelled) {
        // User closed/dismissed the Google popup — gentle, non-alarming.
        toast.info(t('تم إلغاء تسجيل الدخول.'))
      } else {
        toast.danger(t('تعذّر الاتصال بـ Google. حاول مجدداً.'))
      }
    })
}
</script>

<style lang="scss" scoped>
.social :deep(.q-btn) {
  border-radius: var(--ds-radius-pill);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  text-transform: none;
}
</style>
