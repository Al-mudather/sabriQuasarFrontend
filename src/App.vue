<template>
    <div id="q-app">
        <router-view />
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { LocalStorage } from 'quasar'
import {WOW} from 'wowjs'
import 'animate.css'

export default {
    name: "App",
    computed: {
        ...mapState('authentication', ['token'])
    },
    methods: {
        ...mapActions('authentication', ['RE_LOGIN_USER']),
        ...mapActions('authentication', ['logOutAction']),
    },
    created() {
        // console.log({router: this.$router})
        //TODO: Empty the nav bar 
        LocalStorage.set('activeNav', '')

        // TODO: If There is a token, reLogin the user
        if (this.token) { 
            this.RE_LOGIN_USER().then((re) => {
                if (re === false) {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'لقد انتهت صلاحية دخولك للموقع... الرجاء الدخول مره اخرى لتتمكن من تطوير مهاراتك'
                    })
                    //TODO: Delete the user data
                    this.logOutAction()
                    //TODO: Go to login page
                    this.$router.push({ name: "login" });
                }
            }).catch(e => {
              // console.log({ReloginError: e})
              this.$router.push({ name: "login" });
           });
        }
    },
    mounted () {
        let options={
            //Default is true
            live:false
        }
        new WOW(options)
    },
};
</script>
<style>
#q-app {
    direction: rtl !important;
}
</style>
