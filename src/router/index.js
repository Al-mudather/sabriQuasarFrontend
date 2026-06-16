import { route } from 'quasar/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'

import { tokenStorage } from 'src/localStorageService'
import { usePyramidStore } from 'src/stores/pyramid'

import routes from './routes'

// Registration-code gate exemptions: routes an authenticated-but-unregistered
// user must still reach so the gate can't trap them — the gate page itself,
// auth/legal pages (so they can sign out or read terms), and the error page.
const GATE_EXEMPT = new Set([
  'registeration-code',
  'login', 'signUp', 'password-reset', 'reset-password-form', 'password-confirm',
  'account-confirm', 'verify-email',
  'terms-and-conditions', 'privacy-policy',
  'not-found'
])

/*
 * If not building with SSR mode, you can directly export the Router.
 * The function below can be async too; either use async/await or return
 * a Promise which resolves with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Preserve existing hash-mode URLs (quasar.config.js -> build.vueRouterMode).
    history: createWebHashHistory(process.env.VUE_ROUTER_BASE)
  })

  // Registration-code gate (defense-in-depth). Enforcement previously lived
  // ONLY as a post-login router.push, which a `?redirect=` login bypassed (the
  // reported "users don't see the registration code" bug). This global guard
  // makes it durable: any authenticated user NOT linked to a PyramidAffiliate
  // is forced to the registration-code page, with their intended destination
  // preserved as ?redirect= so they land there after entering the code.
  Router.beforeEach(async (to, from, next) => {
    // Unauthenticated visitors are handled by per-route requireAuthentication.
    if (!tokenStorage.getAccessToken()) return next()
    if (GATE_EXEMPT.has(to.name)) return next()

    try {
      const pyramid = usePyramidStore()
      const ok = await pyramid.verifyPlatformAccess()
      if (ok) return next()
      return next({ name: 'registeration-code', query: { redirect: to.fullPath } })
    } catch (_e) {
      // Never let a guard failure white-screen the app — fail open.
      return next()
    }
  })

  return Router
})
