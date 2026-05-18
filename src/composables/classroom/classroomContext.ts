import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type {
  ClassroomBootstrap,
  CurriculumContent,
  ProgressMap,
} from 'src/types/classroom/types'

export type ClassroomContext = {
  /** Slim bootstrap: course meta + unit titles + per-unit contentsCount. */
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  /** Per-unit hydrated lessons. Empty until the rail expands a unit. */
  unitContents: ReadonlyMap<number, CurriculumContent[]>
  /** Set of unit pks currently fetching. Drives rail skeletons. */
  unitLoadingPks: ReadonlySet<number>
  /** Idempotently load a unit's lessons. Safe to call multiple times. */
  loadUnit: (unitPk: number) => Promise<CurriculumContent[]>
  /**
   * The lesson currently on screen (resolved via GetCourseUnitContent at the
   * layout). Available before its parent unit's lesson list has hydrated.
   */
  currentContent: ComputedRef<CurriculumContent | null>
  /** The pk of the unit that owns currentContent. */
  currentUnitPk: ComputedRef<number | null>
  /** Progress map keyed by courseUnitContent.pk. */
  progress: ComputedRef<ProgressMap>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
  refetchProgress: () => void
}

export const ClassroomContextKey: InjectionKey<ClassroomContext> = Symbol('classroomContext')
