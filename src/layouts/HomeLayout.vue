<template>
  <div>
    <div lass="row justify-center">
      <q-btn @click="goToMycourses" class="col-3" color="primary" label="My courses" />
      <q-btn @click="logout" class="col-3" label="Log out" />
    </div>
    <NavBar />
    <ShoppingCart />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import NavBar from 'components/Home/Nav_bar'
import Footer from 'src/components/utils/Footer'
import ShoppingCart from 'components/Home/Shopping_cart'
import { mapActions, mapState } from 'vuex'
import { LocalStorage, Quasar } from 'quasar'

export default {
  name: 'MainLayout',
  components: {
    NavBar,
    Footer,
    ShoppingCart
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('authentication',['token'])
  },

    async mounted () {
      const _isEnglish = LocalStorage.getItem('isEnglish') || false
      console.log('kkkkkkkkkkkkkkkkkkkkkkkk')
      console.log(_isEnglish)
      console.log('kkkkkkkkkkkkkkkkkkkkkkkk')
      if (_isEnglish) {
        this.$i18n.locale = 'en'
        LocalStorage.set('isEnglish', true)
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
            console.log('EEEEEEEEEEEEEEEEEEEEEEEE')
            console.log(err)
            console.log('EEEEEEEEEEEEEEEEEEEEEEEE')
        }
          // TODO: Change the shopping cart elements style when english
          this.changeTheShoppingCarLinksToEnglish ()
          
      } else {
        const langIso = 'ar'
        this.$i18n.locale = 'ar'
        // TODO: Save the language
        LocalStorage.set('isEnglish', false)

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
    },

    logout () {
      this.logOutAction()
    },

    goToMycourses () {
      this.$router.push({ name: 'my-courses' })
    }
  }
}
</script>