<script setup lang="ts">
/**
 * ClassroomQA — full-page Q&A view for the classroom shell.
 *
 * Pulls the courseId off the injected classroom context (enrollment) and
 * renders the composer + list. Same composition is also embedded in the
 * side-panel `#qa` slot (orchestrator concern — not this file's job).
 */
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import QuestionComposer from 'src/components/classroom/qa/QuestionComposer.vue'
import QuestionList from 'src/components/classroom/qa/QuestionList.vue'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'

defineOptions({ name: 'ClassroomQA' })

const ctx = inject(ClassroomContextKey, null)
const { t } = useI18n()

const courseId = computed<number>(() => ctx?.bootstrap.value?.coursePk ?? 0)
const ready = computed<boolean>(() => courseId.value > 0)
const loading = computed<boolean>(() => Boolean(ctx?.loading.value) && !ready.value)
</script>

<template>
  <section class="cls-qa-page">
    <div class="cls-qa-page__inner">
      <header class="cls-qa-page__header">
        <h2 class="cls-qa-page__heading">{{ t('classroom.panel.qa') }}</h2>
      </header>

      <div v-if="loading" class="cls-qa-page__loading">
        <q-spinner size="32px" />
      </div>

      <ClassroomEmptyState
        v-else-if="!ready"
        :title="t('classroom.empty.errorTitle')"
        :description="t('classroom.empty.errorDescription')"
        icon="error_outline"
      />

      <template v-else>
        <QuestionComposer :course-id="courseId" />
        <QuestionList :course-id="courseId" />
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cls-qa-page {
  min-height: 100%;
  background: var(--cls-surface);
  color: var(--cls-text-primary);
  padding: var(--ds-space-6) var(--ds-space-4);

  &__inner {
    max-width: 780px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__heading {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: var(--ds-space-8);
    color: var(--cls-text-muted);
  }
}
</style>
