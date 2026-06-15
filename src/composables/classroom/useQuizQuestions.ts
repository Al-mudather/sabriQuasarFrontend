// Quiz questions composable — mirrors CourseClassRoom2 quiz.vue + question_card.vue.
//
// The CC2 pattern is per-question, not batch:
//   - Load AllContentQuizQuestionByContentQuizId(contentQuizId)
//   - Each answer sent individually via CreateCourseQuizSolution({question, userAnswer})
//   - After mutation, refetch the questions query so the UI re-renders with the
//     learner's answer + correct/incorrect mark + `why` explanation.
//
// NOTE: the `contentQuizId` is the ContentQuizNode.id (Relay global id), NOT
// the CourseUnitContent.pk. It lives inside modelValue.id when the content
// node's modelName === "ContentQuiz".

import { computed, isRef, unref, type ComputedRef, type Ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { AllContentQuizQuestionByContentQuizIdQuery } from 'src/graphql/classroom/query/AllContentQuizQuestionByContentQuizId'
import { CreateCourseQuizSolution } from 'src/graphql/classroom/mutation/CreateCourseQuizSolution'
import type {
  AllContentQuizQuestionByContentQuizIdResult,
  AllContentQuizQuestionByContentQuizIdVars,
  CreateCourseQuizSolutionResult,
  CreateCourseQuizSolutionVars,
} from 'src/types/classroom/types'

type NumLike = number | Ref<number | null | undefined> | null | undefined

function toNum(v: NumLike): number | null {
  const raw = isRef(v) ? unref(v) : v
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : null
}

export type QuizEdge = NonNullable<
  NonNullable<
    AllContentQuizQuestionByContentQuizIdResult['allContentQuizQuestionByContentQuiz']
  >['edges'][number]
>

export function useQuizQuestions(contentQuizId: NumLike): {
  questions: ComputedRef<QuizEdge[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
  submit: (questionPk: number, answerPk: number) => Promise<boolean>
} {
  const vars = computed<AllContentQuizQuestionByContentQuizIdVars>(() => ({
    contentQuizId: toNum(contentQuizId) ?? 0,
    filters: null as unknown as AllContentQuizQuestionByContentQuizIdVars['filters'],
  }))
  const enabled = computed(() => toNum(contentQuizId) !== null)

  const { result, loading, error, refetch } = useQuery<
    AllContentQuizQuestionByContentQuizIdResult,
    AllContentQuizQuestionByContentQuizIdVars
  >(AllContentQuizQuestionByContentQuizIdQuery, vars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  }))

  const questions = computed<QuizEdge[]>(() => {
    const edges = result.value?.allContentQuizQuestionByContentQuiz?.edges ?? []
    return edges.filter((e): e is QuizEdge => e != null)
  })

  const { mutate: runSubmit } = useMutation<
    CreateCourseQuizSolutionResult,
    CreateCourseQuizSolutionVars
  >(CreateCourseQuizSolution)

  async function submit(questionPk: number, answerPk: number): Promise<boolean> {
    try {
      const res = await runSubmit({
        input: { question: questionPk, userAnswer: answerPk },
      })
      const ok = Boolean(res?.data?.createCourseQuizSolution?.success)
      if (ok) void refetch()
      return ok
    } catch {
      return false
    }
  }

  return {
    questions,
    loading,
    error: error as Ref<Error | null>,
    refetch: () => {
      if (enabled.value) void refetch()
    },
    submit,
  }
}
