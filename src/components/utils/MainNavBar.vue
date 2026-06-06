<template>
  <section class="top main-nav">
    <div class="main-nav__inner" :class="{ 'main-nav__inner--compact': hideFields }">
      <!-- Menu & logo -->
      <div class="main-nav__brand">
        <button
          type="button"
          class="main-nav__menu-btn"
          @click="changeMenuState"
          :aria-label="$t('القائمة')"
        >
          <q-icon name="menu" size="24px" />
        </button>
        <div v-if="!hideFields" class="main-nav__logo">
          <img src="~assets/img/logoB.png" alt="" />
        </div>
      </div>

      <!-- Search -->
      <div v-if="!hideFields" class="main-nav__search">
        <form class="main-nav__search-form" @submit="showTheSearchingResult">
          <q-icon
            name="search"
            size="18px"
            class="main-nav__search-icon"
          />
          <input
            v-model="search"
            type="text"
            class="main-nav__search-input"
            :placeholder="$t('ما الذي تبحث عنه؟')"
          />
          <button type="submit" class="main-nav__search-submit" :aria-label="$t('بحث')">
            <q-icon name="search" size="18px" />
          </button>
        </form>
      </div>

      <!-- Auth actions -->
      <div v-if="!hideFields" class="main-nav__auth">
        <div class="account" v-if="!token">
          <div class="sign">
            <ds-button variant="primary" size="md" @click="GO_TO_SIGN_UP_PAGE">
              <template #leading><q-icon name="person_add" size="18px" /></template>
              {{ $t("تسجيل حساب") }}
            </ds-button>
          </div>
          <div class="login">
            <ds-button variant="secondary" size="md" @click="GO_TO_LOG_IN_PAGE">
              <template #leading><q-icon name="login" size="18px" /></template>
              {{ $t("دخول") }}
            </ds-button>
          </div>
        </div>
        <div class="account" v-else>
          <ds-button
            variant="secondary"
            size="md"
            class="logOutBtn"
            @click="LOG_USER_OUT"
          >
            <template #leading><q-icon name="logout" size="18px" /></template>
            {{ $t("خروج") }}
          </ds-button>
        </div>
      </div>

      <!-- Language -->
      <div class="main-nav__lang">
        <LanguageSwitcher variant="light" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useLogout } from 'src/composables/useLogout'
import { apolloClient } from 'src/apollo/client'
import { GetAllCourses } from 'src/graphql/course_management/query/GetAllCourses'
import type { GetAllCoursesResult, GetAllCoursesVars } from 'src/types/courses/types'
import LanguageSwitcher from 'src/components/shared/LanguageSwitcher.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

const auth = useAuthStore()
const settings = useSettingsStore()
const { logout } = useLogout()
const { token } = storeToRefs(auth)

const hideFields = ref(false)
const search = ref('')

// Watch route to hide fields on terms page
watch(
  () => route.name,
  (name) => {
    hideFields.value = name === 'termsAndConditions'
  },
  { immediate: true }
)

function changeMenuState (): void {
  settings.setOpenMenu(true)
}

function LOG_USER_OUT (): void {
  void logout()
}

function showTheSearchingResult (event: Event): void {
  event.preventDefault()

  if (!search.value.trim()) {
    $q.notify({ type: 'warning', position: 'top', progress: true, multiLine: true, message: t('ما الذي تبحث عنه') })
    return
  }

  apolloClient
    .query<GetAllCoursesResult, GetAllCoursesVars>({
      query: GetAllCourses,
      variables: { title_Icontains: search.value }
    })
    .then((res) => {
      const edges = res.data?.allCourses?.edges ?? []
      const searchResult = edges
        .filter((e) => e?.node)
        .map((e) => ({
          label: e!.node!.title ?? '',
          id: e!.node!.id,
          pk: e!.node!.pk
        }))

      if (searchResult.length > 0) {
        $q.bottomSheet({
          style: { textAlign: 'center', padding: '20px', borderBottom: '1px solid #000' },
          actions: searchResult
        })
          .onOk((action: { label: string; pk: string; id: string }) => {
            router.push({
              name: 'course-details',
              params: { name: action.label.split(' ').join('-'), pk: action.pk, id: action.id }
            })
          })
          .onDismiss(() => { search.value = '' })
      } else {
        $q.notify({ color: 'negative', position: 'top', progress: true, multiLine: true, message: t('لا توجد نتائج') })
      }
    })
}

function GO_TO_SIGN_UP_PAGE (): void {
  router.push({ name: 'signUp', query: { redirect: route.fullPath } })
}

function GO_TO_LOG_IN_PAGE (): void {
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}
</script>

<style lang="scss" scoped>
.top.main-nav {
  background-color: var(--ds-surface);
  border-block-end: 1px solid var(--ds-border);
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-4);
}

.main-nav__inner {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: var(--ds-space-4);
  max-width: 1400px;
  margin-inline: auto;

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr auto;
    .main-nav__search {
      grid-column: 1 / -1;
      order: 3;
    }
  }

  &--compact {
    grid-template-columns: auto 1fr;
  }
}

.main-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.main-nav__menu-btn {
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

.main-nav__logo img {
  display: block;
  max-height: 42px;
  width: auto;
}

.main-nav__search {
  min-width: 0;
}

.main-nav__search-form {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  background-color: var(--ds-surface-muted);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding-inline: var(--ds-space-4);
  padding-block: var(--ds-space-2);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
    border-color: var(--ds-brand-500);
    box-shadow: var(--ds-shadow-focus);
  }
}

.main-nav__search-icon {
  color: var(--ds-text-muted);
  flex-shrink: 0;
}

.main-nav__search-input {
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

.main-nav__search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--ds-brand-600);
  color: var(--ds-text-onBrand);
  width: 32px;
  height: 32px;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--ds-brand-700);
  }
}

.main-nav__auth .account {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.main-nav__lang {
  display: inline-flex;
  align-items: center;
}

.lang {
  padding-block-start: 3px;
  h3 {
    color: var(--ds-text);
  }
}
</style>
