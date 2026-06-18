// OAuth helper for social login.
//
// Google uses Google Identity Services (GIS) — the current, supported library.
// `initTokenClient` opens a popup and returns an OAuth 2.0 access token without
// a full-page redirect (so no callback route / sessionStorage round-trip is
// needed). That access token is handed to the `SocialAuth` GraphQL mutation
// (provider "google-oauth2"); the backend validates it server-side.
//
// Facebook keeps the legacy authorization redirect (unchanged).
//
// Exposed as `$socialAuth` / `$auth` on globalProperties and on
// `window.__appGlobals.$socialAuth`, so the `window.hello` shim
// (boot/hello.js) can reach it without a circular import between boot files.
//
// Client ids come from build-time env so deployments can swap credentials
// without a code change:
//   process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID
//   process.env.SOCIAL_AUTH_FACEBOOK_CLIENT_ID

import { boot } from 'quasar/wrappers'
import { SOCIAL_AUTH_KEY } from 'src/localStorageService'

const GIS_SRC = 'https://accounts.google.com/gsi/client'
const GOOGLE_SCOPE = 'openid email profile'

// Lazily inject the GIS script on first use (avoids loading Google's SDK on
// every page for users who never click "Sign in with Google").
let gisLoader = null
function loadGis () {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.google && window.google.accounts && window.google.accounts.oauth2) {
    return Promise.resolve()
  }
  if (gisLoader) return gisLoader
  gisLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')))
      return
    }
    const s = document.createElement('script')
    s.src = GIS_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(s)
  })
  return gisLoader
}

// The token client is created ONCE and reused. The per-request callbacks are
// swapped via module-level handlers just before each requestAccessToken() call,
// so the click handler can fire the popup synchronously (in-gesture) instead of
// constructing a fresh client inside an async chain.
let tokenClient = null
let pendingResolve = null
let pendingReject = null
// True once GIS is loaded AND the token client is built — i.e. a click can open
// the popup synchronously, in-gesture. While false, the first click would have
// to await the GIS network load (a macrotask), which loses the user gesture and
// makes the popup silently fail ("nothing happens; works on the 2nd click").
let googleReady = false

// Distinguishes a user cancel/close from a real error, so the UI can stay quiet
// on cancel but surface genuine failures.
function makeAuthError (message, cancelled) {
  const e = new Error(message)
  e.cancelled = !!cancelled
  return e
}

function buildTokenClient (clientId) {
  return window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GOOGLE_SCOPE,
    // Force the account chooser every time so Google can NEVER silently
    // reuse the previously signed-in account / a cached token (which made
    // logout-then-login come back as the old user).
    prompt: 'select_account',
    callback: (resp) => {
      const resolve = pendingResolve
      pendingResolve = pendingReject = null
      if (!resolve) return
      if (resp && resp.access_token) resolve({ accessToken: resp.access_token })
      else if (pendingReject) pendingReject(makeAuthError((resp && (resp.error_description || resp.error)) || 'Google authentication failed', false))
    },
    // Fired when the user closes the popup, dismisses it, or it can't be shown.
    error_callback: (err) => {
      const reject = pendingReject
      pendingResolve = pendingReject = null
      if (!reject) return
      const type = (err && err.type) || ''
      // 'popup_closed' / 'popup_failed_to_open' / user dismissal → treat as cancel.
      const cancelled = type === 'popup_closed' || type === 'popup_failed_to_open' || type === 'user_cancel'
      reject(makeAuthError((err && (err.message || err.type)) || 'Google authentication cancelled', cancelled))
    }
  })
}

// Eagerly load GIS and build the token client so the FIRST real click can open
// the popup synchronously (in-gesture). Called at boot and on the login page's
// mount. Idempotent and best-effort: resolves once ready, never throws on the
// happy path. Returns a promise so a caller (the button) can reflect readiness.
function warmGoogle () {
  const clientId = process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID || ''
  if (!clientId) return Promise.reject(makeAuthError('Missing client id for google (SOCIAL_AUTH_GOOGLE_CLIENT_ID)', false))
  if (googleReady && tokenClient) return Promise.resolve()
  return loadGis().then(() => {
    if (!tokenClient) tokenClient = buildTokenClient(clientId)
    googleReady = true
  })
}

