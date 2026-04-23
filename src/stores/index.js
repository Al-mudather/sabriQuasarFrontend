import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

/*
 * Pinia root. Runs in parallel with the Vuex 4 root during the Track B -> C
 * migration window. Components migrate to Pinia per-module; once all Vuex
 * mapper sites are gone, src/store/** and the vuex dep are removed.
 */

export default store(() => {
  const pinia = createPinia()
  pinia.use(piniaPersistedState)
  return pinia
})
