<template>
  <section class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('عن الكورس') }}</h2>
    </header>
    <div v-if="courseData && courseData.brief" class="cd-section__prose" v-html="courseData.brief"></div>
    <div v-else class="cd-section__skeleton">
      <ds-skeleton shape="line" width="100%" />
      <ds-skeleton shape="line" width="92%" />
      <ds-skeleton shape="line" width="70%" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CourseDetail } from 'src/types/courses/types'

defineProps<{
  courseData: CourseDetail | null
}>()
</script>

<style lang="scss" scoped>
.cd-section {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  box-shadow: var(--ds-shadow-xs);

  &__head {
    margin-block-end: var(--ds-space-3);
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }

  &__prose {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text);

    :deep(*) {
      p { margin: 0 0 var(--ds-space-3); }
      p:last-child { margin-block-end: 0; }
      ul, ol { padding-inline-start: var(--ds-space-5); margin: 0 0 var(--ds-space-3); }
      li { margin-block-end: var(--ds-space-1); }
      strong, b { color: var(--ds-text); font-weight: var(--ds-weight-bold); }
      a { color: var(--ds-brand-600); text-decoration: underline; }
    }
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}
</style>