function isGoogleReady () {
  return googleReady && !!tokenClient
}

function authenticateGoogle () {
  const clientId = process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID || ''
  if (!clientId) {
    return Promise.reject(makeAuthError('Missing client id for google (SOCIAL_AUTH_GOOGLE_CLIENT_ID)', false))
  }
  return new Promise((resolve, reject) => {
    pendingResolve = resolve
    pendingReject = reject
    if (googleReady && tokenClient) {
      // WARM PATH — GIS is already loaded and the client built, so this call is
      // a microtask off the click: the user gesture is preserved and the popup
      // opens immediately. This is the path that makes Google a single click.
      tokenClient.requestAccessToken()
    } else {
      // COLD PATH — GIS is still loading (user clicked very early). Awaiting the
      // network load loses the gesture, so the popup may not open until a second
      // click. We still warm + try; the boot/mount warm-up makes this rare.
      warmGoogle()
        .then(() => { tokenClient.requestAccessToken() })
        .catch((e) => { pendingResolve = pendingReject = null; reject(e) })
    }
  })
}

// Legacy Facebook authorization redirect — behaviour unchanged.
const FACEBOOK = {
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  clientId: process.env.SOCIAL_AUTH_FACEBOOK_CLIENT_ID || '',
  scope: 'email',
  responseType: 'token'
}
function authenticateFacebook () {
  if (!FACEBOOK.clientId) {
    return Promise.reject(new Error('Missing client id for facebook (SOCIAL_AUTH_FACEBOOK_CLIENT_ID)'))
  }
  const params = new URLSearchParams({
    client_id: FACEBOOK.clientId,
    redirect_uri: window.location.origin + '/#/auth/callback',
    response_type: FACEBOOK.responseType,
    scope: FACEBOOK.scope,
    state: 'facebook'
  })
  window.location.href = `${FACEBOOK.authUrl}?${params.toString()}`
  // Never resolves in the redirecting tab.
  return new Promise(() => {})
}

// Revoke the stored Google access token (if any) so Google drops the grant on
// its side. Combined with `prompt: 'select_account'`, this guarantees the next
// sign-in starts fresh and can't re-log the previous user from a cached token.
// Best-effort: never throws, no-op if GIS isn't loaded or no token is stored.
function revokeGoogle () {
  try {
    if (typeof window === 'undefined') return
    const raw = window.sessionStorage.getItem(SOCIAL_AUTH_KEY)
    if (!raw) return
    const stored = JSON.parse(raw)
    const token = stored && stored.provider === 'google' && stored.accessToken
    const oauth2 = window.google && window.google.accounts && window.google.accounts.oauth2
    if (token && oauth2 && typeof oauth2.revoke === 'function') {
      oauth2.revoke(token, () => { /* revoked */ })
    }
  } catch { /* best-effort — logout proceeds regardless */ }
}

// `authenticate(provider)` keeps the vue-authenticate signature so legacy call
// sites (and the `window.hello` shim) continue to work. Google resolves with
// `{ accessToken }`; Facebook redirects.
function authenticate (provider) {
  if (provider === 'google') return authenticateGoogle()
  if (provider === 'facebook') return authenticateFacebook()
  return Promise.reject(new Error(`Unknown social provider: ${provider}`))
}

export default boot(({ app }) => {
  const api = { authenticate, revokeGoogle, warmGoogle, isGoogleReady }
  app.config.globalProperties.$socialAuth = api
  app.config.globalProperties.$auth = api
  if (typeof window !== 'undefined') {
    window.__appGlobals = window.__appGlobals || {}
    window.__appGlobals.$socialAuth = api
    // Warm Google sign-in as soon as the app boots so the first click on the
    // login page can open the popup in-gesture (single click). Best-effort.
    warmGoogle().catch(() => { /* GIS may still load lazily on click */ })
  }
})
