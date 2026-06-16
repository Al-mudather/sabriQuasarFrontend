// Vue 3 + @vue/apollo-composable wiring.
//
// - Provides the ApolloClient instance on the app so both `useQuery` (setup)
//   and the legacy imperative `apolloClient.mutate(...)` pattern keep working.
// - Error notifications are de-duplicated so a network outage doesn't flood
//   the UI with identical toasts.

import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '../apollo/client'

const recentlyShown = new Map()
const NOTIFY_COOLDOWN_MS = 3000

function notifyOnce (message) {
  const now = Date.now()
  const last = recentlyShown.get(message) || 0
  if (now - last < NOTIFY_COOLDOWN_MS) return
  recentlyShown.set(message, now)
  Notify.create({
    type: 'negative',
    message,
    position: 'bottom',
    timeout: 4000,
    progress: true,
    actions: [{ icon: 'close', color: 'white', round: true }]
  })
}

// Apollo 3 no longer takes an `errorHandler` option on the client itself;
// hook into unhandled promise rejections so a thrown GraphQL error still
// surfaces a toast exactly like the old Vue-Apollo errorHandler did.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event && event.reason
    if (reason && reason.graphQLErrors && reason.graphQLErrors.length) {
      notifyOnce(reason.graphQLErrors[0].message || 'حدث خطأ أثناء تحميل البيانات.')
    } else if (reason && reason.networkError) {
      notifyOnce('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.')
    }
  })
}

export default boot(({ app }) => {
  app.provide(DefaultApolloClient, apolloClient)
  // Keep a runtime handle for components that imperatively use the client.
  app.config.globalProperties.$apolloClient = apolloClient
})

export { apolloClient }
