<template>
  <main class="password-reset" dir="rtl">
    <div class="password-reset__card">
      <header class="password-reset__head">
        <h1 class="password-reset__title">{{ $t('تعيين كلمة مرور جديدة') }}</h1>
        <p class="password-reset__subtitle">
          {{ $t('اختر كلمة مرور قوية — ستحميك في كل مرة تسجّل فيها الدخول.') }}
        </p>
      </header>

      <div v-if="apiError" class="password-reset__banner" role="alert">{{ apiError }}</div>

      <form @submit.prevent="ResetTheUserPassword" class="password-reset__form" novalidate>
        <ds-input
          v-model="newPassword1"
          type="password"
          :label="$t('كلمة المرور الجديدة')"
          :error="fieldErrors.newPassword1"
          autocomplete="new-password"
          required
        />

        <div class="password-reset__strength" v-if="newPassword1">
          <ds-progress-bar :value="strengthValue" size="sm" variant="brand" />
          <span class="password-reset__strength-label" :class="`is-${strengthTier}`">
            {{ strengthLabel }}
          </span>
        </div>

        <ds-input
          v-model="newPassword2"
          type="password"
          :label="$t('تأكيد كلمة المرور')"
          :error="fieldErrors.newPassword2"
          autocomplete="new-password"
          required
        />

        <ds-button
          type="submit"
          native-type="submit"
          variant="accent"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ $t('تعيين كلمة المرور') }}
        </ds-button>
      </form>
    </div>
  </main>
</template>

<script>
import { ResetUserPassword } from 'src/queries/account_management/mutation/ResetUserPassword'
import DsInput from 'src/design-system/components/DsInput.vue'

export default {
  name: 'PasswordResetForm',
  components: { DsInput },

  data () {
    return {
      newPassword1: '',
      newPassword2: '',
      token: '',
      visible: false,
      apiError: '',
      fieldErrors: { newPassword1: '', newPassword2: '' }
    }
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler (params) { this.token = params.token }
    }
  },

  computed: {
    strengthValue () {
      const p = this.newPassword1 || ''
      let score = 0
      if (p.length >= 6) score += 25
      if (p.length >= 10) score += 20
      if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 20
      if (/\d/.test(p)) score += 15
      if (/[^A-Za-z0-9]/.test(p)) score += 20
      return Math.min(100, score)
    },
    strengthTier () {
      const v = this.strengthValue
      if (v < 40) return 'weak'
      if (v < 70) return 'medium'
      return 'strong'
    },
    strengthLabel () {
      return { weak: this.$t('ضعيفة'), medium: this.$t('متوسطة'), strong: this.$t('قوية') }[this.strengthTier]
    }
  },

  methods: {
    errorHandler (errorsObj) {
      const generic = []
      const map = { newPassword1: 'newPassword1', newPassword2: 'newPassword2' }
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          const t = map[key]
          if (t) this.fieldErrors[t] = val.message
          else generic.push(val.message)
        }
      }
      if (generic.length) this.apiError = generic.join(' — ')
    },

    async ResetTheUserPassword () {
      this.apiError = ''
      this.fieldErrors = { newPassword1: '', newPassword2: '' }
      if (this.newPassword1 !== this.newPassword2) {
        this.fieldErrors.newPassword2 = this.$t('كلمتا المرور غير متطابقتين')
        return
      }
      this.visible = true
      try {
        const res = await this.$apollo.mutate({
          mutation: ResetUserPassword,
          variables: {
            token: this.token,
            newPassword1: this.newPassword1,
            newPassword2: this.newPassword2
          }
        })
        if (res.data.passwordReset.success) {
          const toast = this.$toast
          if (typeof toast === 'function') {
            toast({ type: 'success', message: this.$t('تم تعيين كلمة المرور بنجاح') })
          } else {
            this.$q.notify({ type: 'positive', progress: true, multiLine: true, position: 'top', message: this.$t('تم تعيين كلمة المرور بنجاح') })
          }
          this.$router.push({ name: 'login' })
        } else if (res.data.passwordReset.errors) {
          this.errorHandler(res.data.passwordReset.errors)
        }
      } catch (e) {
        this.apiError = this.$t('تعذر تعيين كلمة المرور. قد يكون الرابط منتهياً.')
      } finally {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.password-reset {
  min-block-size: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-6) var(--ds-space-4);
  background: var(--ds-neutral-50);

  &__card {
    inline-size: 100%;
    max-inline-size: 460px;
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-7) var(--ds-space-6);
    box-shadow: var(--ds-shadow-md);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }

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
    gap: var(--ds-space-4);
  }

  &__strength {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: calc(-1 * var(--ds-space-2));
  }

  &__strength-label {
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-medium);
    font-family: var(--ds-font-heading);

    &.is-weak   { color: var(--ds-danger); }
    &.is-medium { color: var(--ds-warning); }
    &.is-strong { color: var(--ds-brand-600); }
  }
}
</style>
