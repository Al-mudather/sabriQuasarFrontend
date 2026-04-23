// Track B stub: `vue-authenticate` is removed (unmaintained, Vue 2 only).
//
// The legacy wiring only registered a single Google provider pointing at
// localhost — it was dev-only config that wasn't useful in production.
//
// Track C will replace this with a ~50 LOC OAuth authorization-code flow
// helper inside the login page, preserving the backend callback contract
// at `/rest-auth/google/`.

import { boot } from 'quasar/wrappers'

export default boot(() => {
  // noop — see note above
})
