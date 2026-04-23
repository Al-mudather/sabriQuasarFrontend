// OAuth 2.0 authorization-code helper (replaces `vue-authenticate`).
//
// The backend consumes a provider access token via the `SocialAuth` GraphQL
// mutation — it does NOT run its own OAuth code-flow exchange. So all this
// helper has to do is:
//   1. redirect the user to the provider's authorization endpoint,
//   2. parse the token off the redirect hash on return,
//   3. hand the token back to the caller (which then runs `SocialAuth`).
//
// Exposed as `$socialAuth` on `app.config.globalProperties`, which gives
// legacy call sites `this.$auth.authenticate('google')` a drop-in path
// (aliased as `$auth` too for API-parity with vue-authenticate).
//
// Client IDs come from build-time env so deployments can swap credentials
// without a code change:
//   process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID
//   process.env.SOCIAL_AUTH_FACEBOOK_CLIENT_ID

import { boot } from 'quasar/wrappers'

const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID || '',
    scope: 'openid email profile',
    responseType: 'token'
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    clientId: process.env.SOCIAL_AUTH_FACEBOOK_CLIENT_ID || '',
    scope: 'email',
    responseType: 'token'
  }
}

function buildRedirectUri () {
  if (typeof window === 'undefined') return ''
  return window.location.origin + '/#/auth/callback'
}

function authorize (provider) {
  const p = PROVIDERS[provider]
  if (!p) return Promise.reject(new Error(`Unknown social provider: ${provider}`))
  if (!p.clientId) return Promise.reject(new Error(`Missing client id for ${provider} (SOCIAL_AUTH_${provider.toUpperCase()}_CLIENT_ID)`))

  const params = new URLSearchParams({
    client_id: p.clientId,
    redirect_uri: buildRedirectUri(),
    response_type: p.responseType,
    scope: p.scope,
    state: provider
  })
  window.location.href = `${p.authUrl}?${params.toString()}`
  // Resolves on the next page load via handleCallback(); this promise never
  // resolves in the redirecting tab.
  return new Promise(() => {})
}

// Parses `#access_token=...&state=...` from the URL hash that the provider
// appends on redirect. Returns `{ provider, accessToken }` or `null` if the
// hash isn't an OAuth response.
function handleCallback () {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#\/?/, '')
  const queryStart = hash.indexOf('?')
  const qs = queryStart >= 0 ? hash.slice(queryStart + 1) : hash
  const params = new URLSearchParams(qs)
  const accessToken = params.get('access_token')
  const provider = params.get('state')
  if (!accessToken) return null
  return { provider, accessToken }
}

export default boot(({ app }) => {
  const api = {
    // `authenticate(provider)` kept to match the vue-authenticate signature
    // so legacy call sites (`this.$auth.authenticate('google')`) continue
    // to compile and run.
    authenticate: authorize,
    handleCallback
  }
  app.config.globalProperties.$socialAuth = api
  app.config.globalProperties.$auth = api
})
