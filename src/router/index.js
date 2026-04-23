import { route } from 'quasar/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'

import routes from './routes'

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

  return Router
})
