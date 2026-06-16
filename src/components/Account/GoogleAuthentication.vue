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
import { useQuasar } from 'quasar'
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
const $q = useQuasar()
const auth = useAuthStore()
const settings = useSettingsStore()
const pyramid = usePyramidStore()

const visible = ref(false)

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
  visible.value = true
  try {
    const authRes = await apolloClient.mutate<SocialAuthMutationResult, SocialAuthVariables>({
      mutation: SocialAuth,
      variables: { provider, accessToken, email }
    })
    const userData = authRes?.data?.socialAuth
    if (userData) {
      await auth.login({ ...userData, token: userData.token ?? '' })
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

      if (userData.token) {
        $q.notify({ type: 'positive', progress: true, multiLine: true, position: 'bottom', message: t('تم تسجيل الدخول بنجاح') })
        await checkRegistrationCode()
      }
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    if (err.message === 'GraphQL error: UNIQUE constraint failed: account_manager_user.email') {
      $q.notify({ type: 'warning', progress: true, multiLine: true, position: 'bottom', message: t('هذا الحساب مسجل مسبقا') })
    }
  } finally {
    visible.value = false
  }
}

function helloGoogleAuth (): void {
  if (typeof window === 'undefined') return

  // hello.js is loaded globally (via index.html or a plugin).
  // Guard its presence at runtime before calling.
  const helloFn = (window as unknown as { hello?: (network: string) => {
    login: (opts: { scope: string; force: boolean }) => Promise<unknown>
    getAuthResponse: () => { access_token: string }
  } }).hello

  if (!helloFn) return

  helloFn('google')
    .login({ scope: 'email', force: true })
    .then(() => {
      try {
        const googleAuth = helloFn('google').getAuthResponse()
        void loginAuthMutation(googleAuth.access_token, 'google-oauth2')
      } catch { /* ignore */ }
    })
    .catch(() => { /* user cancelled or SDK error */ })
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
