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

const { bootstrap: rawBootstrap, loading, error, refetch, refreshEnrollment } = useCourseBootstrap(coursePk)

const enrollmentPk = computed<number | null>(() => rawBootstrap.value?.enrollmentPk ?? null)

const {
  progressMap,
  refetch: refetchProgress,
  start: startProgress,
  end: endProgress,
} = useLearningProgress(coursePk, enrollmentPk)

// Live-ring update: when the user navigates away from a content (contentPk changes),
// refetch ONLY the enrollment so the header ring reflects the new backend
// percentage. (Previously called the full bootstrap refetch, which needlessly
// re-fetched the static course + all unit titles on every single lesson switch.)
watch(
  () => currentContentPkFromRoute.value,
  (next, prev) => {
    if (prev != null && next !== prev) {
      refreshEnrollment()
    }
  },
)

const {
  contentsByUnitPk,
  loadingPks: unitLoadingPks,
  paginationByUnitPk,
  loadUnit,
  loadMore,
} = useUnitContents()

const { currentContent, currentUnitPk } = useCurrentContent(currentContentPkFromRoute)

// The backend progress fields (completedContents, totalVideos, progressPercent)
// are already populated by useCourseBootstrap from the canonical enrollment.progress
// field — pass them through unchanged. progressMap remains wired for per-lesson
// rail ticks; it does NOT override the header ring percentage.
const bootstrap = computed<ClassroomBootstrap | null>(() => rawBootstrap.value)

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
  startProgress,
  endProgress,
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
  // Show the current LESSON/video name in the header (centered), not the course
  // name. Fall back to the course title, then loading/fallback labels.
  const lesson = currentContent.value?.title
  if (lesson && lesson.trim()) return lesson
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
