<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ $t('إنشاء حساب جديد') }}</h1>
      <p class="auth-card__subtitle">
        {{ $t('ابدأ رحلتك العلمية في دقيقة واحدة.') }}
      </p>
    </header>

    <div v-if="apiError" class="auth-card__banner" role="alert">{{ apiError }}</div>

    <form @submit.prevent="REGISTER_NEW_USER" class="auth-card__form" novalidate>
      <ds-input
        v-model="fullName"
        type="text"
        :label="$t('الاسم الكامل')"
        :error="fieldErrors.fullName"
        autocomplete="name"
        required
      />

      <ds-input
        v-model="email"
        type="email"
        :label="$t('البريد الإلكتروني')"
        :error="fieldErrors.email"
        autocomplete="email"
        required
      />

      <div class="auth-card__phone">
        <div class="auth-card__phone-code">
          <label class="auth-card__phone-label">{{ $t('الكود') }}</label>
          <select v-model="countryCode" class="auth-card__phone-select">
            <option value="+249">+249</option>
            <option value="+966">+966</option>
            <option value="+971">+971</option>
            <option value="+20">+20</option>
            <option value="+962">+962</option>
            <option value="+974">+974</option>
            <option value="+965">+965</option>
          </select>
        </div>
        <div class="auth-card__phone-number">
          <ds-input
            v-model="phone"
            type="tel"
            :label="$t('رقم الهاتف')"
            :error="fieldErrors.phone"
            autocomplete="tel"
          />
        </div>
      </div>

      <ds-input
        v-model="password1"
        type="password"
        :label="$t('كلمة المرور')"
        :error="fieldErrors.password1"
        autocomplete="new-password"
        required
      />

      <ds-input
        v-model="password2"
        type="password"
        :label="$t('تأكيد كلمة المرور')"
        :error="fieldErrors.password2"
        autocomplete="new-password"
        required
      />

      <label class="auth-card__terms">
        <input type="checkbox" v-model="agreed" />
        <span>
          {{ $t('أوافق على') }}
          <a @click.stop.prevent="goTerms">{{ $t('الشروط والأحكام') }}</a>
          {{ $t('و') }}
          <a @click.stop.prevent="goPrivacy">{{ $t('سياسة الخصوصية') }}</a>
        </span>
      </label>

      <ds-button
        type="submit"
        native-type="submit"
        variant="accent"
        size="lg"
        full-width
        :loading="visible"
        :disabled="!agreed"
      >
        {{ $t('إنشاء الحساب') }}
      </ds-button>
    </form>

    <div class="auth-card__social">
      <div class="auth-card__divider"><span>{{ $t('أو') }}</span></div>
      <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
    </div>

    <p class="auth-card__switch">
      <span>{{ $t('لديك حساب بالفعل؟') }}</span>
      <a @click="goLogin">{{ $t('تسجيل الدخول') }}</a>
    </p>
  </div>
</template>

<script>
import { RegisterNewUser } from 'src/queries/account_management/mutation/RegisterNewUser'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { mapActions, mapState } from 'vuex'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication'
import DsInput from 'src/design-system/components/DsInput.vue'

export default {
  name: 'SignUp',
  components: { GoogleAuthentication, DsInput },

  data () {
    return {
      googleLabel: 'إنشاء حساب جديد بإستخدام Google',
      visible: false,
      prevRoute: null,
      fullName: '',
      email: '',
      countryCode: '+249',
      phone: '',
      password1: '',
      password2: '',
      agreed: false,
      apiError: '',
      fieldErrors: {
        fullName: '', email: '', phone: '', password1: '', password2: ''
      }
    }
  },

  computed: { ...mapState('settings', ['isEnglish']) },

  beforeRouteEnter (to, from, next) {
    next(vm => { vm.prevRoute = from.fullPath })
  },

  mounted () {
    if (this.isEnglish) this.googleLabel = 'Sign up using Google'
  },

  methods: {
    ...mapActions('authentication', [
      'loginAction',
      'setSignUpDialogAction',
      'setRegisterationDialogAction',
      'SET_USER_DATA_ACTION'
    ]),

    goTerms ()   { this.$router.push({ name: 'terms-and-conditions' }) },
    goPrivacy () { this.$router.push('/privacyPolicy').catch(() => this.$router.push({ name: 'terms-and-conditions' })) },
    goLogin ()   { this.$router.push({ name: 'login' }) },

    resetErrors () {
      this.apiError = ''
      this.fieldErrors = { fullName: '', email: '', phone: '', password1: '', password2: '' }
    },

    errorHandler (errorsObj) {
      const generic = []
      const map = { fullName: 'fullName', email: 'email', phone: 'phone', password1: 'password1', password2: 'password2', newPassword2: 'password2' }
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          const target = map[key]
          if (target) this.fieldErrors[target] = val.message
          else generic.push(val.message)
        }
      }
      if (generic.length) this.apiError = generic.join(' — ')
    },

    validate () {
      this.resetErrors()
      let ok = true
      if (!this.fullName) { this.fieldErrors.fullName = this.$t('الاسم مطلوب'); ok = false }
      if (!this.email)    { this.fieldErrors.email    = this.$t('البريد مطلوب'); ok = false }
      if (!this.password1) { this.fieldErrors.password1 = this.$t('كلمة المرور مطلوبة'); ok = false }
      if (this.password1 && this.password1.length < 6) { this.fieldErrors.password1 = this.$t('كلمة المرور قصيرة جداً'); ok = false }
      if (this.password1 !== this.password2) { this.fieldErrors.password2 = this.$t('كلمتا المرور غير متطابقتين'); ok = false }
      return ok
    },

    async REGISTER_NEW_USER () {
      if (!this.validate()) return
      this.visible = true
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
          try {
            const profile = await this.$apollo.query({ query: GetMyProfileData })
            this.SET_USER_DATA_ACTION(profile.data.me)
          } catch (e) { /* non-blocking */ }
          this.$router.push({ name: 'registeration-code' })
        } else if (signUp_res.data.register.errors) {
          this.errorHandler(signUp_res.data.register.errors)
        }
      } catch (error) {
        this.apiError = error && error.message === 'GraphQL error: UNIQUE constraint failed: account_manager_user.email'
          ? this.$t('هذا الحساب مسجل مسبقاً')
          : this.$t('حدث خطأ، يرجى المحاولة لاحقاً')
      } finally {
        this.visible = false
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
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__phone {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: var(--ds-space-2);
    align-items: end;
  }

  &__phone-label {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    display: block;
    margin-block-end: var(--ds-space-2);
  }

  &__phone-select {
    inline-size: 100%;
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-taupe);
    border-radius: var(--ds-radius-sm);
    padding: 0.75rem var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    outline: none;

    &:focus {
      border-color: var(--ds-brand-600);
      box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.18);
    }
  }

  &__terms {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-arabic);
    cursor: pointer;

    input {
      margin-block-start: 3px;
      accent-color: var(--ds-brand-600);
      inline-size: 16px;
      block-size: 16px;
    }

    a {
      color: var(--ds-brand-600);
      text-decoration: underline;
      cursor: pointer;
      margin-inline: 2px;
    }
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

  &__switch {
    text-align: center;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
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
