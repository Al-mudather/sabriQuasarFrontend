<template>
  <div class="user-sidebar">
    <div class="user-sidebar__card">
      <div class="user-sidebar__avatar">
        <img
          v-if="userAvatar"
          class="user-sidebar__avatar-img"
          :src="userAvatar"
          :alt="userName"
        />
        <span v-else class="user-sidebar__avatar-initial">
          {{ (userName || 'u').slice(0, 1) }}
        </span>
      </div>
      <div class="user-sidebar__identity">
        <span class="user-sidebar__name">{{ userName || 'مرحباً' }}</span>
        <span class="user-sidebar__role">{{ userRole }}</span>
      </div>
    </div>

    <hr class="user-sidebar__divider" aria-hidden="true" />

    <nav class="user-sidebar__nav" aria-label="تنقل الحساب">
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="user-sidebar__link"
        :class="{ 'is-active': isActive(link.to) }"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        @click="emit('navigate')"
      >
        <span
          class="user-sidebar__link-icon"
          aria-hidden="true"
          v-html="link.icon"
        />
        <span class="user-sidebar__link-label">{{ link.label }}</span>
      </router-link>
    </nav>

    <hr class="user-sidebar__divider" aria-hidden="true" />

    <button
      type="button"
      class="user-sidebar__logout"
      @click="emit('logout')"
    >
      <span class="user-sidebar__link-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 17l5-5-5-5M20 12H9M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
        </svg>
      </span>
      <span>تسجيل الخروج</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface NavLink { to: string; label: string; icon: string }

defineProps<{
  userName?: string
  userRole?: string
  userAvatar?: string
  navLinks: NavLink[]
  isActive: (to: string) => boolean
}>()

const emit = defineEmits<{
  (e: 'navigate'): void
  (e: 'logout'): void
}>()
</script>

<style lang="scss" scoped>
.user-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  padding: var(--ds-space-4);
  background: var(--ds-cream);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-xs);
}

.user-sidebar__card {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding-block-end: var(--ds-space-1);
}

.user-sidebar__avatar {
  flex: 0 0 auto;
  inline-size: 40px;
  block-size: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ds-cream-sunken);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-indigo);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 16px;
}

.user-sidebar__avatar-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  display: block;
}

.user-sidebar__avatar-initial {
  line-height: 1;
  text-transform: uppercase;
}

.user-sidebar__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 0;
}

.user-sidebar__name {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  color: var(--ds-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-sidebar__role {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: var(--ds-taupe);
}

.user-sidebar__divider {
  border: 0;
  block-size: 1px;
  inline-size: 100%;
  background: var(--ds-cream-sunken);
  margin-block: var(--ds-space-1);
  margin-inline: 0;
}

.user-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-sidebar__link {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: 12px 16px;
  border-radius: var(--ds-radius-sm);
  border-inline-start: 2px solid transparent;
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.85;
  color: var(--ds-ink);
  text-decoration: none;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out);
}

.user-sidebar__link-icon {
  flex: 0 0 auto;
  display: inline-flex;
  color: var(--ds-indigo);
}

.user-sidebar__link-label { flex: 1 1 auto; min-inline-size: 0; }

.user-sidebar__link:hover,
.user-sidebar__link:focus-visible {
  background: var(--ds-cream-sunken);
  color: var(--ds-indigo);
}

.user-sidebar__link.is-active {
  background: var(--ds-cream-sunken);
  color: var(--ds-indigo);
  border-inline-start-color: var(--ds-terracotta);
}

.user-sidebar__logout {
  appearance: none;
  background: transparent;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: 12px 16px;
  border-radius: var(--ds-radius-sm);
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.85;
  color: var(--ds-danger, #B84A3A);
  cursor: pointer;
  text-align: start;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

  .user-sidebar__link-icon { color: var(--ds-danger, #B84A3A); }

  &:hover,
  &:focus-visible {
    background: rgba(184, 74, 58, 0.08);
  }
}
</style>
