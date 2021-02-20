<template>
    <div id="q-app">
        <router-view />
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "App",
    computed: {
        ...mapState('authentication', ['token'])
    },
    methods: {
        ...mapActions('authentication', ['RE_LOGIN_USER'])
    },
    created() {
        // console.log({router: this.$router})
        // TODO: If There is a token, reLogin the user
        if (this.token) {
            this.RE_LOGIN_USER().catch(e => {
              // console.log({ReloginError: e})
              this.$router.push({ name: "login" });
           });
        }
    }
};
</script>
<style>
#q-app {
    direction: rtl !important;
}
</style>
