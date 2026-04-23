<template>
  <section class="cart-success">
    <div class="cart-success__art">
      <q-icon name="check_circle" size="4rem" class="cart-success__icon" />
    </div>

    <h2 class="cart-success__greeting">
      {{ $t('شكرا لك') }}
      <span v-if="user && !$_.isEmpty(user.fullName)">{{ user.fullName }}</span>
      <span v-else-if="user && !$_.isEmpty(user.firstName) && !$_.isEmpty(user.lastName)">
        {{ user.firstName }} {{ user.lastName }}
      </span>
      <span v-else-if="user && user.username">{{ user.username.split('@')[0] }}</span>
    </h2>

    <p class="cart-success__title">{{ $t('تهانينا لك') }}</p>

    <div class="cart-success__links">
      <p class="cart-success__line" @click="GO_TO_MY_ORDERS_page">
        {{ $t('يمكنك متابعة حالة طلباتك في حالة الدفع عن طريق الأشعار من') }}
        <span class="cart-success__link">{{ $t('صفحة طلباتي') }}</span>
      </p>
      <p class="cart-success__line" @click="GO_TO_MY_COURSES_page">
        {{ $t('او الذهاب الى لوحتك التعليميه في حالة الدفع المباشر لتبدأ التعلم فورا') }}
        <span class="cart-success__link">{{ $t('لوحتك التعليمية') }}</span>
      </p>
    </div>

    <div class="cart-success__actions">
      <DsButton variant="primary" size="lg" @click.native="GO_TO_MY_COURSES_page">
        {{ $t('لوحتك التعليمية') }}
      </DsButton>
      <DsButton variant="secondary" size="lg" @click.native="GO_TO_MY_ORDERS_page">
        {{ $t('صفحة طلباتي') }}
      </DsButton>
    </div>
  </section>
</template>

<script>
import { GetMyNotifications } from 'src/queries/notification_management/query/MyNotifications'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'successCartpage',

  apollo: {
    myNotifications: {
      query () {
        return GetMyNotifications
      },

      variables () {
        return {
          orderBy: ['-id'],
          type: 'CHECKOUT_DONE',
          extraData: `<Order ${this.checkoutOrderID}>`
        }
      },

      result (result) {
        try {
          if (result.data.myNotifications.edges[0].node.title === 'CHECKOUT_SUCCESS') {
            this.deleteShoppinCartDataListAction()
          }
        } catch {
          // silent
        }
      }
    }
  },

  computed: {
    ...mapState('shoppingCart', ['checkoutOrderID']),
    ...mapState('authentication', ['user'])
  },

  methods: {
    ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction']),

    GO_TO_MY_COURSES_page () {
      this.$router.push({ name: 'my-courses' })
    },

    GO_TO_MY_ORDERS_page () {
      this.$router.push({ name: 'my-orders' })
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-4);
  padding: var(--ds-space-6) var(--ds-space-4);
  text-align: center;
  color: var(--ds-text);

  &__art {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: var(--ds-success-bg);
    margin-block-end: var(--ds-space-2);
  }

  &__icon { color: var(--ds-success); }

  &__greeting {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);

    span {
      color: var(--ds-brand-700);
      margin-inline-start: var(--ds-space-2);
    }
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-success);
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    max-width: 36rem;
  }

  &__line {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: 1.6;
    cursor: pointer;
  }

  &__link {
    color: var(--ds-brand-600);
    font-weight: var(--ds-weight-medium);

    &:hover { text-decoration: underline; }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-3);
    justify-content: center;
    margin-block-start: var(--ds-space-4);
  }
}
</style>
