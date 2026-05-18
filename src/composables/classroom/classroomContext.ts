import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ClassroomBootstrap, ProgressMap } from 'src/types/classroom/types'

export type ClassroomContext = {
  bootstrap: ComputedRef<ClassroomBootstrap | null>
  progress: ComputedRef<ProgressMap>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => void
  refetchProgress: () => void
}

export const ClassroomContextKey: InjectionKey<ClassroomContext> = Symbol('classroomContext')
