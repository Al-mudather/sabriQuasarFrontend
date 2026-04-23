// Vue-2 only helpers removed during Track B:
//   - BootstrapVue:        already gone from the rebrand commit.
//   - VueMeta:             replaced by @unhead/vue in boot/main.js.
//   - VueSocialSharing:    Track C will ship a hand-rolled ShareButtons.vue.
//   - VueCountdownTimer:   Track C will inline a small composable.
//   - vueBraintree:        Track C wires braintree-web-drop-in directly.
//   - vueVimeoPlayer:      Track C uses @vimeo/player directly.
//
// What survives: the hover-min stylesheet import plus the $jquery / $_ globals
// that legacy components may still read off `this`.

import { boot } from 'quasar/wrappers'
import '../assets/css/hover-min.css'
import jQuery from 'jquery'
import _ from 'lodash'

export default boot(({ app }) => {
  app.config.globalProperties.$jquery = jQuery
  app.config.globalProperties.$_ = _
})
