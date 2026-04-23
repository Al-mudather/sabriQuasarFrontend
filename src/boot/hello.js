// HelloJS + vue-hellojs have been removed (unmaintained, ES5 globals).
//
// This file is now a stub. Track C will replace the OAuth popup UX with a
// direct Google Identity Services + Facebook Login SDK wiring in the login
// page component, keeping the existing backend callback contracts.
//
// We intentionally keep the boot entry so quasar.config.js boot[] order and
// any downstream references don't break mid-migration.

import { boot } from 'quasar/wrappers'

export default boot(() => {
  // noop — see note above
})
