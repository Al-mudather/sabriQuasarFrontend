// Install the Pinia root alongside the Vuex 4 root. Quasar's default "store"
// slot picks up src/store/index.js (Vuex) so Options-API components keep
// working; this boot file installs Pinia so new stores can coexist during
// the Track B -> C migration window.

import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

export default boot(({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPersistedState)
  app.use(pinia)
})
