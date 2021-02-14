import Vue from 'vue'
import '../assets/css/_bootstrap.min.css'
import '../assets/css/_bootstrap-rtl.css'
import '../assets/css/homepage.css'
import vueVimeoPlayer from 'vue-vimeo-player'
import _ from 'lodash'

Vue.use(vueVimeoPlayer)

import jQuery from 'jquery'

// import bootStrapjs from 'src/assets/js/bootstrap'

Vue.prototype.$jquery = jQuery

Vue.prototype.$_ = _
