import type {
  AllEnrollmentsForCurrentUserQuery,
  AllEnrollmentsForCurrentUserQueryVariables,
  GetEnrollmentByCourseForCurrentUserQuery,
  GetEnrollmentByCourseForCurrentUserQueryVariables,
  // GetEnrollmentByIDQuery — not present in src/graphql/generated.ts; skipped.
} from 'src/graphql/generated'

/**
 * Entity extracted from the list query's edge.node.
 * Represents a single enrollment item (course + canonical backend progress).
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

/**
 * The backend-computed progress object on an enrollment.
 * completed / total are Ints, percentage is a Float (e.g. 43.28).
 */
export type EnrollmentProgress = NonNullable<Enrollment['progress']>

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
