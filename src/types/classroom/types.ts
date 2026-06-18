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
  GetCourseByIdSlimQuery,
  GetCourseByIdSlimQueryVariables,
  GetCourseUnitContentsQuery,
  GetCourseUnitContentsQueryVariables,
  GetCourseUnitContentQuery,
  GetCourseUnitContentQueryVariables,
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

/**
 * Human-friendly file name derived from an attachment URL/path: the last path
 * segment, URL-decoded, with the extension dropped and `_`/`-` turned into
 * spaces. e.g. "/media/.../High_yield_handbook_psychiatry_questions.pdf" ->
 * "High yield handbook psychiatry questions". Empty string when not derivable.
 */
export function fileNameFromAttachment(attachment: string | null | undefined): string {
  if (!attachment) return ''
  try {
    const noQuery = attachment.split(/[?#]/)[0] ?? ''
    const seg = noQuery.split('/').filter(Boolean).pop() ?? ''
    let name = decodeURIComponent(seg)
    name = name.replace(/\.[a-z0-9]{1,8}$/i, '')
    name = name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
    return name
  } catch {
    return ''
  }
}

// Placeholder titles teachers leave on a content item when they don't name it.
// The observed real-world default is the literal "File Title" — and it shows up
// on videos/quizzes too, not just files.
const GENERIC_TITLES = new Set(['file title', 'untitled', 'file', 'no title', 'new file'])

/** True when a title is empty or one of the known generic placeholders. */
export function isGenericTitle(title: string | null | undefined): boolean {
  const t = (title ?? '').trim().toLowerCase()
  return t === '' || GENERIC_TITLES.has(t)
}

/**
 * Resolve a FILE item's display title: the teacher's title when it is
 * meaningful, otherwise the real uploaded file name derived from the attachment
 * URL, otherwise the given fallback.
 */
export function resolveFileTitle(parsed: ParsedFileValue | null | undefined, fallback = 'Resource'): string {
  const title = (parsed?.title ?? '').trim()
  if (!isGenericTitle(title)) return title
  const fromFile = fileNameFromAttachment(parsed?.attachment)
  return fromFile || title || fallback
}

/**
 * Display title for any content item from its (modelName, raw modelValue).
 * Shared by the curriculum rail (useUnitContents) and the open lesson
 * (useCurrentContent) so the sidebar and the content view always agree.
 */
export function titleFromModelValue(modelName: string | null | undefined, raw: string | null | undefined): string {
  const kind = kindFromModelName(modelName)
  const parsed = parseModelValue<Record<string, unknown>>(raw)
  if (kind === 'file') {
    return resolveFileTitle(parsed as ParsedFileValue | null, 'Resource')
  }
  // Pull the title from the usual keys.
  let title = ''
  if (parsed) {
    for (const key of ['title', 'quiz_title', 'name', 'label']) {
      const v = parsed[key]
      if (typeof v === 'string' && v.trim()) { title = v.trim(); break }
    }
  }
  // Videos/quizzes have no derivable real name (a video only carries a UUID
  // stream key), so when the title is a generic placeholder ("File Title") we
  // show a sensible kind label instead of the misleading verbatim text.
  if (title && !isGenericTitle(title)) return title
  if (kind === 'video') return 'Video lesson'
  if (kind === 'quiz') return 'Quiz'
  return 'Lesson'
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
  /**
   * Server-reported total lesson count for this unit. Populated by the slim
   * bootstrap before any per-unit content arrives, so the rail can show
   * "N lessons" chips and accurate skeleton counts. May overcount NoneType
   * placeholder rows; reconciled to `contents.length` once the unit has
   * lazy-loaded.
   */
  contentsCount: number
  /**
   * Empty array while the unit is unloaded — populated by `useUnitContents`
   * when the rail expands the unit (or when the unit owns the current
   * route's contentPk and is eagerly hydrated on first paint).
   */
  contents: CurriculumContent[]
  /** True once useUnitContents has resolved this unit's lessons at least once. */
  hydrated: boolean
}

export type ClassroomBootstrap = {
  /** Enrollment pk (canonical identifier downstream: progress, quiz submit). */
  enrollmentPk: number
  /** Course pk from the URL. */
  coursePk: number
  courseTitle: string
  courseCover: string | null
  hasCertificate: boolean
  /** Course-owner-supplied Telegram group invite URL. Null when unset. */
  telegramLink: string | null
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
// Per-unit pagination state, exposed to the rail so it can render an
// auto-loading sentinel when there are more lessons to fetch.
// ---------------------------------------------------------------------------

export type UnitPagination = {
  endCursor: string | null
  hasNextPage: boolean
  /** Server-reported total. May be null until the first page lands. */
  totalCount: number | null
}

// ---------------------------------------------------------------------------
// Per-operation Result / Vars aliases (from codegen).
// ---------------------------------------------------------------------------

export type GetCourseByIdResult = GetCourseByIdQuery
export type GetCourseByIdVars = GetCourseByIdQueryVariables

export type GetCourseByIDSlimResult = GetCourseByIdSlimQuery
export type GetCourseByIDSlimVars = GetCourseByIdSlimQueryVariables

export type GetCourseUnitContentsResult = GetCourseUnitContentsQuery
export type GetCourseUnitContentsVars = GetCourseUnitContentsQueryVariables

export type GetCourseUnitContentResult = GetCourseUnitContentQuery
export type GetCourseUnitContentVars = GetCourseUnitContentQueryVariables

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
