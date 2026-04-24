<template>
  <ds-card interactive class="course-card" @click="openClassroom">
    <template #media>
      <div class="course-card__media">
        <img
          v-if="course.cover"
          :src="FORMAT_THE_IAMGE_URL(course.cover)"
          :alt="course.title"
        />
        <img v-else src="~assets/img/imagback.png" :alt="course.title" />
        <ds-badge v-if="statusBadge" :variant="statusBadge.variant" class="course-card__badge">
          {{ statusBadge.label }}
        </ds-badge>
      </div>
    </template>

    <h3 class="course-card__title">{{ course.title }}</h3>

    <ds-progress-bar
      :value="progressPercent"
      :variant="isCompleted ? 'success' : 'brand'"
      show-label
      size="sm"
    />

    <template #footer>
      <ds-button
        tag="a"
        :href="classroomUrl"
        :variant="isCompleted ? 'secondary' : 'accent'"
        full-width
        @click.stop
      >
        {{ ctaLabel }}
      </ds-button>
    </template>
  </ds-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type { Enrollment } from 'src/types/enrollments/types'

interface Props {
  course: Enrollment['course']
  totalFinishedCourseContents?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalFinishedCourseContents: 0,
})

const { t } = useI18n()

const progressPercent = computed(() => {
  const total = (props.course.courseunitSet.edges ?? []).reduce(
    (acc, unit) => acc + (unit?.node?.courseunitcontentSet.totalCount ?? 0),
    0
  )
  if (total <= 0) return 0
  return Math.round((props.totalFinishedCourseContents / total) * 100)
})

const isCompleted = computed(() => progressPercent.value >= 100)
const isNotStarted = computed(() => progressPercent.value === 0)
const isInProgress = computed(() => !isCompleted.value && !isNotStarted.value)

interface BadgeConfig {
  label: string
  variant: string
}

const statusBadge = computed<BadgeConfig | null>(() => {
  if (isCompleted.value) return { label: t('مكتمل'), variant: 'success' }
  if (isInProgress.value) return { label: t('قيد التقدم'), variant: 'brand' }
  return null
})

const ctaLabel = computed(() => {
  if (isCompleted.value) return t('مراجعة الكورس')
  if (isInProgress.value) return t('متابعة التعلم')
  return t('اذهب الى الدرس')
})

const classroomUrl = computed(
  () => `${location.origin}/classroom/#/class/${props.course.pk}/`
)

function openClassroom (): void {
  window.location.href = classroomUrl.value
}
</script>

<style lang="scss" scoped>
.course-card {
  block-size: calc(100% - var(--ds-space-6));
  margin-block-end: var(--ds-space-6);

  &__media {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
      transition: transform var(--ds-duration-slow) var(--ds-ease-out);
    }
  }

  &:hover &__media img { transform: scale(1.04); }

  &__badge {
    position: absolute;
    inset-block-start: var(--ds-space-3);
    inset-inline-start: var(--ds-space-3);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-block-size: calc(var(--ds-text-md) * var(--ds-leading-tight) * 2);
  }
}
</style>
