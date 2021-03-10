<template>
    <div class="social" @click="helloGoogleAuth">
        <img src="~assets/img/googel.png" alt="" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { mapActions } from "vuex";

export default {
    name: "GoogleAuthentication",
    data () {
        return {
            visible: false
        }
    },
    methods: {
        ...mapActions("authentication", [
            "loginAction"
        ]),
        GoToHomePage() {
            this.$router.push({ name: "Home" });
        },
        // TODO: Google and Facebook Register
        loginAuthMutation(accessToken, provider, email = "") {
            console.log(" Triggering Apollo ");
            this.visible = true

            this.$apollo
                .mutate({
                    mutation: SocialAuth,
                    variables: {
                        provider: provider,
                        accessToken: accessToken,
                        email: email
                    }
                })
                .then(result => {
                    this.visible = false
                    if (result.data.socialAuth) {
                        this.loginAction(result.data.socialAuth).then(() => {
                            if (result.data.socialAuth.token) {
                                this.$router.go(-1);
                            }
                        });
                    }
                }).catch((err) => {
                    this.visible = false
                    if (err.message === "GraphQL error: UNIQUE constraint failed: account_manager_user.email") {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: this.$t('هذا الحساب مسجل مسبقا')
                        })
                    }
                });
        },

        helloGoogleAuth(network = "google") {
            const hello = this.hello;

            hello("google")
                .login({
                    scope: "email",
                    force: true
                })
                .then(r => {
                    console.log(r);

                    var google = hello("google").getAuthResponse();

                    // console.log(google)
                    // console.log(google.access_token)

                    this.loginAuthMutation(
                        google.access_token,
                        "google-oauth2"
                    );
                });
        }
    }
};
</script>

<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";
@import "src/assets/css/account.scss";
</style>
