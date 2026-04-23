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
        @click.native.stop
      >
        {{ ctaLabel }}
      </ds-button>
    </template>
  </ds-card>
</template>

<script>
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

export default {
  name: 'CourseCard',

  props: {
    course: { type: Object, required: true },
    totalFinishedCourseContents: { type: Number, default: 0 }
  },

  data () {
    return { FORMAT_THE_IAMGE_URL }
  },

  computed: {
    progressPercent () {
      const total = this.course.courseunitSet.edges.reduce(
        (acc, unit) => acc + unit.node.courseunitcontentSet.totalCount,
        0
      )
      if (total <= 0) return 0
      return Math.round((this.totalFinishedCourseContents / total) * 100)
    },

    isCompleted () { return this.progressPercent >= 100 },
    isNotStarted () { return this.progressPercent === 0 },
    isInProgress () { return !this.isCompleted && !this.isNotStarted },

    statusBadge () {
      if (this.isCompleted)  return { label: this.$t('مكتمل'),     variant: 'success' }
      if (this.isInProgress) return { label: this.$t('قيد التقدم'), variant: 'brand' }
      return null
    },

    ctaLabel () {
      if (this.isCompleted)  return this.$t('مراجعة الكورس')
      if (this.isInProgress) return this.$t('متابعة التعلم')
      return this.$t('اذهب الى الدرس')
    },

    classroomUrl () {
      return `${location.origin}/classroom/#/class/${this.course.pk}/`
    }
  },

  methods: {
    openClassroom () { window.location.href = this.classroomUrl }
  }
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
