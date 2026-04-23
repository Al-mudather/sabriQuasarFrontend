import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

// legacy: true + allowCompositionAPI: true preserves `this.$t('...')` across
// the ~hundreds of Options-API components that still call it, while still
// letting setup() use `useI18n()` in migrated components.
const i18n = createI18n({
  legacy: true,
  allowComposition: true,
  globalInjection: true,
  locale: 'ar',
  fallbackLocale: 'en',
  messages
})

export default boot(({ app }) => {
  app.use(i18n)
})

export { i18n }
