<template>
    <div class="social">
        <!-- <img src="~assets/img/facebook.png" alt="" /> -->
        <q-btn class="full-width" :label="label" icon="la la-facebook" @click="helloFacebookAuth" color="primary" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { mapActions } from "vuex";

export default {
    name: "FacebookAuthentication",
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
        ...mapActions('pyramidManagement', ['GET_MY_MARKETING_CODE_ACCOUNT_ACTION']),

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
                //TODO: if the user is a marketer. save his marketing code
                await this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION()
                //TODO: IF THE USER HASE ANY ENROLLMENT, SEND HIME TO HIS COURSES PAGE
                const res = await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE()
                if (res) {
                    this.$router.push({ name: "my-courses" })
                } else {
                    this.$router.push({ name: "Home" })
                }
            } catch (e) {
                if ( e.message == 'GraphQL error: PyramidAffiliate matching query does not exist.') {
                    this.$q.notify({
                        type: 'positive',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'You must inter the registeration code'
                    })
                    // TODO: Go to code registeration page
                    this.$router.push({ name: 'registeration-code' })
                }

            }
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
                    const userData = result.data.socialAuth
                    if (userData) {
                        this.loginAction(userData).then(() => {
                            
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
                            // TODO: Go To the home page
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
                                // this.$router.push({ name: 'registeration-code' })
                            }
                        });
                    }
                }).catch((error) => {
                    this.visible = false
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
