<template>
  <AccountHeader :dialogName="$t('إستعادة كلمة المرور')">
    <!--
      Password Reset section
    -->
    <div class="resetPass">
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
                <input v-model="email" type="email" :placeholder="$t('الإيميل')">
            </div>
            <div class="next">
                <a @click="sendEmailConfirmationToTheUser" style="cursor: pointer">
                    <svg class="nexx nexx_1" id="Group_391" data-name="Group 391" xmlns="http://www.w3.org/2000/svg" width="37" height="32.4" viewBox="0 0 37 32.4">
                        <path id="Path_595" data-name="Path 595" d="M38.867-36.467a14.207,14.207,0,0,0-14.2-14.2h-5.8a14.207,14.207,0,0,0-14.2,14.2,14.207,14.207,0,0,0,14.2,14.2h5.8A14.207,14.207,0,0,0,38.867-36.467Z" transform="translate(-1.867 52.667)" fill="#fbc74b" fill-rule="evenodd"/>
                        <path id="Path_596" data-name="Path 596" d="M17-22.4l-.8.8A16.208,16.208,0,0,1,0-37.8,16.208,16.208,0,0,1,16.2-54l.8.8A15.407,15.407,0,0,0,1.6-37.8,15.407,15.407,0,0,0,17-22.4Z" transform="translate(0 54)" fill="#fbc74b" fill-rule="evenodd"/>
                    </svg>
                    <img src="~assets/img/back.png" alt="">
                </a>
            </div>
          </div>
        </div>
      </form>
      <q-inner-loading :showing="visible">
          <q-spinner-hourglass color="primary" size="70px" />
      </q-inner-loading>
    </div>
  </AccountHeader>
</template>

<script>
import { UserPasswordResetEmail } from 'src/queries/account_management/mutation/UserPasswordResetEmail'
import AccountHeader from 'src/components/utils/accountHeader'
export default {
  data () {
    return {
      email: '',
      visible: false,
      errorMessages: []
    }
  },
  components: {
    AccountHeader
  },
  methods: {

    errorHandler (errorsObj) {
      console.log(errorsObj)
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message)
        }
      }
    },
    sendEmailConfirmationToTheUser () {
      // start the loder
      this.visible = true
      this.$apollo.mutate({
        mutation: UserPasswordResetEmail,
        variables: {
          email: this.email
        }
      }).then((res) => {
        // Close the loder
        this.visible = false
        if (res.data.sendPasswordResetEmail.success) {
          this.$router.push({ name: 'password-confirm' })
        } 
        if (res.data.sendPasswordResetEmail.errors) {
          this.errorHandler(res.data.sendPasswordResetEmail.errors)
        } 
        if (res.errors) {
          this.errorHandler(res.errors)
        }
      }).catch((error) => {
        // Close the loder
        this.visible = false
        if (error.message === 'GraphQL error: [Errno 11001] getaddrinfo failed') this.errorMessages.push('I can\'t send to your email, please try again')
      })
    }
  }
}
</script>

<style lang="scss">
</style>
