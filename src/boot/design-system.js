import { boot } from 'quasar/wrappers'
import DesignSystem from 'src/design-system'

// The DS barrel exports a Vue plugin whose install(Vue) is API-compatible
// with Vue 3: install(app) registers each component via app.component().
// src/design-system/index.js calls `Vue.component(name, component)` — the
// `Vue` parameter name is just a local variable; Vue 3 passes the app
// instance so the call resolves to `app.component(...)` as expected.
export default boot(({ app }) => {
  app.use(DesignSystem)
})
