// Boot tasks that run BEFORE i18n / Pinia are registered:
//   1. install @unhead/vue (vue-meta replacement) so <Head> blocks and
//      programmatic title management keep working in the Options API.
//   2. pre-paint the document's lang/dir attributes and the Quasar lang
//      pack from the persisted `isEnglish` flag, so first paint renders
//      in the user's last-used language (no FOUC, no jarring RTL flip).
//
// Runtime locale switching happens via `src/composables/useAppLocale.ts`,
// which is the single canonical entry point for all later toggles.

import { boot } from 'quasar/wrappers'
// unhead v3 moved the client factory to the '/client' entry (useHead stays
// on the root entry, see CourseDetails.vue).
import { createHead } from '@unhead/vue/client'
import { Quasar, LocalStorage } from 'quasar'
import qLangAr from 'quasar/lang/ar'

export default boot(({ app }) => {
  const head = createHead()
  app.use(head)

  // Read the persisted preference directly — at this boot stage Pinia is
  // not yet registered (i18n boot runs after this one). The settings
  // store uses the same LocalStorage key, so the two stay aligned.
  const isEnglish = LocalStorage.getItem('isEnglish') === true
  const locale = isEnglish ? 'en' : 'ar'

  if (typeof document !== 'undefined') {
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl'
    document.documentElement.lang = locale
  }

  if (isEnglish) {
    // English pack is async-imported so Arabic stays the synchronous default.
    // The composable will re-apply the pack on user toggle either way.
    void import('quasar/lang/en-US')
      .then((pack) => { Quasar.lang.set({ ...pack.default, rtl: false }) })
      .catch(() => { /* lang pack missing — leave default */ })
  } else {
    Quasar.lang.set({ ...qLangAr, rtl: true })
  }
})
