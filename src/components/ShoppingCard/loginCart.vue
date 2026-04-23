<template>
  <section class="login-cart">
    <template v-if="!token">
      <DsCard class="login-cart__card">
        <div class="login-cart__content">
          <q-icon name="lock_outline" size="2.5rem" class="login-cart__icon" />
          <h2 class="login-cart__title">{{ $t('سجل دخولك لمتابعة الشراء') }}</h2>
          <p class="login-cart__desc">
            {{ $t('تحتاج إلى تسجيل الدخول أو إنشاء حساب قبل إتمام عملية الشراء') }}
          </p>

          <div class="login-cart__actions">
            <DsButton
              variant="primary"
              size="lg"
              full-width
              @click.native="GoToLoginPage"
            >
              {{ $t('دخول') }}
            </DsButton>
            <DsButton
              variant="secondary"
              size="lg"
              full-width
              @click.native="GoToSignUpPage"
            >
              {{ $t('إنشـاء حســاب') }}
            </DsButton>
          </div>
        </div>
      </DsCard>
    </template>

    <template v-else>
      <DsCard class="login-cart__card">
        <div class="login-cart__content">
          <q-icon name="check_circle_outline" size="2.5rem" class="login-cart__icon login-cart__icon--success" />
          <h2 class="login-cart__title">{{ $t('أنت مسجل الدخول') }}</h2>
          <p class="login-cart__desc">{{ $t('يمكنك الآن متابعة عملية الشراء') }}</p>
          <DsButton
            variant="primary"
            size="lg"
            full-width
            @click.native="GoToPaymentCartPage"
          >
            {{ $t('متابعة') }}
          </DsButton>
        </div>
      </DsCard>
    </template>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'loginCartpage',

  data () {
    return {
      checked: false,
      lodash: this.$_
    }
  },

  computed: {
    ...mapState('authentication', ['user', 'token'])
  },

  mounted () {
    this.$root.$emit('activateShoppingProgress', 'loginCart')
    if (this.token) {
      this.$router.push({ name: 'user-info' })
    }
  },

  methods: {
    GoToLoginPage () {
      this.$router.push({
        name: 'login',
        query: { redirect: '/cart' }
      })
    },

    GoToSignUpPage () {
      this.$router.push({
        name: 'signUp',
        query: { redirect: '/cart' }
      })
    },

    GoToPaymentCartPage () {
      if (!this.$_.isEmpty(this.user)) {
        this.$router.push({ name: 'payment' })
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
    max-width: 28rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-4);
    padding: var(--ds-space-4) var(--ds-space-2);
    text-align: center;
  }

  &__icon {
    color: var(--ds-brand-600);

    &--success { color: var(--ds-success); }
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
  }

  &__desc {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    width: 100%;
    margin-block-start: var(--ds-space-2);
  }
}
</style>
