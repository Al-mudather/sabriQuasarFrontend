import type {
  AllEnrollmentsForCurrentUserQuery,
  AllEnrollmentsForCurrentUserQueryVariables,
  GetEnrollmentByCourseForCurrentUserQuery,
  GetEnrollmentByCourseForCurrentUserQueryVariables,
  // GetEnrollmentByIDQuery — not present in src/graphql/generated.ts; skipped.
} from 'src/graphql/generated'

/**
 * Entity extracted from the list query's edge.node.
 * Represents a single enrollment item (course + learning progress refs).
 */
export type Enrollment = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        AllEnrollmentsForCurrentUserQuery['allEnrollmentsForCurrentUser']
      >['edges'][number]
    >['node']
  >
>

// List query: AllEnrollmentsForCurrentUser
export type AllEnrollmentsResult = AllEnrollmentsForCurrentUserQuery
export type AllEnrollmentsVars = AllEnrollmentsForCurrentUserQueryVariables

// Single-by-course query: GetEnrollmentByCourseForCurrentUser
export type EnrollmentByCourseResult = GetEnrollmentByCourseForCurrentUserQuery
export type EnrollmentByCourseVars = GetEnrollmentByCourseForCurrentUserQueryVariables

/**
 * Non-null variant of the "by course" entity (the field is nullable in the query).
 */
export type EnrollmentByCourse = NonNullable<
  GetEnrollmentByCourseForCurrentUserQuery['enrollmentByCourseForCurrentUser']
>
