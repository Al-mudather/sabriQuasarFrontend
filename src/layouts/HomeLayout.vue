<template>
  <div>
    <NavBar />
    <transition
      appear
      enter-active-class="animated lightSpeedInRight"
      leave-active-class="animated lightSpeedOutRight"
    >
      <Menu v-if="openMenu"/>
    </transition>
    <ShoppingCart />
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <router-view></router-view>
    </transition>
    <Footer />
  </div>
</template>

<script>
import NavBar from 'components/Home/Nav_bar'
import Menu from 'components/Home/Menu'
import Footer from 'src/components/utils/Footer'
import ShoppingCart from 'components/Home/Shopping_cart'
import { mapActions, mapState } from 'vuex'
import { Quasar } from 'quasar'
 
export default {
  name: 'MainLayout',
  components: {
    NavBar,
    Menu,
    Footer,
    ShoppingCart
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('authentication',['token']),
    ...mapState('settings',['openMenu', 'isEnglish']),
  },

    async mounted () {
      
      if (this.isEnglish) {
        this.$i18n.locale = 'en'
        this.setIsEnglishAction(this.isEnglish)
        const langIso = 'en-us'

        try {
            await import(
            /* webpackInclude: /(de|en-us)\.js$/ */
            'quasar/lang/' + langIso
            )
            .then(lang => {
                Quasar.lang.set({
                    ...lang.default,
                    rtl: true,
                })
            })
        }
        catch (err) {
            // Requested Quasar Language Pack does not exist,
            // let's not break the app, so catching
        }
          // TODO: Change the shopping cart elements style when english
          this.changeTheShoppingCarLinksToEnglish ()
          
      } else {
        this.$i18n.locale = 'ar'
        // TODO: Save the language
        this.setIsEnglishAction(this.isEnglish)

        try {
            Quasar.lang.set({
                isoName: 'ar',
                nativeName: 'العربية',
                // rtl: true,
            })

        }

        catch (err) {
          
          }
        // TODO: Change the shopping cart elements style when arabic
        this.changeTheShoppingCarLinksToArabic ()
      }
  },

  methods: {
    ...mapActions('authentication', ['logOutAction']),
    ...mapActions('settings', ['setIsEnglishAction', 'setOpenMenuAction']),

    changeTheShoppingCarLinksToEnglish () {
        // TODO: Change the style of the backet when English
        this.$jquery('.backgroun').css({
            'transform': 'rotate(180deg)'
        })
        // TODO: Change the style of the backet when English
        this.$jquery('.shoppgCart > .cart svg').css({
            'transform': 'translate(-20%, -30%)'
        })
        
        this.$jquery('.shoppgCart > .cart h3').css({
            'transform': 'translate(35%, -100%)'
        })

        this.$jquery('.shoppgCart > .cart > .notifc').css({
            'transform': 'translate(-5%,-43%)'
        })
    },

    changeTheShoppingCarLinksToArabic () {

      this.$jquery('.backgroun').css({
          'transform': 'rotate(360deg)'
      })

      // TODO: Change the style of the backet when English
      this.$jquery('.shoppgCart > .cart svg').css({
          'transform': 'translate(0%, 0%)'
      })
      
      this.$jquery('.shoppgCart > .cart h3').css({
          'transform': 'translate(0%, 0%)'
      })

      this.$jquery('.shoppgCart > .cart > .notifc').css({
          'transform': 'translate(0%,0%)'
      })
    }
  }
}
</script>