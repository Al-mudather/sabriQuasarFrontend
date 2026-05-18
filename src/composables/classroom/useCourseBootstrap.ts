// Classroom bootstrap — mirrors CourseClassRoom2 class.vue:141-192.
//
// Two sequential queries:
//   1. GetCourseByID(coursePk)            → course + units + contents (modelName/modelValue inline)
//   2. GetEnrollmentByCourseForCurrentUser(courseId: course.pk) → enrollment.pk
//
// Result: a single `ClassroomBootstrap` object that the rest of the classroom
// (rail, content view, progress mutations, quiz submit) reads from via the
// ClassroomContext injection.

import { computed, isRef, ref, unref, watch, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetCourseByID } from 'src/graphql/course_management/query/GetCourseByID'
import { GetEnrollmentByCourseForCurrentUser } from 'src/graphql/enrollment_management/query/GetEnrollmentByCourseForCurrentUser'
import { dlog, dwarn } from 'src/composables/classroom/devLog'
import {
  kindFromModelName,
  type ClassroomBootstrap,
  type CurriculumContent,
  type CurriculumUnit,
  type GetCourseByIdResult,
  type GetCourseByIdVars,
  type GetEnrollmentByCourseForCurrentUserResult,
  type GetEnrollmentByCourseForCurrentUserVars,
} from 'src/types/classroom/types'

type PkLike = number | Ref<number | null | undefined> | null | undefined

function toNum(v: PkLike): number | null {
  const raw = isRef(v) ? unref(v) : v
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : null
}

function titleFromModelValue(modelName: string, raw: string | null | undefined): string {
  if (!raw) return kindFromModelName(modelName)
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const candidates = ['title', 'quiz_title', 'name', 'label']
    for (const key of candidates) {
      const v = parsed[key]
      if (typeof v === 'string' && v.trim()) return v
    }
  } catch {
    /* fall through */
  }
  const k = kindFromModelName(modelName)
  if (k === 'video') return 'Video lesson'
  if (k === 'quiz') return 'Quiz'
  if (k === 'file') return 'Resource'
  return 'Lesson'
}

