<template>
  <main class="verify-email">
    <ds-empty-state :title="$t('تم تفعيل حسابك')" size="lg">
      <template #illustration>
        <img src="~assets/img/success.png" alt="" />
      </template>
      <template #description>
        {{ $t('تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول والبدء بالتعلم.') }}
      </template>
      <template #actions>
        <ds-button variant="primary" size="lg" @click="GotToLoginPage">
          {{ $t('دخول') }}
        </ds-button>
      </template>
    </ds-empty-state>
  </main>
</template>

<script>
import { VerifyUserAccount } from 'src/queries/account_management/mutation/VerifyUserAccount'

export default {
  name: 'VerifyEmail',

  methods: {
    GotToLoginPage () { this.$router.push({ name: 'login' }) }
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler (params) {
        this.$apollo.mutate({
          mutation: VerifyUserAccount,
          variables: { token: params.token }
        }).then(res => {
          if (res.data.success) {
            this.$q.notify({
              type: 'positive',
              progress: true,
              multiLine: true,
              position: 'top',
              message: 'Your account has been verified :)'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verify-email {
  min-block-size: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-8) var(--ds-space-4);
}
</style>
