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
        <span class="app-header__wordmark">
          <span class="app-header__wordmark-line1">مركز د. صبري</span>
          <span class="app-header__wordmark-line2">أبوقرون للتدريب</span>
        </span>
      </router-link>

      <!-- Desktop navigation (logical end / left in RTL) -->
      <nav
        class="app-header__nav"
        aria-label="التنقل الرئيسي"
      >
        <ul class="app-header__nav-list">
          <li
            v-for="link in navLinks"
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

        <div v-if="showAuthCtas" class="app-header__auth">
          <router-link
            to="/account/login"
            class="app-header__login"
          >
            تسجيل الدخول
          </router-link>
          <DsButton
            variant="primary"
            size="sm"
            tag="a"
            href="/account/signUp"
            :magnetic-enabled="true"
          >
            ابدأ الآن
          </DsButton>
        </div>
      </nav>

      <!-- Mobile hamburger (logical end) -->
      <button
        type="button"
        class="app-header__hamburger"
        :aria-expanded="drawerOpen ? 'true' : 'false'"
        aria-controls="app-header-drawer"
        aria-label="فتح القائمة"
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
      :close-label="'إغلاق القائمة'"
    >
      <template #header>
        <span class="app-header__drawer-title">القائمة</span>
      </template>
      <nav
        class="app-header__drawer-nav"
        aria-label="التنقل الرئيسي"
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
      <template v-if="showAuthCtas" #footer>
        <div class="app-header__drawer-footer">
          <router-link
            to="/account/login"
            class="app-header__login"
            @click="drawerOpen = false"
          >
            تسجيل الدخول
          </router-link>
          <DsButton
            variant="primary"
            size="md"
            full-width
            tag="a"
            href="/account/signUp"
          >
            ابدأ الآن
          </DsButton>
        </div>
      </template>
    </DsModal>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsModal from 'src/design-system/components/DsModal.vue'
import { LOGO, BRAND } from 'src/design-system/brand'
import { useAuthStore } from 'src/stores/auth'

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
const { isAuthenticated } = storeToRefs(auth)

const isScrolled = ref(false)
const drawerOpen = ref(false)

const logoSrc = LOGO.full
const brandNameAr = BRAND.nameAr

const navLinks = computed<{ to: string; label: string }[]>(() => {
  const links = [
    { to: '/',        label: 'الرئيسية' },
    { to: '/courses', label: 'الدورات' },
    { to: '/cart/',   label: 'السلة' }
  ]
  if (isAuthenticated.value) {
    links.push({ to: '/myCourses', label: 'دوراتي' })
  }
  return links
})

const showAuthCtas = computed<boolean>(() => props.showAuthCta && !isAuthenticated.value)

function onScroll (): void {
  isScrolled.value = window.scrollY > 20
}

function isActive (to: string): boolean {
  if (!route) return false
  if (to === '/') return route.path === '/'
  return route.path.indexOf(to) === 0
}

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
  flex-direction: column;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 14px;
  line-height: 1.15;
  color: var(--ds-indigo);

  @media (min-width: 600px) {
    display: flex;
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
  align-items: center;
  gap: 32px;
}

.app-header__nav-item {
  display: flex;
}

.app-header__nav-link {
  position: relative;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 15px;
  line-height: 1.4;
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
  border-inline-end: 3px solid transparent;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: rgba(50, 40, 115, 0.06);
    color: var(--ds-indigo);
  }

  &.is-active {
    color: var(--ds-indigo);
    border-inline-end-color: var(--ds-terracotta);
    background: rgba(193, 98, 60, 0.06);
  }
}

.app-header__drawer-footer {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  align-items: stretch;
}
</style>
