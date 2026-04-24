<template>
  <main class="account-header">
    <div class="account-header__card">
      <header class="account-header__top">
        <h1>{{ dialogName }}</h1>
        <button
          type="button"
          class="account-header__back"
          :aria-label="$t('رجوع')"
          @click="goBackToThePreviousePage"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </header>

      <div class="account-header__body">
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  dialogName?: string
  prevRoute?: string
}

const props = defineProps<Props>()
const router = useRouter()

function goBackToThePreviousePage (): void {
  if (props.prevRoute && props.prevRoute !== '/account/signUp') {
    router.push(props.prevRoute)
  } else {
    router.push({ name: 'Home' })
  }
}
</script>

<style lang="scss" scoped>
.account-header {
  min-block-size: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-6) var(--ds-space-3);
  background: var(--ds-surface-muted);

  &__card {
    inline-size: 100%;
    max-inline-size: 480px;
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-md);
    overflow: hidden;
  }

  &__top {
    position: relative;
    background: linear-gradient(135deg, var(--ds-brand-700), var(--ds-brand-600));
    color: var(--ds-text-onBrand);
    padding: var(--ds-space-6) var(--ds-space-6) var(--ds-space-5);
    text-align: center;

    h1 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      margin: 0;
    }
  }

  &__back {
    position: absolute;
    inset-block-start: var(--ds-space-4);
    inset-inline-start: var(--ds-space-4);
    inline-size: 2rem;
    block-size: 2rem;
    border-radius: 50%;
    border: 0;
    background: rgba(255, 255, 255, 0.14);
    color: var(--ds-text-onBrand);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    svg { inline-size: 1rem; block-size: 1rem; }
    &:hover { background: rgba(255, 255, 255, 0.24); }
    &:focus-visible { outline: 2px solid white; outline-offset: 2px; }

    // In RTL the back arrow naturally flips because we use the same
    // chevron glyph; keep it centered by mirroring the SVG.
    [dir="rtl"] & svg { transform: scaleX(-1); }
  }

  &__body {
    padding: var(--ds-space-6);
  }
}
</style>
