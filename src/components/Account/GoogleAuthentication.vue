<template>
    <div class="social" @click="helloGoogleAuth">
        <img src="~assets/img/googel.png" alt="" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { mapActions } from "vuex";

export default {
    name: "GoogleAuthentication",
    data () {
        return {
            visible: false
        }
    },

    props:['prevRoute'],

    methods: {
        ...mapActions("authentication", [
            "loginAction"
        ]),
        ...mapActions('settings', ['setCurrencyAction']),
        GoToHomePage() {
            this.$router.push({ name: "Home" });
        },
        async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
            try {
                const join_permission_res = await this.$apollo.query({query: CheckTheUserPermissionToUsePlatforme})
                this.$router.push({ name: 'Home' })
            } catch (e) {
                if ( e.message == 'GraphQL error: PyramidAffiliate matching query does not exist.') {
                    this.$q.notify({
                        type: 'positive',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'You must enter the registeration code'
                    })
                    // TODO: Go to code registeration page
                    this.$router.push({ name: 'registeration-code' })
                }

            }
        },
        // TODO: Google and Facebook Register
        async loginAuthMutation(accessToken, provider, email = "") {
            console.log(" Triggering Apollo ");
            try {
                this.visible = true

            const auth_res = await this.$apollo.mutate({
                    mutation: SocialAuth,
                    variables: {
                        provider: provider,
                        accessToken: accessToken,
                        email: email
                    }
            })

            if (auth_res.data.socialAuth) {
                this.loginAction(auth_res.data.socialAuth).then(() => {
                    const userData = auth_res.data.socialAuth

                    //TODO: Set the user currency
                    try {
                        const userCur = userData.social.user.userCurrency
                        if (userCur) {
                            userCur == 'SDG' ? this.setCurrencyAction('SDG') : this.setCurrencyAction('USD')
                        }

                        //TODO: Set the external user id for notification
                        let externalUserId = userData.social.user.email; // You will supply the external user id to the OneSignal SDK 
                        OneSignal.push(function() { 
                            OneSignal.setExternalUserId(externalUserId); 
                        });
                    } catch (error) {
                    }
                    if (userData.token) {
                        this.$q.notify({
                            type: 'positive',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: this.$t('تم تسجيل الدخول بنجاح')
                        })
                        // TODO: See if the user thas the reqisteration code
                        this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
                    }
                });
            }

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
                                this.$q.notify({
                                    type: 'positive',
                                    progress: true,
                                    multiLine: true,
                                    position: 'top',
                                    message: this.$t('تم تسجيل الدخول بنجاح')
                                })
                                // TODO: See if the user thas the reqisteration code
                                this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
                                // this.$router.push({ name: 'registeration-code' })
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
            } catch (error) {
                this.visible = false
                if (error.message === "GraphQL error: UNIQUE constraint failed: account_manager_user.email") {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: this.$t('هذا الحساب مسجل مسبقا')
                    })
                }
            }
            
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
