<template>
  <main class="my-courses">
    <!-- Page header: title + compact stats strip -->
    <header class="my-courses__header">
      <div class="my-courses__heading">
        <h1 class="my-courses__title">{{ $t('دوراتي') }}</h1>
        <p v-if="!isLoading" class="my-courses__subtitle">
          {{ subheadingText }}
        </p>
      </div>

      <div
        v-if="!isLoading && total > 0"
        class="my-courses__stats"
        aria-label="Learning statistics"
      >
        <div class="stat-pill stat-pill--indigo">
          <span class="stat-pill__value">{{ total }}</span>
          <span class="stat-pill__label">{{ $t('إجمالي الدورات') }}</span>
        </div>
        <div class="stat-pill stat-pill--terracotta">
          <span class="stat-pill__value">{{ completedCount }}</span>
          <span class="stat-pill__label">{{ $t('مكتملة') }}</span>
        </div>
        <div class="stat-pill stat-pill--muted">
          <span class="stat-pill__value">{{ inProgressCount }}</span>
          <span class="stat-pill__label">{{ $t('قيد التعلم') }}</span>
        </div>
      </div>
    </header>

    <!-- Filter bar: search + optional chip row -->
    <section
      v-if="!isLoading && total > 0"
      class="my-courses__filterbar"
      aria-label="Course filters"
    >
      <div class="my-courses__search">
        <ds-input
          v-model="searchQuery"
          type="search"
          size="md"
          :placeholder="$t('ابحث في دوراتك...')"
          :aria-label="$t('ابحث في دوراتك')"
        />
      </div>

      <div
        v-if="showStatusChips"
        class="my-courses__chips"
        role="tablist"
        :aria-label="$t('تصفية حسب الحالة')"
      >
        <button
          v-for="chip in statusChips"
          :key="chip.value"
          type="button"
          role="tab"
          :aria-selected="statusFilter === chip.value"
          :aria-pressed="statusFilter === chip.value"
          :aria-label="`${chip.label} (${chip.count})`"
          class="chip"
          :class="{ 'chip--active': statusFilter === chip.value }"
          @click="statusFilter = chip.value"
        >
          <span class="chip__label">{{ chip.label }}</span>
          <span class="chip__count">{{ chip.count }}</span>
        </button>
      </div>
    </section>

    <!-- Grid -->
    <section
      v-if="!isLoading && visibleItems.length"
      class="my-courses__grid"
      aria-label="Enrolled courses"
    >
      <article
        v-for="item in visibleItems"
        :key="item.key"
        class="mc-card"
        :class="{ 'mc-card--completed': item.isCompleted }"
      >
        <div class="mc-card__media">
          <img
            v-if="item.course.coverImage"
            :src="item.course.coverImage"
            :alt="item.course.name"
            class="mc-card__cover"
            loading="lazy"
          />
          <div v-else class="mc-card__cover mc-card__cover--placeholder" aria-hidden="true">
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient :id="`mc-grad-${item.key}`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1B1E50"/>
                  <stop offset="100%" stop-color="#322873"/>
                </linearGradient>
              </defs>
              <rect width="400" height="300" :fill="`url(#mc-grad-${item.key})`"/>
              <text
                x="200" y="170"
                text-anchor="middle"
                font-family="Tajawal, system-ui, sans-serif"
                font-weight="700"
                font-size="86"
                fill="#F6F1EA"
                opacity="0.28"
                letter-spacing="6"
              >STC</text>
            </svg>
          </div>

          <!-- Status badge on media -->
          <span
            v-if="item.isCompleted"
            class="mc-card__badge mc-card__badge--done"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ $t('مكتملة') }}
          </span>
          <span
            v-else-if="item.progress > 0"
            class="mc-card__badge mc-card__badge--progress"
          >{{ $t('قيد التعلم') }}</span>
          <span
            v-else
            class="mc-card__badge mc-card__badge--new"
          >{{ $t('لم تبدأ بعد') }}</span>
        </div>

        <div class="mc-card__body">
          <h3 class="mc-card__title">{{ item.course.name }}</h3>

          <div class="mc-card__progress">
            <div class="mc-card__progress-head">
              <span class="mc-card__progress-label">
                {{ item.isCompleted ? $t('أكملت الدورة') : $t('التقدم') }}
              </span>
              <span class="mc-card__progress-value">{{ item.progress }}%</span>
            </div>
            <div
              class="mc-card__progress-track"
              role="progressbar"
              :aria-valuenow="item.progress"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="mc-card__progress-fill"
                :class="{ 'mc-card__progress-fill--done': item.isCompleted }"
                :style="{ inlineSize: `${item.progress}%` }"
              ></div>
            </div>
          </div>

          <ds-button
            :variant="item.isCompleted ? 'secondary' : 'primary'"
            size="md"
            full-width
            class="mc-card__cta"
            @click="goToClassroom(item)"
          >
            {{ item.isCompleted ? $t('إعادة المشاهدة') : $t('متابعة الدورة') }}
          </ds-button>
        </div>
      </article>
    </section>

    <!-- Loading skeletons -->
    <section v-if="isLoading" class="my-courses__grid" aria-busy="true">
      <ds-skeleton
        v-for="n in 6"
        :key="'sk-' + n"
        type="card"
      />
    </section>

    <!-- Empty state: no enrollments at all -->
    <ds-empty-state
      v-if="!isLoading && total === 0"
      variant="search"
      :title="$t('لا توجد دورات هنا بعد')"
      :body="$t('ابدأ رحلتك التعليمية الآن')"
      :cta-label="$t('تصفح الدورات')"
      size="lg"
      @cta-click="goToCoursesPage"
    />

    <!-- Empty state: filter produced no result -->
    <ds-empty-state
      v-else-if="!isLoading && total > 0 && visibleItems.length === 0"
      variant="search"
      :title="$t('لا توجد نتائج مطابقة')"
      :body="$t('جرب تعديل البحث أو الفلتر')"
      :cta-label="$t('إعادة ضبط')"
      @cta-click="resetFilters"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { AllEnrollmentsForCurrentUser } from 'src/graphql/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import { useSettingsStore } from 'src/stores/settings'
