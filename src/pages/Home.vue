<template>
  <section class="web">
    <Header />
    <Statiscs />
    <!-- <ViewData /> -->
    <!-- <Evaluation /> -->
    <Training />
    <!-- <SwiperData /> -->
    <Account />
  </section>
</template>

<script>

import Header from 'components/Home/Header'
import Statiscs from 'components/Home/Statiscs'
// import ViewData from 'components/Home/ViewData'
// import Evaluation from 'components/Home/Evaluation'
import Training from 'components/Home/Training'
// import SwiperData from 'components/Home/SwiperData'


import Account from 'pages/account_management/Account'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  components: {
    Account,
    Header,
    Statiscs,
    // ViewData,
    // Evaluation,
    Training
    // SwiperData
  },
  computed: {
    ...mapState('authentication', ['loginDialog'])
  },
  methods: {
    ...mapActions('settings', ['setActiveNavAction'])
  },
  mounted () {

    //TODO: Save the active link so when render it will be make active again
    this.setActiveNavAction('HOME')

  }
}
</script>
<style lang="scss">
.cart > img {
  transform: translate(-50%, -40%) !important;
}
</style>
