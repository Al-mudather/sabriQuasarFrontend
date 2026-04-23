// Repurposed during Track B: the original file was a dangling DOM listener
// that assumed elements existed at boot time. It now installs @unhead/vue
// (the vue-meta replacement) so <Head> blocks and title management keep
// working in the Options API.

import { boot } from 'quasar/wrappers'
import { createHead } from '@unhead/vue'

export default boot(({ app }) => {
  const head = createHead()
  app.use(head)
})
