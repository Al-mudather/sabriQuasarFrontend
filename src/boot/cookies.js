// `vue-cookies` is Vue 2 only; replaced by `js-cookie`.
// The injected `$cookies` surface stays compatible at the call-site level
// (get/set/remove) so Options-API components don't need changes.

import { boot } from 'quasar/wrappers'
import Cookies from 'js-cookie'

export default boot(({ app }) => {
  app.config.globalProperties.$cookies = Cookies
})

export { Cookies }
