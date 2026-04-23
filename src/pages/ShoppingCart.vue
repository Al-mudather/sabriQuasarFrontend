<template>
  <main class="cart-page">
    <button class="cart-page__close" :aria-label="$t('إغلاق')" @click="closeShoppingCart">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <header class="cart-page__header">
      <h1>{{ $t('الســـلة') }}</h1>
    </header>

    <!-- Progress steps -->
    <nav class="cart-steps" :aria-label="$t('خطوات الدفع')">
      <ol>
        <li
          v-for="(step, i) in steps"
          :key="step.key"
          class="cart-steps__step"
          :class="{
            'cart-steps__step--active': i === activeIndex,
            'cart-steps__step--done':   i < activeIndex
          }"
          :data-cart="step.key"
        >
          <span class="cart-steps__dot">
            <svg v-if="i < activeIndex" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </span>
          <span class="cart-steps__label">{{ step.label }}</span>
        </li>
      </ol>
    </nav>

    <div class="cart-page__body">
      <router-view />
    </div>
  </main>
</template>

<script>
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { CheckoutSubscription } from 'src/queries/notification_management/subscription/CheckoutSubscription'
import { mapActions, mapState } from 'vuex'

const STEP_BY_ROUTE = {
  cart: 0,
  'login-cart': 1,
  'user-info': 1,
  payment: 2,
  'cart-success': 3
}

export default {
  name: 'ShoppingCartPage',

  data () { return { prevRoute: null } },

  apollo: {
    $subscribe: {
      checkoutSubscription: { query: CheckoutSubscription }
    }
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList']),

    steps () {
      return [
        { key: 'cartCourses',    label: this.$t('السلة') },
        { key: 'loginCart',      label: this.$t('الحساب') },
        { key: 'paymentData',    label: this.$t('الدفع') },
        { key: 'successMessage', label: this.$t('تم') }
      ]
    },

    activeIndex () {
      const routeName = this.$route.name
      return STEP_BY_ROUTE[routeName] != null ? STEP_BY_ROUTE[routeName] : 0
    }
  },

  mounted () {
    this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()

    // Legacy event API — keep for backward compat with child components
    // that emit 'activateShoppingProgress' on navigation.
    this.$root.$on('activateShoppingProgress', () => { /* routed-driven now */ })
  },

  beforeDestroy () { this.$root.$off('activateShoppingProgress') },

  beforeRouteEnter (to, from, next) {
    next(vm => { vm.prevRoute = from.fullPath })
  },

  methods: {
    ...mapActions('shoppingCart', ['setShoppinCartDialogAction']),

    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
      try {
        await this.$apollo.query({ query: CheckTheUserPermissionToUsePlatforme })
      } catch (e) {
        if (e.message === 'GraphQL error: PyramidAffiliate matching query does not exist.') {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'You must inter the registeration code'
          })
          this.$router.push({ name: 'registeration-code' })
        }
      }
    },

    closeShoppingCart () { this.$router.push({ name: 'Home' }) }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  position: relative;
  max-inline-size: 1100px;
  margin-inline: auto;
  padding: var(--ds-space-8) var(--ds-space-3) var(--ds-space-16);
  min-block-size: 100vh;

  @media (min-width: 600px) {
    padding-inline: var(--ds-space-4);
  }

  &__close {
    position: absolute;
    inset-block-start: var(--ds-space-4);
    inset-inline-end: var(--ds-space-4);
    inline-size: 2.5rem;
    block-size: 2.5rem;
    border-radius: 50%;
    border: 1px solid var(--ds-border);
    background: var(--ds-surface);
    color: var(--ds-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    svg { inline-size: 1.1rem; block-size: 1.1rem; }
    &:hover { background: var(--ds-surface-muted); }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__header {
    margin-block-end: var(--ds-space-6);
    h1 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }

  &__body {
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-5);
    box-shadow: var(--ds-shadow-xs);
  }
}

.cart-steps {
  margin-block-end: var(--ds-space-6);

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ds-space-2);
    position: relative;

    // The connecting line between dots.
    &::before {
      content: '';
      position: absolute;
      inset-block-start: 1rem;
      inset-inline-start: 12.5%;
      inset-inline-end: 12.5%;
      block-size: 2px;
      background: var(--ds-border);
      z-index: 0;
    }
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-2);
    position: relative;
    z-index: 1;
    text-align: center;
    min-inline-size: 0;
  }

  &__dot {
    inline-size: 2rem;
    block-size: 2rem;
    border-radius: 50%;
    background: var(--ds-surface);
    border: 2px solid var(--ds-border);
    color: var(--ds-text-muted);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-bold);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-variant-numeric: tabular-nums;
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      border-color     var(--ds-duration-fast) var(--ds-ease-out),
      color            var(--ds-duration-fast) var(--ds-ease-out);

    svg { inline-size: 1rem; block-size: 1rem; }
  }

  &__label {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    font-family: var(--ds-font-body);
  }

  &__step--active {
    .cart-steps__dot {
      background: var(--ds-brand-600);
      border-color: var(--ds-brand-600);
      color: var(--ds-text-onBrand);
    }
    .cart-steps__label {
      color: var(--ds-text);
      font-weight: var(--ds-weight-medium);
    }
  }

  &__step--done {
    .cart-steps__dot {
      background: var(--ds-success);
      border-color: var(--ds-success);
      color: var(--ds-text-onBrand);
    }
  }
}
</style>
