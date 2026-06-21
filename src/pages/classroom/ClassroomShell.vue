<template>
  <div class="cls-shell">
    <ClassroomEmptyState
      v-if="ctx.error.value"
      :title="$t('classroom.empty.errorTitle')"
      :description="ctx.error.value.message || $t('classroom.empty.errorDescription')"
      icon="error_outline"
    />
    <!-- Settled with no playable lesson anywhere → say so, don't spin forever. -->
    <ClassroomEmptyState
      v-else-if="noContent"
      :title="$t('classroom.empty.noCurriculum')"
      icon="inbox"
    />
    <!-- Loading: show a classroom-shaped skeleton (not a bare spinner) while we
         resolve which lesson to open. -->
    <ClassroomSkeleton v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useCurriculumNavigation } from 'src/composables/classroom/useCurriculumNavigation'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import ClassroomSkeleton from 'src/components/classroom/ClassroomSkeleton.vue'

defineOptions({ name: 'ClassroomShell' })

const route = useRoute()
const classroom = useClassroomStore()
const injected = inject(ClassroomContextKey)
if (!injected) throw new Error('ClassroomShell must be used inside ClassroomLayout')
const ctx = injected

const coursePk = computed<number | null>(() => {
  const raw = route.params.coursePk
  const first = Array.isArray(raw) ? raw[0] : raw
  const n = Number(first)
  return Number.isFinite(n) && n > 0 ? n : null
})

watch(
  () => ctx.bootstrap.value?.enrollmentPk ?? null,
  (v) => classroom.setEnrollment(v),
  { immediate: true },
)

const currentContentPk = computed<number | null>(() => null)
const { goToFirstUnwatched } = useCurriculumNavigation({
  bootstrap: ctx.bootstrap,
  currentContentPk,
  unitContents: ctx.unitContents,
})

// Set once we've scanned every unit and found NO playable lesson — drives the
// graceful "no curriculum" state instead of an endless spinner.
const noContent = ref<boolean>(false)

// Resolve the FIRST lesson to open. The bootstrap arrives WITHOUT per-unit
// lessons, and — critically — the first unit(s) may be empty while the videos
// live in a LATER unit (real case: course 143's units 1–2 have no playable
// content, the videos start at unit 3). So we walk the units IN ORDER, loading
// each, and redirect into the FIRST unit that actually yields lessons. This
// also self-heals the count-vs-reality mismatch (a unit whose totalCount says
// "1" but whose content query returns nothing is simply skipped). If no unit
// anywhere has a lesson, we settle to the empty state — never an infinite load.
let resolving = false
let routedOnce = false

async function resolveFirstLesson(): Promise<void> {
  if (routedOnce || resolving) return
  const b = ctx.bootstrap.value
  const cpk = coursePk.value
  if (!b || cpk == null) return
  // Guard against the cross-course race: when switching courses in-app the
  // layout persists, so `bootstrap` can momentarily still hold the PREVIOUS
  // course (cache-first) while this route already points at the new one. Acting
  // on it would route into the wrong course's lesson. Wait until the bootstrap
  // is actually for THIS course.
  if (b.coursePk !== cpk) return
  resolving = true
  noContent.value = false
  try {
    for (const unit of b.units) {
      if (routedOnce) return
      // loadUnit is idempotent + cache-aware; it resolves with the unit's
      // lessons (empty array when the unit has none).
      const lessons = await ctx.loadUnit(unit.pk)
      if (routedOnce) return
      if (lessons && lessons.length > 0) {
        routedOnce = true
        // goToFirstUnwatched scans the hydrated units in order, so it lands on
        // the first lesson of the first non-empty unit we just loaded.
        goToFirstUnwatched(cpk)
        return
      }
    }
    // Walked every unit, nothing playable.
    noContent.value = true
  } finally {
    resolving = false
  }
}

watch(
  () => ctx.bootstrap.value,
  (b) => {
    if (b) void resolveFirstLesson()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.cls-shell {
  flex: 1 1 auto;
  display: flex;
  min-block-size: 0;
}
</style>
