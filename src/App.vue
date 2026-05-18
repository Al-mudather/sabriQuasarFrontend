<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import LogRocket from 'logrocket'
import { LocalStorage } from 'quasar'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'

defineOptions({ name: 'App' })

const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const { token, user } = storeToRefs(auth)

// ---------------------------------------------------------------------------
// OneSignal DOMContentLoaded handler (registered once on mount)
// ---------------------------------------------------------------------------
function onDOMContentLoaded (): void {
  if (!window.OneSignal) return
  window.OneSignal.push(() => {
    if (!window.OneSignal) return
    // Show prompt again if push not yet enabled
    void window.OneSignal.isPushNotificationsEnabled?.()?.then((isEnabled) => {
      if (!isEnabled) {
        const os = window.OneSignal
        if (os && typeof (os as Record<string, unknown>)['showSlidedownPrompt'] === 'function') {
          ;(os as Record<string, (arg: Record<string, unknown>) => void>)['showSlidedownPrompt']({ force: true })
        }
      }
    })

    window.OneSignal.on?.('popoverAllowClick', () => {
      // Null-safe: only set external user id when authenticated and email exists
      if (auth.isAuthenticated && user.value?.email) {
        const externalUserId = user.value.email
        window.OneSignal?.push(function () {
          window.OneSignal?.setExternalUserId?.(externalUserId)
        })
      }
    })

    window.OneSignal.on?.('notificationPermissionChange', ((...args: unknown[]) => {
      const permissionChange = args[0] as { to: string }
      const currentPermission = permissionChange.to
      if (currentPermission === 'granted') {
        $q.notify({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'center',
          message: t('تهانينا, الان يمكنك ان تكون مطلعا على كل ماهو جديد في المنصه التعليميه'),
        })

        // Null-safe: only set external user id when authenticated and email exists
        if (auth.isAuthenticated && user.value?.email) {
          const externalUserId = user.value.email
          window.OneSignal?.push(function () {
            window.OneSignal?.setExternalUserId?.(externalUserId)
          })
        }
      } else if (currentPermission === 'denied' || currentPermission === 'default') {
        $q.notify({
          type: 'negative',
          progress: true,
          multiLine: true,
          position: 'center',
          message: t('بعدم قبولك للإشعارات, لايمكننا ان نخبرك بمراحل امتلاكك للدوره التدريبيه اللتي تريدها, من فضلك اقبل الإشعارات'),
        })
      }
    }) as (...args: unknown[]) => void)
  })
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  // LogRocket init
  LogRocket.init('3bybms/stc')
  LogRocket.identify('THE_USER_ID_IN_YOUR_APP', {
    name: 'STC User',
    email: '1@stc.com',
    subscriptionType: 'customer',
  })

  // Blocked notifications warning
  if (Notification.permission === 'denied') {
    $q.notify({
      type: 'negative',
      progress: true,
      multiLine: true,
      position: 'top',
      message: t('لقد قمت بحجب اللإشعارات , الرجاء السماح لها بالظهور لتتمتع باخر التحديثات على المنصه'),
    })
  }

  window.addEventListener('DOMContentLoaded', onDOMContentLoaded)

  // Empty the nav bar
  LocalStorage.set('activeNav', '')

  // If there is a token, re-login the user
  if (token.value) {
    auth.RE_LOGIN_USER()
      .then((re: boolean) => {
        if (re === false) {
          $q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'لقد انتهت صلاحية دخولك للموقع... الرجاء الدخول مره اخرى لتتمكن من تطوير مهاراتك',
          })
          auth.logOutAction()
          void router.push({ name: 'login' })
          return
        }
        // No success toast — this is a silent session restore, not a fresh
        // login. The four real login entry points (Login, SignUp, Google,
        // Facebook auth) each emit their own "تم تسجيل الدخول بنجاح"
        // notification, so toasting here on every page-load would be noise.
      })
      .catch(() => {
        void router.push({ name: 'login' })
      })
  }
})

onUnmounted(() => {
  window.removeEventListener('DOMContentLoaded', onDOMContentLoaded)
  auth.logOutAction()
  localStorage.clear()
})
</script>
