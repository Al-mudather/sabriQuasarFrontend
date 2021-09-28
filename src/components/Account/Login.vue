<template>
    <AccountHeader :prevRoute="prevRoute" :dialogName="$t('تسجيل الدخول')">
        <!--
      Login Section
    -->
        <div class="login">
            <div class="row q-ma-md justify-center">
                <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" class="col-11 q-ma-sm"/>
                <FacebookAuthentication :label="facebookLabel" :prevRoute="prevRoute" class="col-11 q-ma-sm"/>
            </div> 
            <div class="text-center textStyle text-h4 q-mb-md">
                OR
            </div>
            <form id="loginForm" @submit="LoginUser($event)">
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input
                                class="input"
                                id="email"
                                v-model="email"
                                type="email"
                                :placeholder="$t('الإيميل')"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input
                                class="input"
                                id="password"
                                v-model="password"
                                type="password"
                                :placeholder="$t('كلمة المرور')"
                            />
                        </div>
                        <div class="forget" style="cursor: pointer">
                            <h3>
                                {{$t('هل نسيت كلمة')}}
                                <a @click="goToPasswordResetPage"
                                    ><span class="hvr-float-shadow">{{$t('السر ؟')}}</span></a
                                >
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="next" style="cursor: pointer">
                    <!-- <button type="submit" style="outline: none; border: none; background: transparent; box-shadow: none;" id="loginBtn" class="action_btn" @click="LoginUser"> -->
                    <button type="submit" style="outline: none; border: none; background: transparent; box-shadow: none;" id="loginBtn" class="action_btn">
                        <svg
                            class="nexx"
                            xmlns="http://www.w3.org/2000/svg"
                            width="61.667"
                            height="54"
                            viewBox="0 0 61.667 54"
                        >
                            <g
                                id="Group_363"
                                data-name="Group 363"
                                transform="translate(0 54)"
                            >
                                <path
                                    id="Path_55"
                                    data-name="Path 595"
                                    d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z"
                                    fill="#fbc74b"
                                    fill-rule="evenodd"
                                />
                                <path
                                    id="Path_56"
                                    data-name="Path 596"
                                    d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z"
                                    fill="#fbc74b"
                                    fill-rule="evenodd"
                                />
                            </g>
                        </svg>
                        <img src="~assets/img/back.png" alt="" />
                    </button>
                </div>
            </form>
            <div class="creat">
                <div class="orr">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="39.286"
                        height="56.942"
                        viewBox="0 0 39.286 56.942"
                    >
                        <g
                            id="Group_288"
                            data-name="Group 288"
                            transform="translate(-0.501 78.915)"
                        >
                            <path
                                id="Path_598"
                                data-name="Path 598"
                                d="M19.172-39.572a1.129,1.129,0,0,0-.069.6,1.467,1.467,0,0,0,.112.305,2.767,2.767,0,0,0,.866.96c1.369,1.009,2.539,1.832,2.838,3.106.226.961,0,2.231-1.159,4.084a12.806,12.806,0,0,0-1.549,3.77,15.694,15.694,0,0,0-.457,4.088.645.645,0,0,1-.6.685.645.645,0,0,1-.685-.6,16.916,16.916,0,0,1,.409-4.484,14.211,14.211,0,0,1,1.651-4.216c.827-1.37,1.1-2.267.923-2.967a2.22,2.22,0,0,0-.824-1.115c-.423-.357-.935-.692-1.47-1.073a3.623,3.623,0,0,1-1.7-2.615,2.2,2.2,0,0,1,.577-1.733,1.418,1.418,0,0,1,1.063-.435l2.777-.1A17.92,17.92,0,0,0,33.262-47.24,17.808,17.808,0,0,0,37.787-59.19,17.815,17.815,0,0,0,32.575-71.8,17.862,17.862,0,0,0,19.966-77.1,17.932,17.932,0,0,0,7.216-71.94,18.062,18.062,0,0,0,1.791-59.19a.645.645,0,0,1-.645.645A.645.645,0,0,1,.5-59.19a19.458,19.458,0,0,1,5.6-13.86,19.591,19.591,0,0,1,13.86-5.865,19.655,19.655,0,0,1,14,5.723,19.7,19.7,0,0,1,5.818,14A19.687,19.687,0,0,1,34.66-45.983a19.646,19.646,0,0,1-12.6,6.349Z"
                                fill="#e5e5e6"
                                fill-rule="evenodd"
                            />
                        </g>
                    </svg>
                    <span>{{$t('أو')}}</span>
                </div>
                <a @click="goToSignUpPage" style="cursor: pointer">
                    <h3 class="hvr-float-shadow">{{$t('إنشـاء حســاب')}}</h3>
                </a>
            </div>
            <q-inner-loading :showing="visible">
                <q-spinner-hourglass color="primary" size="70px" />
            </q-inner-loading>
        </div>
    </AccountHeader>
