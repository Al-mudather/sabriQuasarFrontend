// useQaSubscription — subscribes to QuestionAndAnswerSubscription for a
// given course and merges each payload into the cached
// `AllQuestionsByCourse` connection so the list re-renders live.
//
// Payload semantics (see QuestionAndAnswerSubscription.js):
//   - `question` present  → a question row (may be newly created, or an
//                           existing one whose reply set grew)
//   - `answer`   present  → a reply was added. The envelope does NOT carry
//                           the parent questionId field directly; we use
//                           `notification.extraData` / the updated `question`
//                           block as the source of truth. When both arrive
//                           together (typical), the `question` block already
//                           embeds the refreshed `questionreplySet`, so we
//                           just replace the cached question node.
//
// Cache write strategy: read the cached `AllQuestionsByCourse` for the
// current courseId, patch edges (prepend new / replace existing), write back.
// We use the `as unknown as` cast pattern from `useProgress.ts` to sidestep
// Apollo TS2589 generic-depth errors on readQuery/writeQuery.

import { computed, isRef, unref, watch, type Ref } from 'vue'
import { useSubscription, useApolloClient } from '@vue/apollo-composable'
import { AllQuestionsByCourse } from 'src/graphql/question_management/query/AllQuestionsByCourse'
import { QuestionAndAnswerSubscription } from 'src/graphql/question_management/subscription/QuestionAndAnswerSubscription'
import type {
  QnaSubscriptionPayload,
  QnaSubscriptionVars,
  QuestionsByCourseResult,
  QuestionsByCourseVars,
} from 'src/types/qa/types'

type CourseIdLike = number | Ref<number | null | undefined> | null | undefined

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_ORDER: string[] = ['-pk']

export function useQaSubscription(courseId: CourseIdLike): {
  error: Ref<Error | null>
} {
  const { resolveClient } = useApolloClient()

  const variables = computed<QnaSubscriptionVars>(() => {
    const v = isRef(courseId) ? unref(courseId) : courseId
    return { courseId: typeof v === 'number' ? v : 0 }
  })

  const enabled = computed(() => {
    const v = isRef(courseId) ? unref(courseId) : courseId
    return typeof v === 'number' && v > 0
  })

  const { result, error } = useSubscription<
    QnaSubscriptionPayload,
    QnaSubscriptionVars
  >(QuestionAndAnswerSubscription, variables, () => ({
    enabled: enabled.value,
  }))

  function mergePayload(payload: QnaSubscriptionPayload | undefined): void {
    if (!payload) return
    const env = payload.questionAnswerSubscription
    if (!env) return
    const cid = variables.value.courseId
    if (!cid) return

    try {
      // Cast around Apollo TS2589 depth — the cached result type is deeply
      // generic and ICE's the inference engine on some call graphs.
      const client = resolveClient() as unknown as {
        readQuery: (opts: { query: unknown; variables: unknown }) =>
          QuestionsByCourseResult | null
        writeQuery: (opts: { query: unknown; variables: unknown; data: unknown }) => void
      }
      const qVars: QuestionsByCourseVars = {
        courseId: cid,
        orderBy: DEFAULT_ORDER,
        limit: DEFAULT_PAGE_SIZE,
        cursor: null,
      }
      const cached = client.readQuery({
        query: AllQuestionsByCourse,
        variables: qVars,
      })
      if (!cached?.allQuestionsByCourse) return

      const conn = cached.allQuestionsByCourse
      const edges = conn.edges ?? []
      const incomingQuestion = env.question
      if (!incomingQuestion || incomingQuestion.pk == null) return

      // Shape a fresh edge matching the query's edge typename.
      const freshNode = {
        __typename: 'QuestionNode' as const,
        // Fabricate a stable `id` for optimistic/subscription rows.
        // When the client next refetches, Apollo's normalization keys on
        // the server's canonical id and the synthetic row is discarded.
        id: (incomingQuestion as { id?: string }).id ?? `sub:q:${incomingQuestion.pk}`,
        pk: incomingQuestion.pk,
        question: incomingQuestion.question,
        user: incomingQuestion.user,
        questionreplySet: incomingQuestion.questionreplySet,
      }
      const freshEdge = {
        __typename: 'QuestionNodeEdge' as const,
        node: freshNode,
      }

      const matchIdx = edges.findIndex((e) => e?.node?.pk === incomingQuestion.pk)
      let nextEdges: typeof edges
      let nextTotal = conn.totalCount ?? edges.length
      if (matchIdx >= 0) {
        nextEdges = edges.slice()
        nextEdges[matchIdx] = freshEdge as (typeof edges)[number]
      } else {
        // Prepend: newest question first (default order is `-pk`).
        nextEdges = [freshEdge as (typeof edges)[number], ...edges]
        nextTotal = (conn.totalCount ?? edges.length) + 1
      }

      client.writeQuery({
        query: AllQuestionsByCourse,
        variables: qVars,
        data: {
          ...cached,
          allQuestionsByCourse: {
            ...conn,
            totalCount: nextTotal,
            edges: nextEdges,
          },
        },
      })
    } catch (err) {
      console.warn('[qa/useQaSubscription] merge failed', err)
    }
  }

  watch(result, (next) => {
    if (next) mergePayload(next)
  })

  return {
    error: error as Ref<Error | null>,
  }
}
