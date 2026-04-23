// Repurposed during Track B: the original file was a dangling DOM listener
// that assumed elements existed at boot time. It now installs @unhead/vue
// (the vue-meta replacement) so <Head> blocks and title management keep
// working in the Options API, and locks Arabic RTL at runtime.

import { boot } from 'quasar/wrappers'
import { createHead } from '@unhead/vue'
import { Quasar } from 'quasar'
import qLangAr from 'quasar/lang/ar'

export default boot(({ app }) => {
  const head = createHead()
  app.use(head)

  // index.html ships with dir="rtl" lang="ar", but Quasar's framework.lang
  // init can overwrite document.documentElement.dir based on the lang pack's
  // rtl flag. Setting the Arabic pack explicitly + re-pinning the attrs keeps
  // html.dir locked so Arabic glyph shaping doesn't break on pages that
  // don't sit under an explicit dir="rtl" container.
  Quasar.lang.set(qLangAr)
  if (typeof document !== 'undefined') {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  }
})
