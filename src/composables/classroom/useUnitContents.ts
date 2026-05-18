// Lazy per-unit content loader for the classroom CurriculumRail.
//
// `useCourseBootstrap` now returns units with `contents: []` + `contentsCount:
// number`. The rail calls `loadUnit(unitPk)` when the user expands a unit
// (or eagerly for the unit owning the URL's contentPk). This composable
// fires `GetCourseUnitContents` once per (unitPk, cache-TTL) and stores the
// resulting `CurriculumContent[]` in a reactive Map keyed by unit pk.
//
// Cache strategy:
//   - Apollo fetchPolicy: 'cache-first' — repeat calls within TTL paint from
//     Apollo's normalized cache instantly.
//   - useStaleAfterTtl tracks per-unit freshness in useClassroomCacheStore;
//     when the user returns after 10+ minutes (default), the next loadUnit
//     forces network-only.
//
// Idempotency: `loadUnit(pk)` is safe to call multiple times in the same
// tick — it dedupes by checking if the unit is already in the in-flight
// set OR resolved in the contents map and fresh.

import { reactive, ref } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'

import { GetCourseUnitContents } from 'src/graphql/course_management/query/GetCourseUnitContents'
import { useClassroomCacheStore } from 'src/stores/classroomCache'
import {
  kindFromModelName,
  type CurriculumContent,
  type GetCourseUnitContentsResult,
  type GetCourseUnitContentsVars,
} from 'src/types/classroom/types'

// Per-unit TTL — keep aligned with the bootstrap TTL so the user can't have
// fresh unit titles next to 11-minute-stale lesson lists.
const UNIT_TTL_MS = 10 * 60 * 1000

// Pull v1 limit higher than any real unit so the single fetch returns the
// full lesson list. Pagination is plumbed but rarely exercised.
const UNIT_CONTENTS_PAGE_SIZE = 200

