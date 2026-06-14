// `window.hello` shim used by the social-auth components.
//
// Call sites (components/Account/GoogleAuthentication.vue, FacebookAuthentication.vue) do:
//   window.hello('google').login({ scope: 'email', force: true })
//     .then(() => window.hello('google').getAuthResponse())   // { access_token }
//
// `.login()` triggers the provider flow (Google => GIS popup) via
// `$socialAuth.authenticate`, stashes the returned access token in
// sessionStorage, and resolves. `.getAuthResponse()` reads it back.
//
// The real OAuth surface lives in boot/socail_auth.js; this file only adapts
// it to the `window.hello(...)` shape the components were written against.

import { boot } from 'quasar/wrappers'
import { SOCIAL_AUTH_KEY } from 'src/localStorageService'

// Single source of truth for the social-token key — the logout purge clears
// this exact key (see src/localStorageService/index.js).
const SESSION_KEY = SOCIAL_AUTH_KEY

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

function socialApi () {
  return (typeof window !== 'undefined' && window.__appGlobals && window.__appGlobals.$socialAuth) || null
}

function hello (provider) {
  return {
    login (/* opts */) {
      const api = socialApi()
      if (!api) return Promise.reject(new Error('$socialAuth not installed'))
      return api.authenticate(provider).then((res) => {
        const accessToken = res && res.accessToken
        if (!accessToken) throw new Error('No access token returned')
        try {
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ provider, accessToken }))
        } catch { /* sessionStorage unavailable */ }
        return { access_token: accessToken }
      })
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
  // The components read the SDK off `window.hello` (the original vue-hellojs
  // global). Without this assignment the Google/Facebook buttons are silent
  // no-ops: `const helloFn = window.hello` is undefined and the handler returns
  // early.
  if (typeof window !== 'undefined') {
    window.hello = hello
  }
})

export { hello }
