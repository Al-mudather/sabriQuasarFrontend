<template>
  <AccountHeader :prevRoute="prevRoute" :dialogName="$t('إنشاء حساب جديد')">
    <section class="auth-form">
      <p class="auth-form__lead">
        {{ isEnglish
          ? 'Create your account in seconds — sign up with your Google account.'
          : 'أنشئ حسابك في ثوانٍ — سجّل عبر حساب Google.' }}
      </p>

      <div class="auth-form__social">
        <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
      </div>

      <p class="auth-form__terms" @click="GO_TO_THE_TERMS_AND_CONDETIONS_PAGE">
        {{ isEnglish
          ? 'By using the platform, you agree to the terms and conditions of the platform'
          : 'بإستخدامك للمنصه فانت توافق على شروط و احكام المنصه' }}
      </p>

      <q-inner-loading :showing="visible">
        <q-spinner-hourglass color="primary" size="70px" />
      </q-inner-loading>
    </section>
  </AccountHeader>
</template>

<script>
import { RegisterNewUser } from 'src/queries/account_management/mutation/RegisterNewUser'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { mapActions, mapState } from 'vuex'
import AccountHeader from 'src/components/utils/accountHeader'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication'

export default {
  name: 'SignUp',
  components: { AccountHeader, GoogleAuthentication },

  data () {
    return {
      facebookLabel: 'إنشاء حساب جديد بإستخدام FACEBOOK',
      googleLabel: 'إنشاء حساب جديد بإستخدام Google',
      visible: false,
      prevRoute: null,
      fullName: '',
      email: '',
      password1: '',
      password2: '',
      errorMessages: []
    }
  },

  computed: { ...mapState('settings', ['isEnglish']) },

  beforeRouteEnter (to, from, next) {
    next(vm => { vm.prevRoute = from.fullPath })
  },

  mounted () {
    if (this.isEnglish) {
      this.facebookLabel = 'SignUp using Facebook'
      this.googleLabel   = 'SignUp using Google'
    }
  },

  methods: {
    ...mapActions('authentication', [
      'loginAction',
      'setSignUpDialogAction',
      'setRegisterationDialogAction',
      'SET_USER_DATA_ACTION'
    ]),

    GO_TO_THE_TERMS_AND_CONDETIONS_PAGE () { this.$router.push({ name: 'terms-and-conditions' }) },

    errorHandler (errorsObj) {
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

    async REGISTER_NEW_USER () {
      // Legacy email/password signup. The flow is preserved so the
      // /api remains compatible, but the UI only exposes Google signup
      // since email signup was disabled product-wide.
      if (!this.fullName || !this.email || !this.password1) {
        this.$q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'All Fields are required' })
        return
      }
      if (this.password1 !== this.password2) {
        this.$q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: 'passwords are not the same' })
        return
      }
      this.visible = true
      this.errorMessages = []
      try {
        const signUp_res = await this.$apollo.mutate({
          mutation: RegisterNewUser,
          variables: {
            email: this.email,
            fullName: this.fullName,
            password1: this.password1,
            password2: this.password2
          }
        })
        if (signUp_res.data.register.success) {
          const tokenAuth = {
            token: signUp_res.data.register.token,
            refresh: signUp_res.data.register.refreshToken
          }
          await this.loginAction(tokenAuth)
          const profile = await this.$apollo.query({ query: GetMyProfileData })
          this.SET_USER_DATA_ACTION(profile.data.me)
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: this.$t('يجب ان تقوم بتفعيل حسابك الإلكتروني')
          })
          this.$router.push({ name: 'password-confirm' })
        } else if (signUp_res.data.register.errors) {
          this.errorHandler(signUp_res.data.register.errors)
        }
      } catch (error) {
        const msg = error && error.message === 'GraphQL error: UNIQUE constraint failed: account_manager_user.email'
          ? this.$t('هذا الحساب مسجل مسبقا')
          : 'There were some errors please try again latter'
        this.$q.notify({ type: 'warning', progress: true, multiLine: true, position: 'top', message: msg })
      } finally {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__lead {
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    text-align: center;
    line-height: var(--ds-leading-arabic);
    margin: 0;
  }

  &__social {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__terms {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    text-align: center;
    margin: 0;
    cursor: pointer;
    &:hover { color: var(--ds-brand-600); text-decoration: underline; }
  }
}
</style>
