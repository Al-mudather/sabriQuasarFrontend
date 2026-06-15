<template>
  <header
    role="banner"
    class="app-header"
    :class="[
      `app-header--${variant}`,
      { 'app-header--sticky': sticky, 'is-scrolled': isScrolled }
    ]"
  >
    <div class="app-header__inner">
      <!-- Brand lockup (logical start / right in RTL) -->
      <router-link
        to="/"
        class="app-header__brand"
        :aria-label="brandNameAr"
      >
        <span class="app-header__mark">
          <img
            :src="logoSrc"
            :alt="brandNameAr"
            class="app-header__mark-img"
          />
        </span>
        <span class="app-header__wordmark">DSTC</span>
      </router-link>

      <!-- Desktop navigation (logical end / left in RTL) -->
      <nav
        class="app-header__nav"
        :aria-label="$t('التنقل الرئيسي')"
      >
        <ul class="app-header__nav-list">
          <li
            v-for="link in primaryLinks"
            :key="link.to"
            class="app-header__nav-item"
          >
            <router-link
              :to="link.to"
              class="app-header__nav-link"
              :class="{ 'is-active': isActive(link.to) }"
              :aria-current="isActive(link.to) ? 'page' : undefined"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>

        <div class="app-header__lang">
          <LanguageSwitcher variant="light" mode="menu" />
        </div>

        <div v-if="showAuthCtas" class="app-header__auth">
          <router-link
            to="/account/login"
            class="app-header__login"
          >
            {{ $t('تسجيل الدخول') }}
          </router-link>
          <DsButton
            variant="primary"
            size="sm"
            to="/account/signUp"
            :magnetic-enabled="true"
          >
            {{ $t('ابدأ الآن') }}
          </DsButton>
        </div>

        <div v-else-if="showLogout" class="app-header__auth">
          <div class="app-header__account">
          <button
            type="button"
            class="app-header__account-trigger"
            :aria-label="$t('حسابي')"
          >
            <span class="app-header__account-avatar">
              <span v-if="avatarInitial" class="app-header__account-avatar-initial">{{ avatarInitial }}</span>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </span>
            <svg class="app-header__account-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>

            <q-menu
              anchor="bottom end"
              self="top end"
              :offset="[0, 10]"
              class="app-header__account-pop"
            >
              <div class="app-header__account-pop-identity">
                <span class="app-header__account-avatar app-header__account-avatar--lg">
                  <span v-if="avatarInitial" class="app-header__account-avatar-initial">{{ avatarInitial }}</span>
                  <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </span>
                <span class="app-header__account-pop-text">
                  <span class="app-header__account-name">{{ userDisplayName || $t('مرحباً') }}</span>
                  <span class="app-header__account-role">{{ userRoleLabel }}</span>
                </span>
              </div>

              <hr class="app-header__account-divider" />

              <q-list class="app-header__account-pop-list">
                <q-item
                  v-for="link in accountLinks"
                  :key="link.to"
                  v-close-popup
                  clickable
                  :to="link.to"
                  :active="isActive(link.to)"
                  class="app-header__account-pop-item"
                >
                  {{ link.label }}
                </q-item>
              </q-list>
            </q-menu>
          </button>
          </div>

          <DsButton
            variant="secondary"
            size="sm"
            @click="logout"
          >
            {{ $t('تسجيل الخروج') }}
          </DsButton>
        </div>
      </nav>

      <!-- Mobile hamburger (logical end) -->
      <button
        type="button"
        class="app-header__hamburger"
        :aria-expanded="drawerOpen ? 'true' : 'false'"
        aria-controls="app-header-drawer"
        :aria-label="$t('فتح القائمة')"
        @click="drawerOpen = true"
      >
        <span class="app-header__hamburger-bar"></span>
        <span class="app-header__hamburger-bar"></span>
        <span class="app-header__hamburger-bar"></span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <DsModal
      id="app-header-drawer"
      v-model="drawerOpen"
      size="sm"
      :close-label="$t('إغلاق القائمة')"
    >
      <template #header>
        <span class="app-header__drawer-title">{{ $t('القائمة') }}</span>
      </template>

      <!-- Identity strip (authenticated) -->
      <div v-if="isAuthenticated" class="app-header__drawer-identity">
        <span class="app-header__account-avatar app-header__account-avatar--lg">
          <span v-if="avatarInitial" class="app-header__account-avatar-initial">{{ avatarInitial }}</span>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </span>
        <span class="app-header__drawer-identity-text">
          <span class="app-header__account-name">{{ userDisplayName || $t('مرحباً') }}</span>
          <span class="app-header__account-role">{{ userRoleLabel }}</span>
        </span>
      </div>

      <nav
        class="app-header__drawer-nav"
        :aria-label="$t('التنقل الرئيسي')"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="app-header__drawer-link"
          :class="{ 'is-active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          @click="drawerOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Language selector — always available; switch between Arabic & English -->
      <div class="app-header__drawer-lang">
        <span class="app-header__drawer-section-label">{{ $t('اللغة') }}</span>
        <LanguageSwitcher variant="light" />
      </div>

      <template v-if="showAuthCtas || showLogout" #footer>
        <div class="app-header__drawer-footer">
          <template v-if="showAuthCtas">
            <DsButton
              variant="secondary"
              size="md"
              full-width
              to="/account/login"
              @click="drawerOpen = false"
            >
              {{ $t('تسجيل الدخول') }}
            </DsButton>
            <DsButton
              variant="primary"
              size="md"
              full-width
              to="/account/signUp"
              @click="drawerOpen = false"
            >
              {{ $t('ابدأ الآن') }}
            </DsButton>
          </template>
          <DsButton
            v-else
            variant="secondary"
            size="md"
            full-width
            @click="drawerOpen = false; logout()"
          >
            {{ $t('تسجيل الخروج') }}
          </DsButton>
        </div>
      </template>
    </DsModal>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsModal from 'src/design-system/components/DsModal.vue'
