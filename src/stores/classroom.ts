// Pinia setup store for the internal classroom feature. Holds only
// presentation-layer state (rail collapsed, active panel tab, player
// preferences) and the currently-active enrollment pk. All *data* lives in
// the Apollo cache — this store is UI state that must survive reloads so
// the learner's cockpit preferences feel sticky across sessions.

import { defineStore } from 'pinia'
import { ref } from 'vue'

// Load the persistedstate module augmentation so `persist: { paths: [...] }`
// is accepted on setup-style stores. Mirrors the pattern in settings.ts.
import 'pinia-plugin-persistedstate'

export type ClassroomPanelTab = 'overview' | 'qa'

export const useClassroomStore = defineStore(
  'classroom',
  () => {
    const currentEnrollmentPk = ref<number | null>(null)
    const railCollapsed = ref<boolean>(false)
    const panelTab = ref<ClassroomPanelTab>('overview')
    const playbackRate = ref<number>(1)
    const autoAdvance = ref<boolean>(true)

    function setEnrollment (pk: number | null): void {
      currentEnrollmentPk.value = pk
    }

    function toggleRail (): void {
      railCollapsed.value = !railCollapsed.value
    }

    function setTab (t: ClassroomPanelTab): void {
      panelTab.value = t
    }

    return {
      currentEnrollmentPk,
      railCollapsed,
      panelTab,
      playbackRate,
      autoAdvance,
      setEnrollment,
      toggleRail,
      setTab,
    }
  },
  {
    // Enrollment pk is intentionally NOT persisted — it must come from the
    // active route so deep-links always win over stale storage.
    persist: { paths: ['railCollapsed', 'panelTab', 'playbackRate', 'autoAdvance'] } as unknown as boolean,
  },
)
