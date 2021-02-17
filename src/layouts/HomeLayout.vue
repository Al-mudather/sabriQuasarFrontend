<template>
  <div>
    <div lass="row justify-center">
      <q-btn @click="logout" class="col-3">
      Log out
    </q-btn>
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
  methods: {
    ...mapActions('authentication', ['logOutAction']),
    logout () {
      this.logOutAction()
    }
  }
}
</script>
