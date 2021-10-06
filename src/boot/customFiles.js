/* eslint-disable */
import Vue from 'vue'
import '../assets/css/_bootstrap.min.css'
import '../assets/css/_bootstrap-rtl.css'
import '../assets/css/homepage.css'
import '../assets/css/hover-min.css'
// import '../assets/css/animate.min.css'
import VueSocialSharing from 'vue-social-sharing'
import jQuery from 'jquery'
import _ from 'lodash'
import vueVimeoPlayer from 'vue-vimeo-player'
// import videoPlayer from 'vue-videojs7'
// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'video.js/dist/video-js.min.css'
// import videojsVimeo from '../../node_modules/videojs-vimeo/dist/videojs-vimeo'
// // // global register
// Vue.use(videojsVimeo)
import { BootstrapVue } from 'bootstrap-vue'
import VueCountdownTimer from 'vuejs-countdown-timer';
import vueBraintree from 'vue-braintree'

Vue.use(vueBraintree)

Vue.use(BootstrapVue)

Vue.use(VueCountdownTimer);

Vue.use(vueVimeoPlayer)
// TODO: Adding vue share
Vue.use(VueSocialSharing);
// TODO: Adding jquery
Vue.prototype.$jquery = jQuery
// TODO: Adding lodash
Vue.prototype.$_ = _
