// Navigation helpers for the classroom player.
//
// Slim-bootstrap aware: prev/next are computed from the hydrated lessons of
// the unit currently on screen + (if cached) the adjacent units. We do NOT
// eagerly preload every unit just to compute "next" — that would defeat the
// purpose of lazy loading. The flow:
//
//   - currentUnitPk is known via useCurrentContent (single-content query).
//   - The layout has called loadUnit(currentUnitPk), so its lessons are in
//     unitContents.
//   - prev/next walks the current unit's hydrated list first.
//   - If the cursor lands on the unit's first/last lesson, prev/next falls
//     forward into the adjacent unit's lessons IF that unit is also
//     hydrated. Otherwise it returns null and the button is disabled —
//     clicking the next-unit's header in the rail expands + hydrates it.
//
// firstUnwatchedContent works similarly: it scans every hydrated unit; the
// shell can call loadUnit(firstUnitPk) before invoking goToFirstUnwatched.

import { computed, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ClassroomBootstrap,
  CurriculumContent,
  CurriculumUnit,
} from 'src/types/classroom/types'

interface NavOptions {
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  currentContentPk: ComputedRef<number | null>
  unitContents: ReadonlyMap<number, CurriculumContent[]>
}

function unitsOf(b: ClassroomBootstrap | null): CurriculumUnit[] {
  return b?.units ?? []
}

function hydratedFlatten(
  b: ClassroomBootstrap | null,
  unitContents: ReadonlyMap<number, CurriculumContent[]>,
): CurriculumContent[] {
  const units = unitsOf(b)
  if (units.length === 0) return []
  const out: CurriculumContent[] = []
  for (const u of units) {
    const lessons = unitContents.get(u.pk)
    if (!lessons || lessons.length === 0) continue
    for (const c of lessons) out.push(c)
  }
  return out
}

export function useCurriculumNavigation(options: NavOptions): {
  nextContent: ComputedRef<CurriculumContent | null>
  prevContent: ComputedRef<CurriculumContent | null>
  firstUnwatchedContent: ComputedRef<CurriculumContent | null>
  goToNext: () => void
  goToPrev: () => void
  goToFirstUnwatched: (coursePk: number) => void
} {
  const router = useRouter()
  const { bootstrap, currentContentPk, unitContents } = options

  // Flat list across all hydrated units, in bootstrap unit order.
  const ordered = computed<CurriculumContent[]>(() =>
    hydratedFlatten(bootstrap.value, unitContents),
  )

  const currentIndex = computed<number>(() => {
    const pk = currentContentPk.value
    if (pk == null) return -1
    return ordered.value.findIndex((c) => c.pk === pk)
  })

  const prevContent = computed<CurriculumContent | null>(() => {
    const i = currentIndex.value
    if (i <= 0) return null
    return ordered.value[i - 1] ?? null
  })

  const nextContent = computed<CurriculumContent | null>(() => {
    const i = currentIndex.value
    const list = ordered.value
    if (i < 0 || i >= list.length - 1) return null
    return list[i + 1] ?? null
  })

  const firstUnwatchedContent = computed<CurriculumContent | null>(() => {
    return ordered.value.find((c) => !c.completed) ?? ordered.value[0] ?? null
  })

  function push(content: CurriculumContent | null): void {
    const b = bootstrap.value
    if (!content || !b) return
    void router.push({
      name: 'classroom-content',
      params: {
        coursePk: String(b.coursePk),
        contentPk: String(content.pk),
      },
    })
  }

  function goToNext(): void {
    push(nextContent.value)
  }

  function goToPrev(): void {
    push(prevContent.value)
  }

  function goToFirstUnwatched(coursePk: number): void {
    const target = firstUnwatchedContent.value
    if (!target) return
    void router.push({
      name: 'classroom-content',
      params: {
        coursePk: String(coursePk),
        contentPk: String(target.pk),
      },
    })
  }

  return {
    nextContent,
    prevContent,
    firstUnwatchedContent,
    goToNext,
    goToPrev,
    goToFirstUnwatched,
  }
}
