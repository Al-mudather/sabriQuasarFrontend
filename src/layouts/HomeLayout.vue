<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
    <AppHeader variant="transparent" :sticky="true" />
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
import { onMounted } from 'vue'
import { Quasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import { useSettingsStore } from 'src/stores/settings'

defineOptions({ name: 'HomeLayout' })

const { locale } = useI18n()
const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

onMounted(async () => {
  settings.setIsEnglish(isEnglish.value)
  locale.value = isEnglish.value ? 'en' : 'ar'

  // Lang-pack rtl flag drives html.dir. Omitting rtl:true for Arabic
  // (or setting rtl:true for English) flips the whole page to LTR and
  // breaks Arabic glyph shaping. Keep these flags accurate.
  try {
    if (isEnglish.value) {
      const lang = await import('quasar/lang/en-us')
      Quasar.lang.set({ ...lang.default, rtl: false })
    } else {
      const lang = await import('quasar/lang/ar')
      Quasar.lang.set({ ...lang.default, rtl: true })
    }
  } catch { /* lang pack missing; no-op */ }
})
</script>
