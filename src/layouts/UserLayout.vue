<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'ltr'">
    <AppHeader variant="cream" :sticky="true" />

    <q-page-container>
      <div class="user-layout">
        <!-- Mobile drawer trigger -->
        <button
          type="button"
          class="user-layout__drawer-trigger"
          :aria-expanded="drawerOpen ? 'true' : 'false'"
          aria-controls="user-layout-drawer"
          :aria-label="$t('فتح قائمة الحساب')"
          @click="drawerOpen = true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{{ $t('حسابي') }}</span>
        </button>

        <div class="user-layout__grid">
          <!-- Sidebar (desktop) -->
          <aside
            class="user-layout__sidebar"
            role="complementary"
            :aria-label="$t('قائمة الحساب')"
          >
            <UserSidebar
              :user-name="userDisplayName"
              :user-role="userRoleLabel"
              :user-avatar="userAvatar"
              :nav-links="navLinks"
              :is-active="isActive"
              @logout="logOut"
            />
          </aside>

          <!-- Main content -->
          <main
            class="user-layout__main"
            role="main"
            :aria-label="$t('محتوى الحساب')"
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
        </div>

        <!-- Mobile drawer -->
        <DsModal
          id="user-layout-drawer"
          v-model="drawerOpen"
          size="sm"
          :close-label="$t('إغلاق')"
        >
          <template #header>
            <span class="user-layout__drawer-title">{{ $t('حسابي') }}</span>
          </template>
          <UserSidebar
            :user-name="userDisplayName"
            :user-role="userRoleLabel"
            :user-avatar="userAvatar"
            :nav-links="navLinks"
            :is-active="isActive"
            @navigate="drawerOpen = false"
            @logout="handleDrawerLogout"
          />
        </DsModal>
      </div>
    </q-page-container>

    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import UserSidebar from 'src/components/shared/UserSidebar.vue'
import DsModal from 'src/design-system/components/DsModal.vue'
import { useAuthStore } from 'src/stores/auth'

defineOptions({ name: 'UserLayout' })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { user } = storeToRefs(auth)
const { t } = useI18n()

// ---------------------------------------------------------------------------
// Nav link definitions (icons as inline SVG HTML strings; consumed via v-html
// inside <UserSidebar>).
// ---------------------------------------------------------------------------
interface NavLink { to: string; label: string; icon: string }

const ICON = {
  profile:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  courses:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z"/><path d="M4 5v11a3 3 0 0 0 3 3"/></svg>',
  cert:      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21l4.5-2 4.5 2L15 13.5"/></svg>',
  bell:      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  orders:    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 7Z"/><path d="M9 7a3 3 0 1 1 6 0"/></svg>',
  marketing: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h4l7-5v12l-7-5H3z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>'
}

// ---------------------------------------------------------------------------
// Layout state
// ---------------------------------------------------------------------------
const drawerOpen = ref(false)

// Labels are computed via t() so they react to locale flips.
const navLinks = computed<NavLink[]>(() => [
  { to: '/profile',         label: t('الملف الشخصي'),   icon: ICON.profile },
  { to: '/myCourses',       label: t('دوراتي'),          icon: ICON.courses },
  { to: '/Certificates',    label: t('الشهادات'),        icon: ICON.cert },
  { to: '/notification',    label: t('الإشعارات'),       icon: ICON.bell },
  { to: '/myOrders',        label: t('طلباتي'),          icon: ICON.orders },
  { to: '/myMarketingPage', label: t('صفحتي التسويقية'), icon: ICON.marketing }
])

const userDisplayName = computed<string>(() => {
  const u = user.value
  if (!u) return ''
  return (u as Record<string, unknown>).fullName as string
    || (u as Record<string, unknown>).name as string
    || (u as Record<string, unknown>).username as string
    || ''
})

const userRoleLabel = computed<string>(() => {
  const u = user.value
  if (!u) return t('متعلم')
  const role = (u as Record<string, unknown>).role ?? (u as Record<string, unknown>).userType
  if (role === 'trainer' || role === 'TRAINER') return t('مدرب')
  if (role === 'admin'   || role === 'ADMIN')   return t('مشرف')
  return t('متعلم')
})

const userAvatar = computed<string>(() => {
  const u = user.value
  if (!u) return ''
  return (u as Record<string, unknown>).avatar as string
    || (u as Record<string, unknown>).photo as string
    || ''
})

function isActive (to: string): boolean {
  return route.path === to || route.path.startsWith(to + '/')
}

function handleDrawerLogout (): void {
  drawerOpen.value = false
  void logOut()
}

async function logOut (): Promise<void> {
  try {
    await auth.logOut()
  } catch { /* graceful */ }
  void router.push({ name: 'Home' }).catch(() => {})
}

</script>

<style lang="scss" scoped>
.user-layout {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(0.75rem, 3vw, 2rem);
  padding-block: clamp(0.75rem, 3vw, 3rem);
}

.user-layout__drawer-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: var(--ds-space-2) var(--ds-space-3);
  margin-block-end: var(--ds-space-4);
  background: var(--ds-cream);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  color: var(--ds-ink);
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  cursor: pointer;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: var(--ds-cream-sunken);
  }

  @media (min-width: 900px) {
    display: none;
  }
}

.user-layout__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 3vw, 2.5rem);

  @media (min-width: 900px) {
    grid-template-columns: 240px minmax(0, 1fr);
  }
}

.user-layout__sidebar {
  display: none;

  @media (min-width: 900px) {
    display: block;
    position: sticky;
    inset-block-start: calc(72px + 1.5rem);
    align-self: start;
  }
}

.user-layout__main {
  line-height: 1.85;

  /* On small screens let the page content take the full container width —
     no card chrome, no padding gutter. The layout's own inline padding
     already gives a safe gutter. */
  @media (max-width: 899px) {
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  /* Card chrome only at desktop widths where the sidebar is visible. */
  @media (min-width: 900px) {
    max-inline-size: 960px;
    padding: clamp(1.5rem, 4vw, 3rem);
    background: var(--ds-ivory, var(--ds-cream));
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-xs);
  }
}

.user-layout__drawer-title {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: var(--ds-text-lg);
  color: var(--ds-indigo);
}
</style>
