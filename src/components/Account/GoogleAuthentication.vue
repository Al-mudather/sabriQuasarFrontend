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
import { useAuthStore } from "src/stores/auth";
import { useSettingsStore } from "src/stores/settings";
import { usePyramidStore } from "src/stores/pyramid";
import { apolloClient } from "src/apollo/client";

export default {
    name: "GoogleAuthentication",
    setup () {
        const auth = useAuthStore();
        const settings = useSettingsStore();
        const pyramid = usePyramidStore();
        return { auth, settings, pyramid };
    },
    data () {
        return {
            visible: false
        }
    },

    props:['prevRoute', 'label'],

    methods: {

        GoToHomePage() {
            this.$router.push({ name: "Home" });
        },

        async IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE () {
            try {
                const res = await apolloClient.query({
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
                const join_permission_res = await apolloClient.query({query: CheckTheUserPermissionToUsePlatforme})
                const errors = this.$_.get(join_permission_res, '[errors]')

                if (errors) {
                    //TODO: Loop throw all the errors
                    for (let error of errors) {
                        if (error.message.includes("PyramidAffiliate matching query does not exist.")) {
                            this.$router.push({ name: 'registeration-code' })
                        }
                    }

                } else {
                    //TODO:If the user is a marketer, then git his marketing code
                    this.pyramid.fetchMyMarketingCode()
                    //TODO: IF THE USER HASE ANY ENROLLMENT, SEND HIME TO HIS COURSES PAGE
                    const res = await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE()
                    //TODO: Empty the marketer code if exists
                    this.pyramid.setMyMarketingCode('')
                    if (res) {
                        this.$router.push({ name: "my-courses" })
                    } else {
                        this.$router.push({ name: "Home" })
                    }
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
                const auth_res = await apolloClient.mutate({
                        mutation: SocialAuth,
                        variables: {
                            provider: provider,
                            accessToken: accessToken,
                            email: email
                        }
                })

                if (auth_res.data.socialAuth) {
                    Promise.resolve(this.auth.login(auth_res.data.socialAuth)).then(() => {
                        const userData = auth_res.data.socialAuth

                        //TODO: Set the user currency
                        try {
                            const userCur = userData.social.user.userCurrency
                            if (userCur) {
                                userCur == 'SDG' ? this.settings.setCurrency('SDG') : this.settings.setCurrency('USD')
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
                .then( (r) => {
                    // console.log('/////////////////');
                    // console.log(r.authResponse.access_token);
                    // console.log('/////////////////');
                    try {
                        var google = hello("google").getAuthResponse();
                        this.loginAuthMutation(
                            google.access_token,
                            "google-oauth2"
                        );
                        // this.loginAuthMutation(
                        //     google.access_token,
                        //     "google-oauth2"
                        // );
                    } catch (error) {
                        // console.log('EEEEEEEEEEEEEE')
                        // console.log(error.message)
                        // console.log('EEEEEEEEEEEEEE')
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.social :deep(.q-btn) {
  border-radius: var(--ds-radius-pill);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  text-transform: none;
}
</style>
