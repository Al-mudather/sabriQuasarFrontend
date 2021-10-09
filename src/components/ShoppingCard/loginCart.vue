<template>
    <div class="dataUser">
        <div v-if="!token" class="creatt">
            <div class="linkss">
                <div class="logBy">
                    <!-- <FacebookAuthentication class="hvr-shadow-radial" />
                    <GoogleAuthentication class="hvr-shadow-radial"/> -->
                    <div class="login hvr-shadow-radial q-mr-sm" style="cursor: pointer">
                        <a @click="GoToLoginPage">
                            <img src="~assets/img/login.png" alt="" />&nbsp;
                            <h3>{{$t('دخول')}}</h3>
                        </a>
                    </div>
                </div>
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
                    <h3 class="hvr-shadow-radial">{{$t('إنشـاء حســاب')}}</h3>
                </div>
            </div>
            <form>
                <!-- <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <img src="~assets/img/usser.png" alt="" />
                            <input type="text" placeholder="الاسم الحقيقي" />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/gmail.png" alt="" />
                            <input type="email" placeholder="الإيميل" />
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <img src="~assets/img/phone-call.png" alt="" />
                            <input type="text" placeholder="رقم الهاتف" />
                        </div>
                        <div class="inp">
                            <img src="~assets/img/password.png" alt="" />
                            <input type="text" placeholder="كلمة المرور" />
                        </div>
                    </div>
                </div> -->
                <!-- <div class="terms">
                    <div class="check">
                        <input type="checkbox" v-mode="checked" name="hana" id="ck" />
                        <label for="ck">
                            <img src="~assets/img/sah.png" alt="" />
                        </label>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19.333"
                            height="19.324"
                            viewBox="0 0 19.333 19.324"
                        >
                            <path
                                id="Path_627"
                                data-name="Path 627"
                                d="M1.136-44.759A8.9,8.9,0,0,1,3.82-51.033a8.825,8.825,0,0,1,6.274-2.534,8.807,8.807,0,0,1,6.206,2.6A8.808,8.808,0,0,1,18.9-44.759a8.817,8.817,0,0,1-2.216,5.927,8.9,8.9,0,0,1-5.644,2.964l-1.382.056a.318.318,0,0,0-.332.3.318.318,0,0,0,.3.332l1.482-.026a9.616,9.616,0,0,0,6.178-3.085,9.663,9.663,0,0,0,2.54-6.471A9.68,9.68,0,0,0,17-51.668,9.681,9.681,0,0,0,10.094-54.5a9.667,9.667,0,0,0-6.841,2.9A9.591,9.591,0,0,0,.5-44.759a.318.318,0,0,0,.318.318A.318.318,0,0,0,1.136-44.759Z"
                                transform="translate(-0.5 54.501)"
                                fill="#d1d1d2"
                                fill-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <h3 style="display: none">{{$t('أنا أوافق علي')}} <span>{{$t('شروط الخدمة')}}</span></h3>
                </div> -->
                <div class="but" @click="GoToSignUpPage">
                    <h3>
                        <img src="~assets/img/Path 478.png" alt="" />{{$t('إنشـاء حســاب')}}
                    </h3>
                </div>
            </form>
        </div>

        <div class="total">
            <div class="next" @click="GoToPaymentCartPage">
                <a href="#">
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
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
// import GoogleAuthentication from "src/components/Account/GoogleAuthentication";
// import FacebookAuthentication from "src/components/Account/FacebookAuthentication";

export default {
    name:  "loginCartpage",
    data () {
        return {
            checked: false,
            lodash: this.$_
        }
    },

    computed: {
        ...mapState("authentication", ["user", "token"])
    },

    mounted () {
        this.$root.$emit('activateShoppingProgress', 'loginCart')
        const shoopingProccess = ['cartCourses', 'loginCart']
        shoopingProccess.map(process => {
            const name = `[data-cart="${process}"]`
            document.querySelector(name).classList.add('active')
            document.querySelector(name).nextSibling.classList.add('show')
        })
        if (this.token) {
            this.$router.push({ name: 'user-info' })
        }
    },
    // components: {
    //     GoogleAuthentication,
    //     FacebookAuthentication
    // },
    methods: {
        GoToLoginPage () {
            this.$router.push({ name: 'login' })
        },

        GoToSignUpPage () {
            this.$router.push({ name: 'signUp' })
        },

        GoToPaymentCartPage () {

            if (!this.$_.isEmpty(this.user)) {
                // this.$router.push({ name: 'payment' })
                this.$router.push({ name: 'user-info' })

            } else {
                
                this.$q.notify({
                    type: 'warning',
                    progress: true,
                    multiLine: true,
                    position: 'top',
                    message: 'يجب تسجيل الدخول اولا'
                })
            }
        }
    }
};
</script>

<style lang="scss">
</style>
