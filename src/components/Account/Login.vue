<template>
  <AccountHeader :prevRoute="prevRoute" :dialogName="$t('تسجيل الدخول')">
    <section class="auth-form">
      <div class="auth-form__social">
        <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
        <FacebookAuthentication :label="facebookLabel" :prevRoute="prevRoute" />
      </div>

      <p class="auth-form__terms" @click="GO_TO_THE_TERMS_AND_CONDETIONS_PAGE">
        {{ isEnglish
          ? 'By using the platform, you agree to the terms and conditions of the platform'
          : 'بإستخدامك للمنصه فانت توافق على شروط و احكام المنصه' }}
      </p>

      <div class="auth-form__divider"><span>{{ $t('أو') }}</span></div>

      <form @submit.prevent="LoginUser" class="auth-form__fields">
        <q-input
          rounded outlined
          v-model="email"
          type="email"
          :label="$t('الإيميل')"
          autocomplete="email"
        />
        <q-input
          rounded outlined
          v-model="password"
          type="password"
          :label="$t('كلمة المرور')"
          autocomplete="current-password"
        />

        <a class="auth-form__forgot" @click="goToPasswordResetPage">
          {{ $t('هل نسيت كلمة المرور ؟') }}
        </a>

        <ds-button
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ $t('تسجيل الدخول') }}
        </ds-button>
      </form>

      <p class="auth-form__switch">
        <span>{{ $t('ليس لديك حساب؟') }}</span>
        <a @click="goToSignUpPage">{{ $t('إنشـاء حســاب') }}</a>
      </p>
    </section>
  </AccountHeader>
</template>

<script>
import { LoginUserWithEmail } from 'src/queries/account_management/mutation/LoginUserWithEmail'
import { mapActions, mapState } from 'vuex'
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import AccountHeader from 'src/components/utils/accountHeader.vue'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication.vue'
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication.vue'

export default {
  name: 'Login',
  components: { AccountHeader, GoogleAuthentication, FacebookAuthentication },

  data () {
    return {
      facebookLabel: 'تسجيل الدخول عن طريق ال Facebook',
      googleLabel: 'تسجيل الدخول عن طريق ال Google',
      email: '',
      password: '',
      prevRoute: null,
      visible: false,
      errorMessages: []
    }
  },

  computed: { ...mapState('settings', ['isEnglish']) },

  beforeRouteEnter (to, from, next) {
    next(vm => { vm.prevRoute = from.fullPath })
  },

  mounted () {
    if (this.isEnglish) {
      this.facebookLabel = 'Login using Facebook'
      this.googleLabel   = 'Login using Google'
    }
  },

  methods: {
    ...mapActions('authentication', ['loginAction']),
    ...mapActions('settings', ['setCurrencyAction']),
    ...mapActions('pyramidManagement', [
      'GET_MY_MARKETING_CODE_ACCOUNT_ACTION',
      'SET_MY_MARKETING_CODE_ACCOUNT_ACTION'
    ]),

    GO_TO_THE_TERMS_AND_CONDETIONS_PAGE () { this.$router.push({ name: 'terms-and-conditions' }) },
    goToPasswordResetPage ()                { this.$router.push({ name: 'password-reset' }) },
    goToSignUpPage ()                       { this.$router.push({ name: 'signUp' }) },

    errorHandler (errorsObj) {
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

    async LoginUser () {
      this.visible = true
      this.errorMessages = []
      try {
        const result = await this.$apollo.mutate({
          mutation: LoginUserWithEmail,
          variables: { email: this.email, password: this.password }
        })
        if (result.data.tokenAuth.success) {
          if (result.data.tokenAuth.user.verified) {
            try {
              const userCur = result.data.tokenAuth.user.userCurrency
              if (userCur) this.setCurrencyAction(userCur === 'SDG' ? 'SDG' : 'USD')

              // eslint-disable-next-line no-undef
              if (typeof OneSignal !== 'undefined') {
                const externalUserId = result.data.tokenAuth.user.email
                // eslint-disable-next-line no-undef
                OneSignal.push(function () { OneSignal.setExternalUserId(externalUserId) })
              }
            } catch (e) { /* OneSignal optional */ }

            await this.loginAction(result.data.tokenAuth)
            this.$q.notify({
              type: 'positive',
              progress: true,
              multiLine: true,
              position: 'top',
              message: 'logged in successfully'
            })
            this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
          } else {
            this.$router.push({ name: 'password-confirm' })
          }
        } else if (result.data.tokenAuth.errors) {
          this.errorHandler(result.data.tokenAuth.errors)
        }
      } catch (e) { /* apolloProvider surfaces the error toast */ }
      finally { this.visible = false }
    },

    async IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE () {
      try {
        const res = await this.$apollo.query({ query: AllEnrollmentsForCurrentUser })
        return res.data.allEnrollmentsForCurrentUser.edges.length > 0
      } catch (e) { return false }
    },

    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
      try {
        await this.$apollo.query({ query: CheckTheUserPermissionToUsePlatforme })
        this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION()
        const hasCourses = await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE()
        this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION('')
        this.$router.push({ name: hasCourses ? 'my-courses' : 'Home' })
      } catch (e) {
        if (e.message === 'GraphQL error: PyramidAffiliate matching query does not exist.') {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'You must inter the registeration code'
          })
          this.$router.push({ name: 'registeration-code' })
        }
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

  &__divider {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    color: var(--ds-text-muted);
    font-size: var(--ds-text-sm);
    font-family: var(--ds-font-heading);
    text-transform: uppercase;
    letter-spacing: 0.08em;

    &::before, &::after {
      content: '';
      flex: 1;
      block-size: 1px;
      background: var(--ds-border);
    }
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__forgot {
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-600);
    cursor: pointer;
    text-align: end;
    text-decoration: none;
    margin-block-start: calc(-1 * var(--ds-space-1));
    &:hover { text-decoration: underline; }
  }

  &__switch {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    text-align: center;
    margin: 0;
    a {
      color: var(--ds-brand-600);
      font-weight: var(--ds-weight-medium);
      margin-inline-start: var(--ds-space-1);
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }
  }
}
</style>
