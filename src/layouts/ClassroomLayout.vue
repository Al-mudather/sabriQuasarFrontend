<template>
  <div class="cls-layout classroom-scope" :dir="$q.lang.rtl ? 'rtl' : 'ltr'">
    <ClassroomHeader
      :title="headerTitle"
      :percent="headerPercent"
    />
    <main class="cls-layout__main">
      <router-view />
    </main>
    <ClassroomFooter />
    <BackToTopFab />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { useCourseBootstrap } from 'src/composables/classroom/useCourseBootstrap'
import { useLearningProgress } from 'src/composables/classroom/useLearningProgress'
import { ClassroomContextKey, type ClassroomContext } from 'src/composables/classroom/classroomContext'
import ClassroomHeader from 'src/components/classroom/ClassroomHeader.vue'
import ClassroomFooter from 'src/components/classroom/ClassroomFooter.vue'
import BackToTopFab from 'src/components/classroom/BackToTopFab.vue'
import type { ClassroomBootstrap, CurriculumContent, CurriculumUnit } from 'src/types/classroom/types'

defineOptions({ name: 'ClassroomLayout' })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

onMounted(() => {
  if (!auth.isAuthenticated) {
    void router.replace({ name: 'login', query: { redirect: route.fullPath } })
  }
})

const coursePk = computed<number | null>(() => {
  const raw = route.params.coursePk
  const first = Array.isArray(raw) ? raw[0] : raw
  const n = Number(first)
  const parsed = Number.isFinite(n) && n > 0 ? n : null
  console.log('[classroom][step 0/4] ClassroomLayout route param', {
    raw,
    parsed,
    path: route.fullPath,
  })
  return parsed
})

const { bootstrap: rawBootstrap, loading, error, refetch } = useCourseBootstrap(coursePk)

const enrollmentPk = computed<number | null>(() => rawBootstrap.value?.enrollmentPk ?? null)

const { progressMap, refetch: refetchProgress } = useLearningProgress(coursePk, enrollmentPk)

// Merge progress map into the curriculum rows so the rail can show ticks
// without every consumer reading the map separately. Progress percent is
// computed over VIDEOS ONLY (product decision: NoneType rows are already
// stripped upstream; quiz + file rows don't move the progress ring).
const bootstrap = computed<ClassroomBootstrap | null>(() => {
  const b = rawBootstrap.value
  if (!b) return null
  const pm = progressMap.value
  const units: CurriculumUnit[] = b.units.map((u) => ({
    ...u,
    contents: u.contents.map<CurriculumContent>((c) => {
      const p = pm[c.pk]
      return {
        ...c,
        completed: Boolean(p?.complete),
        inProgress: Boolean(p?.begin) && !p?.complete,
      }
    }),
  }))
  const completedVideos = units.reduce(
    (acc, u) => acc + u.contents.filter((c) => c.kind === 'video' && c.completed).length,
    0,
  )
  const denom = b.totalVideos
  const progressPercent =
    denom === 0 ? 0 : Math.min(100, Math.round((completedVideos / denom) * 100))
  return { ...b, units, completedContents: completedVideos, progressPercent }
})

const classroomContext: ClassroomContext = {
  bootstrap,
  progress: progressMap,
  loading,
  error,
  refetch,
  refetchProgress,
}
provide(ClassroomContextKey, classroomContext)

const headerTitle = computed<string>(() => {
  if (bootstrap.value?.courseTitle) return bootstrap.value.courseTitle
  if (loading.value) return t('classroom.header.loading')
  return t('classroom.header.fallbackTitle')
})

const headerPercent = computed<number>(() => bootstrap.value?.progressPercent ?? 0)
</script>

<style lang="scss" scoped>
@use 'src/design-system/classroom/tokens.scss';

.cls-layout {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
  background: var(--cls-surface, #0F0B1A);
  color: var(--cls-text-primary, #F5F2EA);

  &__main {
    flex: 1 1 auto;
    display: flex;
    min-block-size: 0;
  }
}
</style>
