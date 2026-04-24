<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
    <AppHeader variant="cream" :sticky="true" />

    <q-page-container>
      <div class="user-layout">
        <!-- Mobile drawer trigger -->
        <button
          type="button"
          class="user-layout__drawer-trigger"
          :aria-expanded="drawerOpen ? 'true' : 'false'"
          aria-controls="user-layout-drawer"
          aria-label="فتح قائمة الحساب"
          @click="drawerOpen = true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>حسابي</span>
        </button>

        <div class="user-layout__grid">
          <!-- Sidebar (desktop) -->
          <aside
            class="user-layout__sidebar"
            role="complementary"
            aria-label="قائمة الحساب"
          >
            <SidebarContent
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
            aria-label="محتوى الحساب"
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
          :close-label="'إغلاق'"
        >
          <template #header>
            <span class="user-layout__drawer-title">حسابي</span>
          </template>
          <SidebarContent
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

<script>
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import DsModal from 'src/design-system/components/DsModal.vue'
import { LocalStorage, Quasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { storeToRefs } from 'pinia'
import { h } from 'vue'

// Inline sidebar renderer — kept local to UserLayout so the layout
// stays self-contained without bleeding into src/components.
const SidebarContent = {
  name: 'UserSidebarContent',
  props: {
    userName:   { type: String, default: '' },
    userRole:   { type: String, default: '' },
    userAvatar: { type: String, default: '' },
    navLinks:   { type: Array,  required: true },
    isActive:   { type: Function, required: true }
  },
  emits: ['navigate', 'logout'],
  render () {
    const avatarNode = this.userAvatar
      ? h('img', { class: 'user-sidebar__avatar-img', src: this.userAvatar, alt: this.userName })
      : h('span', { class: 'user-sidebar__avatar-initial' }, (this.userName || 'u').slice(0, 1))

    return h('div', { class: 'user-sidebar' }, [
      // User card
      h('div', { class: 'user-sidebar__card' }, [
        h('div', { class: 'user-sidebar__avatar' }, [avatarNode]),
        h('div', { class: 'user-sidebar__identity' }, [
          h('span', { class: 'user-sidebar__name' }, this.userName || 'مرحباً'),
          h('span', { class: 'user-sidebar__role' }, this.userRole)
        ])
      ]),
      h('hr', { class: 'user-sidebar__divider', 'aria-hidden': 'true' }),

      // Nav
      h('nav', { class: 'user-sidebar__nav', 'aria-label': 'تنقل الحساب' },
        this.navLinks.map(link => h('router-link', {
          key: link.to,
          to: link.to,
          class: ['user-sidebar__link', { 'is-active': this.isActive(link.to) }],
          'aria-current': this.isActive(link.to) ? 'page' : null,
          onClick: () => this.$emit('navigate')
        }, () => [
          h('span', { class: 'user-sidebar__link-icon', 'aria-hidden': 'true', innerHTML: link.icon }),
          h('span', { class: 'user-sidebar__link-label' }, link.label)
        ]))
      ),

      h('hr', { class: 'user-sidebar__divider', 'aria-hidden': 'true' }),

      // Logout
      h('button', {
        class: 'user-sidebar__logout',
        type: 'button',
        onClick: () => this.$emit('logout')
      }, [
        h('span', {
          class: 'user-sidebar__link-icon',
          'aria-hidden': 'true',
          innerHTML: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 17l5-5-5-5M20 12H9M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/></svg>'
        }),
        h('span', 'تسجيل الخروج')
      ])
    ])
  }
}

const ICON = {
  profile:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  courses:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z"/><path d="M4 5v11a3 3 0 0 0 3 3"/></svg>',
  cert:     '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21l4.5-2 4.5 2L15 13.5"/></svg>',
  bell:     '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  orders:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 7Z"/><path d="M9 7a3 3 0 1 1 6 0"/></svg>',
  marketing:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h4l7-5v12l-7-5H3z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>',
  payments: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>'
}

export default {
  name: 'UserLayout',
  components: { AppHeader, AppFooter, DsModal, SidebarContent },

  setup () {
    const auth = useAuthStore()
    const settings = useSettingsStore()
    const { token, user } = storeToRefs(auth)
    const { isEnglish } = storeToRefs(settings)
    return { token, user, isEnglish, auth, settings }
  },

  data () {
    return {
      drawerOpen: false,
      navLinks: [
        { to: '/profile',            label: 'الملف الشخصي',   icon: ICON.profile },
        { to: '/myCourses',          label: 'دوراتي',          icon: ICON.courses },
        { to: '/Certificates',       label: 'الشهادات',        icon: ICON.cert },
        { to: '/notification',       label: 'الإشعارات',       icon: ICON.bell },
        { to: '/myOrders',           label: 'طلباتي',          icon: ICON.orders },
        { to: '/myMarketingPage',    label: 'التسويق الشبكي', icon: ICON.marketing }
      ]
    }
  },

  computed: {
    userDisplayName () {
      const u = this.user || {}
      return u.fullName || u.name || u.username || ''
    },
    userRoleLabel () {
      const u = this.user || {}
      const role = u.role || u.userType
      if (role === 'trainer' || role === 'TRAINER') return 'مدرب'
      if (role === 'admin'   || role === 'ADMIN')   return 'مشرف'
      return 'متعلم'
    },
    userAvatar () {
      const u = this.user || {}
      return u.avatar || u.photo || ''
    }
  },

  mounted () {
    this.applyLocale(LocalStorage.getItem('isEnglish'))
  },

  watch: {
    isEnglish (value) { this.applyLocale(value) }
  },

  methods: {
    isActive (to) {
      if (!this.$route) return false
      return this.$route.path === to || this.$route.path.startsWith(to + '/')
    },

    handleDrawerLogout () {
      this.drawerOpen = false
      this.logOut()
    },

    async logOut () {
      try {
        await this.auth.logOut()
      } catch (e) { /* graceful */ }
      this.$router.push({ name: 'Home' }).catch(() => {})
    },

    async applyLocale (isEnglish) {
      this.$i18n.locale = isEnglish ? 'en' : 'ar'
      this.settings.setIsEnglish(isEnglish)

      try {
        if (isEnglish) {
          const lang = await import('quasar/lang/en-us')
          Quasar.lang.set({ ...lang.default, rtl: false })
        } else {
          const lang = await import('quasar/lang/ar')
          Quasar.lang.set({ ...lang.default, rtl: true })
        }
      } catch (err) { /* lang pack missing; no-op */ }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
  padding-block: clamp(1.5rem, 4vw, 3rem);
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
  max-width: 960px;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--ds-ivory, var(--ds-cream));
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-xs);
  line-height: 1.85;
}

.user-layout__drawer-title {
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: var(--ds-text-lg);
  color: var(--ds-indigo);
}
</style>

<style lang="scss">
/* Non-scoped so the functional SidebarContent render can match without
   Vue's scoped attribute rewriting. */
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
  width: 40px;
  height: 40px;
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
  width: 100%;
  height: 100%;
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
  min-width: 0;
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
  height: 1px;
  width: 100%;
  background: var(--ds-cream-sunken);
  margin: var(--ds-space-1) 0;
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

.user-sidebar__link-label { flex: 1 1 auto; min-width: 0; }

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
