<template>
  <div class="social">
    <q-btn class="full-width" :label="label" icon="la la-facebook" @click="helloFacebookAuth" color="primary" />
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

async function navigateAfterLogin (): Promise<void> {
  // Send the user straight to their destination — NO blocking pre-queries. The
  // global router guard owns registration-code gating (it diverts a no-code user
  // to `registeration-code`), and any "enrolled → my-courses" routing belongs to
  // that destination, not here. Blocking navigation on an enrollment lookup +
  // the guard's access check used to stack ~8s of sequential network round-trips
  // on a cold first attempt, which read as a "stuck" login that only worked on a
  // second click (warm cache). `replace` keeps the login page out of history; a
  // NavigationFailure from the guard redirecting is expected, so swallow it.
  const redirectTarget = route.query?.redirect
  const target = (typeof redirectTarget === 'string' && redirectTarget)
    ? redirectTarget
    : { name: 'Home' }
  await router.replace(target).catch(() => {})
}

async function loginAuthMutation (accessToken: string, provider: string, email = ''): Promise<void> {
  visible.value = true
  try {
    const result = await apolloClient.mutate<SocialAuthMutationResult, SocialAuthVariables>({
      mutation: SocialAuth,
      variables: { provider, accessToken, email }
    })
    const userData = result?.data?.socialAuth
    if (userData) {
      await auth.login({ ...userData, token: userData.token ?? '' })
      // New session → re-verify the registration-code gate (the router guard).
      pyramid.resetPlatformAccess()
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
        await navigateAfterLogin()
      }
    }
  } catch {
    /* silent — FB errors handled by SDK overlay */
  } finally {
    visible.value = false
  }
}

function helloFacebookAuth (): void {
  // Runtime guard: FB SDK is loaded dynamically below via a script injection.
  // We do not call window.FB directly — instead we inject the SDK and call FB
  // only once it confirms it is available (FB.init callback). The `FB` global
  // is declared below using a loose window cast to avoid @ts-expect-error.
  if (typeof window === 'undefined') return

  const win = window as Window & {
    FB?: {
      init: (opts: Record<string, unknown>) => void
      logout: (cb: () => void) => void
      login: (cb: (res: { status: string }) => void, opts: { scope: string }) => void
      getLoginStatus: (cb: (res: { authResponse: { accessToken: string } }) => void) => void
    }
    hello?: (network: string) => {
      api: (path: string) => Promise<{ email?: string }>
    }
  }

  const jq = (win as unknown as { jQuery?: ((sel: unknown) => { ready: (fn: () => void) => void }) & { ajaxSetup: (opts: Record<string, unknown>) => void; getScript: (url: string, cb: () => void) => void } }).jQuery

  if (!jq) {
    // jQuery not available — skip Facebook auth
    return
  }

  jq(document).ready(() => {
    jq.ajaxSetup({ cache: true })
    jq.getScript('https://connect.facebook.net/en_US/sdk.js', () => {
      if (!win.FB) return
      win.FB.init({
        appId: '757236575189030',
        version: 'v2.7',
        cookie: true,
        xfbml: true,
      })

      win.FB.logout(() => { /* clear any stale session */ })

      win.FB.login((logRes) => {
        const lr = logRes as { status?: string }
        if (lr.status === 'connected') {
          win.FB!.getLoginStatus((res) => {
            const r = res as { authResponse?: { accessToken?: string } }
            const accessToken = r.authResponse?.accessToken ?? ''
            if (!win.hello) return
            void (win.hello as (n: string) => { api: (p: string) => Promise<{ email?: string }> })('facebook')
              .api(`/me?access_token=${accessToken}`)
              .then((resData: { email?: string }) => {
                void loginAuthMutation(accessToken, 'facebook', resData.email ?? '')
              })
          })
        }
      }, { scope: 'email' })
    })
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
