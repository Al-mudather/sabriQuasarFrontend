<template>
  <section class="cart-success" aria-label="تم استلام الطلب">
    <div class="cart-success__crest" aria-hidden="true">
      <svg
        viewBox="0 0 64 64"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 33.5 L28 43.5 L47 22" />
      </svg>
    </div>

    <h1 class="cart-success__title">
      {{ $t('تم استلام طلبك') }}
    </h1>

    <p class="cart-success__greeting">
      {{ $t('شكراً لك') }}
      <span v-if="user && user.fullName">{{ user.fullName }}</span>
      <span v-else-if="user && user.firstName && user.lastName">
        {{ user.firstName }} {{ user.lastName }}
      </span>
      <span v-else-if="user && user.username">
        {{ user.username.split('@')[0] }}
      </span>
      — {{ $t('نسعد بانضمامك إلينا.') }}
    </p>

    <p
      v-if="checkoutOrderID"
      class="cart-success__order"
    >
      {{ $t('رقم الطلب') }}:
      <span class="cart-success__order-number">#{{ checkoutOrderID }}</span>
    </p>

    <div class="cart-success__body">
      <p>
        {{ $t('إذا دفعت بإرفاق إشعار بنكي، يمكنك متابعة حالة طلبك من') }}
        <router-link :to="{ name: 'my-orders' }" class="cart-success__link">
          {{ $t('صفحة طلباتي') }}
        </router-link>.
      </p>
      <p>
        {{ $t('إذا كان الدفع مباشراً، ستجد دوراتك جاهزة في') }}
        <router-link :to="{ name: 'my-courses' }" class="cart-success__link">
          {{ $t('لوحتك التعليمية') }}
        </router-link>.
      </p>
    </div>

    <div class="cart-success__actions">
      <DsButton
        variant="accent"
        size="lg"
        @click="$router.push({ name: 'my-courses' })"
      >
        {{ $t('ابدأ التعلم الآن') }}
      </DsButton>
      <DsButton
        variant="secondary"
        size="lg"
        @click="$router.push({ name: 'courses' })"
      >
        {{ $t('عودة إلى الدورات') }}
      </DsButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { GetMyNotifications } from 'src/graphql/notification_management/query/MyNotifications'
import type {
  GetMyNotificationsResult,
  GetMyNotificationsVars,
} from 'src/types/cart/types'
import { useCartStore } from 'src/stores/cart'
import { useAuthStore } from 'src/stores/auth'

const cart = useCartStore()
const auth = useAuthStore()
const { checkoutOrderID } = storeToRefs(cart)
const { user } = storeToRefs(auth)

const { result, onResult } = useQuery<GetMyNotificationsResult, GetMyNotificationsVars>(
  GetMyNotifications,
  () => ({
    orderBy: ['-id'],
    type: 'CHECKOUT_DONE',
    extraData: `<Order ${checkoutOrderID.value}>`
  }),
  { errorPolicy: 'all' }
)

onResult((r) => {
  if (r.data?.myNotifications?.edges?.[0]?.node?.title === 'CHECKOUT_SUCCESS') {
    cart.deleteCart()
  }
})

const myNotifications = computed(() => result.value?.myNotifications ?? null)
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

  &__crest {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 50%;
    background: var(--ds-indigo, #322873);
    color: var(--ds-cream, #f6f1ea);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-block-end: var(--ds-space-2);
    box-shadow: 0 12px 32px rgba(50, 40, 115, 0.18);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, #1b1410);
  }

  &__greeting {
    margin: 0;
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: 1.7;

    span {
      color: var(--ds-indigo, #322873);
      font-weight: var(--ds-weight-semibold);
      margin-inline: 0.25ch;
    }
  }

  &__order {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__order-number {
    color: var(--ds-indigo, #322873);
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    margin-inline-start: 0.5ch;
    letter-spacing: 0.02em;
  }

  &__body {
    max-width: 34rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);

    p {
      margin: 0;
      font-size: var(--ds-text-sm);
      color: var(--ds-text-muted);
      line-height: 1.8;
    }
  }

  &__link {
    color: var(--ds-indigo, #322873);
    text-decoration: none;
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
