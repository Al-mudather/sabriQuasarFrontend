<template>
  <div>
    <NavBar />
    <ShoppingCart />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from 'components/Home/Nav_bar'
import ShoppingCart from 'components/Home/Shopping_cart'

export default {
  name: 'MainLayout',
  components: {
    NavBar,
    ShoppingCart
  },
  data () {
    return {
    }
  }
}
</script>
