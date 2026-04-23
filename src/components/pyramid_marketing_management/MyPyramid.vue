<template>
  <div class="my-pyramid">
    <my-pyramid-participants class="my-pyramid__col" />
    <my-pyramid-rewards class="my-pyramid__col" />
  </div>
</template>

<script>
import MyPyramidParticipants from 'src/components/pyramid_marketing_management/MyPyramidParticipants.vue'
import MyPyramidRewards from 'src/components/pyramid_marketing_management/MyPyramidRewards.vue'

export default {
  name: 'MyPyramid',
  components: {
    'my-pyramid-participants': MyPyramidParticipants,
    'my-pyramid-rewards': MyPyramidRewards
  }
}
</script>

<style lang="scss" scoped>
.my-pyramid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-4);

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
