<script setup lang="ts">
/*
  QuizRunner — per-question model (mirrors CourseClassRoom2 quiz.vue + question_card.vue).

  Each question is independent:
    - Learner picks one answer
    - "Send" button fires CreateCourseQuizSolution({question, userAnswer})
    - After mutation success, the questions query refetches; the backend
      returns `coursequizsolutionSet` (the learner's solution) and
      `isCorrect`/`why` on answers — UI renders correctness + explanation.

  No aggregate score, no pass/fail threshold. The run ends when the learner
  has answered every question (or moves on); content completion is driven
  by the enclosing ClassroomContentView via Start/EndLearningUnit.
*/
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import QuizQuestion from './QuizQuestion.vue'
import { useQuizQuestions, type QuizEdge } from 'src/composables/classroom/useQuizQuestions'

interface Props {
  /** ContentQuizNode.id from modelValue.id (NOT the content-unit-content pk). */
  contentQuizId: number
  /** Optional quiz title from parsed modelValue. */
  title?: string | null
}

const props = defineProps<Props>()
const { t } = useI18n()

const { questions, loading, error, submit } = useQuizQuestions(() => props.contentQuizId)

const answeredCount = computed(() => {
  let n = 0
  for (const e of questions.value) {
    if ((e.node?.coursequizsolutionSet?.edges?.length ?? 0) > 0) n += 1
  }
  return n
})

async function onAnswer(edge: QuizEdge, answerPk: number): Promise<void> {
  const qpk = edge.node?.pk
  if (typeof qpk !== 'number') return
  await submit(qpk, answerPk)
}
</script>

<template>
  <div class="cls-quiz">
    <header class="cls-quiz__head">
      <h2 class="cls-quiz__title">{{ props.title || t('classroom.quiz.title') }}</h2>
      <p v-if="questions.length > 0" class="cls-quiz__count">
        {{ answeredCount }} / {{ questions.length }}
      </p>
    </header>

    <div v-if="loading && questions.length === 0" class="cls-quiz__loading" role="status">
      <q-spinner size="32px" />
    </div>

    <ClassroomEmptyState
      v-else-if="error"
      :title="t('classroom.quiz.errorTitle')"
      :description="error.message || t('classroom.quiz.errorDescription')"
      icon="error_outline"
    />

    <ClassroomEmptyState
      v-else-if="questions.length === 0"
      :title="t('classroom.quiz.errorTitle')"
      :description="t('classroom.quiz.errorDescription')"
      icon="quiz"
    />

    <div v-else class="cls-quiz__list">
      <QuizQuestion
        v-for="(edge, idx) in questions"
        :key="edge.node?.pk ?? idx"
        :edge="edge"
        :index="idx + 1"
        :total="questions.length"
        @answer="(pk) => onAnswer(edge, pk)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cls-quiz {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  inline-size: 100%;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary, #F5F2EA);
  }

  &__count {
    margin: 0;
    color: var(--cls-text-muted, #9890A8);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-block-size: 200px;
    color: var(--cls-text-muted);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }
}
</style>
