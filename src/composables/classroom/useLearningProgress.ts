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

import { computed, isRef, ref, shallowRef, unref, watch, type ComputedRef, type Ref } from 'vue'
import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable'
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
  ResumeRow,
  StartLearningUnitResult,
  StartLearningUnitVars,
} from 'src/types/classroom/types'

/** The server caps this connection at 100 rows per page. */
const PROGRESS_PAGE_SIZE = 100
/** Safety stop for the paging loop (30 × 100 rows is far beyond any course). */
const PROGRESS_MAX_PAGES = 30

type ProgressEdges = NonNullable<
  GetAllLearningProgressByCourseResult['learningProgressByCourse']
>['edges']

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
  /** Server progress rows shaped for the classroom's resume-on-entry logic. */
  resumeRows: ComputedRef<ResumeRow[]>
  /**
   * True once every page of the progress list has arrived (or failed) for the
   * current enrollment — the entry logic waits for it before picking a lesson.
   */
  progressReady: ComputedRef<boolean>
  refetch: () => void
  start: (contentPk: number, unitPk: number) => Promise<void>
  end: () => Promise<void>
  currentProgressId: Ref<number | null>
} {
  const vars = computed<GetAllLearningProgressByCourseVars>(() => ({
    courseId: toNum(coursePk),
    enrollmentId: toNum(enrollmentPk),
    first: PROGRESS_PAGE_SIZE,
    after: null,
  }))
  const enabled = computed<boolean>(
    () => toNum(coursePk) !== null && toNum(enrollmentPk) !== null,
  )

  const { client } = useApolloClient()
  const { result, refetch, onResult, onError } = useQuery<
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

  // Pages after the first. The connection returns at most 100 rows per page,
  // so without paging a student deep into a long course would be missing
  // ticks and could not get a correct resume point.
  //
  // Both pieces of state are tagged with the enrollment they belong to rather
  // than reset from a watcher: a cache hit can deliver its result in the same
  // tick the enrollment becomes known, and a reset running after it would
  // leave `progressReady` false for good.
  const scopeKey = computed<string | null>(() =>
    enabled.value ? `${toNum(coursePk)}:${toNum(enrollmentPk)}` : null,
  )
  const extra = shallowRef<{ key: string | null; edges: ProgressEdges }>({ key: null, edges: [] })
  const readyKey = ref<string | null>(null)
  const progressReady = computed<boolean>(() => scopeKey.value !== null && readyKey.value === scopeKey.value)
  let pagingToken = 0

  async function loadRemainingPages(startCursor: string, base: GetAllLearningProgressByCourseVars): Promise<void> {
    const token = ++pagingToken
    const key = scopeKey.value
    const collected: ProgressEdges = []
    let cursor: string | null = startCursor
    try {
      for (let page = 0; cursor && page < PROGRESS_MAX_PAGES; page++) {
        const res: { data: GetAllLearningProgressByCourseResult } = await client.query<
          GetAllLearningProgressByCourseResult,
          GetAllLearningProgressByCourseVars
        >({
          query: GetAllLearningProgressByCourse,
          variables: { ...base, after: cursor },
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        })
        if (token !== pagingToken) return
        const conn = res.data?.learningProgressByCourse
        collected.push(...(conn?.edges ?? []))
        cursor = conn?.pageInfo?.hasNextPage ? conn.pageInfo.endCursor ?? null : null
      }
    } catch {
      /* partial progress is still useful — fall through with what we have */
    }
    if (token !== pagingToken) return
    extra.value = { key, edges: collected }
    readyKey.value = key
  }

  onResult((res) => {
    const conn = res.data?.learningProgressByCourse
    if (!conn) {
      // Answered without a list (GraphQL error with errorPolicy 'all'): there
      // is nothing to wait for — do not hold the classroom entry.
      if (!res.loading) readyKey.value = scopeKey.value
      return
    }
    markProgressFresh()
    const next = conn.pageInfo?.hasNextPage ? conn.pageInfo.endCursor ?? null : null
    if (next) {
      void loadRemainingPages(next, { ...vars.value })
    } else {
      pagingToken++
      extra.value = { key: scopeKey.value, edges: [] }
      readyKey.value = scopeKey.value
    }
  })
  // A failed progress query must not hold the classroom entry hostage.
  onError(() => {
    readyKey.value = scopeKey.value
  })

  // Local, optimistic overrides applied on top of the once-fetched server map.
  // Instead of refetching the entire (unbounded) course-wide progress list on
  // every lesson change, we patch only the row the student just touched, using
  // the single row the Start/End mutations return. The checkmark/in-progress
  // tick updates instantly; a full reload still reconciles from the backend.
  const localOverrides = ref<ProgressMap>({})

  const allEdges = computed<ProgressEdges>(() => [
    ...(result.value?.learningProgressByCourse?.edges ?? []),
    ...(extra.value.key === scopeKey.value ? extra.value.edges : []),
  ])

  const resumeRows = computed<ResumeRow[]>(() => {
    const rows: ResumeRow[] = []
    for (const edge of allEdges.value) {
      const node = edge?.node
      const contentPk = node?.courseUnitContent?.pk
      const progressPk = node?.pk
      if (!node || contentPk == null || progressPk == null) continue
      rows.push({
        contentPk,
        unitPk: node.courseUnitContent?.courseUnit?.pk ?? null,
        progressPk,
        begin: node.begin ?? null,
        complete: node.complete ?? null,
        updated: node.updated ?? null,
      })
    }
    return rows
  })

  const progressMap = computed<ProgressMap>(() => {
    const edges = allEdges.value
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
  // One token per start() call = one VISIT to a lesson. The backend may hand
  // back the same progress row for a second visit to the same lesson, so the
  // row pk cannot tell two visits apart; the token can.
  let startSeq = 0
  /** Token of the visit `currentProgressId` belongs to. */
  let visitToken = 0

  async function start(contentPk: number, unitPk: number): Promise<void> {
    const cid = toNum(coursePk)
    const eid = toNum(enrollmentPk)
    if (cid == null || eid == null) return
    const token = ++startSeq
    currentContentPk.value = contentPk
    currentUnitPk.value = unitPk
    const input = { courseId: cid, enrollmentId: eid, courseUnitId: unitPk, courseUnitContentId: contentPk }
    try {
      const res = await runStart({ progressData: input })
      // A newer start() owns the "current" state now: this answer is stale.
      if (token !== startSeq) return
      const success = res?.data?.startLearningUnit?.success
      const pk = res?.data?.startLearningUnit?.learning?.pk
      if (success && typeof pk === 'number') {
        currentProgressId.value = pk
        visitToken = token
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

  // One EndLearningUnit per leave: a lesson tap, the route watcher and the
  // unmount hook can all ask to end the same visit at once. They share the
  // one request that is in flight for that visit. A LATER visit to the same
  // lesson (A → B → A while End(A) is still in flight) is a different visit:
  // it gets its own request, and the late answer of the first one must not
  // clear its progress id.
  let endInFlight: { visit: number; promise: Promise<void> } | null = null

  function end(): Promise<void> {
    const pid = currentProgressId.value
    const visit = visitToken
    if (pid != null && endInFlight?.visit === visit) return endInFlight.promise
    const promise = runEndOnce(visit).finally(() => {
      if (endInFlight?.promise === promise) endInFlight = null
    })
    if (pid != null) endInFlight = { visit, promise }
    return promise
  }

  async function runEndOnce(visit: number): Promise<void> {
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
        // Only clear the VISIT we ended: a slow End must not wipe the id of a
        // lesson (even the same lesson, same row) started while it was in flight.
        if (visitToken === visit && currentProgressId.value === pid) currentProgressId.value = null
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
      startSeq++ // answers still in flight belong to the old course
      // New course/enrollment → drop session-local progress patches; the fresh
      // server map for the new course is the source of truth.
      localOverrides.value = {}
    },
  )

  return {
    progressMap,
    resumeRows,
    progressReady,
    refetch: () => {
      if (enabled.value) void refetch()
    },
    start,
    end,
    currentProgressId,
  }
}
