<template>
  <section class="navv user-nav">
    <div class="user-nav__inner">
      <button
        type="button"
        class="user-nav__menu-btn"
        @click="changeMenuState"
        :aria-label="$t('القائمة')"
      >
        <q-icon name="menu" size="24px" />
      </button>

      <div class="user-nav__user" v-if="user?.firstName">
        <q-icon name="person" size="22px" class="user-nav__user-icon" />
        <h3 class="user-nav__user-name">
          {{ user?.firstName }}
          {{ user?.lastName }}
        </h3>
      </div>
      <div class="user-nav__user" v-else-if="(user as Record<string, unknown>)?.username">
        <q-icon name="person" size="22px" class="user-nav__user-icon" />
        <h3 class="user-nav__user-name">
          {{ (user as Record<string, unknown>)?.username }}
        </h3>
      </div>
      <div class="user-nav__user heading" v-else>
        {{ user?.email }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'

const auth = useAuthStore()
const settings = useSettingsStore()
const { user } = storeToRefs(auth)

function changeMenuState (): void {
  settings.setOpenMenu(true)
}
</script>

<style lang="scss" scoped>
.user-nav {
  background-color: var(--ds-surface);
  border-block-end: 1px solid var(--ds-border);
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-4);

  &__inner {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
    max-width: 1400px;
    margin-inline: auto;
  }

  &__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    color: var(--ds-brand-700);
    border-radius: var(--ds-radius-pill);
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: var(--ds-surface-muted);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__user {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
  }

  &__user-icon {
    color: var(--ds-brand-600);
  }

  &__user-name {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
  }
}

.heading {
  font-size: var(--ds-text-xl);
  font-family: var(--ds-font-body);
  color: var(--ds-text-muted);
}
</style>
