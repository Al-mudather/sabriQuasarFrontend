<template>
  <main class="verify-email" dir="rtl">
    <div class="verify-email__card">
      <template v-if="state === 'loading'">
        <ds-skeleton type="circle" width="64px" height="64px" />
        <ds-skeleton width="60%" height="28px" style="margin-block-start: 1rem;" />
        <ds-skeleton width="80%" height="16px" style="margin-block-start: 0.5rem;" />
        <ds-skeleton width="40%" height="16px" style="margin-block-start: 0.5rem;" />
      </template>

      <template v-else-if="state === 'success'">
        <div class="verify-email__icon verify-email__icon--ok" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 24l10 10 22-22" />
          </svg>
        </div>
        <h1 class="verify-email__title">{{ $t('تم التحقق من بريدك') }}</h1>
        <p class="verify-email__subtitle">{{ $t('جارٍ التحويل...') }}</p>
        <ds-button variant="accent" size="lg" full-width @click="goLogin">
          {{ $t('متابعة إلى تسجيل الدخول') }}
        </ds-button>
      </template>

      <template v-else>
        <ds-empty-state
          variant="error"
          :title="$t('تعذر التحقق من البريد')"
          size="md"
        >
          <template #description>
            <span>{{ $t('قد يكون الرابط منتهي الصلاحية أو سبق استخدامه. أعد إرسال رسالة التفعيل وحاول مجدداً.') }}</span>
          </template>
          <template #actions>
            <ds-button variant="accent" size="md" @click="goConfirm">
              {{ $t('إعادة إرسال رابط التفعيل') }}
            </ds-button>
            <ds-button variant="ghost" size="md" @click="goLogin">
              {{ $t('العودة إلى تسجيل الدخول') }}
            </ds-button>
          </template>
        </ds-empty-state>
      </template>
    </div>
  </main>
</template>

<script>
import { VerifyUserAccount } from 'src/queries/account_management/mutation/VerifyUserAccount'

export default {
  name: 'VerifyEmail',

  data () { return { state: 'loading' } },

  methods: {
    goLogin ()   { this.$router.push({ name: 'login' }) },
    goConfirm () { this.$router.push({ name: 'password-confirm' }) },

    async verify (token) {
      this.state = 'loading'
      try {
        const res = await this.$apollo.mutate({
          mutation: VerifyUserAccount,
          variables: { token }
        })
        const ok = (res && res.data && (res.data.success || (res.data.verifyAccount && res.data.verifyAccount.success)))
        if (ok) {
          this.state = 'success'
          setTimeout(() => { this.$router.push({ name: 'login' }) }, 1800)
        } else {
          this.state = 'error'
        }
      } catch (e) {
        this.state = 'error'
      }
    }
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler (params) {
        if (params && params.token) this.verify(params.token)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verify-email {
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
    gap: var(--ds-space-4);
    align-items: flex-start;
    text-align: start;
  }

  &__icon {
    inline-size: 64px;
    block-size: 64px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &--ok {
      background: var(--ds-brand-50);
      color: var(--ds-brand-600);
    }
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
    margin: 0;
  }

  &__subtitle {
    font-size: var(--ds-text-md);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-arabic);
  }
}
</style>
