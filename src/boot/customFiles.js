import Vue from 'vue'
import '../assets/css/_bootstrap.min.css'
import '../assets/css/_bootstrap-rtl.css'
import '../assets/css/homepage.css'
import '../assets/css/hover-min.css'
// import '../assets/css/animate.min.css'
import vueVimeoPlayer from 'vue-vimeo-player'
import VueSocialSharing from 'vue-social-sharing'
import jQuery from 'jquery'
import _ from 'lodash'

// TODO: Adding vue share
Vue.use(VueSocialSharing);
// TODO: Adding vimeo player
Vue.use(vueVimeoPlayer)
// TODO: Adding jquery
Vue.prototype.$jquery = jQuery
// TODO: Adding lodash
Vue.prototype.$_ = _
