<template>
  <header ref="heroRoot" class="course-hero" :data-loading="!courseData">
    <!-- Topographic contour drift — reuses the existing hero motion primitive.
         Purely decorative; absolutely positioned behind text. -->
    <svg
      ref="contour"
      class="course-hero__contour"
      viewBox="0 0 1200 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,60 C240,30 460,90 720,70 C920,56 1060,110 1200,80" />
      <path d="M0,130 C220,100 520,180 760,140 C980,108 1080,180 1200,150" />
      <path d="M0,210 C260,180 540,260 820,220 C1020,190 1140,260 1200,230" />
    </svg>

    <span class="course-hero__kicker">{{ $t('دورة') }}</span>

    <h1
      v-if="courseData && courseData.title"
      ref="titleEl"
      class="course-hero__title"
      data-hero-title
    >
      {{ courseData.title }}
    </h1>
    <ds-skeleton v-else shape="line" width="72%" height="3.25rem" />

    <!-- The brief now lives in full (with read-more) in the الوصف section
         below; the old truncated hero teaser duplicated it, so it was removed. -->

    <ul class="course-hero__meta">
      <li v-if="leadInstructor">
        <span class="course-hero__meta-avatar">
          <img
            v-if="leadInstructor.image"
            :src="FORMAT_THE_IAMGE_URL(leadInstructor.image)"
            :alt="leadInstructor.name"
          />
          <span v-else aria-hidden="true">{{ leadInstructor.initial }}</span>
        </span>
        <span class="course-hero__meta-text">
          <span class="course-hero__meta-label">{{ $t('المدرب') }}</span>
          <strong>{{ leadInstructor.name }}</strong>
        </span>
      </li>

      <li v-if="courseData && courseData.courseHours">
        <span class="course-hero__meta-icon" aria-hidden="true">◷</span>
        <span class="course-hero__meta-text">
          <span class="course-hero__meta-label">{{ $t('المدة') }}</span>
          <strong>{{ courseData.courseHours }} {{ $t('ساعة') }}</strong>
        </span>
      </li>

      <li v-if="lessonTotal > 0">
        <span class="course-hero__meta-icon" aria-hidden="true">▤</span>
        <span class="course-hero__meta-text">
          <span class="course-hero__meta-label">{{ $t('الدروس') }}</span>
          <strong>{{ lessonTotal }}</strong>
        </span>
      </li>

      <li v-if="courseData && courseData.enrollmentCount">
        <span class="course-hero__meta-icon" aria-hidden="true">◉</span>
        <span class="course-hero__meta-text">
          <span class="course-hero__meta-label">{{ $t('الملتحقون') }}</span>
          <strong>{{ formatCount(courseData.enrollmentCount) }}</strong>
        </span>
      </li>

      <li v-if="courseData && courseData.courseLanguage && courseData.courseLanguage.languageName">
        <span class="course-hero__meta-icon" aria-hidden="true">⏶</span>
        <span class="course-hero__meta-text">
          <span class="course-hero__meta-label">{{ $t('اللغة') }}</span>
          <strong>{{ courseData.courseLanguage.languageName }}</strong>
        </span>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import { contourDrift } from 'src/design-system/motion.js'
import type { CourseDetail } from 'src/types/courses/types'

interface LeadInstructor {
  name: string
  image: string
  initial: string
}

interface Props {
  courseData: CourseDetail | null
  leadInstructor: LeadInstructor | null
  lessonTotal: number
}

defineProps<Props>()

const heroRoot = ref<HTMLElement | null>(null)
const contour = ref<SVGElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let motionHandle: any = null

onMounted(() => {
  if (contour.value) {
    motionHandle = contourDrift(contour.value, { distance: '2%', duration: 38 })
  }
})

onBeforeUnmount(() => {
  motionHandle?.kill?.()
  motionHandle = null
})

function formatCount(n: number | null | undefined): string {
  const num = Number(n)
  if (!Number.isFinite(num)) return '0'
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
  return String(num)
}

defineExpose({ titleEl })
</script>

<style lang="scss" scoped>
.course-hero {
  position: relative;
  // Bottom padding kept minimal: the hero no longer carries a summary, so the
  // only separation from the description below is the main column's row-gap.
  padding-block: var(--ds-space-8) 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  isolation: isolate;

  &__contour {
    position: absolute;
    inset: 0;
    inline-size: 110%;
    block-size: 100%;
    fill: none;
    stroke: var(--ds-brand-600);
    stroke-width: 1;
    opacity: 0.06;
    z-index: -1;
    pointer-events: none;
  }

  &__kicker {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-sm);
    letter-spacing: 0.14em;
    color: var(--ds-brand-600);
    background: var(--ds-brand-50, rgba(50, 40, 115, 0.08));
    padding: 0.35em 0.95em;
    border-radius: var(--ds-radius-pill);
    align-self: flex-start;
    line-height: 1.2;
  }

  &__title {
    font-family: var(--ds-font-display, var(--ds-font-heading));
    font-weight: 700;
    font-size: clamp(2rem, 3.2vw + 1rem, 3.25rem);
    line-height: 1.15;
    color: var(--ds-ink, var(--ds-text));
    margin: 0;
    letter-spacing: -0.01em;
    max-inline-size: 28ch;
  }

  &__meta {
    list-style: none;
    margin: var(--ds-space-2) 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-5) var(--ds-space-6);

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      min-inline-size: 0;
    }
  }

  &__meta-avatar {
    inline-size: 2.25rem;
    block-size: 2.25rem;
    border-radius: 50%;
    overflow: hidden;
    background: var(--ds-surface-muted);
    border: 2px solid var(--ds-surface-elevated, #fff);
    box-shadow: var(--ds-shadow-xs);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img { inline-size: 100%; block-size: 100%; object-fit: cover; }
    span {
      font-family: var(--ds-font-heading);
      font-weight: 700;
      color: var(--ds-brand-700);
    }
  }

  &__meta-icon {
    color: var(--ds-brand-600);
    font-size: 1.1rem;
    line-height: 1;
  }

  &__meta-text {
    display: inline-flex;
    flex-direction: column;
    line-height: 1.25;
  }

  &__meta-label {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__meta-text strong {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    font-variant-numeric: tabular-nums;
  }
}
</style>
