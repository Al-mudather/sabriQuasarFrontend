<template>
    <AccountHeader
        dialogName="إنشاء حساب جديد"
        v-on:closeDialog="closeSiginUpDialog"
    >
        <!--
      Signup Section
    -->
        <div class="signup">
            <div class="logBy">
                <div class="social" @click="helloFacebookAuth">
                    <img src="~assets/img/facebook.png" alt="" />
                </div>
                <div class="social" @click="helloGoogleAuth">
                    <img src="~assets/img/googel.png" alt="" />
                </div>
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
                                v-model="username"
                                type="text"
                                placeholder="الاسم الحقيقي"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input
                                v-model="email"
                                type="email"
                                placeholder="الإيميل"
                            />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input
                                v-model="password1"
                                type="password"
                                placeholder="كلمة المرور"
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
                                placeholder="إعادة كلمة المرور"
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
        </div>
    </AccountHeader>
</template>

<script>
import { SocialAuth } from "src/queries/account_management/mutation/CreateSocailAuth";
import { RegisterNewUser } from "src/queries/account_management/mutation/RegisterNewUser";
import { mapActions } from "vuex";
import AccountHeader from "src/components/utils/accountHeader";
export default {
    data() {
        return {
            username: "",
            email: "",
            password1: "",
            password2: "",
            errorMessages: []
        };
    },
    components: {
        AccountHeader
    },
    methods: {
        ...mapActions("authentication", [
            "loginAction",
            "setSignUpDialogAction",
            "setRegisterationDialogAction"
        ]),

        closeSiginUpDialog() {
            this.setSignUpDialogAction(false);
            this.setRegisterationDialogAction(false);
        },

        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.errorMessages.push(val.message);
                }
            }
        },
        RegisterNewUser() {
            if (this.password1 === this.password2) {
                this.errorMessages = [];
                this.$apollo
                    .mutate({
                        mutation: RegisterNewUser,
                        variables: {
                            email: this.email,
                            username: this.username,
                            password1: this.password1,
                            password2: this.password2
                        }
                    })
                    .then(result => {
                        if (result.data.register.success) {
                            this.GotToConfirmationPage();
                        } else if (result.data.register.errors) {
                            console.log("gggggggggggggggg");
                            console.log(result.data.register);
                            console.log("gggggggggggggggg");
                            this.errorHandler(result.data.register.errors);
                        }
                    });
            } else {
                this.errorMessages.push("passwords are not the same");
            }
        },

        GotToConfirmationPage() {
            this.closeSiginUpDialog();
            this.$router.push({ name: "password-confirm" });
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
                    if (result.data.socialAuth) {
                        this.loginAction(result.data.socialAuth).then(() => {
                            this.closeSiginUpDialog();
                        })
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
        },

        helloFacebookAuth(network = "google") {
            const hello = this.hello;

            hello("facebook")
                .login({
                    scope: "public_profile,email",
                    force: true
                })
                .then(r => {
                    console.log('Facebook')
                    console.log(r);
                    console.log('Facebook')

                    // Call user information, for the given network
                    hello("facebook")
                        .api("/me")
                        .then(r => {
                            console.log("r = ", r);
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
