<template>
  <section class="top home-nav">
    <div class="home-nav__inner">
      <!-- Menu & logo -->
      <div class="home-nav__brand" @click="changeMenuState">
        <button
          type="button"
          class="home-nav__menu-btn"
          :aria-label="$t('القائمة')"
        >
          <q-icon name="menu" size="26px" />
        </button>
        <div class="home-nav__logo">
          <img src="~assets/img/logo.png" alt="" />
        </div>
      </div>

      <!-- Search -->
      <div class="home-nav__search">
        <form class="home-nav__search-form" @submit="showTheSearchingResult">
          <q-icon name="search" size="18px" class="home-nav__search-icon" />
          <input
            v-model="search"
            type="text"
            class="home-nav__search-input"
            :placeholder="$t('ما الذي تبحث عنه؟')"
          />
          <button
            type="submit"
            class="home-nav__search-submit"
            :aria-label="$t('بحث')"
          >
            <q-icon name="search" size="18px" />
          </button>
        </form>
      </div>

      <!-- Auth actions -->
      <div class="home-nav__auth">
        <div class="account m_btn" v-if="!token">
          <div class="sign m_btn">
            <ds-button variant="accent" size="md" @click="GO_TO_SIGN_UP_PAGE">
              <template #leading><q-icon name="person_add" size="18px" /></template>
              {{ $t("تسجيل حساب") }}
            </ds-button>
          </div>
          <div class="login m_btn">
            <ds-button variant="secondary" size="md" @click="GO_TO_LOG_IN_PAGE">
              <template #leading><q-icon name="login" size="18px" /></template>
              {{ $t("دخول") }}
            </ds-button>
          </div>
        </div>
        <div class="account m_btn" v-else>
          <div class="sign logOutBtn mag">
            <ds-button variant="secondary" size="md" @click="LOG_USER_OUT">
              <template #leading><q-icon name="logout" size="18px" /></template>
              {{ $t("خروج") }}
            </ds-button>
          </div>
        </div>
      </div>

      <!-- Language -->
      <div class="home-nav__lang">
        <div class="lang">
          <q-toggle
            v-model="_isEnglish"
            icon="language"
            unchecked-icon="clear"
            class="text-white"
            label="Eng"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { Quasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'
import { apolloClient } from 'src/apollo/client'
import { GetAllCourses } from 'src/graphql/course_management/query/GetAllCourses'
import type {
  GetAllCoursesResult,
  GetAllCoursesVars,
} from 'src/types/courses/types'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { t } = useI18n()

const auth = useAuthStore()
const settings = useSettingsStore()
const cart = useCartStore()
const pyramid = usePyramidStore()

const { token } = storeToRefs(auth)
const { isEnglish } = storeToRefs(settings)

const search = ref('')
const isDraft = ref(false)

const isSearchEmpty = computed(() => !search.value.trim())

const _isEnglish = computed({
  get: () => isEnglish.value,
  set: (newValue: boolean) => settings.setIsEnglish(newValue),
})

watch(isEnglish, async (value) => {
  if (value) {
    settings.setIsEnglish(value)
    const langIso = 'en-us'
    try {
      const lang = await import('quasar/lang/' + langIso)
      Quasar.lang.set({ ...lang.default, rtl: false })
      // Adjust cart styling in outer layouts when switching locales
      const $ = (window as Record<string, unknown>).jQuery as ((sel: string) => { css: (props: Record<string, string>) => void }) | undefined
      if ($) {
        $('.backgroun').css({ transform: 'rotate(180deg)' })
        $('.shoppgCart > .cart svg').css({ transform: 'translate(-20%, -30%)' })
        $('.shoppgCart > .cart h3').css({ transform: 'translate(35%, -100%)' })
        $('.shoppgCart > .cart > .notifc').css({ transform: 'translate(-5%,-43%)' })
      }
    } catch (_err) {
      // Requested Quasar Language Pack does not exist — keep app running
    }
  } else {
    settings.setIsEnglish(value)
    try {
      const lang = await import('quasar/lang/ar')
      Quasar.lang.set({ ...lang.default, rtl: true })
      const $ = (window as Record<string, unknown>).jQuery as ((sel: string) => { css: (props: Record<string, string>) => void }) | undefined
      if ($) {
        $('.backgroun').css({ transform: 'rotate(360deg)' })
        $('.shoppgCart > .cart svg').css({ transform: 'translate(0%, 0%)' })
        $('.shoppgCart > .cart h3').css({ transform: 'translate(0%, 0%)' })
        $('.shoppgCart > .cart > .notifc').css({ transform: 'translate(0%,0%)' })
      }
    } catch (_err) {
      // ignore
    }
  }
})

function changeMenuState (): void {
  settings.setOpenMenu(true)
}

function removeCookie (): void {
  const tokenName = 'csrftoken'
  // $cookies is globally injected; access via window to avoid $-plugin typing
  try {
    ;(window as Record<string, unknown>).$cookies && (window as Record<string, { remove: (t: string) => void }>).$cookies.remove(tokenName)
  } catch (_e) { /* ignore */ }
}

function LOG_USER_OUT (): void {
  pyramid.setMyMarketingCode('')
  try { removeCookie() } catch (_e) { /* ignore */ }
  cart.deleteCart()
  auth.logOut()
  void router.push({ name: 'Home' })
}

async function showTheSearchingResult (event: Event): Promise<void> {
  event.preventDefault()

  if (isSearchEmpty.value) {
    $q.notify({
      type: 'warning',
      position: 'top',
      progress: true,
      multiLine: true,
      message: t('ما الذي تبحث عنه'),
    })
    return
  }

  try {
    const res = await apolloClient.query<GetAllCoursesResult, GetAllCoursesVars>({
      query: GetAllCourses,
      variables: {
        title_Icontains: search.value,
        isDraft: isDraft.value,
      },
    })
    const edges = res.data?.allCourses?.edges ?? []
    const searchResult = edges
      .filter((e): e is NonNullable<typeof e> => !!e?.node)
      .map((e) => ({
        label: e.node!.title,
        id: e.node!.id,
        pk: e.node!.pk,
      }))

    if (searchResult.length) {
      $q.bottomSheet({
        style: {
          textAlign: 'center',
          padding: '20px',
          'border-bottom': '1px solid #000 !important',
        },
        actions: searchResult,
      })
        .onOk((action: { label: string; id: string; pk: number | null }) => {
          void router.push({
            name: 'course-details',
            params: {
              name: action.label.replaceAll(' ', '-'),
              pk: String(action.pk),
              id: action.id,
            },
          })
        })
        .onDismiss(() => {
          search.value = ''
        })
    } else {
      $q.notify({
        color: 'negative',
        position: 'top',
        progress: true,
        multiLine: true,
        message: t('لا توجد نتائج'),
      })
    }
  } catch (_err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      progress: true,
      multiLine: true,
      message: t('لا توجد نتائج'),
    })
  }
}

