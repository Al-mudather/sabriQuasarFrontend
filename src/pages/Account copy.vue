<template>
  <div>
    <q-dialog full-width full-height v-model="loginDialog">
      <Login v-if="!passwordResetDialog"/>
      <ResetPassword v-if="passwordResetDialog"/>
    </q-dialog>

    <q-dialog full-width full-height v-model="signUpDialog">
      <SignUp />
    </q-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Login from 'components/Account/Login'
import ResetPassword from 'components/Account/ResetPassword'
import SignUp from 'components/Account/SignUp'
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  components: {
    Login,
    ResetPassword,
    SignUp
  },

  computed: {
    ...mapState('authentication', [
      'loginDialog',
      'signUpDialog',
      'registerationDialog',
      'passwordResetDialog'
    ])
  }
}
</script>
<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';
</style>
