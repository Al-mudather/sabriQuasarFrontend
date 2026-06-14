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

function authenticateGoogle () {
  const clientId = process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID || ''
  if (!clientId) {
    return Promise.reject(new Error('Missing client id for google (SOCIAL_AUTH_GOOGLE_CLIENT_ID)'))
  }
  return loadGis().then(() => new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPE,
      callback: (resp) => {
        if (resp && resp.access_token) resolve({ accessToken: resp.access_token })
        else reject(new Error((resp && (resp.error_description || resp.error)) || 'Google authentication failed'))
      },
      // Fired when the user closes the popup or the request can't be displayed.
      error_callback: (err) => reject(new Error((err && (err.message || err.type)) || 'Google authentication cancelled'))
    })
    client.requestAccessToken()
  }))
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

// `authenticate(provider)` keeps the vue-authenticate signature so legacy call
// sites (and the `window.hello` shim) continue to work. Google resolves with
// `{ accessToken }`; Facebook redirects.
function authenticate (provider) {
  if (provider === 'google') return authenticateGoogle()
  if (provider === 'facebook') return authenticateFacebook()
  return Promise.reject(new Error(`Unknown social provider: ${provider}`))
}

export default boot(({ app }) => {
  const api = { authenticate }
  app.config.globalProperties.$socialAuth = api
  app.config.globalProperties.$auth = api
  if (typeof window !== 'undefined') {
    window.__appGlobals = window.__appGlobals || {}
    window.__appGlobals.$socialAuth = api
  }
})
