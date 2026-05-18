<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'ltr'">
    <AppHeader variant="cream" :sticky="true" />
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'

defineOptions({ name: 'HomeLayout' })

// Locale state lives in `src/composables/useAppLocale.ts`; see MainLayout.vue.
</script>