function GO_TO_SIGN_UP_PAGE (): void {
  void router.push({
    name: 'signUp',
    query: { redirect: route.fullPath },
  })
}

function GO_TO_LOG_IN_PAGE (): void {
  void router.push({
    name: 'login',
    query: { redirect: route.fullPath },
  })
}
</script>

<style lang="scss" scoped>
.top.home-nav {
  background: linear-gradient(
    135deg,
    var(--ds-brand-700) 0%,
    var(--ds-brand-600) 100%
  );
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-4);
  color: var(--ds-text-onBrand);
}

.home-nav__inner {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: var(--ds-space-4);
  max-width: 1400px;
  margin-inline: auto;

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr auto;
    .home-nav__search {
      grid-column: 1 / -1;
      order: 3;
    }
  }
}

.home-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  cursor: pointer;
}

.home-nav__menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--ds-text-onBrand);
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.18);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
  }
}

.home-nav__logo img {
  display: block;
  max-height: 44px;
  width: auto;
}

.home-nav__search {
  min-width: 0;
}

.home-nav__search-form {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  background-color: var(--ds-surface);
  border: 1px solid transparent;
  border-radius: var(--ds-radius-pill);
  padding-inline: var(--ds-space-4);
  padding-block: var(--ds-space-2);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
    border-color: var(--ds-accent-300);
    box-shadow: 0 0 0 3px rgba(252, 199, 76, 0.35);
  }
}

.home-nav__search-icon {
  color: var(--ds-text-muted);
  flex-shrink: 0;
}

.home-nav__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);

  &::placeholder {
    color: var(--ds-text-muted);
  }
}

.home-nav__search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--ds-accent-300);
  color: var(--ds-brand-800);
  width: 32px;
  height: 32px;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--ds-accent-400);
  }
}

.home-nav__auth .account {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.home-nav__lang {
  display: inline-flex;
  align-items: center;
}

.m_btn {
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.03);
  }
}

.lang {
  color: var(--ds-text-onBrand);
}
</style>
