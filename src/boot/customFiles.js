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
import videoPlayer from 'vue-videojs7'

// global register
Vue.use(videoPlayer)

Vue.use(vueVimeoPlayer)
// TODO: Adding vue share
Vue.use(VueSocialSharing);
// TODO: Adding jquery
Vue.prototype.$jquery = jQuery
// TODO: Adding lodash
Vue.prototype.$_ = _
