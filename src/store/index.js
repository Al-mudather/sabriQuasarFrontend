import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import settings from './settings'
import pyramidManagement from './pyramid_management'
import authentication from './authentication'
import shoppingCart from './shoppingCart'
import courseManagement from './courseManagement'
import learningProgress from './learningProgress'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      settings,
      pyramidManagement,
      authentication,
      shoppingCart,
      courseManagement,
      learningProgress
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
