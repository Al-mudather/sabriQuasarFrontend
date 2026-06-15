import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import { loadLocaleMessages } from 'src/i18n'

// legacy: true + allowCompositionAPI: true preserves `this.$t('...')` across
// the ~hundreds of Options-API components that still call it, while still
// letting setup() use `useI18n()` in migrated components.
//
// Initial locale comes from the persisted `isEnglish` flag (same key used by
// the settings store) so first-paint is correct in either language. Runtime
// toggles funnel through `src/composables/useAppLocale.ts` and update both
// vue-i18n and Quasar lang together.
const storedIsEnglish = LocalStorage.getItem('isEnglish') === true
const initialLocale = storedIsEnglish ? 'en' : 'ar'

// Created with NO messages — the active locale is loaded async below, before
// first render; the inactive locale is fetched on demand at switch time. This
// keeps ~100 KB of the unused locale off the first-load critical path.
const i18n = createI18n({
  legacy: true,
  allowComposition: true,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {}
})

// Async boot: Quasar awaits this before mounting the app, so the active
// locale's messages are guaranteed present by the time anything renders.
export default boot(async ({ app }) => {
  const msgs = await loadLocaleMessages(initialLocale)
  i18n.global.setLocaleMessage(initialLocale, msgs)
  app.use(i18n)
})

export { i18n }
