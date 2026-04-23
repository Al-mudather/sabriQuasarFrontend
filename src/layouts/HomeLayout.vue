<template>
  <q-layout view="hHh lpR fFf" :dir="$q.lang.rtl ? 'rtl' : 'rtl'">
    <AppHeader variant="transparent" :sticky="true" />
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
import { Quasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { storeToRefs } from 'pinia'

export default {
  name: 'HomeLayout',
  components: { AppHeader, AppFooter },

  setup () {
    const auth = useAuthStore()
    const settings = useSettingsStore()
    const { token } = storeToRefs(auth)
    const { isEnglish } = storeToRefs(settings)
    return { token, isEnglish, settings }
  },

  async mounted () {
    this.settings.setIsEnglish(this.isEnglish)
    this.$i18n.locale = this.isEnglish ? 'en' : 'ar'

    // Lang-pack rtl flag drives html.dir. Omitting rtl:true for Arabic
    // (or setting rtl:true for English) flips the whole page to LTR and
    // breaks Arabic glyph shaping. Keep these flags accurate.
    try {
      if (this.isEnglish) {
        const lang = await import('quasar/lang/en-us')
        Quasar.lang.set({ ...lang.default, rtl: false })
      } else {
        const lang = await import('quasar/lang/ar')
        Quasar.lang.set({ ...lang.default, rtl: true })
      }
    } catch (err) { /* lang pack missing; no-op */ }
  }
}
</script>
