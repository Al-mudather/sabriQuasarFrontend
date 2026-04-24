<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassroomProgressRing from 'src/components/classroom/ClassroomProgressRing.vue'
import type { ClassroomBootstrap } from 'src/types/classroom/types'

defineOptions({ name: 'CertificateProgress' })

interface Props {
  enrollment: ClassroomBootstrap
}

const props = defineProps<Props>()
const { t } = useI18n()

const isComplete = computed(() => props.enrollment.progressPercent >= 100)

const progressLine = computed(() =>
  t('classroom.certificate.percentComplete', {
    completed: props.enrollment.completedContents,
    total: props.enrollment.totalContents,
  }),
)
</script>

<template>
  <section class="cls-cert-progress" aria-live="polite">
    <ClassroomProgressRing
      :percent="enrollment.progressPercent"
      :size="160"
      :stroke="12"
    />

    <div class="cls-cert-progress__body">
      <h2 class="cls-cert-progress__title">
        {{ isComplete
          ? t('classroom.certificate.congrats')
          : t('classroom.certificate.notReadyTitle') }}
      </h2>
      <p class="cls-cert-progress__desc">
        {{ isComplete
          ? t('classroom.certificate.notReadyDescription')
          : t('classroom.certificate.notReadyDescription') }}
      </p>
      <p class="cls-cert-progress__count">{{ progressLine }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cls-cert-progress {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--ds-space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--ds-space-4);
  color: var(--cls-text-primary);

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    line-height: var(--ds-leading-tight);
  }

  &__desc {
    margin: 0;
    color: var(--cls-text-muted);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-normal);
  }

  &__count {
    margin: 0;
    font-size: var(--ds-text-md);
    color: var(--cls-text-primary);
    font-variant-numeric: tabular-nums;
  }
}
</style>