import { useAuthStore } from 'src/stores/auth'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsInput from 'src/design-system/components/DsInput.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import type { AllEnrollmentsResult, AllEnrollmentsVars, Enrollment } from 'src/types/enrollments/types'

// ---------------------------------------------------------------------------
// Stores / router
// ---------------------------------------------------------------------------
const settings = useSettingsStore()
const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------
onMounted(() => {
  settings.setActiveNav('BORD')
  if (!auth.isAuthenticated) {
    void router.push({ name: 'login', query: { redirect: '/my-courses' } })
  }
})

// ---------------------------------------------------------------------------
// Local filter state
// ---------------------------------------------------------------------------
type StatusFilter = 'all' | 'in-progress' | 'completed'
const searchQuery = ref<string>('')
const statusFilter = ref<StatusFilter>('all')

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
const enrollQuery = useQuery<AllEnrollmentsResult, AllEnrollmentsVars>(
  AllEnrollmentsForCurrentUser,
  { limit: 100, cursor: '' },
  { fetchPolicy: 'network-only' },
)

const allEnrollmentsData = computed(
  () => enrollQuery.result.value?.allEnrollmentsForCurrentUser ?? null,
)

const enrollmentEdges = computed(
  () => (allEnrollmentsData.value?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node),
)

function computeProgress(enrollmentNode: Enrollment): number {
  const course = enrollmentNode.course
  if (!course?.courseunitSet) return 0
  const done = enrollmentNode.learningprogressSet?.totalCount ?? 0
  const total = (course.courseunitSet.edges ?? []).reduce(
    (acc, u) => acc + (u?.node?.courseunitcontentSet?.totalCount ?? 0),
    0,
  )
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)))
}

interface CourseCardViewModel {
  key: string
  pk: number | null
  enrollmentPk: number | null
  progress: number
  isCompleted: boolean
  course: {
    id: string
    pk: number | null
    name: string
    coverImage?: string
    progress: number
  }
}

const items = computed<CourseCardViewModel[]>(() =>
  enrollmentEdges.value.map((edge) => {
    const node = edge.node!
    const c = node.course
    const progress = computeProgress(node)
    return {
      key: node.id ?? c.id ?? String(c.pk),
      pk: c.pk,
      enrollmentPk: node.pk,
      progress,
      isCompleted: progress >= 100,
      course: {
        id: c.id,
        pk: c.pk,
        name: c.title,
        coverImage: c.cover ? FORMAT_THE_IAMGE_URL(c.cover) as string : undefined,
        progress,
      },
    }
  }),
)

// ---------------------------------------------------------------------------
// Derived counts
// ---------------------------------------------------------------------------
const total = computed(() => items.value.length)
const isLoading = computed(() => enrollQuery.loading.value && items.value.length === 0)

const inProgressCount = computed(
  () => items.value.filter((i) => i.progress > 0 && i.progress < 100).length,
)
const completedCount = computed(
  () => items.value.filter((i) => i.isCompleted).length,
)

// Chips are subtle and secondary: only show when there's enough content.
const showStatusChips = computed(() => total.value > 6)

