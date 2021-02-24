<template>
  <section class="web">
    <router-view></router-view>
  </section>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  components: {
  }
}
</script>
<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';
</style>
