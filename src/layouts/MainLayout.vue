<template>
  <q-layout>
    <MainNavBar />
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <Menu v-if="openMenu" />
    </transition>
    <ShoppingCart />
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
import MainNavBar from 'components/utils/MainNavBar.vue'
import Menu from 'components/Home/Menu.vue'
import Footer from 'src/components/utils/Footer'
import ShoppingCart from 'components/Home/Shopping_cart'
import { LocalStorage, Quasar } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MainLayout',
  components: { MainNavBar, Menu, Footer, ShoppingCart },

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
