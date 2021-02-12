import Vue from 'vue'

const HelloJs = require('hellojs/dist/hello.all.min.js')
const VueHello = require('vue-hellojs')

HelloJs.init({
  google: '812696144817-l1pdrq5sjmd71f5gnv6scsahsfaa5eve.apps.googleusercontent.com'
  // facebook: FACEBOOK_APP_CLIENT_ID
})
Vue.use(VueHello, HelloJs)
