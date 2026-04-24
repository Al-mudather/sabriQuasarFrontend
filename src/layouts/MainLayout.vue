<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
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
import { watch, onMounted } from 'vue'
import { LocalStorage, Quasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import { useSettingsStore } from 'src/stores/settings'

defineOptions({ name: 'MainLayout' })

const { locale } = useI18n()
const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

async function applyLocale (val: boolean | null): Promise<void> {
  locale.value = val ? 'en' : 'ar'
  settings.setIsEnglish(val ?? false)

  // rtl flag on the lang pack drives html.dir. Omitting rtl:true for
  // Arabic (or setting rtl:true for English) flips the whole page to
  // LTR and breaks Arabic glyph shaping.
  try {
    if (val) {
      const lang = await import('quasar/lang/en-us')
      Quasar.lang.set({ ...lang.default, rtl: false })
    } else {
      const lang = await import('quasar/lang/ar')
      Quasar.lang.set({ ...lang.default, rtl: true })
    }
  } catch { /* lang pack missing; no-op */ }
}

onMounted(() => {
  void applyLocale(LocalStorage.getItem<boolean>('isEnglish'))
})

watch(isEnglish, (value) => { void applyLocale(value) })
</script>
