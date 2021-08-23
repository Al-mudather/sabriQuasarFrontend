<template>
  <div class="row">
      <div class="col-lg-6 col-sm-12 col-xs-12">
        <my-pyramid-participants />
      </div>
      <div class="col-lg-6 col-sm-12 col-xs-12">
        <my-pyramid-rewards />
      </div>
  </div>
</template>

<script>
import MyPyramidParticipants from 'src/components/pyramid_marketing_management/MyPyramidParticipants.vue'
import MyPyramidRewards from 'src/components/pyramid_marketing_management/MyPyramidRewards.vue'

export default {
  name: "MyPyramid",
  data() {
    return {
    };
  },
  components: {
    'my-pyramid-participants': MyPyramidParticipants,
    'my-pyramid-rewards': MyPyramidRewards
  }
};
</script>

<style lang="scss">
</style>
