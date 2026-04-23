<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
    <AppHeader variant="cream" :sticky="true" />
    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
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

      try {
        if (isEnglish) {
          const lang = await import(/* webpackInclude: /(de|en-us)\.js$/ */ 'quasar/lang/en-us')
          Quasar.lang.set({ ...lang.default, rtl: true })
        } else {
          Quasar.lang.set({ isoName: 'ar', nativeName: 'العربية' })
        }
      } catch (err) { /* lang pack missing; no-op */ }
    }
  }
}
</script>
