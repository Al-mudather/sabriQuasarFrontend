<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ $t('تسجيل الدخول') }}</h1>
      <p class="auth-card__subtitle">
        {{ $t('أهلاً بعودتك. أدخل بياناتك لمتابعة رحلتك.') }}
      </p>
    </header>

    <div v-if="apiError" class="auth-card__banner" role="alert">
      <span>{{ apiError }}</span>
    </div>

    <form @submit.prevent="LoginUser" class="auth-card__form" novalidate>
      <ds-input
        v-model="email"
        type="email"
        :label="$t('البريد الإلكتروني')"
        :error="fieldErrors.email"
        autocomplete="email"
        required
        name="email"
      />

      <ds-input
        v-model="password"
        type="password"
        :label="$t('كلمة المرور')"
        :error="fieldErrors.password"
        autocomplete="current-password"
        required
        name="password"
      />

      <div class="auth-card__row">
        <label class="auth-card__remember">
          <input type="checkbox" v-model="remember" />
          <span>{{ $t('تذكرني') }}</span>
        </label>
        <a class="auth-card__link" @click="goToPasswordResetPage">
          {{ $t('نسيت كلمة المرور؟') }}
        </a>
      </div>

      <ds-button
        type="submit"
        native-type="submit"
        variant="accent"
        size="lg"
        full-width
        :loading="visible"
      >
        {{ $t('تسجيل الدخول') }}
      </ds-button>

      <ds-button
        type="button"
        native-type="button"
        variant="ghost"
        size="lg"
        full-width
        @click="goToSignUpPage"
      >
        {{ $t('إنشاء حساب جديد') }}
      </ds-button>
    </form>

    <div class="auth-card__social">
      <div class="auth-card__divider"><span>{{ $t('أو') }}</span></div>
      <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
      <FacebookAuthentication :label="facebookLabel" :prevRoute="prevRoute" />
    </div>

    <p class="auth-card__fineprint" @click="GO_TO_THE_TERMS_AND_CONDETIONS_PAGE">
      {{ isEnglish
        ? 'By continuing you agree to the platform terms and conditions.'
        : 'بمتابعتك فإنك توافق على شروط وأحكام المنصة.' }}
    </p>
  </div>
</template>

<script>
import { LoginUserWithEmail } from 'src/queries/account_management/mutation/LoginUserWithEmail'
import { mapActions, mapState } from 'vuex'
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication.vue'
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication.vue'
import DsInput from 'src/design-system/components/DsInput.vue'

export default {
  name: 'Login',
  components: { GoogleAuthentication, FacebookAuthentication, DsInput },

  data () {
    return {
      facebookLabel: 'تسجيل الدخول عن طريق Facebook',
      googleLabel: 'تسجيل الدخول عن طريق Google',
      email: '',
      password: '',
      remember: true,
      prevRoute: null,
      visible: false,
      apiError: '',
      fieldErrors: { email: '', password: '' }
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

    resetErrors () {
      this.apiError = ''
      this.fieldErrors = { email: '', password: '' }
    },

    errorHandler (errorsObj) {
      const generic = []
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          if (key === 'email' || key === 'password') {
            this.fieldErrors[key] = val.message
          } else {
            generic.push(val.message)
          }
        }
      }
      if (generic.length) this.apiError = generic.join(' — ')
    },

    redirectAfterLogin (fallback) {
      const target = this.$route.query && this.$route.query.redirect
      if (target) {
        this.$router.push(target).catch(() => {})
        return true
      }
      if (fallback) this.$router.push(fallback).catch(() => {})
      return false
    },

    async LoginUser () {
      this.resetErrors()
      this.visible = true
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
            if (this.redirectAfterLogin()) return
            this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
          } else {
            this.$router.push({ name: 'password-confirm' })
          }
        } else if (result.data.tokenAuth.errors) {
          this.errorHandler(result.data.tokenAuth.errors)
        }
      } catch (e) {
        this.apiError = this.$t('تعذر تسجيل الدخول. تحقق من بياناتك وحاول مجدداً.')
      } finally { this.visible = false }
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
          this.$router.push({ name: 'registeration-code' })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__head { text-align: start; }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-2xl);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-2);
  }

  &__subtitle {
    font-size: var(--ds-text-md);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-arabic);
  }

  &__banner {
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-accent-50);
    color: var(--ds-accent-500);
    border-inline-start: 3px solid var(--ds-accent-300);
    border-radius: var(--ds-radius-sm);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-arabic);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: calc(-1 * var(--ds-space-2));
  }

  &__remember {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    cursor: pointer;

    input {
      accent-color: var(--ds-brand-600);
      inline-size: 16px;
      block-size: 16px;
      cursor: pointer;
    }
  }

  &__link {
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-600);
    cursor: pointer;
    text-decoration: none;
    font-weight: var(--ds-weight-medium);
    &:hover { text-decoration: underline; }
  }

  &__social {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    color: var(--ds-text-muted);
    font-size: var(--ds-text-xs);
    font-family: var(--ds-font-heading);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-block-end: var(--ds-space-2);

    &::before, &::after {
      content: '';
      flex: 1;
      block-size: 1px;
      background: var(--ds-border);
    }
  }

  &__fineprint {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    text-align: center;
    margin: 0;
    cursor: pointer;
    &:hover { color: var(--ds-brand-600); text-decoration: underline; }
  }
}
</style>
