<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
    <AppHeader variant="cream" :sticky="true" />

    <q-page-container>
      <!-- Step indicator strip -->
      <section
        class="cart-steps"
        role="navigation"
        aria-label="خطوات الدفع"
      >
        <div class="cart-steps__inner">
          <ol class="cart-steps__list">
            <li
              v-for="(step, i) in steps"
              :key="step.key"
              class="cart-steps__item"
              :class="[
                { 'is-active':    i === activeIndex },
                { 'is-completed': i <  activeIndex },
                { 'is-pending':   i >  activeIndex }
              ]"
            >
              <span class="cart-steps__dot" aria-hidden="true">
                <svg
                  v-if="i < activeIndex"
                  viewBox="0 0 24 24"
                  width="14" height="14"
                  fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                >
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </span>
              <span class="cart-steps__label">{{ step.label }}</span>
              <span
                v-if="i < steps.length - 1"
                class="cart-steps__line"
                :class="{ 'is-filled': i < activeIndex }"
                aria-hidden="true"
              />
            </li>
          </ol>
        </div>
      </section>

      <main
        class="cart-shell"
        :class="{ 'cart-shell--wide': isWideStep }"
        role="main"
        aria-label="محتوى السلة"
      >
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <router-view />
        </transition>
      </main>
    </q-page-container>

    <AppFooter />
  </q-layout>
</template>

<script>
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { CheckoutSubscription } from 'src/queries/notification_management/subscription/CheckoutSubscription'
import { mapActions, mapState } from 'vuex'

// Route-name → zero-indexed step. Order: cart, login, userInfo, payment, success.
const STEP_BY_ROUTE = {
  cart: 0,
  'login-cart': 1,
  'user-info': 2,
  payment: 3,
  'cart-success': 4
}

// Steps that benefit from the two-column (items + summary) layout.
const WIDE_STEPS = new Set(['cart', 'payment'])

export default {
  name: 'ShoppingCartLayout',

  components: { AppHeader, AppFooter },

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
        { key: 'cart',     label: 'السلة' },
        { key: 'login',    label: 'تسجيل الدخول' },
        { key: 'billing',  label: 'معلومات الفوترة' },
        { key: 'payment',  label: 'الدفع' },
        { key: 'confirm',  label: 'تأكيد' }
      ]
    },

    activeIndex () {
      const routeName = this.$route.name
      if (STEP_BY_ROUTE[routeName] != null) return STEP_BY_ROUTE[routeName]
      const p = this.$route.path || ''
      if (p.indexOf('/cart/success')   !== -1) return 4
      if (p.indexOf('/cart/payment')   !== -1) return 3
      if (p.indexOf('/cart/userInfo')  !== -1) return 2
      if (p.indexOf('/cart/loginCart') !== -1) return 1
      return 0
    },

    isWideStep () {
      return WIDE_STEPS.has(this.$route.name)
    }
  },

  mounted () {
    this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
    this.$root.$on('activateShoppingProgress', () => { /* no-op */ })
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
    }
  }
}
</script>

<style lang="scss" scoped>
/* ---------- Step indicator strip ---------- */
.cart-steps {
  background: var(--ds-cream);
  border-block-end: 1px solid var(--ds-border);
  padding-block: clamp(1.25rem, 3vw, 2rem);
}

.cart-steps__inner {
  max-width: 720px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.cart-steps__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--ds-space-1);
}

.cart-steps__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-2);
  min-width: 0;
  text-align: center;
}

.cart-steps__dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ds-cream);
  border: 2px solid var(--ds-taupe);
  color: var(--ds-taupe);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 13px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition:
    background-color var(--ds-duration-base) var(--ds-ease-out),
    border-color     var(--ds-duration-base) var(--ds-ease-out),
    color            var(--ds-duration-base) var(--ds-ease-out);
}

.cart-steps__label {
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 11px;
  line-height: 1.85;
  color: var(--ds-taupe);

  @media (min-width: 600px) {
    font-size: 12px;
  }
}

.cart-steps__line {
  position: absolute;
  inset-block-start: 15px;
  inset-inline-start: 50%;
  width: 100%;
  height: 2px;
  background: var(--ds-taupe);
  opacity: 0.35;
  z-index: 0;
  transition:
    background-color var(--ds-duration-base) var(--ds-ease-out),
    opacity          var(--ds-duration-base) var(--ds-ease-out);

  &.is-filled {
    background: var(--ds-indigo);
    opacity: 1;
  }
}

.cart-steps__dot { position: relative; z-index: 1; }

.cart-steps__item.is-active {
  .cart-steps__dot {
    background: var(--ds-indigo);
    border-color: var(--ds-indigo);
    color: var(--ds-cream);
  }
  .cart-steps__label {
    color: var(--ds-ink);
    font-weight: var(--ds-weight-semibold);
  }
}

.cart-steps__item.is-completed {
  .cart-steps__dot {
    background: var(--ds-cream);
    border-color: var(--ds-indigo);
    color: var(--ds-indigo);
  }
  .cart-steps__label {
    color: var(--ds-indigo);
  }
}

/* ---------- Main content shell ---------- */
.cart-shell {
  max-width: 720px;
  margin-inline: auto;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem);
  line-height: 1.85;

  &--wide {
    max-width: 1100px;
  }
}
</style>
