// Resolves the single CourseUnitContent for the lesson currently on screen.
//
// The classroom URL is `/classroom/class/:coursePk/content/:contentPk`. The
// slim bootstrap (GetCourseByIDSlim) deliberately omits per-unit lesson
// lists, so the layout cannot synthesize a CurriculumContent for the
// current lesson by walking bootstrap.units. This composable fills that
// gap: it fires GetCourseUnitContent(contentPk) and exposes a typed
// CurriculumContent plus its parent unit pk. The rail then eagerly
// loads that unit so prev/next navigation has the surrounding lessons.

import { computed, isRef, unref, watch, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import { GetCourseUnitContent } from 'src/graphql/course_management/query/GetCourseUnitContent'
import { useClassroomCacheStore } from 'src/stores/classroomCache'
import {
  kindFromModelName,
  type CurriculumContent,
  type GetCourseUnitContentResult,
  type GetCourseUnitContentVars,
} from 'src/types/classroom/types'

const CURRENT_CONTENT_TTL_MS = 10 * 60 * 1000

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

type PkLike = number | Ref<number | null | undefined> | null | undefined

function toNum(v: PkLike): number | null {
  const raw = isRef(v) ? unref(v) : v
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : null
}

export function useCurrentContent(contentPk: PkLike): {
  currentContent: ComputedRef<CurriculumContent | null>
  currentUnitPk: ComputedRef<number | null>
  loading: Ref<boolean>
} {
  const cache = useClassroomCacheStore()

  const vars = computed<GetCourseUnitContentVars>(() => ({ contentPk: toNum(contentPk) ?? 0 }))
  const enabled = computed(() => toNum(contentPk) !== null)

  const { result, loading, onResult, refetch } = useQuery<
    GetCourseUnitContentResult,
    GetCourseUnitContentVars
  >(GetCourseUnitContent, vars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }))

  onResult((res) => {
    const pk = res.data?.courseUnitContent?.pk
    if (pk) cache.markFresh(`content:${pk}`)
  })

  // Stale-after-TTL refetch for the current lesson too — keeps the metadata
  // (and the video / quiz / file pointers) fresh after long playback sessions.
  watch(
    () => toNum(contentPk),
    (pk) => {
      if (pk == null) return
      if (cache.isStale(`content:${pk}`, CURRENT_CONTENT_TTL_MS)) {
        void refetch(vars.value)
      }
    },
    { immediate: true },
  )

  const currentContent = computed<CurriculumContent | null>(() => {
    const node = result.value?.courseUnitContent
    if (!node) return null
    const pk = (node as { pk?: number | null }).pk ?? null
    if (pk == null) return null
    const modelName = node.modelName ?? ''
    if (!modelName) return null
    const kind = kindFromModelName(modelName)
    if (kind === 'unknown') return null
    const raw = (node.modelValue ?? null) as string | null
    return {
      pk,
      id: node.id,
      isFree: false,
      isMandatory: false,
      modelName,
      kind,
      modelValueRaw: raw,
      title: titleFromModelValue(modelName, raw),
      order: 0,
      completed: false,
      inProgress: false,
    }
  })

  const currentUnitPk = computed<number | null>(() => {
    const u = result.value?.courseUnitContent?.courseUnit
    if (!u) return null
    return (u as { pk?: number | null }).pk ?? null
  })

  return { currentContent, currentUnitPk, loading }
}
