import VueApollo from 'vue-apollo'
import { Notify } from 'quasar'
import { apolloClient } from '../apollo/client'

// Dedupe noisy error toasts — show at most one user-facing notice per
// 3 seconds per message, so a burst of failed queries during a network
// outage doesn't flood the screen.
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
    position: 'top',
    timeout: 4000,
    progress: true,
    actions: [{ icon: 'close', color: 'white', round: true }]
  })
}

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      fetchPolicy: 'cache-and-network'
    }
  },
  errorHandler ({ graphQLErrors, networkError }) {
    if (graphQLErrors && graphQLErrors.length) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(`[GraphQL error]: ${message}`, { locations, path })
      })
      notifyOnce(graphQLErrors[0].message || 'حدث خطأ أثناء تحميل البيانات.')
    }
    if (networkError) {
      console.error('[Network error]:', networkError)
      notifyOnce('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.')
    }
  }
})

export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
