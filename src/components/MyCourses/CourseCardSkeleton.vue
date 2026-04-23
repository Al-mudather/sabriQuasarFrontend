<template>
  <ds-card class="course-card-skeleton">
    <template #media>
      <ds-skeleton shape="rect" height="100%" radius="0" />
    </template>
    <ds-skeleton shape="rect" height="7px" radius="999px" />
    <ds-skeleton shape="line" width="85%" />
    <ds-skeleton shape="line" width="55%" />
    <template #footer>
      <ds-skeleton shape="pill" width="100%" />
    </template>
  </ds-card>
</template>

<script>
export default {
  name: 'CourseCardSkeleton'
}
</script>

<style lang="scss" scoped>
.course-card-skeleton {
  height: calc(100% - 25px);
  margin-block-end: 25px;
}
</style>
