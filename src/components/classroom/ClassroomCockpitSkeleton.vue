<template>
  <div
    class="cls-skel"
    :data-variant="variant"
    role="status"
    :aria-label="$t('classroom.header.loading')"
  >
    <!-- Curriculum rail placeholder (full variant only; desktop only) -->
    <div v-if="variant === 'full'" class="cls-skel__rail" aria-hidden="true">
      <div v-for="n in 5" :key="`u${n}`" class="cls-skel__rail-group">
        <div class="cls-skel__bar cls-skel__bar--lg" />
        <div class="cls-skel__bar" />
        <div class="cls-skel__bar cls-skel__bar--short" />
      </div>
    </div>

    <!-- Player / stage placeholder -->
    <div class="cls-skel__stage" aria-hidden="true">
      <div class="cls-skel__player" />
      <div class="cls-skel__bar cls-skel__bar--title" />
      <div class="cls-skel__bar cls-skel__bar--short" />
      <div class="cls-skel__rows">
        <div v-for="n in 4" :key="`r${n}`" class="cls-skel__bar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton screen for the classroom cockpit while the bootstrap queries resolve.
// Replaces the bare centered spinner so the user sees the page's structure
// immediately instead of a blank dark screen.
//
//   - variant="full"  → rail (desktop) + stage. Used by ClassroomShell, the
//                        transient entry route before it redirects to a lesson.
//   - variant="stage" → just the player/stage block. Used inside
//                        ClassroomContentView, where the real rail already
//                        renders its own skeleton.
defineOptions({ name: 'ClassroomCockpitSkeleton' })
withDefaults(defineProps<{ variant?: 'full' | 'stage' }>(), { variant: 'full' })
</script>

<style lang="scss" scoped>
@use 'src/design-system/classroom/tokens.scss';

.cls-skel {
  display: flex;
  flex: 1 1 auto;
  align-self: stretch;
  inline-size: 100%;
  min-block-size: 0;
  overflow: hidden;

  &__rail {
    flex: 0 0 var(--cls-rail-w, 320px);
    background: var(--cls-rail-bg, #120e22);
    border-inline-end: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
    padding: var(--ds-space-3, 12px);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4, 16px);
    overflow: hidden;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__rail-group {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2, 8px);
  }

  &__stage {
    flex: 1 1 auto;
    min-inline-size: 0;
    padding: var(--ds-space-4, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3, 12px);
    overflow: hidden;
  }

  &__player {
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--cls-radius-md, 12px);
    background: var(--cls-surface-elevated, #1a1430);
    animation: cls-skel-pulse 1.2s ease-in-out infinite;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2, 8px);
    margin-block-start: var(--ds-space-3, 12px);
  }

  &__bar {
    height: 12px;
    border-radius: var(--cls-radius-sm, 8px);
    background: var(--cls-rail-hover, #1e1834);
    animation: cls-skel-pulse 1.2s ease-in-out infinite;

    &--lg {
      height: 16px;
      inline-size: 70%;
    }
    &--short {
      inline-size: 45%;
    }
    &--title {
      height: 22px;
      inline-size: 55%;
      margin-block-start: var(--ds-space-2, 8px);
    }
  }
}

@keyframes cls-skel-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
</style>
