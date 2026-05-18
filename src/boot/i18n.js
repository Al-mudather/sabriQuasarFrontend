import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import messages from 'src/i18n'

// legacy: true + allowCompositionAPI: true preserves `this.$t('...')` across
// the ~hundreds of Options-API components that still call it, while still
// letting setup() use `useI18n()` in migrated components.
//
// Initial locale comes from the persisted `isEnglish` flag (same key used by
// the settings store) so first-paint is correct in either language. Runtime
// toggles funnel through `src/composables/useAppLocale.ts` and update both
// vue-i18n and Quasar lang together.
const storedIsEnglish = LocalStorage.getItem('isEnglish') === true

const i18n = createI18n({
  legacy: true,
  allowComposition: true,
  globalInjection: true,
  locale: storedIsEnglish ? 'en' : 'ar',
  fallbackLocale: 'en',
  messages
})

export default boot(({ app }) => {
  app.use(i18n)
})

export { i18n }
