<template>
  <div>
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
  }
}
</script>
