<template>
    <div class="social" @click="helloFacebookAuth">
        <img src="~assets/img/facebook.png" alt="" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { mapActions } from "vuex";

export default {
    name: "FacebookAuthentication",
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
                            // TODO: Go To the home page
                            if (result.data.socialAuth.token) {
                                this.$router.go(-1);
                            }
                        });
                    }
                }).catch((error) => {
                    this.visible = false
                    console.log('eeeeeeeeeeeeeee')
                    console.log(error)
                    console.log('eeeeeeeeeeeeeee')
                });
        },

        helloFacebookAuth(network = "google") {
            const hello = this.hello;

            hello("facebook")
                .login({
                    scope: "public_profile,email",
                    force: true
                })
                .then(r => {
                    console.log("Facebook");
                    console.log(r);
                    console.log("Facebook");

                    // Call user information, for the given network
                    hello("facebook")
                        .api("/me")
                        .then(r => {
                            // console.log("r.email = " + r.email);
                            // console.log("r.name== = " + r.name);

                            var facebook = hello("facebook").getAuthResponse();

                            // console.log('')
                            // console.log(facebook)
                            // console.log(facebook.access_token)

                            this.loginAuthMutation(
                                facebook.access_token,
                                "facebook",
                                r.email
                            );
                        });
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
