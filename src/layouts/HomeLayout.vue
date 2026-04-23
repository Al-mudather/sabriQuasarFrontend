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
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeLayout',
  components: { AppHeader, AppFooter },

  computed: {
    ...mapState('authentication', ['token']),
    ...mapState('settings', ['isEnglish'])
  },

  async mounted () {
    this.setIsEnglishAction(this.isEnglish)
    this.$i18n.locale = this.isEnglish ? 'en' : 'ar'

    if (this.isEnglish) {
      try {
        const lang = await import(/* webpackInclude: /(de|en-us)\.js$/ */ 'quasar/lang/en-us')
        Quasar.lang.set({ ...lang.default, rtl: true })
      } catch (err) { /* lang pack missing; no-op */ }
    } else {
      try {
        Quasar.lang.set({ isoName: 'ar', nativeName: 'العربية' })
      } catch (err) { /* no-op */ }
    }
  },

  methods: {
    ...mapActions('authentication', ['logOutAction']),
    ...mapActions('settings', ['setIsEnglishAction'])
  }
}
</script>