import LanguageSwitcher from 'src/components/shared/LanguageSwitcher.vue'
import { LOGO, BRAND } from 'src/design-system/brand'
import { useAuthStore } from 'src/stores/auth'
import { useLogout } from 'src/composables/useLogout'

interface Props {
  variant?: 'cream' | 'transparent'
  sticky?: boolean
  showAuthCta?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'cream',
  sticky: true,
  showAuthCta: true
})

const route = useRoute()
const auth = useAuthStore()
const { isAuthenticated, user } = storeToRefs(auth)
const { logout } = useLogout()

const isScrolled = ref(false)
const drawerOpen = ref(false)

const logoSrc = LOGO.full
const brandNameAr = BRAND.nameAr

// Labels are computed via $t() so they re-render reactively on locale flip.
// The Arabic literal is the i18n key (matches the existing key pattern).
const { t } = useI18n()

// Essential links shown directly in the desktop top bar. Kept to the core few
// so the bar fits on one line in BOTH languages (English labels are wider than
// Arabic) — "My courses" is promoted here as a primary destination once
// authenticated; the rest live behind the avatar dropdown.
const primaryLinks = computed<{ to: string; label: string }[]>(() => {
  const base = [
    { to: '/',        label: t('الرئيسية') },
    { to: '/courses', label: t('الدورات') },
    { to: '/cart/',   label: t('السلة') },
  ]
  if (!isAuthenticated.value) return base
  return [...base, { to: '/myCourses', label: t('دوراتي') }]
})

// Secondary account links live behind the avatar dropdown on desktop (and are
// appended to the drawer on mobile). Promoting all of them to the top bar
// overflowed it to a second line once authenticated.
const accountLinks = computed<{ to: string; label: string }[]>(() => {
  if (!isAuthenticated.value) return []
  return [
    { to: '/Certificates',    label: t('الشهادات') },
    { to: '/notification',    label: t('الإشعارات') },
    { to: '/myOrders',        label: t('طلباتي') },
    { to: '/myMarketingPage', label: t('صفحتي التسويقية') },
    { to: '/profile',         label: t('الملف الشخصي') },
  ]
})

// Drawer (mobile) keeps the full list in one column — it has the vertical room.
const navLinks = computed<{ to: string; label: string }[]>(
  () => [...primaryLinks.value, ...accountLinks.value],
)

const showAuthCtas = computed<boolean>(() => props.showAuthCta && !isAuthenticated.value)
const showLogout = computed<boolean>(() => props.showAuthCta && isAuthenticated.value)

const userDisplayName = computed<string>(() => {
  const u = user.value as Record<string, unknown> | null
  if (!u) return ''
  return (u.fullName as string) || (u.name as string) || (u.username as string) || ''
})

const userRoleLabel = computed<string>(() => {
  const u = user.value as Record<string, unknown> | null
  if (!u) return t('متعلم')
  const role = u.role ?? u.userType
  if (role === 'trainer' || role === 'TRAINER') return t('مدرب')
  if (role === 'admin'   || role === 'ADMIN')   return t('مشرف')
  return t('متعلم')
})

const avatarInitial = computed<string>(() => {
  const name = userDisplayName.value
  return name ? name.trim().charAt(0).toUpperCase() : ''
})

function onScroll (): void {
  isScrolled.value = window.scrollY > 20
}

function isActive (to: string): boolean {
  if (!route) return false
  if (to === '/') return route.path === '/'
  return route.path.indexOf(to) === 0
}

watch(() => route.path, () => {
  drawerOpen.value = false
})

