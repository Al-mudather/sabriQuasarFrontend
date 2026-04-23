import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

// Pinia root. Auto-wired by Quasar (the CLI detects src/stores/index.js).
// Do NOT also register Pinia via a boot file — that creates a second instance
// and stores end up registered to the wrong root, breaking the whole app.

export default store(() => {
  const pinia = createPinia()
  pinia.use(piniaPersistedState)
  return pinia
})
