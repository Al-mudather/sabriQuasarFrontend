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
    },

    goToMycourses () {
      this.$router.push({ name: 'my-courses' })
    }
  }
}
</script>