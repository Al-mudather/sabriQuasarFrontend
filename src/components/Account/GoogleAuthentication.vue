<template>
    <div class="social" @click="helloGoogleAuth">
        <img src="~assets/img/googel.png" alt="" />
    </div>
</template>

<script>
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { mapActions } from "vuex";

export default {
    name: "GoogleAuthentication",
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
                    //TODO: There is a network error go and solve it
                    //TODO: There is a network error go and solve it
                    //TODO: There is a network error go and solve it
                    console.log('llllllllllllllll')
                    console.log(result.data)
                    console.log('llllllllllllllll')
                    if (result.data.socialAuth) {
                        this.loginAction(result.data.socialAuth).then(() => {
                            // TODO: Go To the home page
                            this.$router.push({ name: "Home" });
                        });
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