onMounted(() => {
  if (props.sticky && typeof window !== 'undefined') {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<style lang="scss" scoped>
.app-header {
  --header-height: 64px;
  position: relative;
  inset-block-start: 0;
  inset-inline: 0;
  width: 100%;
  z-index: var(--ds-z-sticky);
  background: var(--ds-cream);
  border-block-end: 1px solid transparent;
  transition:
    background-color var(--ds-duration-base) var(--ds-ease-out),
    backdrop-filter  var(--ds-duration-base) var(--ds-ease-out),
    border-color     var(--ds-duration-base) var(--ds-ease-out);

  @media (min-width: 600px) {
    --header-height: 72px;
  }

  &--transparent {
    background: transparent;
  }

  &--sticky {
    position: sticky;
  }

  &.is-scrolled {
    background: rgba(246, 241, 234, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-block-end-color: var(--ds-border);
  }
}

.app-header__inner {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-4);
}

/* ---------- Brand lockup ---------- */
.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  text-decoration: none;
  color: inherit;
}

.app-header__mark {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  background: var(--ds-ivory);
  box-shadow: var(--ds-shadow-xs);
}

.app-header__mark-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.app-header__wordmark {
  display: none;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-bold);
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.12em;
  color: var(--ds-indigo);

  @media (min-width: 600px) {
    display: inline-block;
  }
}

.app-header--transparent:not(.is-scrolled) .app-header__wordmark {
  color: var(--ds-ivory);
}

/* ---------- Desktop nav ---------- */
.app-header__nav {
  display: none;
  align-items: center;
  gap: var(--ds-space-6);

  @media (min-width: 900px) {
    display: flex;
  }
}

.app-header__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(12px, 1.4vw, 22px);
}

.app-header__nav-item {
  display: flex;
}

.app-header__nav-link {
  position: relative;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--ds-ink);
  text-decoration: none;
  padding-block: var(--ds-space-1);
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &::after {
    content: '';
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
    inset-inline-start: auto;
    height: 2px;
    width: 100%;
    background: var(--ds-indigo);
    transform: scaleX(0);
    transform-origin: inset-inline-end;
    transition: transform var(--ds-duration-base) var(--ds-ease-out);
  }

  &:hover,
  &:focus-visible {
    color: var(--ds-indigo);

    &::after {
      transform: scaleX(1);
    }
  }

  &.is-active {
    color: var(--ds-indigo);

    &::after {
      background: var(--ds-terracotta);
      transform: scaleX(1);
    }
  }
}

.app-header--transparent:not(.is-scrolled) .app-header__nav-link {
  color: var(--ds-ivory);

  &:hover,
  &:focus-visible,
  &.is-active {
    color: var(--ds-ivory);
  }

  &::after {
    background: var(--ds-ivory);
  }

  &.is-active::after {
    background: var(--ds-terracotta);
  }
}

/* ---------- Auth ---------- */
.app-header__auth {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
}

.app-header__login {
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  color: var(--ds-taupe);
  text-decoration: none;
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    color: var(--ds-indigo);
  }
}

.app-header--transparent:not(.is-scrolled) .app-header__login {
  color: rgba(251, 247, 240, 0.8);

  &:hover,
  &:focus-visible {
    color: var(--ds-ivory);
  }
}

/* ---------- Account dropdown ---------- */
.app-header__account {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.app-header__account-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 4px 8px 4px 4px;
  background: transparent;
  border: 1px solid var(--ds-border);
  border-radius: 999px;
  color: var(--ds-ink);
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: var(--ds-cream-sunken);
    border-color: var(--ds-border-strong);
    color: var(--ds-indigo);
  }
}

.app-header--transparent:not(.is-scrolled) .app-header__account-trigger {
  color: var(--ds-ivory);
  border-color: var(--ds-border-on-indigo);

  &:hover,
  &:focus-visible {
    background: rgba(251, 247, 240, 0.12);
  }
}

.app-header__account-avatar {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ds-cream-sunken);
  color: var(--ds-indigo);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 14px;
  overflow: hidden;

  &--lg {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

.app-header__account-avatar-initial {
  line-height: 1;
  text-transform: uppercase;
}

.app-header__account-caret {
  transition: transform var(--ds-duration-fast) var(--ds-ease-out);

  &.is-open {
    transform: rotate(180deg);
  }
}

.app-header__account-menu {
  position: absolute;
  inset-block-start: calc(100% + var(--ds-space-2));
  inset-inline-end: 0;
  min-width: 260px;
  padding: var(--ds-space-2);
  background: var(--ds-cream);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
  z-index: calc(var(--ds-z-sticky) + 1);
}

.app-header__account-identity {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-2);
}

