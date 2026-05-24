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
import { computed, onMounted, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { useCourseBootstrap } from 'src/composables/classroom/useCourseBootstrap'
import { useLearningProgress } from 'src/composables/classroom/useLearningProgress'
import { useUnitContents } from 'src/composables/classroom/useUnitContents'
import { useCurrentContent } from 'src/composables/classroom/useCurrentContent'
import { ClassroomContextKey, type ClassroomContext } from 'src/composables/classroom/classroomContext'
import ClassroomHeader from 'src/components/classroom/ClassroomHeader.vue'
import ClassroomFooter from 'src/components/classroom/ClassroomFooter.vue'
import BackToTopFab from 'src/components/classroom/BackToTopFab.vue'
import type { ClassroomBootstrap } from 'src/types/classroom/types'

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

// ---------------------------------------------------------------------------
// Route params
// ---------------------------------------------------------------------------

const coursePk = computed<number | null>(() => {
  const raw = route.params.coursePk
  const first = Array.isArray(raw) ? raw[0] : raw
  const n = Number(first)
  return Number.isFinite(n) && n > 0 ? n : null
})

const currentContentPkFromRoute = computed<number | null>(() => {
  const raw = route.params.contentPk
  const first = Array.isArray(raw) ? raw[0] : raw
  if (!first) return null
  const n = Number(first)
  return Number.isFinite(n) && n > 0 ? n : null
})

// ---------------------------------------------------------------------------
// Data layer (slim bootstrap + lazy unit lessons + current-lesson resolver)
// ---------------------------------------------------------------------------

const { bootstrap: rawBootstrap, loading, error, refetch } = useCourseBootstrap(coursePk)

const enrollmentPk = computed<number | null>(() => rawBootstrap.value?.enrollmentPk ?? null)

const { progressMap, refetch: refetchProgress } = useLearningProgress(coursePk, enrollmentPk)

const {
  contentsByUnitPk,
  loadingPks: unitLoadingPks,
  paginationByUnitPk,
  loadUnit,
  loadMore,
} = useUnitContents()

const { currentContent, currentUnitPk } = useCurrentContent(currentContentPkFromRoute)

// Wrap the slim raw bootstrap with progress-aware aggregates so downstream
// readers (ClassroomOverviewPanel, ClassroomHeader) see accurate
// completedContents / totalVideos / progressPercent values that update as
// units lazy-hydrate.
const bootstrap = computed<ClassroomBootstrap | null>(() => {
  const b = rawBootstrap.value
  if (!b) return null
  const pm = progressMap.value
  let totalVideos = 0
  let completedVideos = 0
  for (const contents of contentsByUnitPk.values()) {
    for (const c of contents) {
      if (c.kind !== 'video') continue
      totalVideos += 1
      if (pm[c.pk]?.complete) completedVideos += 1
    }
  }
  // Denominator priority: hydrated video count when available (precise),
  // otherwise the slim bootstrap's totalContents (estimate). This keeps
  // the percent stable from first paint and only sharpens upward as the
  // user opens more units.
  const denom = totalVideos > 0 ? totalVideos : b.totalContents
  const progressPercent = denom === 0 ? 0 : Math.min(100, Math.round((completedVideos / denom) * 100))
  return {
    ...b,
    totalVideos: totalVideos > 0 ? totalVideos : b.totalVideos,
    completedContents: completedVideos,
    progressPercent,
  }
})

// Eagerly hydrate the unit that owns the current lesson, so the rail can
// show its surrounding lessons + the player has prev/next data within the
// unit without waiting for a click.
watch(
  () => currentUnitPk.value,
  (pk) => {
    if (pk != null) void loadUnit(pk)
  },
  { immediate: true },
)

// ---------------------------------------------------------------------------
// Inject into descendant components.
// ---------------------------------------------------------------------------

const classroomContext: ClassroomContext = {
  bootstrap,
  unitContents: contentsByUnitPk,
  unitLoadingPks,
  unitPagination: paginationByUnitPk,
  loadUnit,
  loadMore,
  currentContent,
  currentUnitPk,
  progress: progressMap,
  loading,
  error,
  refetch,
  refetchProgress,
}
provide(ClassroomContextKey, classroomContext)

// ---------------------------------------------------------------------------
// Header derived values
// ---------------------------------------------------------------------------

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
  // Pin to viewport so the document itself never scrolls. Each of the
  // three internal columns (rail / main / panel) owns its own scroll
  // container, which keeps the video player anchored in the center
  // when the user expands a unit accordion in the rail.
  block-size: 100vh;
  overflow: hidden;
  background: var(--cls-surface, #0F0B1A);
  color: var(--cls-text-primary, #F5F2EA);

  &__main {
    flex: 1 1 auto;
    display: flex;
    min-block-size: 0;
    overflow: hidden;
  }
}
</style>
