<template>
  <!-- Mirrors the cockpit layout (rail | player | panel) so the loading state
       reads as the classroom filling in, not a spinner hanging. The rail aside
       is hidden on mobile, matching ClassroomContentView. -->
  <div class="cls-skel" role="status" :aria-label="$t('classroom.header.loading')">
    <aside class="cls-skel__rail">
      <q-skeleton type="text" width="55%" class="cls-skel__rail-title" />
      <div v-for="n in 7" :key="n" class="cls-skel__rail-item">
        <q-skeleton type="QAvatar" size="20px" />
        <div class="cls-skel__rail-lines">
          <q-skeleton type="text" :width="`${70 - (n % 3) * 12}%`" />
          <q-skeleton type="text" width="32%" height="8px" />
        </div>
      </div>
    </aside>

    <section class="cls-skel__main">
      <q-skeleton class="cls-skel__player" />
    </section>

    <aside class="cls-skel__panel">
      <q-skeleton type="text" width="40%" />
      <q-skeleton type="text" width="80%" />
      <q-skeleton type="text" width="65%" />
      <q-skeleton type="rect" height="44px" class="cls-skel__panel-btn" />
    </aside>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ClassroomSkeleton' })
</script>

<style lang="scss" scoped>
.cls-skel {
  display: flex;
  flex: 1 1 auto;
  min-block-size: 0;
  inline-size: 100%;
  // Tone the Quasar skeletons to the dark classroom surface.
  --q-skeleton-bg: rgba(245, 242, 234, 0.06);

  :deep(.q-skeleton) {
    background: rgba(245, 242, 234, 0.07);
  }
  :deep(.q-skeleton--anim) {
    --q-skeleton-speed: 1.2s;
  }

  &__rail {
    flex: 0 0 var(--cls-rail-w, 320px);
    inline-size: var(--cls-rail-w, 320px);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-inline-end: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
  }

  &__rail-title { margin-block-end: 6px; }

  &__rail-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__rail-lines {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__main {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
    padding: 24px;
  }

  &__player {
    inline-size: 100%;
    max-inline-size: 960px;
    aspect-ratio: 16 / 9;
    border-radius: var(--cls-radius-lg, 16px);
  }

  &__panel {
    flex: 0 0 var(--cls-panel-w, 360px);
    inline-size: var(--cls-panel-w, 360px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-inline-start: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
  }

  &__panel-btn { margin-block-start: 8px; border-radius: 10px; }
}

@media (max-width: 1023px) {
  .cls-skel {
    flex-direction: column;

    &__rail,
    &__panel { display: none; }

    &__main {
      padding: 0;
      align-items: flex-start;
    }

    &__player { border-radius: 0; max-inline-size: none; }
  }
}
</style>
