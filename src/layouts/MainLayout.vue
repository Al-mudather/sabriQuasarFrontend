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

<script>
import AppHeader from 'src/components/shared/AppHeader.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'
import { LocalStorage, Quasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'
import { storeToRefs } from 'pinia'

export default {
  name: 'MainLayout',
  components: { AppHeader, AppFooter },

  setup () {
    const settings = useSettingsStore()
    const { isEnglish } = storeToRefs(settings)
    return { isEnglish, settings }
  },

  mounted () {
    this.applyLocale(LocalStorage.getItem('isEnglish'))
  },

  watch: {
    isEnglish (value) { this.applyLocale(value) }
  },

  methods: {
    async applyLocale (isEnglish) {
      this.$i18n.locale = isEnglish ? 'en' : 'ar'
      this.settings.setIsEnglish(isEnglish)

      // rtl flag on the lang pack drives html.dir. Omitting rtl:true for
      // Arabic (or setting rtl:true for English) flips the whole page to
      // LTR and breaks Arabic glyph shaping.
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
