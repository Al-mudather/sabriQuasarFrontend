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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MainLayout',
  components: { AppHeader, AppFooter },

  computed: {
    ...mapState('settings', ['isEnglish'])
  },

  mounted () {
    this.applyLocale(LocalStorage.getItem('isEnglish'))
  },

  watch: {
    isEnglish (value) { this.applyLocale(value) }
  },

  methods: {
    ...mapActions('settings', ['setIsEnglishAction']),

    async applyLocale (isEnglish) {
      this.$i18n.locale = isEnglish ? 'en' : 'ar'
      this.setIsEnglishAction(isEnglish)

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
