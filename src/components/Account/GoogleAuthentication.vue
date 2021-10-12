<template>
    <div class="social">
        <!-- <img src="~assets/img/googel.png" alt="" /> -->
        <q-btn class="full-width"  :label="label" icon="la la-google" @click="helloGoogleAuth" color="deep-orange"/>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
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

    props:['prevRoute', 'label'],

    methods: {
        ...mapActions("authentication", [
            "loginAction"
        ]),
        ...mapActions('settings', ['setCurrencyAction']),
        GoToHomePage() {
            this.$router.push({ name: "Home" });
        },

        async IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE () {
            try {
                const res = await this.$apollo.query({
                    query: AllEnrollmentsForCurrentUser,
                })

                if (res.data.allEnrollmentsForCurrentUser.edges.length > 0) {
                    return true
                } else {
                    return false
                }

            } catch (error) {
                return false
            }
        },

        async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
            try {
                const join_permission_res = await this.$apollo.query({query: CheckTheUserPermissionToUsePlatforme})
                //TODO: IF THE USER HASE ANY ENROLLMENT, SEND HIME TO HIS COURSES PAGE
                const res = await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE()

                if (res) {
                    this.$router.push({ name: "my-courses" })
                } else {
                    this.$router.push({ name: "Home" })
                }
            } catch (e) {
                if ( e.message == 'GraphQL error: PyramidAffiliate matching query does not exist.') {
                    // this.$q.notify({
                    //     type: 'positive',
                    //     progress: true,
                    //     multiLine: true,
                    //     position: 'top',
                    //     message: 'You must enter the registeration code'
                    // })
                    // TODO: Go to code registeration page
                    this.$router.push({ name: 'registeration-code' })
                }

            }
        },
        // TODO: Google and Facebook Register
        async loginAuthMutation(accessToken, provider, email = "") {
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

.q-btn__content {
    padding-right: 0 !important;
    padding-left: 0 !important;
}

.q-btn {
    &> span {
        margin-right: 0 !important;
        margin-left: 0 !important;
        &> span {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
    }
}

.q-icon {
    margin-left: 0 !important;
    margin-right: 0.3rem;

}
</style>
