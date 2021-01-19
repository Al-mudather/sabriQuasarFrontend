<template>
  <AccountHeader dialogName="إنشاء حساب جديد" v-on:closeDialog="closeSiginUpDialog">
    <!--
      Signup Section
    -->
    <div class="signup">
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
                      <input v-model="username" type="text" placeholder="الاسم الحقيقي">
                  </div>
                  <div class="inp">
                      <img src="~assets/img/gmail.png" alt="">
                      <input v-model="email" type="email" placeholder="الإيميل">
                  </div>
                  <div class="inp">
                      <img src="~assets/img/password.png" alt="">
                      <input v-model="password1" type="password" placeholder="كلمة المرور">
                      <img class="closee" src="~assets/img/eye.png" alt="">
                  </div>
                  <div class="inp">
                      <img src="~assets/img/password.png" alt="">
                      <input v-model="password2" type="password" placeholder="إعادة كلمة المرور">
                  </div>
              </div>
          </div>
          <div class="next">
              <a @click="RegisterNewUser" style="cursor: pointer">
                  <svg class="nexx neex_1" xmlns="http://www.w3.org/2000/svg" width="61.667" height="54" viewBox="0 0 61.667 54">
                      <g id="Group_363" data-name="Group 363" transform="translate(0 54)">
                          <path id="Path_55" data-name="Path 595" d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z" fill="#fbc74b" fill-rule="evenodd"/>
                          <path id="Path_56" data-name="Path 596" d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z" fill="#fbc74b" fill-rule="evenodd"/>
                      </g>
                  </svg>
                  <img src="~assets/img/back.png" alt="">
              </a>
          </div>
      </form>
    </div>
  </AccountHeader>
</template>

<script>
import { RegisterNewUser } from 'src/queries/account_management/mutation/RegisterNewUser'
import { mapActions } from 'vuex'
import AccountHeader from 'src/components/utils/accountHeader'
export default {
  data () {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
      errorMessages: []
    }
  },
  components: {
    AccountHeader
  },
  methods: {
    ...mapActions('authentication', ['setSignUpDialogAction', 'setRegisterationDialogAction']),

    closeSiginUpDialog () {
      this.setSignUpDialogAction(false)
      this.setRegisterationDialogAction(false)
    },

    errorHandler (errorsObj) {
      console.log(errorsObj)
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message)
        }
      }
    },
    RegisterNewUser () {
      if (this.password1 === this.password2) {
        this.errorMessages = []
        this.$apollo.mutate({
          mutation: RegisterNewUser,
          variables: {
            email: this.email,
            username: this.username,
            password1: this.password1,
            password2: this.password2
          }
        }).then((result) => {
          if (result.data.register.success) {
            this.GotToConfirmationPage()
          } else if (result.data.register.errors) {
            this.errorHandler(result.data.register.errors)
          }
        })
      } else {
        this.errorMessages.push('passwords are not the same')
      }
    },

    GotToConfirmationPage () {
      this.$router.push({ name: 'password-confirm' })
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';

</style>
