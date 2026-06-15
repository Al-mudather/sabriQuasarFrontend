// Vue-2 only helpers removed during Track B:
//   - BootstrapVue:        already gone from the rebrand commit.
//   - VueMeta:             replaced by @unhead/vue in boot/main.js.
//   - VueSocialSharing:    Track C will ship a hand-rolled ShareButtons.vue.
//   - VueCountdownTimer:   Track C will inline a small composable.
//   - vueBraintree:        Track C wires braintree-web-drop-in directly.
//   - vueVimeoPlayer:      Track C uses @vimeo/player directly.
//
// Track C audit: the previously-registered `$jquery` / `$_` globals had zero
// call sites in `src/**` (verified via grep for `this.$jquery` and `this.$_`).
// The `boot/lodash.js` global `$_` registration was removed in the first-load
// perf pass (lodash dropped entirely); this file no longer touches globals and
// only keeps the surviving hover-min stylesheet import.

import { boot } from 'quasar/wrappers'
import '../assets/css/hover-min.css'

export default boot(() => {
  // CSS side-effect only.
})
