<template>
    <AccountHeader
        :dialogName="$t('إنشاء حساب جديد')"
    >
        <!--
        Signup Section
        -->
        <div class="signup">
            <div class="logBy">
                <FacebookAuthentication />
                <GoogleAuthentication />
            </div>
            <form>
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div
                            class=""
                            style="text-align:left"
                            v-if="errorMessages.length > 0"
                        >
                            Please fix these <strong>error first</strong>
                            <ul>
                                <li
                                    v-for="(message, index) in errorMessages"
                                    :key="index"
                                >
                                    {{ message }}<br />
                                </li>
                            </ul>
                        </div>
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input
                                v-model="fullName"
                                type="text"
                                :placeholder="$t('الاسم الحقيقي')"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input
                                v-model="email"
                                type="email"
                                :placeholder="$t('الإيميل')"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input
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
                                v-model="password2"
                                type="password"
                                :placeholder="$t('إعادة كلمة المرور')"
                            />
                        </div>
                    </div>
                </div>
                <div class="next">
                    <a @click="RegisterNewUser" style="cursor: pointer">
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
                    </a>
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
import { mapActions } from "vuex";
import AccountHeader from "src/components/utils/accountHeader";
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication';
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication';

export default {
    data() {
        return {
            visible: false,
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
    methods: {
        ...mapActions("authentication", [
            "loginAction",
            "setSignUpDialogAction",
            "setRegisterationDialogAction"
        ]),

        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.errorMessages.push(val.message);
                }
            }
        },
        RegisterNewUser() {
            try {
                if (this.password1 === this.password2) {
                    // Start the loder
                    this.visible = true
                    this.errorMessages = [];
                    this.$apollo
                        .mutate({
                            mutation: RegisterNewUser,
                            variables: {
                                email: this.email,
                                fullName: this.fullName,
                                password1: this.password1,
                                password2: this.password2
                            }
                        })
                        .then(result => {
                            // Close the loder
                            this.visible = false
                            if (result.data.register.success) {
                                this.GotToConfirmationPage();
                            } else if (result.data.register.errors) {
                                this.errorHandler(result.data.register.errors);
                            }
                        }).catch((error) => {
                            // Close the loder
                            this.visible = false
                            this.errorHandler(error.errors);
                        });
                } else {
                    this.errorMessages.push("passwords are not the same");
                }
                
            } catch (error) {
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
</style>