.app-header__account-identity-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.app-header__account-name {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 14px;
  line-height: 1.3;
  color: var(--ds-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__account-role {
  font-family: var(--ds-font-body);
  font-size: 12px;
  line-height: 1.4;
  color: var(--ds-taupe);
}

.app-header__account-divider {
  border: 0;
  height: 1px;
  width: 100%;
  background: var(--ds-cream-sunken);
  margin: var(--ds-space-1) 0;
}

.app-header__account-item {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: 10px 12px;
  border-radius: var(--ds-radius-sm);
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  line-height: 1.4;
  color: var(--ds-ink);
  text-decoration: none;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: var(--ds-cream-sunken);
    color: var(--ds-indigo);
  }

  &.is-active {
    background: var(--ds-cream-sunken);
    color: var(--ds-indigo);
  }
}

.app-header__account-item-icon {
  flex: 0 0 auto;
  display: inline-flex;
  color: var(--ds-indigo);
}

.app-header__account-item-label {
  flex: 1 1 auto;
  min-width: 0;
}

/* Menu transition */
.app-header-menu-enter-active,
.app-header-menu-leave-active {
  transition:
    opacity var(--ds-duration-fast) var(--ds-ease-out),
    transform var(--ds-duration-fast) var(--ds-ease-out);
}
.app-header-menu-enter-from,
.app-header-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ---------- Hamburger (mobile) ---------- */
.app-header__hamburger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: var(--ds-space-2);
  background: transparent;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  color: var(--ds-ink);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: rgba(50, 40, 115, 0.06);
    border-color: var(--ds-border-strong);
  }

  @media (min-width: 900px) {
    display: none;
  }
}

.app-header__hamburger-bar {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
}

.app-header--transparent:not(.is-scrolled) .app-header__hamburger {
  color: var(--ds-ivory);
  border-color: var(--ds-border-on-indigo);
}

/* ---------- Drawer ---------- */
.app-header__drawer-title {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: var(--ds-text-lg);
  color: var(--ds-indigo);
}

.app-header__drawer-identity {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3);
  margin-block-end: var(--ds-space-3);
  background: var(--ds-cream-sunken);
  border-radius: var(--ds-radius-md);
}

.app-header__drawer-identity-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.app-header__drawer-section-label {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ds-taupe);
  padding: var(--ds-space-2);
  margin-block-start: var(--ds-space-3);
}

.app-header__drawer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
}

.app-header__drawer-link {
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: var(--ds-text-md);
  line-height: var(--ds-leading-arabic);
  color: var(--ds-ink);
  text-decoration: none;
  padding: var(--ds-space-3) var(--ds-space-2);
  border-radius: var(--ds-radius-sm);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: rgba(50, 40, 115, 0.06);
    color: var(--ds-indigo);
  }

  &.is-active {
    color: var(--ds-indigo);
    background: rgba(193, 98, 60, 0.08);
  }

  &--account {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);

    .app-header__account-item-icon { color: var(--ds-indigo); }
  }
}

.app-header__drawer-footer {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  align-items: stretch;
  inline-size: 100%;
}

.app-header__drawer-lang {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-2);
  margin-block-start: var(--ds-space-3);
  padding-block-start: var(--ds-space-3);
  border-block-start: 1px solid rgba(50, 40, 115, 0.08);

  // Reset the shared section-label's stacking margins so it sits centered
  // on the row opposite the switcher.
  .app-header__drawer-section-label {
    margin-block-start: 0;
    padding: 0;
  }
}
</style>

<style lang="scss">
/* Account dropdown content teleports to <body> via q-menu, so it can't be
   scoped. Everything is namespaced under .app-header__account-pop. */
.app-header__account-pop {
  min-width: 240px;
  padding: var(--ds-space-2);
  background: var(--ds-cream);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
}

.app-header__account-pop-identity {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-2);
}

.app-header__account-pop .app-header__account-avatar {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ds-cream-sunken);
  color: var(--ds-indigo);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 16px;
  overflow: hidden;
}

.app-header__account-pop .app-header__account-avatar-initial {
  line-height: 1;
  text-transform: uppercase;
}

.app-header__account-pop-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.app-header__account-pop .app-header__account-name {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 14px;
  line-height: 1.3;
  color: var(--ds-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__account-pop .app-header__account-role {
  font-family: var(--ds-font-body);
  font-size: 12px;
  line-height: 1.4;
  color: var(--ds-taupe);
}

.app-header__account-pop .app-header__account-divider {
  border: 0;
  height: 1px;
  width: 100%;
  background: var(--ds-cream-sunken);
  margin: var(--ds-space-1) 0;
}

.app-header__account-pop-list {
  padding: 0;
}

.app-header__account-pop-item {
  border-radius: var(--ds-radius-sm);
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  min-height: 40px;
  color: var(--ds-ink);

  &.q-item--active {
    color: var(--ds-indigo);
    background: var(--ds-cream-sunken);
  }

  &--logout {
    color: var(--ds-terracotta);
  }
}
</style>
