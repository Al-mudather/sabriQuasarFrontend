// Type-safety source of truth for the Q&A feature.
// Course Q&A threads, replies, archival, real-time subscription.
// Type-only re-exports and entity extractors over generated GraphQL types.

import type {
  AllQuestionsByCourseQuery,
  AllQuestionsByCourseQueryVariables,
  AllQuestionRepliesForQuestionQuery,
  AllQuestionRepliesForQuestionQueryVariables,
  CreateCourseQuestionMutation,
  CreateCourseQuestionMutationVariables,
  CreateQuestionReplyMutation,
  CreateQuestionReplyMutationVariables,
  ArchiveCourseQuestionMutation,
  ArchiveCourseQuestionMutationVariables,
  ArchiveQuestionReplyMutation,
  ArchiveQuestionReplyMutationVariables,
  QuestionAndAnswerSubscription,
  QuestionAndAnswerSubscriptionVariables,
} from 'src/graphql/generated'

// --- Entity extractors (edge.node) ---

export type CourseQuestion = NonNullable<
  NonNullable<
    NonNullable<AllQuestionsByCourseQuery['allQuestionsByCourse']>['edges'][number]
  >['node']
>

export type QuestionReply = NonNullable<
  NonNullable<
    NonNullable<
      AllQuestionRepliesForQuestionQuery['allQuestionRepliesForQuestion']
    >['edges'][number]
  >['node']
>

// --- Queries ---

export type QuestionsByCourseResult = AllQuestionsByCourseQuery
export type QuestionsByCourseVars = AllQuestionsByCourseQueryVariables

export type QuestionRepliesForQuestionResult = AllQuestionRepliesForQuestionQuery
export type QuestionRepliesForQuestionVars = AllQuestionRepliesForQuestionQueryVariables

// --- Mutations ---

export type CreateCourseQuestionResult = CreateCourseQuestionMutation
export type CreateCourseQuestionVars = CreateCourseQuestionMutationVariables

export type CreateQuestionReplyResult = CreateQuestionReplyMutation
export type CreateQuestionReplyVars = CreateQuestionReplyMutationVariables

export type ArchiveCourseQuestionResult = ArchiveCourseQuestionMutation
export type ArchiveCourseQuestionVars = ArchiveCourseQuestionMutationVariables

export type ArchiveQuestionReplyResult = ArchiveQuestionReplyMutation
export type ArchiveQuestionReplyVars = ArchiveQuestionReplyMutationVariables

// --- Subscription ---

export type QnaSubscriptionPayload = QuestionAndAnswerSubscription
export type QnaSubscriptionVars = QuestionAndAnswerSubscriptionVariables
