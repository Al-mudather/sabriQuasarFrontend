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
  refreshEnrollment: () => void
} {
  const courseVars = computed<GetCourseByIDSlimVars>(() => ({ coursePk: toNum(coursePk) ?? 0 }))
  const enabled = computed(() => toNum(coursePk) !== null)

  const {
    result: courseResult,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
    onResult: onCourseResult,
  } = useQuery<GetCourseByIDSlimResult, GetCourseByIDSlimVars>(GetCourseByIDSlim, courseVars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

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

  // Enrollment query keyed on the ROUTE course pk — the same value the course
  // query resolves to (`course(id: $coursePk)` returns `course.pk === coursePk`).
  // Keying on the input instead of the course RESPONSE lets enrollment fire IN
  // PARALLEL with the course query rather than waiting for it (was a 2-hop
  // waterfall on every cold classroom entry).
  const enrollmentVars = computed<GetEnrollmentByCourseForCurrentUserVars>(() => ({
    courseId: toNum(coursePk) ?? 0,
  }))
  const enrollmentEnabled = computed<boolean>(() => toNum(coursePk) !== null)

  const {
    result: enrollmentResult,
    loading: enrollmentLoading,
    error: enrollmentError,
    refetch: refetchEnrollment,
    onResult: onEnrollmentResult,
  } = useQuery<
    GetEnrollmentByCourseForCurrentUserResult,
    GetEnrollmentByCourseForCurrentUserVars
  >(GetEnrollmentByCourseForCurrentUser, enrollmentVars, () => ({
    enabled: enrollmentEnabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  const { markFresh: markEnrollmentFresh } = useStaleAfterTtl({
    key: () => {
      const pk = toNum(coursePk)
      return pk ? `enrollment:${pk}` : null
    },
    refetch: () => refetchEnrollment({ ...enrollmentVars.value }),
    disabled: () => !enrollmentEnabled.value,
  })

  onEnrollmentResult((res) => {
    if (res.data?.enrollmentByCourseForCurrentUser) markEnrollmentFresh()
  })

  // (Removed the `watch(course.pk) -> refetchEnrollment()` that re-fired the
  // enrollment query the instant the course landed — a redundant SECOND fetch.
  // The enrollment query is now keyed on the stable route `coursePk`, so it
  // already targets the right course from the first call.)

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
      // EXTERNAL units carry no content of their own — their lessons live on the
      // linked `external` unit (e.g. course 169's "Neurology" unit borrows its 7
      // videos from unit 41). Point this curriculum entry at whichever unit
      // actually OWNS the content, so lazy loading + navigation resolve real
      // lessons instead of rendering an empty unit that hangs the classroom with
      // nothing to play. Title/order stay from THIS course's unit.
      const node = u as {
        pk?: number | null
        id?: string
        title?: string | null
        order?: number | null
        isExternal?: boolean | null
        external?: { pk?: number | null; id?: string; courseunitcontentSet?: { totalCount?: number | null } | null } | null
        courseunitcontentSet?: { totalCount?: number | null } | null
      }
      const external = node.isExternal ? node.external ?? null : null
      const contentUnitPk = (external?.pk ?? node.pk) ?? null
      if (contentUnitPk == null) return
      const contentsCount =
        external?.courseunitcontentSet?.totalCount ?? node.courseunitcontentSet?.totalCount ?? 0
      totalContents += contentsCount
      units.push({
        pk: contentUnitPk,
        id: external?.id ?? node.id ?? '',
        title: node.title ?? '',
        order: node.order ?? uIdx,
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
    // Refetch ONLY the enrollment (progress ring) — used after lesson navigation,
    // where the course meta is static and doesn't need re-fetching.
    refreshEnrollment: () => {
      if (enrollmentEnabled.value) void refetchEnrollment()
    },
  }
}
