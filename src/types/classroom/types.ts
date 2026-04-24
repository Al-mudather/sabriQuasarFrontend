// Type-safety source of truth for the CLASSROOM feature.
//
// Mirrors the data shapes from CourseClassRoom2 (the source-of-truth reference
// app) but narrowed for Vue 3 + TS + Apollo v3. Polymorphic content is carried
// as `modelName` + `modelValue` (JSON string) on each CourseUnitContentNode —
// the same contract the backend serves. The FE parses `modelValue` at the
// point of render and narrows to one of the `Parsed*Value` shapes below.
//
// Per-op Result/Vars aliases are thin wrappers over codegen symbols.

import type {
  EnrollmentNode,
  CourseUnitContentNode,
  LearningProgressNode,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
  GetEnrollmentByCourseForCurrentUserQuery,
  GetEnrollmentByCourseForCurrentUserQueryVariables,
  GetAllCourseUnitsByCourseIdQuery,
  GetAllCourseUnitsByCourseIdQueryVariables,
  GetAllLearningProgressByCourseQuery,
  GetAllLearningProgressByCourseQueryVariables,
  AllContentQuizQuestionByContentQuizIdQuery,
  AllContentQuizQuestionByContentQuizIdQueryVariables,
  StartLearningUnitMutation,
  StartLearningUnitMutationVariables,
  EndLearningUnitMutation,
  EndLearningUnitMutationVariables,
  CreateCourseQuizSolutionMutation,
  CreateCourseQuizSolutionMutationVariables,
  ProgressInput,
  CreateCourseQuizSolutionInput,
} from 'src/graphql/generated'

// ---------------------------------------------------------------------------
// Raw node re-exports (convenience).
// ---------------------------------------------------------------------------

export type RawEnrollmentNode = EnrollmentNode
export type RawCourseUnitContentNode = CourseUnitContentNode
export type RawLearningProgressNode = LearningProgressNode

// ---------------------------------------------------------------------------
// modelName / modelValue contract.
//
// `modelName` is the Django content-type-style tag the server sends:
//   "ContentVideo" | "ContentQuiz" | "ContentFile"
// `modelValue` is a JSON string; the shape depends on modelName.
// ---------------------------------------------------------------------------

export type ContentKind = 'video' | 'quiz' | 'file' | 'unknown'

export function kindFromModelName(modelName: string | null | undefined): ContentKind {
  const n = (modelName ?? '').toLowerCase()
  if (n.includes('video')) return 'video'
  if (n.includes('quiz')) return 'quiz'
  if (n.includes('file')) return 'file'
  return 'unknown'
}

/** Video content payload (the shape inside `modelValue` when modelName === 'ContentVideo'). */
export type ParsedVideoValue = {
  /** Provider discriminator. Known value: "TYPE_HASIF" (self-hosted HLS). */
  video_type?: string | null
  /** For TYPE_HASIF: videoData.videoUuid is the HLS stream key. */
  video_metadata?: {
    videoData?: { videoUuid?: string | null } | null
  } | null
  /** Server-rendered VdoCipher iframe HTML blob (when set). */
  cipher_iframe?: string | null
  /** Vimeo/YouTube: numeric id or full URL. */
  video?: string | null
  /** Optional display fields. */
  title?: string | null
  description?: string | null
  duration?: number | string | null
}

export type ParsedQuizValue = {
  /** Backend sends the ContentQuizNode id on the quiz content. */
  id?: string | null
  quiz_title?: string | null
  is_mandatory?: boolean | null
  title?: string | null
}

export type ParsedFileValue = {
  attachment?: string | null
  title?: string | null
  description?: string | null
}

