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
    <div v-else class="cls-shell__loading" role="status" :aria-label="$t('classroom.header.loading')">
      <q-spinner-dots color="secondary" size="48px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useCurriculumNavigation } from 'src/composables/classroom/useCurriculumNavigation'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'

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
const { goToFirstUnwatched } = useCurriculumNavigation(ctx.bootstrap, currentContentPk)

watch(
  () => ctx.bootstrap.value,
  (b) => {
    const cpk = coursePk.value
    if (b && b.totalContents > 0 && cpk != null) goToFirstUnwatched(cpk)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.cls-shell {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 0;

  &__loading {
    display: inline-flex;
  }
}
</style>
