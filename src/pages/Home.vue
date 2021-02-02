<template>
  <section class="web">
    <Header />
    <ShoppingCartPopUp v-if="shoppinCartDialog"/>
    <Statiscs />
    <ViewData />
    <Evaluation />
    <Training />
    <SwiperData />
    <Account />
  </section>
</template>

<script>

import Header from 'components/Home/Header'
import Statiscs from 'components/Home/Statiscs'
import ViewData from 'components/Home/ViewData'
import Evaluation from 'components/Home/Evaluation'
import Training from 'components/Home/Training'
import SwiperData from 'components/Home/SwiperData'

import ShoppingCartPopUp from 'src/pages/ShoppingCart'

import Account from 'pages/Account'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  components: {
    ShoppingCartPopUp,
    Account,
    Header,
    Statiscs,
    ViewData,
    Evaluation,
    Training,
    SwiperData
  },
  computed: {
    ...mapState('authentication', ['loginDialog']),
    ...mapState('shoppingCart', ['shoppinCartDialog'])
  }
}
</script>
<style lang="scss">
</style>
