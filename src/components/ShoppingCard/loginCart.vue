<template>
  <section class="login-cart" aria-label="تسجيل الدخول للمتابعة">
    <DsCard v-if="!token" class="login-cart__card" padding="lg">
      <div class="login-cart__content">
        <div class="login-cart__crest" aria-hidden="true">
          <q-icon name="lock_outline" size="1.75rem" />
        </div>

        <h2 class="login-cart__title">
          {{ $t('أكمل خطوة واحدة قبل المتابعة') }}
        </h2>
        <p class="login-cart__desc">
          {{ $t('سجل دخولك أو أنشئ حساباً جديداً لحفظ دوراتك ومتابعة طلبك بأمان.') }}
        </p>

        <div class="login-cart__actions">
          <DsButton
            variant="accent"
            size="lg"
            full-width
            @click="GoToLoginPage"
          >
            {{ $t('لديّ حساب — تسجيل الدخول') }}
          </DsButton>

          <DsButton
            variant="secondary"
            size="lg"
            full-width
            @click="GoToSignUpPage"
          >
            {{ $t('إنشاء حساب جديد') }}
          </DsButton>
        </div>

        <p class="login-cart__meta">
          {{ $t('بالمتابعة فإنك توافق على') }}
          <router-link :to="{ name: 'terms-and-conditions' }" class="login-cart__link">
            {{ $t('الشروط والأحكام') }}
          </router-link>
          {{ $t('و') }}
          <router-link :to="{ name: 'privacy-policy' }" class="login-cart__link">
            {{ $t('سياسة الخصوصية') }}
          </router-link>
          .
        </p>
      </div>
    </DsCard>

    <DsCard v-else class="login-cart__card" padding="lg">
      <div class="login-cart__content">
        <div class="login-cart__crest login-cart__crest--ok" aria-hidden="true">
          <q-icon name="check" size="1.75rem" />
        </div>
        <h2 class="login-cart__title">{{ $t('أنت مسجل الدخول') }}</h2>
        <p class="login-cart__desc">{{ $t('يمكنك الآن متابعة عملية الشراء.') }}</p>
        <DsButton
          variant="accent"
          size="lg"
          full-width
          @click="GoToPaymentCartPage"
        >
          {{ $t('متابعة') }}
        </DsButton>
      </div>
    </DsCard>
  </section>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'

export default {
  name: 'loginCartpage',

  setup () {
    const auth = useAuthStore()
    const { user, token } = storeToRefs(auth)
    return { auth, user, token }
  },

  data () {
    return {
      lodash: this.$_
    }
  },

  mounted () {
    if (this.token) {
      this.$router.push({ name: 'user-info' })
    }
  },

  methods: {
    GoToLoginPage () {
      this.$router.push({
        name: 'login',
        query: { redirect: '/cart/userInfo' }
      })
    },

    GoToSignUpPage () {
      this.$router.push({
        name: 'signUp',
        query: { redirect: '/cart/userInfo' }
      })
    },

    GoToPaymentCartPage () {
      if (!this.$_.isEmpty(this.user)) {
        this.$router.push({ name: 'user-info' })
      } else {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'يجب تسجيل الدخول اولا'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-cart {
  display: flex;
  justify-content: center;

  &__card {
    width: 100%;
    max-width: 30rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-4);
    text-align: center;
  }

  &__crest {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--ds-cream, #f6f1ea);
    color: var(--ds-indigo, #322873);
    border: 1px solid var(--ds-indigo, #322873);

    &--ok {
      background: var(--ds-indigo, #322873);
      color: var(--ds-cream, #f6f1ea);
      border-color: var(--ds-indigo, #322873);
    }
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    line-height: 1.3;
    color: var(--ds-text);
  }

  &__desc {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    width: 100%;
    margin-block-start: var(--ds-space-2);
  }

  &__meta {
    margin: 0;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    line-height: 1.6;
  }

  &__link {
    color: var(--ds-indigo, #322873);
    text-decoration: none;
    font-weight: var(--ds-weight-medium);

    &:hover { text-decoration: underline; }
  }
}
</style>
