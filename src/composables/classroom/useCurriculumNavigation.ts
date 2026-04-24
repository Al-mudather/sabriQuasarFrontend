// Navigation helpers for the classroom player.
//
// Given the flat `ClassroomBootstrap.units[].contents[]` tree and the pk of
// the content currently on screen, exposes prev/next/first-unwatched
// pointers and imperative `goTo*` helpers that push onto vue-router.

import { computed, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ClassroomBootstrap,
  CurriculumContent,
} from 'src/types/classroom/types'

function flatten(b: ClassroomBootstrap | null): CurriculumContent[] {
  if (!b) return []
  return b.units.flatMap((u) => u.contents)
}

export function useCurriculumNavigation(
  bootstrap: Ref<ClassroomBootstrap | null>,
  currentContentPk: Ref<number | null>,
): {
  nextContent: ComputedRef<CurriculumContent | null>
  prevContent: ComputedRef<CurriculumContent | null>
  firstUnwatchedContent: ComputedRef<CurriculumContent | null>
  goToNext: () => void
  goToPrev: () => void
  goToFirstUnwatched: (coursePk: number) => void
} {
  const router = useRouter()

  const ordered = computed<CurriculumContent[]>(() => flatten(bootstrap.value))

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
