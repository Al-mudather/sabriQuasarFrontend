<template>
  <div>
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from 'components/Home/Nav_bar'

export default {
  name: 'MainLayout',
  components: { NavBar },
  data () {
    return {
    }
  }
}
</script>
