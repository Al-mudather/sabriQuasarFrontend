// Classroom bootstrap — slim variant.
//
// Two sequential queries:
//   1. GetCourseByIDSlim(coursePk)          → course meta + unit titles
//                                              (NO eager unit contents)
//   2. GetEnrollmentByCourseForCurrentUser  → enrollment.pk
//
// Per-unit lesson lists are NOT in this bootstrap. The rail calls
// `useUnitContents().loadUnit(unitPk)` on accordion expand to hydrate one
// unit at a time. Bootstrap-level `totalContents` / `totalVideos` are
// computed from per-unit `courseunitcontentSet.totalCount` — slightly less
// accurate than the old per-lesson sum (NoneType placeholders inflate the
// count by 1-2 per unit at most) but stable from first paint and good
// enough for the progress denominator.
//
// Cache policy:
//   - fetchPolicy: 'cache-first' so revisits paint from the Apollo cache
//     instantly.
//   - useStaleAfterTtl forces a network-only refetch when the cache is
//     older than 10 minutes, or when the tab transitions hidden → visible.

import { computed, isRef, ref, unref, watch, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetCourseByIDSlim } from 'src/graphql/course_management/query/GetCourseByIDSlim'
import { GetEnrollmentByCourseForCurrentUser } from 'src/graphql/enrollment_management/query/GetEnrollmentByCourseForCurrentUser'
import { useStaleAfterTtl } from 'src/composables/classroom/useStaleAfterTtl'
import {
  type ClassroomBootstrap,
  type CurriculumUnit,
  type GetCourseByIDSlimResult,
  type GetCourseByIDSlimVars,
  type GetEnrollmentByCourseForCurrentUserResult,
  type GetEnrollmentByCourseForCurrentUserVars,
} from 'src/types/classroom/types'

type PkLike = number | Ref<number | null | undefined> | null | undefined

function toNum(v: PkLike): number | null {
  const raw = isRef(v) ? unref(v) : v
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : null
}

export function useCourseBootstrap(coursePk: PkLike): {
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
} {
  const courseVars = computed<GetCourseByIDSlimVars>(() => ({ coursePk: toNum(coursePk) ?? 0 }))
  const enabled = computed(() => toNum(coursePk) !== null)

  const {
    result: courseResult,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
    onError: onCourseError,
    onResult: onCourseResult,
  } = useQuery<GetCourseByIDSlimResult, GetCourseByIDSlimVars>(GetCourseByIDSlim, courseVars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  onCourseError((err) => {
    console.error('[classroom][bootstrap] GetCourseByIDSlim FAILED', {
      message: err.message,
      graphQLErrors: err.graphQLErrors,
      networkError: err.networkError,
    })
  })

  // Cache freshness — refetch on mount + on tab focus when older than TTL.
  const { markFresh: markCourseFresh } = useStaleAfterTtl({
    key: () => {
      const pk = toNum(coursePk)
      return pk ? `course:${pk}` : null
    },
    refetch: () => refetchCourse({ ...courseVars.value }),
    disabled: () => !enabled.value,
  })

  onCourseResult((res) => {
    if (res.data?.course) markCourseFresh()
  })

  // Enrollment query keyed on course.pk (filled by the first query).
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
    onResult: onEnrollmentResult,
  } = useQuery<
    GetEnrollmentByCourseForCurrentUserResult,
    GetEnrollmentByCourseForCurrentUserVars
  >(GetEnrollmentByCourseForCurrentUser, enrollmentVars, () => ({
    enabled: enrollmentEnabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  onEnrollmentError((err) => {
    console.error('[classroom][bootstrap] GetEnrollmentByCourseForCurrentUser FAILED', {
      message: err.message,
      graphQLErrors: err.graphQLErrors,
      networkError: err.networkError,
    })
  })

  const { markFresh: markEnrollmentFresh } = useStaleAfterTtl({
    key: () => {
      const pk = courseResult.value?.course?.pk
      return pk ? `enrollment:${pk}` : null
    },
    refetch: () => refetchEnrollment({ ...enrollmentVars.value }),
    disabled: () => !enrollmentEnabled.value,
  })

  onEnrollmentResult((res) => {
    if (res.data?.enrollmentByCourseForCurrentUser) markEnrollmentFresh()
  })

  // Refetch the enrollment query whenever the course pk lands so we don't
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

    const unitEdges = course.courseunitSet?.edges ?? []
    const units: CurriculumUnit[] = []
    let totalContents = 0

    unitEdges.forEach((uEdge, uIdx) => {
      const u = uEdge?.node
      if (!u) return
      const unitPk = (u as { pk?: number | null }).pk ?? null
      if (unitPk == null) return
      const contentsCount = u.courseunitcontentSet?.totalCount ?? 0
      totalContents += contentsCount
      units.push({
        pk: unitPk,
        id: u.id,
        title: (u as { title?: string | null }).title ?? '',
        order: (u as { order?: number | null }).order ?? uIdx,
        contentsCount,
        contents: [],
        hydrated: false,
      })
    })
    units.sort((a, b) => a.order - b.order || a.pk - b.pk)

    // Use the backend's canonical progress field as the single source of truth.
    // `enrollment.progress.total` may differ from our summed `totalContents`
    // (the backend counts exactly; our slim bootstrap sum may overcount
    // NoneType placeholder rows). Prefer the backend value when available.
    const backendTotal = enrollment.progress?.total ?? null
    const completedContents = enrollment.progress?.completed ?? 0
    const progressPercent = Math.round(enrollment.progress?.percentage ?? 0)
    const denominator = backendTotal !== null ? backendTotal : totalContents

    const out: ClassroomBootstrap = {
      enrollmentPk: enrollment.pk,
      coursePk: course.pk,
      courseTitle: course.title ?? '',
      courseCover: (course as { cover?: string | null }).cover ?? null,
      hasCertificate: Boolean((course as { hasCertificate?: boolean | null }).hasCertificate),
      telegramLink: (course as { telegramLink?: string | null }).telegramLink ?? null,
      totalContents: denominator,
      totalVideos: denominator,
      completedContents,
      progressPercent,
      units,
    }
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