function titleFromModelValue(modelName: string, raw: string | null | undefined): string {
  if (!raw) return kindFromModelName(modelName)
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    for (const key of ['title', 'quiz_title', 'name', 'label']) {
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

export interface UseUnitContentsApi {
  /** Map of unitPk → hydrated lesson list. Reactive — components can `v-for` it. */
  contentsByUnitPk: Map<number, CurriculumContent[]>
  /** Set of unitPk currently fetching. Reactive — drives skeleton state. */
  loadingPks: Set<number>
  /**
   * Idempotently load a unit's contents. Safe to call repeatedly; returns
   * the cached array if already fresh, otherwise triggers one Apollo query.
   */
  loadUnit: (unitPk: number) => Promise<CurriculumContent[]>
  /** Force a stale-bypass refetch for one unit. */
  refetchUnit: (unitPk: number) => Promise<CurriculumContent[]>
}

export function useUnitContents(): UseUnitContentsApi {
  const { client } = useApolloClient()
  const cache = useClassroomCacheStore()

  // Reactive containers. `reactive(new Map())` gives a Vue-tracked Map.
  const contentsByUnitPk = reactive(new Map<number, CurriculumContent[]>())
  const loadingPks = reactive(new Set<number>())
  // De-duplicate in-flight requests so a double-click doesn't fire twice.
  const inflight = ref(new Map<number, Promise<CurriculumContent[]>>())

  function keyFor(unitPk: number): string {
    return `unit:${unitPk}`
  }

  async function fetchOnce(unitPk: number, fresh: boolean): Promise<CurriculumContent[]> {
    const fetchPolicy = fresh ? 'network-only' : 'cache-first'
    console.log('[classroom][unit-contents] fetch →', { unitPk, fetchPolicy, limit: UNIT_CONTENTS_PAGE_SIZE })
    const { data } = await client.query<GetCourseUnitContentsResult, GetCourseUnitContentsVars>({
      query: GetCourseUnitContents,
      variables: { unitPk, cursor: null, limit: UNIT_CONTENTS_PAGE_SIZE },
      fetchPolicy,
      errorPolicy: 'all',
    })

    const edges = data?.courseUnit?.courseunitcontentSet?.edges ?? []
    const totalCount = data?.courseUnit?.courseunitcontentSet?.totalCount ?? null
    console.log('[classroom][unit-contents] fetch ←', {
      unitPk,
      unitFound: !!data?.courseUnit,
      totalCount,
      rawEdgeCount: edges.length,
    })

    const out: CurriculumContent[] = []
    let skipped = { noNode: 0, noPk: 0, noModelName: 0, unknownKind: 0 }
    edges.forEach((edge, idx) => {
      const node = edge?.node
      if (!node) { skipped.noNode += 1; return }
      const pk = (node as { pk?: number | null }).pk ?? null
      if (pk == null) { skipped.noPk += 1; return }
      const modelName = node.modelName ?? ''
      if (!modelName || modelName === 'NoneType') { skipped.noModelName += 1; return }
      const kind = kindFromModelName(modelName)
      if (kind === 'unknown') { skipped.unknownKind += 1; return }
      // CourseUnitContentNode.modelValue is typed in the codegen output as
      // Record<string, number> because the codegen treats every JSONString
      // identically, but the apollo client's parse-on-read typePolicy only
      // covers CourseNode.currency (see src/apollo/client.js:113-119). At
      // runtime modelValue is still a JSON string. The cast reflects that.
      const raw = (node.modelValue as unknown as string | null) ?? null
      out.push({
        pk,
        id: node.id,
        isFree: Boolean((node as { isFree?: boolean | null }).isFree),
        isMandatory: Boolean((node as { isMandatory?: boolean | null }).isMandatory),
        modelName,
        kind,
        modelValueRaw: raw,
        title: titleFromModelValue(modelName, raw),
        order: (node as { order?: number | null }).order ?? idx,
        completed: false,
        inProgress: false,
      })
    })
    out.sort((a, b) => a.order - b.order || a.pk - b.pk)
    console.log('[classroom][unit-contents] materialised', { unitPk, kept: out.length, skipped })

    contentsByUnitPk.set(unitPk, out)
    cache.markFresh(keyFor(unitPk))
    return out
  }

  async function loadUnit(unitPk: number): Promise<CurriculumContent[]> {
    if (!Number.isFinite(unitPk) || unitPk <= 0) return []

    const inflightP = inflight.value.get(unitPk)
    if (inflightP) return inflightP

    // Empty-array cache hits are NOT a hit — they're a previous failure. We
    // require at least one materialised lesson to count a unit as cached.
    // Without this, a single bad fetch (empty edges / auth blip / wrong
    // arg) pins the unit to "0 lessons" forever inside the TTL window.
    const cached = contentsByUnitPk.get(unitPk)
    const stale = cache.isStale(keyFor(unitPk), UNIT_TTL_MS)
    if (cached && cached.length > 0 && !stale) return cached

    loadingPks.add(unitPk)
    const p = fetchOnce(unitPk, false)
      .catch((err: unknown) => {
        console.warn('[classroom][unit-contents] loadUnit failed', { unitPk, err })
        return contentsByUnitPk.get(unitPk) ?? []
      })
      .finally(() => {
        loadingPks.delete(unitPk)
        inflight.value.delete(unitPk)
      })
    inflight.value.set(unitPk, p)
    return p
  }

  async function refetchUnit(unitPk: number): Promise<CurriculumContent[]> {
    loadingPks.add(unitPk)
    try {
      return await fetchOnce(unitPk, true)
    } catch (err) {
      console.warn('[classroom] useUnitContents.refetchUnit failed', { unitPk, err })
      return contentsByUnitPk.get(unitPk) ?? []
    } finally {
      loadingPks.delete(unitPk)
    }
  }

  return { contentsByUnitPk, loadingPks, loadUnit, refetchUnit }
}
