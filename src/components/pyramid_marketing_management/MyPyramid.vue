<template>
  <div class="my-pyramid">
    <MyPyramidParticipants class="my-pyramid__col" />
    <MyPyramidRewards class="my-pyramid__col" />
  </div>
</template>

<script setup lang="ts">
import MyPyramidParticipants from 'src/components/pyramid_marketing_management/MyPyramidParticipants.vue'
import MyPyramidRewards from 'src/components/pyramid_marketing_management/MyPyramidRewards.vue'
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
