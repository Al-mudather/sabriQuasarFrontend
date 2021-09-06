<template>
 <div class="who-joined-me">
    <h2><span>{{count}}</span>شخص إنضم من خلالي</h2>
  </div>
</template>

<script>

import {MyPyramidAffiliates} from 'src/queries/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe.js'

export default {
  name: "WhoJoindThePlatformThrowMe",
  data() {
    return {
      count: 0
    };
  },
  apollo: {
    myPyramidAffiliates: { 
      query: MyPyramidAffiliates,
      result (res) {
        if (!res.loading) {
          this.count = res.data.myPyramidAffiliates
        }
      }
    }
  },
  methods: {
  }
};
</script>

<style lang="scss">
</style>
