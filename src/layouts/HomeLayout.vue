<template>
  <q-layout>
    <Currency />
    <NavBar />
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
import Currency from 'components/Home/Currency.vue'
import NavBar from 'components/Home/Nav_bar.vue'
import Menu from 'components/Home/Menu'
import Footer from 'src/components/utils/Footer'
import ShoppingCart from 'components/Home/Shopping_cart'
import { Quasar } from 'quasar'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeLayout',
  components: { Currency, NavBar, Menu, Footer, ShoppingCart },

  computed: {
    ...mapState('authentication', ['token']),
    ...mapState('settings', ['openMenu', 'isEnglish'])
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
    ...mapActions('settings', ['setIsEnglishAction', 'setOpenMenuAction'])
  }
}
</script>