export function useCourseBootstrap(coursePk: PkLike): {
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
} {
  const courseVars = computed<GetCourseByIdVars>(() => {
    const pk = toNum(coursePk) ?? 0
    dlog('[classroom][step 1/4] useCourseBootstrap.courseVars', { coursePk: pk })
    return { coursePk: pk, unitContentsLimit: 50 }
  })
  const enabled = computed(() => {
    const ok = toNum(coursePk) !== null
    dlog('[classroom][step 1/4] useCourseBootstrap.enabled', {
      coursePk: isRef(coursePk) ? unref(coursePk) : coursePk,
      enabled: ok,
    })
    return ok
  })

  const {
    result: courseResult,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
    onError: onCourseError,
  } = useQuery<GetCourseByIdResult, GetCourseByIdVars>(GetCourseByID, courseVars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  }))

  onCourseError((err) => {
    dwarn('[classroom][step 2/4] GetCourseByID FAILED', {
      message: err.message,
      graphQLErrors: err.graphQLErrors,
      networkError: err.networkError,
    })
  })

  watch(
    () => courseResult.value?.course,
    (c) => {
      if (!c) return
      const unitEdges = c.courseunitSet?.edges ?? []
      dlog('[classroom][step 2/4] GetCourseByID OK', {
        coursePk: c.pk,
        title: c.title,
        units: unitEdges.length,
        firstUnit: unitEdges[0]?.node ? {
          pk: unitEdges[0].node.pk,
          title: unitEdges[0].node.title,
          totalCount: unitEdges[0].node.courseunitcontentSet?.totalCount ?? null,
          rawEdges: unitEdges[0].node.courseunitcontentSet?.edges?.length ?? 0,
        } : null,
      })
    },
  )

  // Enrollment query keyed on course.pk (which we get from the first query).
  const enrollmentVars = computed<GetEnrollmentByCourseForCurrentUserVars>(() => ({
    courseId: courseResult.value?.course?.pk ?? 0,
  }))
  const enrollmentEnabled = computed<boolean>(() => {
    const pk = courseResult.value?.course?.pk
    return typeof pk === 'number' && pk > 0
  })

  const {
    result: enrollmentResult,
    loading: enrollmentLoading,
    error: enrollmentError,
    refetch: refetchEnrollment,
    onError: onEnrollmentError,
  } = useQuery<
    GetEnrollmentByCourseForCurrentUserResult,
    GetEnrollmentByCourseForCurrentUserVars
  >(GetEnrollmentByCourseForCurrentUser, enrollmentVars, () => ({
    enabled: enrollmentEnabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  }))

  onEnrollmentError((err) => {
    dwarn('[classroom][step 3/4] GetEnrollmentByCourseForCurrentUser FAILED', {
      message: err.message,
      graphQLErrors: err.graphQLErrors,
      networkError: err.networkError,
    })
  })

  watch(
    () => enrollmentResult.value?.enrollmentByCourseForCurrentUser,
    (e) => {
      if (!e) return
      dlog('[classroom][step 3/4] GetEnrollmentByCourseForCurrentUser OK', {
        enrollmentPk: e.pk,
        completedFromServer: e.learningprogressSet?.edgeCount ?? 0,
      })
    },
  )

  // Refetch the enrollment query whenever a new course pk lands so we don't
  // reuse a stale enrollment from a previous course.
  watch(
    () => courseResult.value?.course?.pk,
    (next, prev) => {
      if (next && next !== prev) void refetchEnrollment()
    },
  )

  const loading = computed<boolean>(() => courseLoading.value || enrollmentLoading.value)
  const aggregatedError = ref<Error | null>(null)
  watch(
    () => courseError.value,
    (e) => {
      if (e) aggregatedError.value = e
    },
    { immediate: true },
  )
  watch(
    () => enrollmentError.value,
    (e) => {
      if (e) aggregatedError.value = e
    },
    { immediate: true },
  )

  const bootstrap = computed<ClassroomBootstrap | null>(() => {
    const course = courseResult.value?.course
    const enrollment = enrollmentResult.value?.enrollmentByCourseForCurrentUser
    if (!course || course.pk == null || !enrollment || enrollment.pk == null) return null

    // Flatten units + contents. We skip:
    //   - rows missing pk (can't route)
    //   - rows whose backend modelName is "NoneType" (placeholders with no
    //     real content attached — they appear in several courses and the
    //     user doesn't want them surfaced).
    const unitEdges = course.courseunitSet?.edges ?? []
    const units: CurriculumUnit[] = []
    let totalContents = 0
    let totalVideos = 0

    unitEdges.forEach((uEdge, uIdx) => {
      const u = uEdge?.node
      if (!u) return
      const cEdges = u.courseunitcontentSet?.edges ?? []
      const contents: CurriculumContent[] = []
      cEdges.forEach((cEdge, cIdx) => {
        const c = cEdge?.node
        if (!c) return
        const pk = (c as { pk?: number | null }).pk ?? null
        if (pk == null) return
        const modelName = c.modelName ?? ''
        if (modelName === 'NoneType' || !modelName) return
        const kind = kindFromModelName(modelName)
        if (kind === 'unknown') return
        const raw = (c.modelValue ?? null) as string | null
        contents.push({
          pk,
          id: c.id,
          isFree: Boolean((c as { isFree?: boolean | null }).isFree),
          isMandatory: Boolean((c as { isMandatory?: boolean | null }).isMandatory),
          modelName,
          kind,
          modelValueRaw: raw,
          title: titleFromModelValue(modelName, raw),
          order: (c as { order?: number | null }).order ?? cIdx,
          completed: false,
          inProgress: false,
        })
        totalContents += 1
        if (kind === 'video') totalVideos += 1
      })
      // Order contents by their backend `order` when available, then pk.
      contents.sort((a, b) => a.order - b.order || a.pk - b.pk)
      units.push({
        pk: (u as { pk?: number | null }).pk ?? uIdx,
        id: u.id,
        title: (u as { title?: string | null }).title ?? '',
        order: (u as { order?: number | null }).order ?? uIdx,
        contents,
      })
    })
    units.sort((a, b) => a.order - b.order || a.pk - b.pk)

    // Progress percent is video-only per product decision: NoneType rows are
    // filtered out entirely (above); quizzes and file downloads aren't counted
    // toward the headline progress ring. totalContents still reflects the
    // total number of *visible* rows for generic counters.
    const progressPercent = 0 // computed in the layout merger once the progress map is available
    const completedContents = 0

    const out: ClassroomBootstrap = {
      enrollmentPk: enrollment.pk,
      coursePk: course.pk,
      courseTitle: course.title ?? '',
      courseCover: (course as { cover?: string | null }).cover ?? null,
      hasCertificate: Boolean((course as { hasCertificate?: boolean | null }).hasCertificate),
      telegramLink: (course as { telegramLink?: string | null }).telegramLink ?? null,
      totalContents,
      totalVideos,
      completedContents,
      progressPercent,
      units,
    }
    dlog('[classroom][step 4/4] bootstrap assembled', {
      enrollmentPk: out.enrollmentPk,
      coursePk: out.coursePk,
      title: out.courseTitle,
      totalContents: out.totalContents,
      totalVideos,
      units: out.units.length,
      sampleUnits: out.units.slice(0, 3).map((u) => ({ pk: u.pk, title: u.title, lessons: u.contents.length })),
    })
    return out
  })

  return {
    bootstrap,
    loading,
    error: aggregatedError as Ref<Error | null>,
    refetch: () => {
      void refetchCourse()
      if (enrollmentEnabled.value) void refetchEnrollment()
    },
  }
}
