<template>
  <section class="pwd-reset">
    <header class="pwd-reset__head">
      <h2>{{ $t('تعيين كلمة مرور جديدة') }}</h2>
    </header>

    <ul v-if="errorMessages.length > 0" class="pwd-reset__errors" role="alert">
      <li v-for="(m, i) in errorMessages" :key="i">{{ m }}</li>
    </ul>

    <form @submit.prevent="UpdateUserPassowrd" class="pwd-reset__form">
      <div class="pwd-reset__grid">
        <q-input
          rounded outlined
          v-model="oldPassword"
          type="password"
          :label="$t('كلمة المرور القديمة')"
        />
        <q-input
          rounded outlined
          v-model="newPassword1"
          type="password"
          :label="$t('كلمة المرور الجديدة')"
        />
      </div>
      <q-input
        rounded outlined
        v-model="newPassword2"
        type="password"
        :label="$t('تأكيد كلمة المرور الجديدة')"
      />
      <div class="pwd-reset__actions">
        <ds-button type="submit" variant="primary" :loading="visible">
          {{ $t('تعيين') }}
        </ds-button>
      </div>
    </form>
  </section>
</template>

<script>
import { ChangeUserPassword } from 'src/queries/account_management/mutation/ChangeUserPassword'
import { tokenStorage } from 'src/localStorageService'

export default {
  name: 'PasswordResetProfile',

  data () {
    return {
      visible: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errorMessages: []
    }
  },

  methods: {
    errorHandler (errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) this.errorMessages.push(val.message)
      }
    },

    resetFields () {
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
    },

    async UpdateUserPassowrd () {
      if (!this.oldPassword) return
      if (this.newPassword1 !== this.newPassword2) {
        this.errorMessages = ['passwords are not the same']
        return
      }
      this.errorMessages = []
      this.visible = true
      try {
        const result = await this.$apollo.mutate({
          mutation: ChangeUserPassword,
          variables: {
            oldPassword: this.oldPassword,
            newPassword1: this.newPassword1,
            newPassword2: this.newPassword2
          }
        })
        if (result.data.passwordChange.success) {
          this.resetFields()
          tokenStorage.setToken({
            token: result.data.passwordChange.token,
            refresh: result.data.passwordChange.refreshToken
          })
          this.$q.notify({
            type: 'positive',
            multiLine: true,
            progress: true,
            message: 'Password was changed successfully'
          })
        } else if (result.data.passwordChange.errors) {
          this.errorHandler(result.data.passwordChange.errors)
        }
      } catch (e) { /* apolloProvider surfaces */ }
      finally { this.visible = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.pwd-reset {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__errors {
    list-style: none;
    margin: 0;
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
    gap: var(--ds-space-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-3);
    @media (min-width: 600px) { grid-template-columns: 1fr 1fr; }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
