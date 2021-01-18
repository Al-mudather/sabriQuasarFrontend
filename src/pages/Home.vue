<template>
  <section class="web">
    <ShoppingCart />
    <Header />
    <Statiscs />
    <ViewData />
    <Evaluation />
    <Training />
    <SwiperData />
    <Footer />
  </section>
</template>

<script>
// @ is an alias to /src

import ShoppingCart from 'components/Home/Shopping_cart'
import Header from 'components/Home/Header'
import Footer from 'components/Home/Footer'
import Statiscs from 'components/Home/Statiscs'
import ViewData from 'components/Home/ViewData'
import Evaluation from 'components/Home/Evaluation'
import Training from 'components/Home/Training'
import SwiperData from 'components/Home/SwiperData'

export default {
  name: 'Home',
  components: {
    ShoppingCart,
    Header,
    Footer,
    Statiscs,
    ViewData,
    Evaluation,
    Training,
    SwiperData
  }
}
</script>
<style lang="scss">
</style>
