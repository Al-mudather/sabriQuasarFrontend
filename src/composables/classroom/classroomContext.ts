import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type {
  ClassroomBootstrap,
  CurriculumContent,
  ProgressMap,
  UnitPagination,
} from 'src/types/classroom/types'

export type ClassroomContext = {
  /** Slim bootstrap: course meta + unit titles + per-unit contentsCount. */
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  /** Per-unit hydrated lessons. Empty until the rail expands a unit. */
  unitContents: ReadonlyMap<number, CurriculumContent[]>
  /** Set of unit pks currently fetching. Drives rail skeletons. */
  unitLoadingPks: ReadonlySet<number>
  /** Per-unit pagination state — drives the rail's auto-load sentinel. */
  unitPagination: ReadonlyMap<number, UnitPagination>
  /** Idempotently load a unit's first page. Safe to call multiple times. */
  loadUnit: (unitPk: number) => Promise<CurriculumContent[]>
  /** Fetch and append the next page of a unit. No-op when hasNextPage is false. */
  loadMore: (unitPk: number) => Promise<CurriculumContent[]>
  /**
   * The lesson currently on screen (resolved via GetCourseUnitContent at the
   * layout). Available before its parent unit's lesson list has hydrated.
   */
  currentContent: ComputedRef<CurriculumContent | null>
  /** The pk of the unit that owns currentContent. */
  currentUnitPk: ComputedRef<number | null>
  /** Progress map keyed by courseUnitContent.pk. */
  progress: ComputedRef<ProgressMap>
  /**
   * Start / end the learning-progress record for the active lesson. Owned by
   * the SINGLE useLearningProgress instance in the layout — ContentView calls
   * these instead of spawning its own instance (which re-ran the whole
   * GetAllLearningProgressByCourse query, a duplicate fetch).
   */
  startProgress: (contentPk: number, unitPk: number) => Promise<void>
  endProgress: () => Promise<void>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
  refetchProgress: () => void
}

export const ClassroomContextKey: InjectionKey<ClassroomContext> = Symbol('classroomContext')