</template>

<script>
import { LoginUserWithEmail } from "src/queries/account_management/mutation/LoginUserWithEmail";
import { mapActions } from "vuex";
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'

import AccountHeader from "src/components/utils/accountHeader.vue";
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication';
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication';

export default {
    data() {
        return {
            facebookLabel: "تسجيل الدخول عن طريق ال Facebook",
            googleLabel: "تسجيل الدخول عن طريق ال Google",
            email: "",
            password: "",
            prevRoute: null,
            visible: false,
            errorMessages: []
        };
    },
    components: {
        AccountHeader,
        GoogleAuthentication,
        FacebookAuthentication
    },

    beforeRouteEnter(to, from, next) {

        next(vm => {
            vm.prevRoute = from.fullPath
        })
    },


    methods: {
        ...mapActions('authentication', ['loginAction']),
        ...mapActions('settings', ['setCurrencyAction']),

        goToPasswordResetPage() {
            this.$router.push({ name: 'password-reset' });
        },

        goToSignUpPage() {
            this.$router.push({ name: 'signUp' });
        },

        reset () {
            this.email = ''
            this.password = ''
        },

        errorHandler(errorsObj) {
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.$q.notify({
                        type: 'warning',
                        position: 'top',
                        progress: true,
                        multiLine: true,
                        message: val.message
                    })
                }
            }
        },
        LoginUser(event) {
            event.preventDefault();
            try {
                this.visible = true
                this.errorMessages = []

                this.$apollo
                    .mutate({
                        mutation: LoginUserWithEmail,
                        variables: {
                            email: this.email,
                            password: this.password
                        }
                    })
                    .then(result => {
                        this.visible = false
                        if (result.data.tokenAuth.success) {
                            // TODO: reset the data
                            if (result.data.tokenAuth.user.verified) {
                                //TODO: Set the user currency
                                try {
                                    const userCur = result.data.tokenAuth.user.userCurrency
                                    if (userCur) {
                                        userCur == 'SDG' ? this.setCurrencyAction('SDG') : this.setCurrencyAction('USD')
                                    }

                                    //TODO: Set the external user id for notification
                                    let externalUserId = result.data.tokenAuth.user.email; // You will supply the external user id to the OneSignal SDK 
                                    OneSignal.push(function() { 
                                        OneSignal.setExternalUserId(externalUserId); 
                                    });
                                } catch (error) {
                                }
                                //TODO: Log me in
                                this.loginAction(result.data.tokenAuth).then(() => {
                                    this.$q.notify({
                                        type: 'positive',
                                        progress: true,
                                        multiLine: true,
                                        position: 'top',
                                        message: 'logged in successfully'
                                    })
                                    // TODO: See if the user thas the reqisteration code
                                    this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
                                });
                            } else {
                                //TODO: Go to the Email verification page
                                this.$router.push({ name: "password-confirm" });
                            }
                        } else if (result.data.tokenAuth.errors) {
                            this.errorHandler(result.data.tokenAuth.errors);
                        }
                    }).catch((error) => {
                        this.visible = false
                    });
                
            } catch (error) {
                this.visible = false
            }
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
                //TODO: IF there is an error, then the user did not join the platform with a registeration code
                if ( e.message == 'GraphQL error: PyramidAffiliate matching query does not exist.') {
                    this.$q.notify({
                        type: 'positive',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'You must inter the registeration code'
                    })
                    // TODO: Go to registeration code page
                    this.$router.push({ name: 'registeration-code' })
                }

            }
        }
    }
};
</script>

<style lang="scss">

.action_btn {
    
    & > svg > g > path {
        transition: all .3s;
    }
    
    &:hover > svg > g > path{
        fill: $color-primary;
    }

}

.textStyle {
    color: #7B7B7B;
    font-size: 19px;
    font-family: "cairoR";
}

.input {
    font-size: 1.5rem;
    font-family: inherit;
    color: inherit;
    padding: 1.5rem 2rem;
    border-radius: 2px;
    background-color: rgba($color-white, .5);
    // border: none;
    border-bottom: 3px solid transparent;
    width: 90%;
    display: block;
    transition: all .3s;

    // @include respond(tab-port) {
    //     width: 100%;
    // }

    &:focus {
        outline: none;
        box-shadow: 0 1rem 2rem rgba($color-black, .1);
        border-bottom: 3px solid $color-primary !important;
    }

    &:focus:invalid {
        border-bottom: 3px solid $color-secondary-dark !important;
    }

    &::-webkit-input-placeholder {
        color: $color-grey-dark-2;
    }
}

.social {
    position: relative;
    z-index: 100;
}
</style>
