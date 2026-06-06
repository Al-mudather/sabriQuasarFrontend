<template>
  <section class="menuu">
    <div class="openMenu">
      <!-- Top section -->
      <div class="topMenu">
        <button
          type="button"
          class="closes"
          @click="changeMenuState"
          :aria-label="$t('إغلاق')"
        >
          <q-icon name="close" size="22px" />
        </button>

        <div class="lang">
          <q-toggle v-model="_isEnglish" icon="language" />
        </div>

        <div class="profile">
          <q-icon name="account_circle" size="72px" class="profile__icon" />
          <h3 v-if="user?.fullName">{{ user.fullName }}</h3>
          <h3 v-else>{{ user?.email }}</h3>
        </div>

        <div class="account" v-if="!token">
          <div class="sign">
            <a @click="GO_TO_SIGNUP_PAGE" style="cursor: pointer">
              <q-icon name="person_add" size="18px" />
              <h3>{{ $t("إنشاء حساب") }}</h3>
            </a>
          </div>
          <div class="login">
            <a @click="GO_TO_LOGIN_PAGE" style="cursor: pointer">
              <q-icon name="login" size="18px" />
              <h3>{{ $t("دخول") }}</h3>
            </a>
          </div>
        </div>
      </div>

      <!-- Navigation links -->
      <div class="butgro side-nav" id="butgro">
        <a
          class="but side-nav__item side-nav__item--active"
          data-link="HOME"
          @click="GO_TO_HOME_PAGE($event)"
        >
          <q-icon name="home" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("الرئيسية") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="COURSES"
          @click="GOT_TO_COURSES_PAGE($event)"
        >
          <q-icon name="school" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("الــدورات") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="MYORDERS"
          v-if="token"
          @click="GO_TO_MY_ORDERS_PAGE($event)"
        >
          <q-icon name="receipt_long" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("طلباتي") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="BORD"
          v-if="token"
          @click="GO_TO_MY_COURSES_PAGE($event)"
        >
          <q-icon name="menu_book" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("كورساتي") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="MYMARKETINGPAGE"
          v-if="token && user?.isPyramidMarketer"
          @click="GO_TO_MY_MARKETING_PAGE($event)"
        >
          <q-icon name="campaign" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("صفحتي التسويقيه") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="NOTIFICATION"
          v-if="token"
          @click="GO_TO_MY_NOTIFICATIONS_PAGE($event)"
        >
          <q-icon name="notifications" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("الإشعارت") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="NOTIFICATION"
          v-if="token"
          @click="GO_TO_MY_CERTIFICATE_PAGE($event)"
        >
          <q-icon name="workspace_premium" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("شهاداتي") }}</h3>
        </a>
        <a
          class="but side-nav__item"
          data-link="PROFILE"
          v-if="token"
          @click="GO_TO_MY_PROFILE_PAGE($event)"
        >
          <q-icon name="person" size="18px" class="side-nav__item-icon" />
          <h3>{{ $t("الملف الشخصي") }}</h3>
        </a>
      </div>

      <div
        class="exit"
        v-if="token"
        @click="logTheUserOut"
        style="cursor: pointer"
      >
        <q-icon name="logout" size="18px" class="exit__icon" />
        <h3>{{ $t("خــروج") }}</h3>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { LocalStorage } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useLogout } from 'src/composables/useLogout'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import type {
  MyPyramidAccountResult,
  MyPyramidAccountVars,
} from 'src/types/pyramid/types'

const router = useRouter()

const auth = useAuthStore()
const settings = useSettingsStore()
const { logout } = useLogout()

const { token, user } = storeToRefs(auth)
const { isEnglish } = storeToRefs(settings)

const { result: pyramidResult } = useQuery<MyPyramidAccountResult, MyPyramidAccountVars>(
  MyPyramidAccount,
  {},
  { errorPolicy: 'all' },
)
const myPyramidAccount = computed(() => pyramidResult.value?.myPyramidAccount ?? null)

const _isEnglish = computed({
  get: () => isEnglish.value,
  set: (newValue: boolean) => settings.setIsEnglish(newValue),
})

onMounted(() => {
  const rawNav = LocalStorage.getItem('activeNav')
  const link_attr: string = rawNav !== null ? JSON.parse(rawNav as string) : ''

  const nav_items = document.querySelectorAll<HTMLElement>('.side-nav__item')

  if (link_attr) {
    nav_items.forEach((nav) => {
      nav.classList.remove('side-nav__item--active')
    })
    const active_link = document.querySelector<HTMLElement>(`[data-link="${link_attr}"]`)
    if (active_link) active_link.classList.add('side-nav__item--active')
  }

  nav_items.forEach((nav) => {
    nav.addEventListener('click', () => {
      nav_items.forEach((n) => n.classList.remove('side-nav__item--active'))
      nav.classList.add('side-nav__item--active')
    })
  })
})

