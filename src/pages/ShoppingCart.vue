<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'ltr'">
    <AppHeader variant="cream" :sticky="true" />

    <q-page-container>
      <!-- Step indicator strip -->
      <section
        class="cart-steps"
        role="navigation"
        :aria-label="$t('خطوات الدفع')"
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
        :aria-label="$t('محتوى السلة')"
      >
        <router-view v-slot="{ Component }">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </q-page-container>

    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import { CheckoutSubscription } from 'src/graphql/notification_management/subscription/CheckoutSubscription'
import type {
  CheckoutSubscriptionResult,
  CheckoutSubscriptionVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'
import { storeToRefs } from 'pinia'
import { useSubscription } from '@vue/apollo-composable'
import { onBeforeRouteUpdate, onBeforeRouteLeave, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

// Route-name → zero-indexed step. Order: cart, login, userInfo, payment, success.
const STEP_BY_ROUTE: Record<string, number> = {
  cart: 0,
  'login-cart': 1,
  'user-info': 2,
  payment: 3,
  'cart-success': 4
}

// Steps that benefit from the two-column (items + summary) layout.
const WIDE_STEPS = new Set(['cart', 'payment'])

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const cart = useCartStore()
const pyramid = usePyramidStore()
const { shoppingCartDataList } = storeToRefs(cart)
const prevRoute = ref<string | null>(null)

// Passive subscription — fires for cache updates, no direct use of result here.
useSubscription<CheckoutSubscriptionResult, CheckoutSubscriptionVars>(CheckoutSubscription)

// Track previous route for back-navigation UX.
onBeforeRouteUpdate((to, from) => { prevRoute.value = from.fullPath })
onBeforeRouteLeave((to, from) => { prevRoute.value = from.fullPath })

const steps = computed(() => [
  { key: 'cart',     label: t('السلة') },
  { key: 'login',    label: t('تسجيل الدخول') },
  { key: 'billing',  label: t('معلومات الفوترة') },
  { key: 'payment',  label: t('الدفع') },
  { key: 'confirm',  label: t('تأكيد') }
])

const activeIndex = computed((): number => {
  const routeName = route.name as string | undefined
  if (routeName != null && STEP_BY_ROUTE[routeName] != null) return STEP_BY_ROUTE[routeName]
  const p = route.path || ''
  if (p.includes('/cart/success'))   return 4
  if (p.includes('/cart/payment'))   return 3
  if (p.includes('/cart/userInfo'))  return 2
  if (p.includes('/cart/loginCart')) return 1
  return 0
})

const isWideStep = computed((): boolean => {
  return WIDE_STEPS.has(route.name as string)
})

// Registration-code gate (payment-side backstop). The global router guard
// already blocks no-code users from reaching the cart, but we re-verify here
// (network-only, via the store) as defense-in-depth at the transactional edge.
async function checkPyramidRegistration (): Promise<void> {
  const ok = await pyramid.verifyPlatformAccess(true)
  if (!ok) {
    $q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'bottom',
      message: t('يرجى إدخال رمز الإحالة الخاص بك أولاً')
    })
    router.push({ name: 'registeration-code', query: { redirect: route.fullPath } })
  }
}

onMounted(() => {
  checkPyramidRegistration()
})
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
