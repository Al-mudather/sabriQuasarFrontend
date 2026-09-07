<template>
  <section class="cd-about">
    <header class="cd-about__head">
      <h2>{{ $t('الوصف') }}</h2>
    </header>

    <read-more v-if="hasBrief" :max-height="clampHeight">
      <div class="cd-about__prose" v-html="courseData?.brief ?? ''" />
    </read-more>

    <div v-else class="cd-about__skeleton">
      <ds-skeleton shape="line" width="100%" />
      <ds-skeleton shape="line" width="92%" />
      <ds-skeleton shape="line" width="70%" />
    </div>
  </section>
</template>

<script setup lang="ts">
// The clamp used to be hand-rolled here, and it was broken: `measure()` read the
// prose ref synchronously from a `flush: 'pre'` watcher, so on the only render
// that matters — the one where the GraphQL brief first arrives — the element did
// not exist yet and the "needs a toggle" flag stayed false. The fallback was a
// character-count heuristic (>480 plaintext chars), which a brief made of many
// short bullet lines never trips: the MRCP course has 453 characters spread over
// ~26 rendered lines, so 500+px of description was clamped away with no way to
// open it. ReadMore measures scrollHeight under a ResizeObserver instead, which
// is correct whenever the content arrives, and is already what the sibling
// sections on this page use.
import { computed } from 'vue'
import ReadMore from 'src/components/courseDetails/ReadMore.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import type { CourseDetail } from 'src/types/courses/types'

interface Props {
  courseData: CourseDetail | null
}

const props = defineProps<Props>()

const hasBrief = computed<boolean>(() => Boolean(props.courseData?.brief))

// Roughly 11 Arabic lines. Deliberately taller than the sibling rails (260/300):
// the description is the page's primary copy, so more of it should be readable
// before the reader has to ask for the rest.
const clampHeight = 340
</script>

<style lang="scss" scoped>
.cd-about {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  &__head h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: 700;
    color: var(--ds-text);
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__prose {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text);

    // The brief is author-entered HTML: it can carry hard-coded colours, inline
    // font sizes and images that would otherwise blow out the column.
    :deep(p) { margin: 0 0 var(--ds-space-3); }
    :deep(p:last-child) { margin-block-end: 0; }
    :deep(ul), :deep(ol) {
      padding-inline-start: var(--ds-space-5);
      margin: 0 0 var(--ds-space-3);
    }
    :deep(li) { margin-block-end: var(--ds-space-1); }
    :deep(strong), :deep(b) {
      color: var(--ds-text);
      font-weight: var(--ds-weight-bold);
    }
    :deep(a) {
      color: var(--ds-brand-600);
      text-decoration: underline;
    }
    :deep(img) {
      max-inline-size: 100%;
      block-size: auto;
      border-radius: var(--ds-radius-md);
    }
    // Long unbroken tokens (exam codes, URLs) must not force a horizontal
    // scrollbar on a 375px screen.
    :deep(*) { overflow-wrap: break-word; }
    // Author-pasted tables and <pre> scroll inside themselves instead.
    :deep(table), :deep(pre) {
      display: block;
      max-inline-size: 100%;
      overflow-x: auto;
    }
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}
</style>
