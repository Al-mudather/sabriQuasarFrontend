<template>
  <main class="confirm-page">
    <div class="confirm-page__card">
      <ds-empty-state :title="$t('تم إرسال رابط التفعيل')" size="md">
        <template #illustration>
          <img src="~assets/img/success.png" alt="" />
        </template>
        <template #description>
          <span>{{ $t('تم إرسال رابط تفعيل حسابك علي بريدك الالكتروني') }}</span>
          <br />
          <span>{{ $t('اذا لم تقم باستلام الرابط يرجى اعادة ارسال ايميلك مره اخرى') }}</span>
        </template>
        <template #actions>
          <ds-button variant="primary" @click="prompt = true">
            {{ $t('إعادة الإرسال') }}
          </ds-button>
          <ds-button variant="ghost" @click="GoToHomePage">
            {{ $t('العودة إلى الرئيسية') }}
          </ds-button>
        </template>
      </ds-empty-state>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card class="confirm-page__dialog">
        <h3>{{ $t('بريدك الإلكتروني') }}</h3>
        <q-input
          rounded outlined
          type="email"
          v-model="email"
          :label="$t('الإيميل')"
          autofocus
          @keyup.enter="RESEND_USER_EMAIL"
        />
        <div class="confirm-page__dialog-actions">
          <ds-button variant="ghost" @click="prompt = false">
            {{ $t('إلغاء') }}
          </ds-button>
          <ds-button variant="primary" :loading="loader" @click="RESEND_USER_EMAIL">
            {{ $t('إرسال') }}
          </ds-button>
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script>
import { ResendActivationEmail } from 'src/queries/account_management/mutation/ResendActivationEmail'

export default {
  name: 'Confirm',

  data () { return { prompt: false, loader: false, email: '' } },

  methods: {
    GoToHomePage () { this.$router.push({ name: 'Home' }) },

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

    async RESEND_USER_EMAIL () {
      if (!this.email) {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: this.$t('بريدك الإلكتروني مطلوب')
        })
        return
      }
      this.loader = true
      try {
        const result = await this.$apollo.mutate({
          mutation: ResendActivationEmail,
          variables: { email: this.email }
        })
        if (result.data.resendActivationEmail.success) {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: this.$t('تم إرسال البريد بنجاح')
          })
          this.prompt = false
        } else if (result.data.resendActivationEmail.errors) {
          this.errorHandler(result.data.resendActivationEmail.errors)
        }
      } catch (error) {
        if (error && error.errors) this.errorHandler(error.errors)
      } finally {
        this.loader = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-page {
  min-block-size: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-8) var(--ds-space-4);

  &__card {
    inline-size: 100%;
    max-inline-size: 480px;
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-6);
    box-shadow: var(--ds-shadow-md);
  }

  &__dialog {
    inline-size: 100%;
    max-inline-size: 360px;
    padding: var(--ds-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);

    h3 {
      text-align: center;
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-lg);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }

  &__dialog-actions {
    display: flex;
    gap: var(--ds-space-3);
    justify-content: flex-end;
  }
}
</style>
