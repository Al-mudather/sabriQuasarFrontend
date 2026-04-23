/* eslint-disable */
import Vue from 'vue'
import '../assets/css/hover-min.css'
import VueSocialSharing from 'vue-social-sharing'
import jQuery from 'jquery'
import _ from 'lodash'
import vueVimeoPlayer from 'vue-vimeo-player'
import VueCountdownTimer from 'vuejs-countdown-timer';
import vueBraintree from 'vue-braintree'

import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.use(vueBraintree)
Vue.use(VueCountdownTimer);
Vue.use(vueVimeoPlayer)
Vue.use(VueSocialSharing);

Vue.prototype.$jquery = jQuery
Vue.prototype.$_ = _
