// Lazy per-unit content loader for the classroom CurriculumRail.
//
// `useCourseBootstrap` returns units with `contents: []` + `contentsCount:
// number`. The rail calls `loadUnit(unitPk)` when the user expands a unit
// (or eagerly for the unit owning the URL's contentPk). This composable
// fires the first page of `GetCourseUnitContents` and stores the resulting
// `CurriculumContent[]` in a reactive Map keyed by unit pk, plus a
// per-unit pagination cursor so the rail can call `loadMore(unitPk)` as
// the user scrolls into the bottom of an expanded unit.
//
// Cache strategy:
//   - Apollo fetchPolicy: 'cache-first' on first page — repeat opens within
//     TTL paint from the normalized cache instantly. Subsequent pages run
//     'network-only' because (unitPk, cursor) is unique per page slice.
//   - useStaleAfterTtl tracks per-unit freshness in useClassroomCacheStore;
//     when the user returns after 10+ minutes (default), the next loadUnit
//     forces network-only on page one.
//
// Idempotency:
//   - `loadUnit(pk)` and `loadMore(pk)` dedupe by checking the in-flight set.
//   - `loadMore` is a no-op when the unit isn't loaded yet or has no next
//     page; the consumer (rail sentinel) can fire freely without guarding.

import { reactive, ref } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'

import { GetCourseUnitContents } from 'src/graphql/course_management/query/GetCourseUnitContents'
import { useClassroomCacheStore } from 'src/stores/classroomCache'
import {
  kindFromModelName,
  type CurriculumContent,
  type GetCourseUnitContentsResult,
  type GetCourseUnitContentsVars,
  type UnitPagination,
} from 'src/types/classroom/types'

// Per-unit TTL — keep aligned with the bootstrap TTL so the user can't have
// fresh unit titles next to 11-minute-stale lesson lists.
const UNIT_TTL_MS = 10 * 60 * 1000

// Backend caps a single page at 100 rows. Heavier units (Microbiology ≈ 96)
// still arrive in one round-trip; the rare unit that exceeds it falls back
// to scroll-triggered `loadMore`.
const UNIT_CONTENTS_PAGE_SIZE = 100

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
  /** Set of unitPk currently fetching (any page). Reactive — drives skeleton state. */
  loadingPks: Set<number>
  /** Per-unit pagination cursor / hasNextPage / totalCount. */
  paginationByUnitPk: Map<number, UnitPagination>
  /**
   * Idempotently load page one of a unit's contents. Safe to call repeatedly;
   * returns the cached array if already fresh, otherwise triggers one Apollo
   * query.
   */
  loadUnit: (unitPk: number) => Promise<CurriculumContent[]>
  /**
   * Fetch the next page of a unit's contents and append to the cached list.
   * No-op if the unit isn't loaded, has no next page, or is already in flight.
   */
  loadMore: (unitPk: number) => Promise<CurriculumContent[]>
  /** Force a stale-bypass refetch of page one (resets cursor). */
  refetchUnit: (unitPk: number) => Promise<CurriculumContent[]>
}

function mapEdgesToContents(
  data: GetCourseUnitContentsResult | undefined,
  startOrderOffset: number,
): CurriculumContent[] {
  const edges = data?.allCourseUnitContentsByCourseUnit?.edges ?? []
  const out: CurriculumContent[] = []
  edges.forEach((edge, idx) => {
    const node = edge?.node
    if (!node) return
    const pk = (node as { pk?: number | null }).pk ?? null
    if (pk == null) return
    const modelName = node.modelName ?? ''
    if (!modelName || modelName === 'NoneType') return
    const kind = kindFromModelName(modelName)
    if (kind === 'unknown') return
    const raw = (node.modelValue ?? null) as string | null
    out.push({
      pk,
      id: node.id,
      isFree: Boolean((node as { isFree?: boolean | null }).isFree),
      isMandatory: Boolean((node as { isMandatory?: boolean | null }).isMandatory),
      modelName,
      kind,
      modelValueRaw: raw,
      title: titleFromModelValue(modelName, raw),
      order: (node as { order?: number | null }).order ?? startOrderOffset + idx,
      completed: false,
      inProgress: false,
    })
  })
  return out
}

