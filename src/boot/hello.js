// Minimal `hello()` shim replacing `vue-hellojs`.
//
// Legacy call sites (components/Account/GoogleAuthentication.vue, etc.) do:
//   this.hello("google").login({ scope: "email", force: true }).then(...)
//   this.hello("google").getAuthResponse()
//
// Until C2 rewrites those call sites onto the new `$socialAuth` API, this
// shim preserves the shape by delegating `.login()` to the authorization-code
// redirect and reading the returned `access_token` out of the URL hash on
// the callback route. `getAuthResponse()` returns whatever the last callback
// parsed (scoped to this session in sessionStorage).
//
// This is intentionally tiny — ~40 LOC. The real OAuth surface lives in
// boot/socail_auth.js; this file only exists to avoid ripping up the two
// social auth components during Track C.

import { boot } from 'quasar/wrappers'

const SESSION_KEY = 'helloShim.lastAuthResponse'

function readStoredResponse (provider) {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.provider === provider ? parsed : null
  } catch {
    return null
  }
}

function hello (provider) {
  return {
    login (/* opts */) {
      // Deferred import: boot files run in a fixed order and this function
      // is only called after user interaction, so the globalProperties are
      // populated by then.
      const api = (typeof window !== 'undefined' && window.__appGlobals && window.__appGlobals.$socialAuth) || null
      if (!api) return Promise.reject(new Error('$socialAuth not installed'))
      return api.authenticate(provider)
    },
    getAuthResponse () {
      if (typeof window === 'undefined') return {}
      const stored = readStoredResponse(provider)
      return stored ? { access_token: stored.accessToken } : {}
    }
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$hello = hello
  // Expose globalProperties reference so the shim can reach the socialAuth
  // API without circular imports between boot files.
  if (typeof window !== 'undefined') {
    window.__appGlobals = window.__appGlobals || {}
    window.__appGlobals.$socialAuth = app.config.globalProperties.$socialAuth
  }
})

export { hello }
