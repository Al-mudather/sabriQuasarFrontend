<template>
    <AccountHeader
        :prevRoute="prevRoute"
        :dialogName="$t('إنشاء حساب جديد')"
    >
        <!--
        Signup Section
        -->
        <div class="signup">
            <div class="logBy">
                <FacebookAuthentication class="hvr-pulse-grow" />
                <GoogleAuthentication class="hvr-pulse-grow" />
            </div>
            <form @submit="REGISTER_NEW_USER($event)">
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <!-- <img src="~assets/img/gmail.png" alt="" /> -->
                            <input
                                class="input"
                                id="fullName"
                                v-model="fullName"
                                type="text"
                                :placeholder="$t('الاسم الحقيقي')"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input
                                class="input"
                                id="regEmail"
                                v-model="email"
                                type="email"
                                :placeholder="$t('الإيميل')"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input
                                class="input"
                                id="regPassword"
                                v-model="password1"
                                type="password"
                                :placeholder="$t('كلمة المرور')"
                            />
                            <img
                                class="closee"
                                src="~assets/img/eye.png"
                                alt=""
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input
                                class="input"
                                id="regPassword2"
                                v-model="password2"
                                type="password"
                                :placeholder="$t('إعادة كلمة المرور')"
                            />
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="action_btn" type="submit" id="siginUpAction" style="outline: none; border: none; background: transparent; box-shadow: none; cursor: pointer">
                        <svg
                            class="nexx neex_1"
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
            <q-inner-loading :showing="visible">
                <q-spinner-hourglass color="primary" size="70px" />
            </q-inner-loading>
        </div>
    </AccountHeader>
</template>

<script>
import { RegisterNewUser } from "src/queries/account_management/mutation/RegisterNewUser";
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import { mapActions } from "vuex";
import AccountHeader from "src/components/utils/accountHeader";
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication';
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication';

export default {

    data() {
        return {
            visible: false,
            prevRoute: null,
            fullName: "",
            email: "",
            password1: "",
            password2: "",
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
        ...mapActions("authentication", [
            "loginAction",
            "setSignUpDialogAction",
            "setRegisterationDialogAction",
            "SET_USER_DATA_ACTION"
        ]),

        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: val.message
                    })
                }
            }
        },

        async REGISTER_NEW_USER(event) {
            event.preventDefault();
            try {
                if (this.fullName && this.email&& this.password1 ) {
                    if (this.password1 === this.password2) {
                        // Start the loder
                        this.visible = true
                        this.errorMessages = [];
                        const signUp_res = await this.$apollo.mutate({
                            mutation: RegisterNewUser,
                            variables: {
                                email: this.email,
                                fullName: this.fullName,
                                password1: this.password1,
                                password2: this.password2
                            }
                        })
                        
                        if (signUp_res.data.register.success){
                            const tokenAuth = {
                                token: signUp_res.data.register.token,
                                refresh: signUp_res.data.register.refreshToken
                            }

                            this.loginAction(tokenAuth).then(() => {

                                try {
                                    this.$apollo.query({
                                        query: GetMyProfileData
                                    }).then(res => {
                                        this.SET_USER_DATA_ACTION(res.data.me)
                                        this.$q.notify({
                                            type: 'warning',
                                            progress: true,
                                            multiLine: true,
                                            position: 'top',
                                            message: this.$t('يجب ان تقوم بتفعيل حسابك الإلكتروني')
                                        })
                                    })
                                } catch (error) {
                                }
                            });
                            this.GotToConfirmationPage();
                        } else if (signUp_res.data.register.errors) {
                            this.visible = false
                            this.errorHandler(signUp_res.data.register.errors);
                        }

                    } else {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: "passwords are not the same"
                        })
                    }
                } else {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: "All Fields are required"
                    })
                }
                
            } catch (error) {
                if (error.message === "GraphQL error: UNIQUE constraint failed: account_manager_user.email") {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: this.$t('هذا الحساب مسجل مسبقا')
                    })
                } else {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'There were some errors please try again latter'
                    })
                }
                // Close the loder
                this.visible = false
            }
        },

        GotToConfirmationPage() {
            this.$router.push({ name: "password-confirm" });
        }
    }
};
</script>
 
<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";
@import "src/assets/css/account.scss";

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
</style>
