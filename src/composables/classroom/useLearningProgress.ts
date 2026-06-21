// Learning progress composable — mirrors CourseClassRoom2 store/courseManagement
// StartLearningUnit/EndLearningUnit pattern plus the GetAllLearningProgressByCourse
// poll that drives completion ticks in the rail.
//
// Contract:
//   - `start(contentPk, unitPk)` fires `StartLearningUnit` and remembers the
//     returned learning-progress pk for the subsequent End call.
//   - `end()` fires `EndLearningUnit` against the remembered progress pk and
//     refetches the progress list to update rail ticks.
//   - `progressMap` is a keyed-by-contentPk object (id → {begin, complete}).
//
// Semantics match CC2: no 90% watch threshold, no optimistic update. A content
// is "complete" only after the backend returns complete on the progress row
// following an EndLearningUnit mutation.

import { computed, isRef, ref, unref, watch, type ComputedRef, type Ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GetAllLearningProgressByCourse } from 'src/graphql/classroom/query/GetAllLearningProgressByCourse'
import { StartLearningUnit } from 'src/graphql/classroom/mutation/StartLearningUnit'
import { EndLearningUnit } from 'src/graphql/classroom/mutation/EndLearningUnit'
import { useStaleAfterTtl } from 'src/composables/classroom/useStaleAfterTtl'
import type {
  EndLearningUnitResult,
  EndLearningUnitVars,
  GetAllLearningProgressByCourseResult,
  GetAllLearningProgressByCourseVars,
  ProgressEntry,
  ProgressMap,
  StartLearningUnitResult,
  StartLearningUnitVars,
} from 'src/types/classroom/types'

type PkLike = number | Ref<number | null | undefined> | null | undefined

function toNum(v: PkLike): number | null {
  const raw = isRef(v) ? unref(v) : v
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : null
}

export function useLearningProgress(
  coursePk: PkLike,
  enrollmentPk: PkLike,
): {
  progressMap: ComputedRef<ProgressMap>
  refetch: () => void
  start: (contentPk: number, unitPk: number) => Promise<void>
  end: () => Promise<void>
  currentProgressId: Ref<number | null>
} {
  const vars = computed<GetAllLearningProgressByCourseVars>(() => ({
    courseId: toNum(coursePk),
    enrollmentId: toNum(enrollmentPk),
  }))
  const enabled = computed<boolean>(
    () => toNum(coursePk) !== null && toNum(enrollmentPk) !== null,
  )

  const { result, refetch, onResult } = useQuery<
    GetAllLearningProgressByCourseResult,
    GetAllLearningProgressByCourseVars
  >(GetAllLearningProgressByCourse, vars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  // 10-minute staleness window + refetch on tab refocus.
  const { markFresh: markProgressFresh } = useStaleAfterTtl({
    key: () => {
      const eid = toNum(enrollmentPk)
      return eid ? `progress:${eid}` : null
    },
    refetch: () => refetch({ ...vars.value }),
    disabled: () => !enabled.value,
  })

  onResult((res) => {
    if (res.data?.learningProgressByCourse) markProgressFresh()
  })

  // Local, optimistic overrides applied on top of the once-fetched server map.
  // Instead of refetching the entire (unbounded) course-wide progress list on
  // every lesson change, we patch only the row the student just touched, using
  // the single row the Start/End mutations return. The checkmark/in-progress
  // tick updates instantly; a full reload still reconciles from the backend.
  const localOverrides = ref<ProgressMap>({})

  const progressMap = computed<ProgressMap>(() => {
    const edges = result.value?.learningProgressByCourse?.edges ?? []
    const map: ProgressMap = {}
    for (const edge of edges) {
      const node = edge?.node
      if (!node) continue
      const cpk = node.courseUnitContent?.pk
      const ppk = node.pk
      if (cpk == null || ppk == null) continue
      const entry: ProgressEntry = {
        pk: ppk,
        begin: (node.begin as string | null | undefined) ?? null,
        complete: (node.complete as string | null | undefined) ?? null,
      }
      map[cpk] = entry
    }
    // Session-local patches win over the server snapshot.
    return { ...map, ...localOverrides.value }
  })

  const { mutate: runStart } = useMutation<StartLearningUnitResult, StartLearningUnitVars>(
    StartLearningUnit,
  )
  const { mutate: runEnd } = useMutation<EndLearningUnitResult, EndLearningUnitVars>(
    EndLearningUnit,
  )

  const currentProgressId = ref<number | null>(null)
  const currentContentPk = ref<number | null>(null)
  const currentUnitPk = ref<number | null>(null)

  async function start(contentPk: number, unitPk: number): Promise<void> {
    const cid = toNum(coursePk)
    const eid = toNum(enrollmentPk)
    if (cid == null || eid == null) return
    currentContentPk.value = contentPk
    currentUnitPk.value = unitPk
    const input = { courseId: cid, enrollmentId: eid, courseUnitId: unitPk, courseUnitContentId: contentPk }
    try {
      const res = await runStart({ progressData: input })
      const success = res?.data?.startLearningUnit?.success
      const pk = res?.data?.startLearningUnit?.learning?.pk
      if (success && typeof pk === 'number') {
        currentProgressId.value = pk
        // Optimistically mark the row in-progress so the rail dot shows now,
        // without refetching the whole course progress list.
        const prev = localOverrides.value[contentPk]
        localOverrides.value = {
          ...localOverrides.value,
          [contentPk]: { pk, begin: prev?.begin ?? new Date().toISOString(), complete: prev?.complete ?? null },
        }
      }
    } catch {
      /* start failed — leave progress id unset */
    }
  }

  async function end(): Promise<void> {
    const cid = toNum(coursePk)
    const eid = toNum(enrollmentPk)
    const pid = currentProgressId.value
    const ccid = currentContentPk.value
    const cuid = currentUnitPk.value
    if (cid == null || eid == null || pid == null || ccid == null || cuid == null) return
    const input = { courseId: cid, enrollmentId: eid, courseUnitId: cuid, courseUnitContentId: ccid }
    try {
      const res = await runEnd({ progressData: input, progressId: pid })
      const success = res?.data?.endLearningUnit?.success
      if (success) {
        currentProgressId.value = null
        // Patch ONLY the row we just ended, from the mutation's returned row —
        // no course-wide refetch. `complete` is the backend's authoritative
        // value (it may stay null if the lesson wasn't sufficiently watched).
        const learning = res?.data?.endLearningUnit?.learning
        const prev = localOverrides.value[ccid]
        localOverrides.value = {
          ...localOverrides.value,
          [ccid]: {
            pk: learning?.pk ?? prev?.pk ?? pid,
            begin: prev?.begin ?? new Date().toISOString(),
            complete: (learning?.complete as string | null | undefined) ?? prev?.complete ?? null,
          },
        }
      }
    } catch {
      /* end failed — progress reconciles on next full load / TTL refetch */
    }
  }

  // Guardrail: if the content changes mid-flight, emit end for the previous
  // content before the caller starts the new one. Consumers that know better
  // (e.g. explicit next/prev) should call end() themselves first.
  watch(
    () => [toNum(coursePk), toNum(enrollmentPk)] as const,
    () => {
      currentProgressId.value = null
      currentContentPk.value = null
      currentUnitPk.value = null
      // New course/enrollment → drop session-local progress patches; the fresh
      // server map for the new course is the source of truth.
      localOverrides.value = {}
    },
  )

  return {
    progressMap,
    refetch: () => {
      if (enabled.value) void refetch()
    },
    start,
    end,
    currentProgressId,
  }
}
