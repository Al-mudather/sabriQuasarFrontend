<script setup lang="ts">
/*
  Single quiz question card. Mirrors CourseClassRoom2 question_card.vue.

  Once the learner has a solution row (`coursequizsolutionSet.edges.length > 0`)
  the radios are locked and the correct answer is revealed with its `why`
  explanation — exactly what the backend serves back after CreateCourseQuizSolution.
*/
import { computed, ref, watch } from 'vue'
import type { QuizEdge } from 'src/composables/classroom/useQuizQuestions'

interface Props {
  edge: QuizEdge
  index: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ answer: [answerPk: number] }>()

const question = computed(() => props.edge.node)
const answers = computed(() =>
  (question.value?.contentquizquestionanswerSet?.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is NonNullable<typeof n> => n != null),
)

const solutionAnswerPk = computed<number | null>(() => {
  const sol = question.value?.coursequizsolutionSet?.edges?.[0]?.node
  return sol?.userAnswer?.pk ?? null
})

const isAnswered = computed(() => solutionAnswerPk.value != null)

const selected = ref<number | null>(solutionAnswerPk.value)
watch(solutionAnswerPk, (v) => {
  if (v != null) selected.value = v
})

function onPick(pk: number): void {
  if (isAnswered.value) return
  selected.value = pk
}

function submit(): void {
  if (isAnswered.value || selected.value == null) return
  emit('answer', selected.value)
}

function answerState(pk: number): 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal' {
  if (!isAnswered.value) {
    return selected.value === pk ? 'selected' : 'idle'
  }
  const ans = answers.value.find((a) => a.pk === pk)
  if (ans?.isCorrect) {
    return solutionAnswerPk.value === pk ? 'correct' : 'reveal'
  }
  if (solutionAnswerPk.value === pk) return 'wrong'
  return 'idle'
}

function whyFor(pk: number): string | null {
  const a = answers.value.find((x) => x.pk === pk)
  return a?.why ? a.why : null
}
</script>

<template>
  <article v-if="question" class="cls-quiz-q" :aria-labelledby="`q-${question.pk}-label`">
    <header class="cls-quiz-q__head">
      <span class="cls-quiz-q__pos">{{ index }} / {{ total }}</span>
      <h3 :id="`q-${question.pk}-label`" class="cls-quiz-q__title" v-html="question.question" />
    </header>

    <ul class="cls-quiz-q__answers" role="radiogroup" :aria-labelledby="`q-${question.pk}-label`">
      <li
        v-for="a in answers"
        :key="a.pk"
        class="cls-quiz-q__answer"
        :data-state="answerState(a.pk)"
      >
        <label class="cls-quiz-q__label">
          <input
            type="radio"
            :name="`q-${question.pk}`"
            :value="a.pk"
            :checked="selected === a.pk"
            :disabled="isAnswered"
            class="cls-quiz-q__input"
            @change="onPick(a.pk)"
          />
          <span class="cls-quiz-q__bullet" aria-hidden="true" />
          <span class="cls-quiz-q__text">{{ a.answer }}</span>
        </label>
        <p
          v-if="isAnswered && answerState(a.pk) === 'correct' && whyFor(a.pk)"
          class="cls-quiz-q__why"
        >
          <span class="cls-quiz-q__why-label">{{ $t('classroom.quiz.whyLabel') }}</span>
          {{ whyFor(a.pk) }}
        </p>
      </li>
    </ul>

    <div v-if="!isAnswered" class="cls-quiz-q__actions">
      <q-btn
        unelevated
        no-caps
        class="cls-quiz-q__send"
        :label="$t('classroom.quiz.send')"
        :disable="selected == null"
        @click="submit"
      />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.cls-quiz-q {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  padding: var(--ds-space-4);
  background: var(--cls-surface, #0F0B1A);
  border: 1px solid var(--cls-border, rgba(255, 255, 255, 0.08));
  border-radius: var(--cls-radius-lg, 16px);
  color: var(--cls-text-primary, #F5F2EA);

  &__head {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }

  &__pos {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--cls-text-dim, #7a7088);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-semibold);
    line-height: var(--ds-leading-tight);
  }

  &__answers {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__answer {
    --state-border: var(--cls-border, rgba(255, 255, 255, 0.08));
    --state-bg: transparent;

    &[data-state='selected'] {
      --state-border: var(--cls-accent, #D47A5E);
      --state-bg: rgba(212, 122, 94, 0.12);
    }
    &[data-state='correct'] {
      --state-border: #22c55e;
      --state-bg: rgba(34, 197, 94, 0.14);
    }
    &[data-state='wrong'] {
      --state-border: #ef4444;
      --state-bg: rgba(239, 68, 68, 0.14);
    }
    &[data-state='reveal'] {
      --state-border: #22c55e;
      --state-bg: rgba(34, 197, 94, 0.06);
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3);
    border-radius: var(--cls-radius-md, 12px);
    border: 1px solid var(--state-border);
    background: var(--state-bg);
    cursor: pointer;
  }

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    inline-size: 0;
    block-size: 0;
  }

  &__bullet {
    flex: 0 0 auto;
    inline-size: 18px;
    block-size: 18px;
    border-radius: 50%;
    border: 2px solid var(--state-border);
    background: transparent;
    position: relative;

    .cls-quiz-q__answer[data-state='selected'] &::after,
    .cls-quiz-q__answer[data-state='correct'] &::after,
    .cls-quiz-q__answer[data-state='wrong'] &::after {
      content: '';
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: currentColor;
    }
  }

  &__text {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-base);
    line-height: var(--ds-leading-normal);
  }

  &__why {
    margin: var(--ds-space-1) 0 0 32px;
    font-size: var(--ds-text-sm);
    color: var(--cls-text-muted, #9890A8);
    line-height: 1.5;
  }

  &__why-label {
    font-weight: var(--ds-weight-semibold);
    color: #22c55e;
    margin-inline-end: 4px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__send {
    background: var(--cls-accent, #D47A5E);
    color: var(--cls-text-primary, #F5F2EA);
    border-radius: var(--cls-radius-md, 12px);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-semibold);
    padding: var(--ds-space-2) var(--ds-space-6);
  }
}
</style>
