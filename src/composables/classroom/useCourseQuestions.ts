// useCourseQuestions — wraps the AllQuestionsByCourse query with cursor
// pagination and exposes a stable UI-friendly shape.
//
// The underlying op is a Relay connection; we expose a flattened `questions`
// array of `CourseQuestion` entity nodes, plus `fetchMore()` that appends
// the next page using the cached `endCursor`.
//
// The query docs are `.js` gql-tag modules (see
// src/graphql/question_management/query/AllQuestionsByCourse.js). We import
// the document as-is and attach our typed vars/result via `useQuery`.

import { computed, isRef, unref, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { AllQuestionsByCourse } from 'src/graphql/question_management/query/AllQuestionsByCourse'
import type {
  CourseQuestion,
  QuestionsByCourseResult,
  QuestionsByCourseVars,
} from 'src/types/qa/types'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_ORDER: string[] = ['-pk']

type CourseIdLike = number | Ref<number | null | undefined> | null | undefined

export function useCourseQuestions(courseId: CourseIdLike): {
  questions: ComputedRef<CourseQuestion[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  hasNextPage: ComputedRef<boolean>
  endCursor: ComputedRef<string | null>
  totalCount: ComputedRef<number>
  fetchMore: () => Promise<void>
  refetch: () => void
} {
  const variables = computed<QuestionsByCourseVars>(() => {
    const v = isRef(courseId) ? unref(courseId) : courseId
    return {
      courseId: typeof v === 'number' ? v : 0,
      orderBy: DEFAULT_ORDER,
      limit: DEFAULT_PAGE_SIZE,
      cursor: null,
    }
  })

  const enabled = computed(() => {
    const v = isRef(courseId) ? unref(courseId) : courseId
    return typeof v === 'number' && v > 0
  })

  const { result, loading, error, fetchMore: apolloFetchMore, refetch } = useQuery<
    QuestionsByCourseResult,
    QuestionsByCourseVars
  >(AllQuestionsByCourse, variables, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  }))

  const questions = computed<CourseQuestion[]>(() => {
    const edges = result.value?.allQuestionsByCourse?.edges ?? []
    const out: CourseQuestion[] = []
    for (const edge of edges) {
      const node = edge?.node
      if (node) out.push(node)
    }
    return out
  })

  const endCursor = computed<string | null>(
    () => result.value?.allQuestionsByCourse?.pageInfo?.endCursor ?? null,
  )

  const hasNextPage = computed<boolean>(
    () => result.value?.allQuestionsByCourse?.pageInfo?.hasNextPage ?? false,
  )

  const totalCount = computed<number>(
    () => result.value?.allQuestionsByCourse?.totalCount ?? 0,
  )

  async function fetchMore(): Promise<void> {
    if (!hasNextPage.value) return
    const cursor = endCursor.value
    if (!cursor) return
    try {
      await apolloFetchMore({
        variables: { ...variables.value, cursor },
        // Merge the new edges onto the existing connection.
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.allQuestionsByCourse) return prev
          const prevConn = prev?.allQuestionsByCourse
          const nextConn = fetchMoreResult.allQuestionsByCourse
          const prevEdges = prevConn?.edges ?? []
          const nextEdges = nextConn.edges ?? []
          return {
            ...fetchMoreResult,
            allQuestionsByCourse: {
              ...nextConn,
              edges: [...prevEdges, ...nextEdges],
            },
          } as QuestionsByCourseResult
        },
      })
    } catch {
      /* fetchMore failed — keep existing page */
    }
  }

  return {
    questions,
    loading,
    error: error as Ref<Error | null>,
    hasNextPage,
    endCursor,
    totalCount,
    fetchMore,
    refetch: () => {
      void refetch()
    },
  }
}
