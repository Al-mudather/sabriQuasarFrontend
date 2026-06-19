// Resolves the single CourseUnitContent for the lesson currently on screen.
//
// The classroom URL is `/classroom/class/:coursePk/content/:contentPk`. The
// slim bootstrap (GetCourseByIDSlim) deliberately omits per-unit lesson
// lists, so the layout cannot synthesize a CurriculumContent for the
// current lesson by walking bootstrap.units. This composable fills that
// gap: it fires GetCourseUnitContent(contentPk) and exposes a typed
// CurriculumContent plus its parent unit pk. The rail then eagerly
// loads that unit so prev/next navigation has the surrounding lessons.

import { computed, isRef, unref, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import { GetCourseUnitContent } from 'src/graphql/course_management/query/GetCourseUnitContent'
import {
  kindFromModelName,
  titleFromModelValue,
  type CurriculumContent,
  type GetCourseUnitContentResult,
  type GetCourseUnitContentVars,
} from 'src/types/classroom/types'

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
  const vars = computed<GetCourseUnitContentVars>(() => ({ contentPk: toNum(contentPk) ?? 0 }))
  const enabled = computed(() => toNum(contentPk) !== null)

  // ONE network-only fetch per lesson. Two things matter for VdoCipher, whose
  // `cipher_iframe` modelValue carries a SINGLE-USE OTP:
  //   1. network-only — never replay a cached (already-consumed) OTP on revisit.
  //   2. exactly one fetch — the previous code ALSO ran a TTL `watch` that called
  //      `refetch()` on mount, so every lesson fetched TWICE → the iframe loaded
  //      twice → the first load consumed the OTP and the second 403'd ("6007").
  //      That redundant refetch is removed; network-only already keeps it fresh.
  const { result, loading } = useQuery<
    GetCourseUnitContentResult,
    GetCourseUnitContentVars
  >(GetCourseUnitContent, vars, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }))

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
