<template>
  <AccountHeader :dialogName="$t('إستعادة كلمة المرور')">
    <section class="auth-form">
      <p class="auth-form__lead">
        {{ $t('أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.') }}
      </p>

      <ul v-if="errorMessages.length > 0" class="auth-form__errors" role="alert">
        <li v-for="(m, i) in errorMessages" :key="i">{{ m }}</li>
      </ul>

      <form @submit.prevent="sendEmailConfirmationToTheUser" class="auth-form__fields">
        <q-input
          rounded outlined
          v-model="email"
          type="email"
          :label="$t('الإيميل')"
          autocomplete="email"
        />
        <ds-button
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ $t('إرسال الرابط') }}
        </ds-button>
      </form>
    </section>
  </AccountHeader>
</template>

<script>
import { UserPasswordResetEmail } from 'src/queries/account_management/mutation/UserPasswordResetEmail'
import AccountHeader from 'src/components/utils/accountHeader'

export default {
  name: 'ResetPassword',
  components: { AccountHeader },

  data () {
    return { email: '', visible: false, errorMessages: [] }
  },

  methods: {
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

    async sendEmailConfirmationToTheUser () {
      this.visible = true
      try {
        const res = await this.$apollo.mutate({
          mutation: UserPasswordResetEmail,
          variables: { email: this.email }
        })
        if (res.data.sendPasswordResetEmail.success) {
          this.$router.push({ name: 'password-confirm' })
        }
        if (res.data.sendPasswordResetEmail.errors) this.errorHandler(res.data.sendPasswordResetEmail.errors)
        if (res.errors) this.errorHandler(res.errors)
      } catch (error) {
        if (error.message === 'GraphQL error: [Errno 11001] getaddrinfo failed') {
          this.$q.notify({
            type: 'warning',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تعذر إرسال البريد الإلكتروني، حاول مجددًا')
          })
        }
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

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }
}
</style>