interface ChipDef { value: StatusFilter; label: string; count: number }
const statusChips = computed<ChipDef[]>(() => [
  { value: 'all', label: t('الكل'), count: total.value },
  { value: 'in-progress', label: t('قيد التعلم'), count: inProgressCount.value },
  { value: 'completed', label: t('مكتملة'), count: completedCount.value },
])

// ---------------------------------------------------------------------------
// Filtered view
// ---------------------------------------------------------------------------
const visibleItems = computed<CourseCardViewModel[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const effectiveStatus = showStatusChips.value ? statusFilter.value : 'all'
  return items.value.filter((i) => {
    if (effectiveStatus === 'completed' && !i.isCompleted) return false
    if (effectiveStatus === 'in-progress' && !(i.progress > 0 && i.progress < 100)) return false
    if (q && !i.course.name.toLowerCase().includes(q)) return false
    return true
  })
})

const subheadingText = computed<string>(() => {
  if (total.value === 0) return t('ابدأ رحلتك التعليمية الآن')
  return t('تتابع الآن {n} دورات', { n: total.value })
    .replace('{n}', String(total.value))
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function goToCoursesPage(): void {
  void router.push({ name: 'courses' })
}

function goToClassroom(item: CourseCardViewModel): void {
  // The classroom cockpit is keyed on *course* pk; the enrollment resolves
  // server-side via `enrollmentByCourseForCurrentUser`.
  const coursePk = item.pk
  if (!coursePk) return
  void router.push({ name: 'classroom-shell', params: { coursePk: String(coursePk) } })
}

function resetFilters(): void {
  searchQuery.value = ''
  statusFilter.value = 'all'
}
</script>

<style lang="scss" scoped>
.my-courses {
  max-inline-size: 1280px;
  margin-inline: auto;
  padding: var(--ds-space-5) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-5) var(--ds-space-16);
  }

  /* ---------- Header ---------- */
  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    margin-block-end: var(--ds-space-6);

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--ds-space-6);
    }
  }

  &__heading {
    min-inline-size: 0;
    flex: 1 1 auto;
  }

  &__title {
    font-family: var(--ds-font-heading, 'Tajawal', system-ui, sans-serif);
    font-weight: 700;
    font-size: clamp(26px, 3.6vw, 40px);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-2);
    line-height: 1.2;
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-taupe, var(--ds-text-muted));
    margin: 0;
    line-height: var(--ds-leading-arabic, 1.7);
  }

  /* ---------- Compact stats strip ---------- */
  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
  }

  .stat-pill {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-4);
    background: var(--ds-surface-elevated, var(--ds-ivory, #fbf6ee));
    border: 1px solid var(--ds-border);
    border-radius: 999px;
    box-shadow: var(--ds-shadow-xs);
    font-family: var(--ds-font-body);
    white-space: nowrap;

    &__value {
      font-family: var(--ds-font-mono, var(--ds-font-heading));
      font-weight: 700;
      font-size: var(--ds-text-lg);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    &__label {
      font-size: var(--ds-text-xs);
      color: var(--ds-taupe, var(--ds-text-muted));
    }

    &--indigo .stat-pill__value { color: var(--ds-brand-600, #322873); }
    &--terracotta .stat-pill__value { color: var(--ds-accent-300, #c1623c); }
    &--muted .stat-pill__value { color: var(--ds-ink, var(--ds-text)); }
  }

  /* ---------- Filter bar ---------- */
  &__filterbar {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    margin-block-end: var(--ds-space-5);

    @media (min-width: 700px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--ds-space-4);
    }
  }

  &__search {
    flex: 1 1 auto;
    min-inline-size: 0;
    max-inline-size: 420px;
  }

  &__chips {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding-block: 6px;
    padding-inline: var(--ds-space-3);
    background: transparent;
    border: 1px solid var(--ds-border);
    border-radius: 999px;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted, var(--ds-taupe));
    cursor: pointer;
    transition:
      background-color var(--ds-duration-fast, 150ms) ease,
      color            var(--ds-duration-fast, 150ms) ease,
      border-color     var(--ds-duration-fast, 150ms) ease,
      box-shadow       var(--ds-duration-fast, 150ms) ease;

    &:hover,
    &:focus-visible {
      color: var(--ds-brand-600, #322873);
      border-color: var(--ds-brand-300, #897dc3);
      background: rgba(50, 40, 115, 0.04);
    }

    &:focus-visible {
      outline: 2px solid var(--ds-brand-300, #897dc3);
      outline-offset: 2px;
    }

    &--active {
      background: var(--ds-surface-elevated, #fff);
      color: var(--ds-brand-600, #322873);
      border-color: var(--ds-brand-600, #322873);
      box-shadow: var(--ds-shadow-xs);
    }

    &--active:hover,
    &--active:focus-visible {
      color: var(--ds-brand-600, #322873);
      border-color: var(--ds-brand-600, #322873);
      background: var(--ds-surface-elevated, #fff);
    }

    &__label {
      line-height: 1;
    }

    &__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 1.5rem;
      padding-block: 2px;
      padding-inline: 6px;
      border-radius: 999px;
      background: var(--ds-border);
      font-family: var(--ds-font-mono, var(--ds-font-body));
      font-size: var(--ds-text-xs);
      font-variant-numeric: tabular-nums;
      color: var(--ds-text-muted, var(--ds-taupe));
      line-height: 1;
    }

    &:hover &__count,
    &:focus-visible &__count {
      color: var(--ds-brand-600, #322873);
    }

    &--active &__count {
      background: var(--ds-brand-600, #322873);
      color: var(--ds-ivory, #fbf6ee);
    }
  }

  /* ---------- Grid ---------- */
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--ds-space-5);
    align-items: stretch;
  }
}

/* =========================================================================
   MyCourseCard (inline, scoped to this page)
   ========================================================================= */
.mc-card {
  display: flex;
  flex-direction: column;
  background: var(--ds-surface-elevated, var(--ds-ivory, #fbf6ee));
  border: 1px solid var(--ds-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--ds-shadow-xs);
  transition:
    transform var(--ds-duration-base, 220ms) var(--ds-ease-out, ease-out),
    box-shadow var(--ds-duration-base, 220ms) var(--ds-ease-out, ease-out);

  animation: mc-rise 420ms var(--ds-ease-out, ease-out) both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--ds-shadow-md, 0 8px 24px rgba(27, 20, 16, 0.08));
  }

  &__media {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--ds-surface-muted, rgba(27, 20, 16, 0.04));
  }

  &__cover {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--ds-duration-slow, 400ms) var(--ds-ease-out, ease-out);
  }

  &:hover &__cover {
    transform: scale(1.04);
  }

  &__cover--placeholder svg {
    inline-size: 100%;
    block-size: 100%;
    display: block;
  }

  &__badge {
    position: absolute;
    inset-block-start: var(--ds-space-3);
    inset-inline-start: var(--ds-space-3);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px var(--ds-space-2);
    border-radius: 999px;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    font-weight: 600;
    line-height: 1;
    backdrop-filter: none;

    &--done {
      background: var(--ds-accent-300, #c1623c);
      color: var(--ds-ivory, #fbf6ee);
    }

    &--progress {
      background: var(--ds-brand-600, #322873);
      color: var(--ds-ivory, #fbf6ee);
    }

    &--new {
      background: var(--ds-ivory, #fbf6ee);
      color: var(--ds-taupe, var(--ds-text-muted));
      border: 1px solid var(--ds-border);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    padding: var(--ds-space-4) var(--ds-space-4) var(--ds-space-4);
    flex: 1 1 auto;
  }

  &__title {
    font-family: var(--ds-font-heading, 'Tajawal', system-ui, sans-serif);
    font-weight: 600;
    font-size: 1.0625rem;
    line-height: 1.4;
    color: var(--ds-ink, var(--ds-text));
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-block-size: calc(2 * 1.4 * 1.0625rem);
  }

  /* ---------- Integrated progress bar ---------- */
  &__progress {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__progress-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-2);
  }

  &__progress-label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
  }

  &__progress-value {
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-sm);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--ds-brand-600, #322873);
    line-height: 1;
  }

  &__progress-track {
    position: relative;
    inline-size: 100%;
    block-size: 8px;
    background: rgba(27, 20, 16, 0.08);
    border-radius: 999px;
    overflow: hidden;
  }

  &__progress-fill {
    block-size: 100%;
    background: var(--ds-brand-600, #322873);
    border-radius: 999px;
    transition: inline-size 600ms var(--ds-ease-out, ease-out);

    &--done {
      background: var(--ds-accent-300, #c1623c);
    }
  }

  &--completed &__progress-value {
    color: var(--ds-accent-300, #c1623c);
  }

  &__cta {
    margin-block-start: auto;
  }

  /* Cascade animation delay */
  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 40}ms;
    }
  }
}

@keyframes mc-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .mc-card {
    animation: none;
    transition: none;
  }
  .mc-card:hover {
    transform: none;
  }
  .mc-card:hover .mc-card__cover {
    transform: none;
  }
  .mc-card__progress-fill {
    transition: none;
  }
}
</style>
