<template>
  <AccountHeader dialogName="تسجيل الدخول" v-on:closeDialog="closeLoginDialog">
    <!--
      Login Section
    -->
    <div class="login">
      <div class="logBy">
          <div class="social">
              <img src="~assets/img/facebook.png" alt="">
          </div>
          <div class="social">
              <img src="~assets/img/googel.png" alt="">
          </div>
      </div>
      <form>
          <div class="row">
              <div class="col-lg-12 col-xs-12">
                  <div class="" style="text-align:left" v-if="errorMessages.length > 0">
                    Please fix these <strong>error first</strong>
                    <ul>
                      <li v-for="(message, index) in errorMessages" :key="index">{{message}}<br /></li>
                    </ul>
                  </div>
                  <div class="inp">
                      <img src="~assets/img/gmail.png" alt="">
                      <input v-model="email" type="email" placeholder="الإيميل">
                  </div>
                  <div class="inp">
                      <img src="~assets/img/password.png" alt="">
                      <input v-model="password" type="password" placeholder="كلمة المرور">
                  </div>
                  <div class="forget" style="cursor: pointer">
                      <h3>هل نسيت كلمة <a @click="openPasswordResetDialog"><span>المــرور ؟</span></a> </h3>
                  </div>
              </div>
          </div>
          <div class="next" style="cursor: pointer">
              <a @click="LoginUser">
                  <svg class="nexx" xmlns="http://www.w3.org/2000/svg" width="61.667" height="54" viewBox="0 0 61.667 54">
                      <g id="Group_363" data-name="Group 363" transform="translate(0 54)">
                          <path id="Path_55" data-name="Path 595" d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z" fill="#fbc74b" fill-rule="evenodd"/>
                          <path id="Path_56" data-name="Path 596" d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z" fill="#fbc74b" fill-rule="evenodd"/>
                      </g>
                  </svg>
                  <img src="~assets/img/back.png" alt="">
              </a>
          </div>
      </form>
      <div class="creat">
          <div class="orr">
              <svg xmlns="http://www.w3.org/2000/svg" width="39.286" height="56.942" viewBox="0 0 39.286 56.942">
                  <g id="Group_288" data-name="Group 288" transform="translate(-0.501 78.915)">
                      <path id="Path_598" data-name="Path 598" d="M19.172-39.572a1.129,1.129,0,0,0-.069.6,1.467,1.467,0,0,0,.112.305,2.767,2.767,0,0,0,.866.96c1.369,1.009,2.539,1.832,2.838,3.106.226.961,0,2.231-1.159,4.084a12.806,12.806,0,0,0-1.549,3.77,15.694,15.694,0,0,0-.457,4.088.645.645,0,0,1-.6.685.645.645,0,0,1-.685-.6,16.916,16.916,0,0,1,.409-4.484,14.211,14.211,0,0,1,1.651-4.216c.827-1.37,1.1-2.267.923-2.967a2.22,2.22,0,0,0-.824-1.115c-.423-.357-.935-.692-1.47-1.073a3.623,3.623,0,0,1-1.7-2.615,2.2,2.2,0,0,1,.577-1.733,1.418,1.418,0,0,1,1.063-.435l2.777-.1A17.92,17.92,0,0,0,33.262-47.24,17.808,17.808,0,0,0,37.787-59.19,17.815,17.815,0,0,0,32.575-71.8,17.862,17.862,0,0,0,19.966-77.1,17.932,17.932,0,0,0,7.216-71.94,18.062,18.062,0,0,0,1.791-59.19a.645.645,0,0,1-.645.645A.645.645,0,0,1,.5-59.19a19.458,19.458,0,0,1,5.6-13.86,19.591,19.591,0,0,1,13.86-5.865,19.655,19.655,0,0,1,14,5.723,19.7,19.7,0,0,1,5.818,14A19.687,19.687,0,0,1,34.66-45.983a19.646,19.646,0,0,1-12.6,6.349Z" fill="#e5e5e6" fill-rule="evenodd"/>
                  </g>
              </svg>
              <span>أو</span>
          </div>
          <a @click="openSiginUpDialog" style="cursor: pointer">
              <h3>إنشـاء حســاب</h3>
          </a>
      </div>
    </div>
  </AccountHeader>
</template>

<script>
import { LoginUserWithEmail } from 'src/queries/account_management/mutation/LoginUserWithEmail'
import { mapActions } from 'vuex'
import AccountHeader from 'src/components/utils/accountHeader'
export default {
  data () {
    return {
      email: '',
      password: '',
      errorMessages: []
    }
  },
  components: {
    AccountHeader
  },
  methods: {
    ...mapActions('authentication', [
      'loginAction',
      'setLoginDialogAction',
      'setPasswordResetDialogAction',
      'setSignUpDialogAction'
    ]),

    closeLoginDialog () {
      this.setLoginDialogAction(false)
    },

    openSiginUpDialog () {
      // TODO: Close the login page
      this.closeLoginDialog()
      this.setSignUpDialogAction(true)
    },

    openPasswordResetDialog () {
      // TODO: Close the registeration dialog
      this.setPasswordResetDialogAction(true)
    },

    GoToPasswordReset () {
      this.$router.push({ name: 'password-reset' })
    },

    errorHandler (errorsObj) {
      console.log(errorsObj)
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message)
        }
      }
    },
    LoginUser () {
      // const redirectUrl = this.$route.query.redirect
      this.$apollo.mutate({
        mutation: LoginUserWithEmail,
        variables: {
          email: this.email,
          password: this.password
        }
      }).then((result) => {
        if (result.data.tokenAuth.success) {
          this.loginAction(result.data.tokenAuth).then(() => {
            this.setLoginDialogAction(false)
            // this.$router.push(redirectUrl || { name: 'Home' })
          })
        } else if (result.data.tokenAuth.errors) {
          this.errorHandler(result.data.tokenAuth.errors)
        }
      })
    }
  }
}
</script>

<style lang="scss">
// @import 'src/assets/css/sass/helpers/_variabels.scss';
// @import 'src/assets/css/sass/helpers/_mixins.scss';
// @import 'src/assets/css/account.scss';
</style>
