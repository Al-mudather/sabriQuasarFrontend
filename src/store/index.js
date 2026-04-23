import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import settings from './settings'
import pyramidManagement from './pyramid_management'
import authentication from './authentication'
import shoppingCart from './shoppingCart'

/*
 * Vuex 4 root. Kept alongside the new Pinia root (src/stores/index.js) for
 * the Track B -> Track C migration window so the 152 legacy mapper sites
 * (mapState / mapGetters / mapActions) continue to work while they're
 * ported module-by-module.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      settings,
      pyramidManagement,
      authentication,
      shoppingCart
    },

    strict: !!process.env.DEBUGGING
  })

  return Store
})
