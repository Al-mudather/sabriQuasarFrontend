// Type-safety source of truth for the COURSES feature.
//
// This file is TYPE-ONLY. No runtime logic. Do not add parsers here — the
// `CourseNode.currency` JSONString scalar is parsed at the network boundary
// by the Apollo typePolicy. This file narrows the emitted raw
// `Record<string, number>` into a closed-union price map for call sites.
//
// CurrencyCode is mirrored from the canonical set the backend emits
// (schema: OrderCurrency — EUR/GBP/SAR/SDG/USD) plus the UI-only code
// 'AED' that the legacy PriceDisplay/CategorySection components surface.
// Keep this list in sync with src/types/settings/types.ts.

import type {
  // Catalog / listing
  GetAllCoursesQuery,
  GetAllCoursesQueryVariables,
  AllCoursesInSpecialityQuery,
  AllCoursesInSpecialityQueryVariables,
  GetAllSpecialitiesQuery,
  GetAllSpecialitiesQueryVariables,

  // Single course
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,

  // Aggregate counts / hours
  AllCoursesHoursQuery,
  AllCoursesHoursQueryVariables,
  GetAllCoursesCountQuery,
  GetAllCoursesCountQueryVariables,
  AllInstructorCountQuery,
  AllInstructorCountQueryVariables,

  // Units + content
  GetAllCourseUnitsByCourseIdQuery,
  GetAllCourseUnitsByCourseIdQueryVariables,
  AllCourseUnitContentsByCourseContentFileQuery,
  AllCourseUnitContentsByCourseContentFileQueryVariables,

  // Instructors / prerequisites / learning outcomes
  GetAllCourseInstructorsQuery,
  GetAllCourseInstructorsQueryVariables,
  GetAllPreRequisitesByCourseQuery,
  GetAllPreRequisitesByCourseQueryVariables,
  GetAllWhatYouWillLearnByCourseIdQuery,
  GetAllWhatYouWillLearnByCourseIdQueryVariables,
} from 'src/graphql/generated'

// TODO: AllCoursesStatiscs / AllCoursesCountStatiscs missing from generated.ts
// (schema drift). GetAllCoursesCount is the closest match and is exported
// below; revisit once the backend operation lands.

// ---------------------------------------------------------------------------
// Currency scalar narrowing (fixes the JSONString `currency` leak)
// ---------------------------------------------------------------------------

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'SDG'

export type CoursePricing = Partial<Record<CurrencyCode, number>>

/** What codegen emits for `CourseNode.currency` before narrowing. */
export type RawCoursePricing = Record<string, number>

/** What feature call sites should consume after typePolicy narrowing. */
export type ParsedCoursePricing = CoursePricing

// ---------------------------------------------------------------------------
// Entities — each extracted from its connection's edge.node
// ---------------------------------------------------------------------------

export type Course = NonNullable<
  NonNullable<
    NonNullable<GetAllCoursesQuery['allCourses']>['edges'][number]
  >['node']
>

export type CourseInSpeciality = NonNullable<
  NonNullable<
    NonNullable<AllCoursesInSpecialityQuery['allCoursesInSpeciality']>['edges'][number]
  >['node']
>

export type Speciality = NonNullable<
  NonNullable<
    NonNullable<GetAllSpecialitiesQuery['allCourseSpecialities']>['edges'][number]
  >['node']
>

export type CourseDetail = NonNullable<GetCourseByIdQuery['course']>

export type CourseUnit = NonNullable<
  NonNullable<
    NonNullable<GetAllCourseUnitsByCourseIdQuery['allCourseUnits']>['edges'][number]
  >['node']
>

export type CourseUnitContent = NonNullable<
  NonNullable<
    NonNullable<
      AllCourseUnitContentsByCourseContentFileQuery['allCourseUnitContentsByCourseContentFile']
    >['edges'][number]
  >['node']
>

export type CourseInstructor = NonNullable<
  NonNullable<
    NonNullable<GetAllCourseInstructorsQuery['allCourseInstructors']>['edges'][number]
  >['node']
>

export type CoursePreRequisite = NonNullable<
  NonNullable<
    NonNullable<GetAllPreRequisitesByCourseQuery['allPrerequisiteByCourse']>['edges'][number]
  >['node']
>

export type CourseLearningOutcome = NonNullable<
  NonNullable<
    NonNullable<GetAllWhatYouWillLearnByCourseIdQuery['allWhatYouWillLearn']>['edges'][number]
  >['node']
>

// ---------------------------------------------------------------------------
// Per-operation Result / Vars aliases
// ---------------------------------------------------------------------------

// Catalog / listing
export type GetAllCoursesResult = GetAllCoursesQuery
export type GetAllCoursesVars = GetAllCoursesQueryVariables

export type AllCoursesInSpecialityResult = AllCoursesInSpecialityQuery
export type AllCoursesInSpecialityVars = AllCoursesInSpecialityQueryVariables

export type GetAllSpecialitiesResult = GetAllSpecialitiesQuery
export type GetAllSpecialitiesVars = GetAllSpecialitiesQueryVariables

// Single course
export type GetCourseByIdResult = GetCourseByIdQuery
export type GetCourseByIdVars = GetCourseByIdQueryVariables

// Aggregate counts / hours
export type AllCoursesHoursResult = AllCoursesHoursQuery
export type AllCoursesHoursVars = AllCoursesHoursQueryVariables

export type GetAllCoursesCountResult = GetAllCoursesCountQuery
export type GetAllCoursesCountVars = GetAllCoursesCountQueryVariables

export type AllInstructorCountResult = AllInstructorCountQuery
export type AllInstructorCountVars = AllInstructorCountQueryVariables

// Units + content
export type GetAllCourseUnitsByCourseIdResult = GetAllCourseUnitsByCourseIdQuery
export type GetAllCourseUnitsByCourseIdVars = GetAllCourseUnitsByCourseIdQueryVariables

export type AllCourseUnitContentsByCourseContentFileResult =
  AllCourseUnitContentsByCourseContentFileQuery
export type AllCourseUnitContentsByCourseContentFileVars =
  AllCourseUnitContentsByCourseContentFileQueryVariables

// Instructors / prerequisites / learning outcomes
export type GetAllCourseInstructorsResult = GetAllCourseInstructorsQuery
export type GetAllCourseInstructorsVars = GetAllCourseInstructorsQueryVariables

export type GetAllPreRequisitesByCourseResult = GetAllPreRequisitesByCourseQuery
export type GetAllPreRequisitesByCourseVars = GetAllPreRequisitesByCourseQueryVariables

export type GetAllWhatYouWillLearnByCourseIdResult = GetAllWhatYouWillLearnByCourseIdQuery
export type GetAllWhatYouWillLearnByCourseIdVars = GetAllWhatYouWillLearnByCourseIdQueryVariables
