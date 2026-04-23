<template>
  <q-layout class="web">
    <user-nav-bar />
    <Menu v-if="openMenu" />
    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
    </q-page-container>
    <Footer />
  </q-layout>
</template>

<script>
import UserNavBar from 'src/components/utils/UserNavBar.vue'
import Footer from 'src/components/utils/Footer.vue'
import Menu from 'components/Home/Menu.vue'
import { LocalStorage, Quasar } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserLayout',
  components: { Menu, Footer, UserNavBar },

  computed: {
    ...mapState('settings', ['openMenu', 'isEnglish'])
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
