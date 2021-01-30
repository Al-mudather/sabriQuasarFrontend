// import something here
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files

Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:8000', // Your API domain

  providers: {
    google: {
      url: '/rest-auth/google/',
      clientId: '812696144817-l1pdrq5sjmd71f5gnv6scsahsfaa5eve.apps.googleusercontent.com',
      redirectUri: 'http://localhost:8080', // Your client app URL
      scope: ['email'],
    }
  }
})

// export default async (/* { app, router, Vue ... } */) => {
//   // something to do
// }
