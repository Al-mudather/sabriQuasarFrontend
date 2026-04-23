import { boot } from 'quasar/wrappers'
import axios from 'axios'

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  if (typeof window !== 'undefined') {
    app.config.globalProperties.$Stripe = window.Stripe
  }
})

export { axios }