/** Narrow-safe JSON.parse — returns null instead of throwing on invalid JSON. */
export function parseModelValue<T>(raw: string | null | undefined): T | null {
  if (!raw || typeof raw !== 'string') return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Video provider discriminator.
// ---------------------------------------------------------------------------

export type VideoProvider = 'type_hasif' | 'vdocipher' | 'vimeo' | 'youtube' | 'unknown'

/**
 * Resolve which playback pipeline to use for a ParsedVideoValue.
 *
 * Priority mirrors CourseClassRoom2/src/pages/Class_managements/class.vue:243-279:
 *   1. video_type === "TYPE_HASIF"     → 'type_hasif' (self-hosted HLS + ClearKey DRM)
 *   2. cipher_iframe truthy            → 'vdocipher' (server-rendered iframe blob)
 *   3. video contains "youtube"        → 'youtube' (iframe)
 *   4. otherwise                       → 'vimeo' (default iframe / SDK)
 */
export function resolveVideoProvider(v: ParsedVideoValue | null | undefined): VideoProvider {
  if (!v) return 'unknown'
  const vt = (v.video_type ?? '').toUpperCase()
  if (vt === 'TYPE_HASIF') return 'type_hasif'
  if (v.cipher_iframe) return 'vdocipher'
  const url = (v.video ?? '').toLowerCase()
  if (url.includes('youtube')) return 'youtube'
  if (v.video) return 'vimeo'
  return 'unknown'
}

// ---------------------------------------------------------------------------
// UI-facing classroom shapes.
// ---------------------------------------------------------------------------

export type CurriculumContent = {
  pk: number
  id: string
  isFree: boolean
  isMandatory: boolean
  /** Raw Django model name from the server (e.g. "ContentVideo"). */
  modelName: string
  /** Normalized discriminator for switch statements. */
  kind: ContentKind
  /** Raw JSON string; parse on demand with `parseModelValue`. */
  modelValueRaw: string | null
  title: string
  order: number
  completed: boolean
  inProgress: boolean
}

export type CurriculumUnit = {
  pk: number
  id: string
  title: string
  order: number
  contents: CurriculumContent[]
}

export type ClassroomBootstrap = {
  /** Enrollment pk (canonical identifier downstream: progress, quiz submit). */
  enrollmentPk: number
  /** Course pk from the URL. */
  coursePk: number
  courseTitle: string
  courseCover: string | null
  hasCertificate: boolean
  /** Count of visible (video + quiz + file) rows; excludes NoneType. */
  totalContents: number
  /** Completed *videos* (progress ring denominator is totalVideos). */
  completedContents: number
  /** 0..100 integer percent over videos only. */
  progressPercent: number
  /** Count of video-kind rows; denominator for the progress ring. */
  totalVideos: number
  units: CurriculumUnit[]
}

// ---------------------------------------------------------------------------
// Progress map used by the rail for completion ticks.
// ---------------------------------------------------------------------------

export type ProgressEntry = {
  /** The learning-progress row pk (needed by EndLearningUnit). */
  pk: number
  begin: string | null
  complete: string | null
}

/** Keyed by courseUnitContent.pk. */
export type ProgressMap = Record<number, ProgressEntry>

// ---------------------------------------------------------------------------
// Per-operation Result / Vars aliases (from codegen).
// ---------------------------------------------------------------------------

export type GetCourseByIdResult = GetCourseByIdQuery
export type GetCourseByIdVars = GetCourseByIdQueryVariables

export type GetEnrollmentByCourseForCurrentUserResult = GetEnrollmentByCourseForCurrentUserQuery
export type GetEnrollmentByCourseForCurrentUserVars = GetEnrollmentByCourseForCurrentUserQueryVariables

export type GetAllCourseUnitsByCourseIDResult = GetAllCourseUnitsByCourseIdQuery
export type GetAllCourseUnitsByCourseIDVars = GetAllCourseUnitsByCourseIdQueryVariables

export type GetAllLearningProgressByCourseResult = GetAllLearningProgressByCourseQuery
export type GetAllLearningProgressByCourseVars = GetAllLearningProgressByCourseQueryVariables

export type AllContentQuizQuestionByContentQuizIdResult = AllContentQuizQuestionByContentQuizIdQuery
export type AllContentQuizQuestionByContentQuizIdVars = AllContentQuizQuestionByContentQuizIdQueryVariables

export type StartLearningUnitResult = StartLearningUnitMutation
export type StartLearningUnitVars = StartLearningUnitMutationVariables

export type EndLearningUnitResult = EndLearningUnitMutation
export type EndLearningUnitVars = EndLearningUnitMutationVariables

export type CreateCourseQuizSolutionResult = CreateCourseQuizSolutionMutation
export type CreateCourseQuizSolutionVars = CreateCourseQuizSolutionMutationVariables

export type { ProgressInput, CreateCourseQuizSolutionInput }