export function useUnitContents(): UseUnitContentsApi {
  const { client } = useApolloClient()
  const cache = useClassroomCacheStore()

  // Reactive containers. `reactive(new Map())` gives a Vue-tracked Map.
  const contentsByUnitPk = reactive(new Map<number, CurriculumContent[]>())
  const loadingPks = reactive(new Set<number>())
  const paginationByUnitPk = reactive(new Map<number, UnitPagination>())
  // De-duplicate in-flight requests so a double-click / scroll spam doesn't
  // fire twice for the same unit. Separate buckets for page-one vs more.
  const inflightFirst = ref(new Map<number, Promise<CurriculumContent[]>>())
  const inflightMore = ref(new Map<number, Promise<CurriculumContent[]>>())

  function keyFor(unitPk: number): string {
    return `unit:${unitPk}`
  }

  async function fetchPage(
    unitPk: number,
    cursor: string | null,
    fresh: boolean,
  ): Promise<{ items: CurriculumContent[]; pagination: UnitPagination }> {
    const fetchPolicy = fresh ? 'network-only' : 'cache-first'
    const { data } = await client.query<GetCourseUnitContentsResult, GetCourseUnitContentsVars>({
      query: GetCourseUnitContents,
      variables: { unitPk, cursor, limit: UNIT_CONTENTS_PAGE_SIZE },
      fetchPolicy,
      errorPolicy: 'all',
    })

    const startOrderOffset = (contentsByUnitPk.get(unitPk)?.length ?? 0)
    const items = mapEdgesToContents(data, startOrderOffset)
    const conn = data?.allCourseUnitContentsByCourseUnit
    const pagination: UnitPagination = {
      endCursor: conn?.pageInfo?.endCursor ?? null,
      hasNextPage: Boolean(conn?.pageInfo?.hasNextPage),
      totalCount: conn?.totalCount ?? null,
    }
    return { items, pagination }
  }

  async function loadUnit(unitPk: number): Promise<CurriculumContent[]> {
    if (!Number.isFinite(unitPk) || unitPk <= 0) return []

    const inflightP = inflightFirst.value.get(unitPk)
    if (inflightP) return inflightP

    const cached = contentsByUnitPk.get(unitPk)
    const stale = cache.isStale(keyFor(unitPk), UNIT_TTL_MS)
    if (cached && !stale) return cached

    loadingPks.add(unitPk)
    const p = fetchPage(unitPk, null, false)
      .then(({ items, pagination }) => {
        items.sort((a, b) => a.order - b.order || a.pk - b.pk)
        contentsByUnitPk.set(unitPk, items)
        paginationByUnitPk.set(unitPk, pagination)
        cache.markFresh(keyFor(unitPk))
        return items
      })
      .catch((err: unknown) => {
        console.warn('[classroom] useUnitContents.loadUnit failed', { unitPk, err })
        return contentsByUnitPk.get(unitPk) ?? []
      })
      .finally(() => {
        loadingPks.delete(unitPk)
        inflightFirst.value.delete(unitPk)
      })
    inflightFirst.value.set(unitPk, p)
    return p
  }

  async function loadMore(unitPk: number): Promise<CurriculumContent[]> {
    if (!Number.isFinite(unitPk) || unitPk <= 0) return []
    const cached = contentsByUnitPk.get(unitPk)
    const page = paginationByUnitPk.get(unitPk)
    // Caller (rail sentinel) is allowed to fire freely; we no-op when there's
    // nothing to do.
    if (!cached || !page || !page.hasNextPage) return cached ?? []
    const inflightP = inflightMore.value.get(unitPk)
    if (inflightP) return inflightP

    loadingPks.add(unitPk)
    const cursor = page.endCursor
    const p = fetchPage(unitPk, cursor, false)
      .then(({ items, pagination }) => {
        const seen = new Set(cached.map((c) => c.pk))
        const merged = cached.concat(items.filter((c) => !seen.has(c.pk)))
        merged.sort((a, b) => a.order - b.order || a.pk - b.pk)
        contentsByUnitPk.set(unitPk, merged)
        paginationByUnitPk.set(unitPk, pagination)
        return merged
      })
      .catch((err: unknown) => {
        console.warn('[classroom] useUnitContents.loadMore failed', { unitPk, err })
        return contentsByUnitPk.get(unitPk) ?? []
      })
      .finally(() => {
        loadingPks.delete(unitPk)
        inflightMore.value.delete(unitPk)
      })
    inflightMore.value.set(unitPk, p)
    return p
  }

  async function refetchUnit(unitPk: number): Promise<CurriculumContent[]> {
    loadingPks.add(unitPk)
    try {
      const { items, pagination } = await fetchPage(unitPk, null, true)
      items.sort((a, b) => a.order - b.order || a.pk - b.pk)
      contentsByUnitPk.set(unitPk, items)
      paginationByUnitPk.set(unitPk, pagination)
      cache.markFresh(keyFor(unitPk))
      return items
    } catch (err) {
      console.warn('[classroom] useUnitContents.refetchUnit failed', { unitPk, err })
      return contentsByUnitPk.get(unitPk) ?? []
    } finally {
      loadingPks.delete(unitPk)
    }
  }

  return { contentsByUnitPk, loadingPks, paginationByUnitPk, loadUnit, loadMore, refetchUnit }
}
