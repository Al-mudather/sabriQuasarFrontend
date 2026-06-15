<template>
  <div class="cls-shell">
    <ClassroomEmptyState
      v-if="ctx.error.value"
      :title="$t('classroom.empty.errorTitle')"
      :description="ctx.error.value.message || $t('classroom.empty.errorDescription')"
      icon="error_outline"
    />
    <ClassroomEmptyState
      v-else-if="ctx.bootstrap.value && ctx.bootstrap.value.totalContents === 0"
      :title="$t('classroom.empty.noCurriculum')"
      icon="inbox"
    />
    <ClassroomCockpitSkeleton v-else variant="full" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useCurriculumNavigation } from 'src/composables/classroom/useCurriculumNavigation'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import ClassroomCockpitSkeleton from 'src/components/classroom/ClassroomCockpitSkeleton.vue'

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

// On entry the slim bootstrap arrives without per-unit lessons. To pick a
// "first unwatched" target we need the first unit's lessons hydrated.
// loadUnit() is idempotent + cache-aware, so calling it here is cheap.
//
// Trigger off `courseUnits` (course query alone) rather than `bootstrap`
// (course + enrollment) so the first unit's lessons start loading in parallel
// with the enrollment query instead of waiting for both.
let routedOnce = false
watch(
  () => ctx.courseUnits.value,
  (units) => {
    const first = units[0]
    if (first) void ctx.loadUnit(first.pk)
  },
  { immediate: true },
)

// Once the first unit's lessons land, route to its first unwatched lesson.
// Guarded with `routedOnce` so a later background refetch doesn't yank the
// user out of the lesson they've since navigated to.
watch(
  [() => ctx.bootstrap.value, () => ctx.unitContents.size, () => Array.from(ctx.unitContents.values()).flat().length],
  () => {
    if (routedOnce) return
    const cpk = coursePk.value
    const b = ctx.bootstrap.value
    if (!b || !cpk || b.totalContents === 0) return
    const firstUnit = b.units[0]
    if (!firstUnit) return
    const firstHydrated = ctx.unitContents.get(firstUnit.pk)
    if (!firstHydrated || firstHydrated.length === 0) return
    routedOnce = true
    goToFirstUnwatched(cpk)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.cls-shell {
  flex: 1 1 auto;
  display: flex;
  // Empty/error states center; the loading skeleton fills via its own
  // `align-self: stretch` + flex-grow.
  align-items: center;
  justify-content: center;
  min-block-size: 0;
}
</style>
