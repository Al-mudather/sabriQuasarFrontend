<template>
  <main class="password-reset">
    <div class="password-reset__card">
      <h1 class="password-reset__title">{{ $t('تعيين كلمــة مـرور') }}</h1>

      <ul v-if="errorMessages.length > 0" class="password-reset__errors" role="alert">
        <li v-for="(m, i) in errorMessages" :key="i">{{ m }}</li>
      </ul>

      <form @submit.prevent="ResetTheUserPassword" class="password-reset__form">
        <q-input
          rounded outlined
          v-model="newPassword1"
          type="password"
          :label="$t('كلمة المرور')"
        />
        <q-input
          rounded outlined
          v-model="newPassword2"
          type="password"
          :label="$t('إعادة كلمة المرور')"
        />
        <ds-button type="submit" variant="primary" size="lg" full-width>
          {{ $t('تعيين كلمة المرور') }}
        </ds-button>
      </form>
    </div>
  </main>
</template>

<script>
import { ResetUserPassword } from 'src/queries/account_management/mutation/ResetUserPassword'

export default {
  name: 'PasswordResetForm',

  data () {
    return {
      newPassword1: '',
      newPassword2: '',
      token: '',
      errorMessages: []
    }
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler (params) { this.token = params.token }
    }
  },

  methods: {
    errorHandler (errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message)
        }
      }
    },

    async ResetTheUserPassword () {
      if (this.newPassword1 !== this.newPassword2) {
        this.errorMessages = ['كلمتا المرور غير متطابقتين']
        return
      }
      this.errorMessages = []
      const res = await this.$apollo.mutate({
        mutation: ResetUserPassword,
        variables: {
          token: this.token,
          newPassword1: this.newPassword1,
          newPassword2: this.newPassword2
        }
      })
      if (res.data.passwordReset.success) {
        this.$router.push({ name: 'login' })
      } else if (res.data.passwordReset.errors) {
        this.errorHandler(res.data.passwordReset.errors)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.password-reset {
  min-block-size: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-8) var(--ds-space-4);

  &__card {
    inline-size: 100%;
    max-inline-size: 420px;
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-6);
    box-shadow: var(--ds-shadow-md);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-5);
    text-align: center;
  }

  &__errors {
    list-style: none;
    margin: 0 0 var(--ds-space-4);
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-danger-bg);
    color: var(--ds-danger);
    border-radius: var(--ds-radius-md);
    font-size: var(--ds-text-sm);
    li + li { margin-block-start: var(--ds-space-1); }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }
}
</style>
