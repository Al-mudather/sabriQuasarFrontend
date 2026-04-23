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
import { useAuthStore } from "src/stores/auth";
import { useSettingsStore } from "src/stores/settings";
import { usePyramidStore } from "src/stores/pyramid";
import { apolloClient } from "src/apollo/client";

export default {
    name: "FacebookAuthentication",
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
                //TODO:If the user is a marketer, then git his marketing code
                this.pyramid.fetchMyMarketingCode()
                //TODO: IF THE USER HASE ANY ENROLLMENT, SEND HIME TO HIS COURSES PAGE
                const res = await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE()
                //TODO: delete the marketer code
                this.pyramid.setMyMarketingCode('')
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
            this.visible = true
            apolloClient
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
                        Promise.resolve(this.auth.login(userData)).then(() => {

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

        helloFacebookAuth(network = "facebook") {
            const hello = this.hello;

            this.$jquery(document).ready( () => {
                this.$jquery.ajaxSetup({ cache: true });
                this.$jquery.getScript('https://connect.facebook.net/en_US/sdk.js', () => {
                    FB.init({
                        appId: '757236575189030',
                        version: 'v2.7',
                        cookie     : true,                     // Enable cookies to allow the server to access the session.
                        xfbml      : true,
                    }); 
                    this.$jquery('#loginbutton,#feedbutton').removeAttr('disabled');

                    FB.logout( (out) => {
                    } )

                    FB.login( (log_res) => {
                        if (log_res.status === 'connected') {
                            FB.getLoginStatus( (res) => {
                                const access_token = res.authResponse.accessToken
                                    hello('facebook')
                                    .api(`/me?access_token=${access_token}`)
                                    .then( (res_data) => {
                                        const email = res_data.email

                                        this.loginAuthMutation(
                                            access_token,
                                            "facebook",
                                            email
                                        );
                                    } )
                            } );
                        } else {
                        }
                    }, {scope: 'email'} );
                });
            });


            // hello('facebook')
            // .login({
            //     scope: "public_profile,email",
            //     force: true
            // })
            // .then(r => {
            //     const access_token = r.authResponse.access_token

            //     // Call user information, for the given network
            //     hello('facebook')
            //     .api(`/me?access_token=${access_token}`)
            //     .then(res => {

            //         // var facebookRes = hello('facebook').getAuthResponse();
            //         // console.log("lllllllllllllllll");
            //         // console.log(res);
            //         // console.log("lllllllllllllllll");
            //         try {
            //             this.loginAuthMutation(
            //                 access_token,
            //                 "facebook",
            //                 res.email
            //             );
            //         } catch (error) {
            //             console.log("eeeeeeeeeeeeeeeeeeeee");
            //             console.log(error);
            //             console.log("eeeeeeeeeeeeeeeeeeeee");
            //         }
            //     }, (e) => {
            //         console.log("eeeeeeeeeeeeeeeeeeeee");
            //         console.log(e);
            //         console.log("eeeeeeeeeeeeeeeeeeeee");
            //     }

            //     );
            // });
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
