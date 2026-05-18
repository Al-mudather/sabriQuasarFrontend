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

  const { result, refetch, onError, onResult } = useQuery<
    GetAllLearningProgressByCourseResult,
    GetAllLearningProgressByCourseVars
  >(GetAllLearningProgressByCourse, vars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  onError((err) => {
    console.error('[classroom][progress] GetAllLearningProgressByCourse FAILED', {
      message: err.message,
      graphQLErrors: err.graphQLErrors,
      networkError: err.networkError,
    })
  })

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

  watch(
    () => result.value?.learningProgressByCourse?.edges,
    (edges) => {
      if (!edges) return
      console.log('[classroom][progress] GetAllLearningProgressByCourse OK', {
        rows: edges.length,
        completed: edges.filter((e) => e?.node?.complete).length,
      })
    },
  )

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
    return map
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
    if (cid == null || eid == null) {
      console.warn('[classroom][progress] start skipped — missing ids', { cid, eid, contentPk, unitPk })
      return
    }
    currentContentPk.value = contentPk
    currentUnitPk.value = unitPk
    const input = { courseId: cid, enrollmentId: eid, courseUnitId: unitPk, courseUnitContentId: contentPk }
    console.log('[classroom][progress] StartLearningUnit →', input)
    try {
      const res = await runStart({ progressData: input })
      const success = res?.data?.startLearningUnit?.success
      const pk = res?.data?.startLearningUnit?.learning?.pk
      console.log('[classroom][progress] StartLearningUnit ←', {
        success,
        progressPk: pk,
        errors: res?.data?.startLearningUnit?.errors,
      })
      if (success && typeof pk === 'number') currentProgressId.value = pk
    } catch (err) {
      console.warn('[classroom][progress] StartLearningUnit threw', err)
    }
  }

  async function end(): Promise<void> {
    const cid = toNum(coursePk)
    const eid = toNum(enrollmentPk)
    const pid = currentProgressId.value
    const ccid = currentContentPk.value
    const cuid = currentUnitPk.value
    if (cid == null || eid == null || pid == null || ccid == null || cuid == null) {
      console.log('[classroom][progress] end skipped — nothing to finalize', { cid, eid, pid, ccid, cuid })
      return
    }
    const input = { courseId: cid, enrollmentId: eid, courseUnitId: cuid, courseUnitContentId: ccid }
    console.log('[classroom][progress] EndLearningUnit →', { ...input, progressId: pid })
    try {
      const res = await runEnd({ progressData: input, progressId: pid })
      const success = res?.data?.endLearningUnit?.success
      console.log('[classroom][progress] EndLearningUnit ←', {
        success,
        errors: res?.data?.endLearningUnit?.errors,
      })
      if (success) {
        currentProgressId.value = null
        void refetch()
      }
    } catch (err) {
      console.warn('[classroom][progress] EndLearningUnit threw', err)
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