function MAKE_ACTIVE (e: Event): void {
  const target = e.target as HTMLElement
  const active_nav = target.parentElement?.closest('a') ?? target.closest('a')
  if (active_nav) {
    settings.setActiveNav(active_nav.getAttribute('data-link') ?? '')
  }
}

function changeMenuState (): void {
  settings.setOpenMenu(false)
}

function logTheUserOut (): void {
  void logout()
}

function GO_TO_MY_ORDERS_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'my-orders' })
}

function GO_TO_MY_NOTIFICATIONS_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'notification' })
}

function GO_TO_MY_CERTIFICATE_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'my-certificate' })
}

function GO_TO_MY_MARKETING_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'my-marketing-page' })
}

function GO_TO_MY_PROFILE_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'user-profile' })
}

function GO_TO_MY_COURSES_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'my-courses' })
}

function GOT_TO_COURSES_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'courses' })
}

function GO_TO_HOME_PAGE (e: Event): void {
  MAKE_ACTIVE(e)
  void router.push({ name: 'Home' })
}

function GO_TO_SIGNUP_PAGE (): void {
  void router.push({ name: 'signUp' })
}

function GO_TO_LOGIN_PAGE (): void {
  void router.push({ name: 'login' })
}
</script>

<style lang="scss" scoped>
.menuu {
  position: fixed;
  inset: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
}

.openMenu {
  max-width: 280px;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    var(--ds-brand-700) 0%,
    var(--ds-brand-800) 100%
  );
  color: var(--ds-text-onBrand);
  position: relative;
  box-shadow: var(--ds-shadow-lg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.topMenu {
  position: relative;
  padding-block: var(--ds-space-4);
  padding-inline: var(--ds-space-4);
  border-block-end: 1px solid rgba(255, 255, 255, 0.08);
}

.closes {
  position: absolute;
  top: var(--ds-space-3);
  inset-inline-end: var(--ds-space-3);
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.12);
  color: var(--ds-text-onBrand);
  border: none;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.22);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
  }
}

.lang {
  position: relative;
  margin-block-start: var(--ds-space-2);
}

.profile {
  text-align: center;
  padding-block: var(--ds-space-4);

  &__icon {
    color: var(--ds-accent-300);
  }

  h3 {
    font-size: var(--ds-text-md);
    font-family: var(--ds-font-body);
    color: var(--ds-text-onBrand);
    margin-block: var(--ds-space-2);
  }
}

.account {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-2);
  margin-block-end: var(--ds-space-2);

  .sign,
  .login {
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    padding-block: var(--ds-space-2);
    padding-inline: var(--ds-space-4);
    border-radius: var(--ds-radius-pill);
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      text-decoration: none;
      color: inherit;
    }

    h3 {
      margin: 0;
      font-size: var(--ds-text-sm);
      font-family: var(--ds-font-body);
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  .sign {
    background-color: var(--ds-brand-500);
    color: var(--ds-text-onBrand);
  }

  .login {
    background-color: var(--ds-accent-300);
    color: var(--ds-brand-800);
  }
}

// Side nav list
.butgro.side-nav {
  list-style: none;
  display: flex;
  flex-direction: column;
  padding-block: var(--ds-space-4);
  padding-inline: 0;
  margin: 0;
  flex: 1;
}

.side-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-6);
  color: var(--ds-neutral-100);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  h3 {
    margin: 0;
    font-size: var(--ds-text-sm);
    font-family: var(--ds-font-body);
    color: inherit;
  }

  &::before {
    content: "";
    position: absolute;
    inset-block: 20%;
    inset-inline-start: 0;
    width: 3px;
    background-color: var(--ds-accent-300);
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.2s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: var(--ds-text-onBrand);
  }

  &:hover::before,
  &--active::before {
    transform: scaleY(1);
  }

  &--active {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--ds-accent-300);
  }

  &-icon {
    flex-shrink: 0;
  }
}

.exit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-2);
  margin-inline: auto;
  margin-block-end: var(--ds-space-6);
  padding-block: var(--ds-space-2);
  padding-inline: var(--ds-space-6);
  background-color: var(--ds-brand-500);
  color: var(--ds-text-onBrand);
  border-radius: var(--ds-radius-pill);
  min-width: 150px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--ds-brand-600);
  }

  &__icon {
    color: var(--ds-accent-300);
  }

  h3 {
    margin: 0;
    font-size: var(--ds-text-sm);
    font-family: var(--ds-font-body);
  }
}
</style>
