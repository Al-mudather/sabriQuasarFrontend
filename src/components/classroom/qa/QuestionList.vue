<script setup lang="ts">
/**
 * QuestionList — paginated list of course questions.
 *
 * Owns the `useCourseQuestions` query for a given courseId and wires
 * `useQaSubscription` so live questions/replies appear in the list without
 * a manual refetch.
 */
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseQuestions } from 'src/composables/classroom/useCourseQuestions'
import { useQaSubscription } from 'src/composables/classroom/useQaSubscription'
import QuestionItem from './QuestionItem.vue'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'

const props = defineProps<{ courseId: number }>()
const { t } = useI18n()

const courseIdRef = toRef(props, 'courseId')
const { questions, loading, error, hasNextPage, fetchMore } =
  useCourseQuestions(courseIdRef)

// Live updates — prepend new questions and refresh question rows whose reply
// set grew. Error surface is internal-only (logged); the list view degrades
// to poll-on-mount if the websocket is down.
useQaSubscription(courseIdRef)
</script>

<template>
  <section class="qa-list" aria-live="polite">
    <div v-if="error" class="qa-list__error" role="alert">
      {{ t('classroom.qa.errorTitle') }}
    </div>

    <div v-else-if="loading && questions.length === 0" class="qa-list__loading">
      <q-spinner size="28px" />
    </div>

    <ClassroomEmptyState
      v-else-if="questions.length === 0"
      :title="t('classroom.qa.noQuestions')"
      icon="forum"
    />

    <div v-else class="qa-list__items">
      <QuestionItem
        v-for="q in questions"
        :key="q.id"
        :question="q"
      />
    </div>

    <div v-if="hasNextPage && questions.length > 0" class="qa-list__more">
      <q-btn
        unelevated
        no-caps
        flat
        :label="t('classroom.qa.loadMore')"
        :loading="loading"
        class="qa-list__more-btn"
        @click="fetchMore"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.qa-list {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  &__error {
    color: #E77C5C;
    font-size: var(--ds-text-sm);
    padding: var(--ds-space-3);
    border: 1px solid var(--cls-divider);
    border-radius: var(--cls-radius-sm);
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: var(--ds-space-6);
    color: var(--cls-text-muted);
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__more {
    display: flex;
    justify-content: center;
    padding-top: var(--ds-space-2);
  }

  &__more-btn {
    color: var(--cls-accent);
    font-weight: var(--ds-weight-semibold);

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }
}
</style>
