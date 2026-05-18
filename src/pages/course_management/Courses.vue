<template>
  <main class="catalog">
    <!-- =========== Page header (cream) =========== -->
    <header class="catalog__head">
      <div class="catalog__head-inner">
        <ds-breadcrumb class="catalog__crumbs">
          <ds-breadcrumb-item :to="{ name: 'Home' }">
            {{ $t('الرئيسية') }}
          </ds-breadcrumb-item>
          <ds-breadcrumb-item>
            {{ $t('الدورات') }}
          </ds-breadcrumb-item>
        </ds-breadcrumb>

        <h1 class="catalog__title">{{ $t('جميع الدورات') }}</h1>

        <p class="catalog__subtitle">
          <template v-if="totalCount !== null">
            {{ $t('{n} دورة متاحة', { n: formatNum(totalCount) }) }}
          </template>
          <template v-else>
            {{ $t('استكشف مكتبة الدورات التدريبية') }}
          </template>
        </p>
      </div>
    </header>

    <div class="catalog__shell">
      <!-- =========== Sidebar (inline-start — right in RTL, left in LTR) =========== -->
      <aside class="catalog__sidebar" aria-label="filters">
        <div class="filter-panel">
          <div class="filter-panel__head">
            <h2 class="filter-panel__heading">{{ $t('الفلاتر') }}</h2>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="filter-panel__clear"
              @click="clearAllFilters"
            >
              {{ $t('مسح الفلاتر') }}
            </button>
          </div>

          <!-- Speciality group -->
          <section class="filter-panel__group">
            <h3 class="filter-panel__group-title">{{ $t('التخصص') }}</h3>
            <div v-if="specialitiesLoading" class="filter-panel__skeletons">
              <ds-skeleton v-for="i in 5" :key="i" shape="line" width="80%" />
            </div>
            <ul v-else class="filter-panel__list">
              <li class="filter-panel__item">
                <label class="check">
                  <input
                    type="radio"
                    name="speciality"
                    :value="null"
                    :checked="activeSpecialityID === null"
                    @change="setSpeciality(null)"
                  />
                  <span class="check__mark" aria-hidden="true"></span>
                  <span class="check__label">{{ $t('كل التخصصات') }}</span>
                </label>
              </li>
              <li
                v-for="spec in specialitiesEdges"
                :key="spec.node.id"
                class="filter-panel__item"
              >
                <label class="check">
                  <input
                    type="radio"
                    name="speciality"
                    :value="spec.node.pk"
                    :checked="activeSpecialityID === spec.node.pk"
                    @change="setSpeciality(spec.node.pk)"
                  />
                  <span class="check__mark" aria-hidden="true"></span>
                  <span class="check__label">{{ spec.node.speciality }}</span>
                </label>
              </li>
            </ul>
          </section>
        </div>
      </aside>

      <!-- =========== Main content =========== -->
      <section class="catalog__main">
        <!-- Toolbar: search + sort + mobile filter trigger -->
        <div class="catalog__toolbar">
          <button
            type="button"
            class="catalog__filter-trigger"
            :aria-label="$t('الفلاتر')"
            @click="mobileFilterOpen = true"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M6 12h12M10 18h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>{{ $t('الفلاتر') }}</span>
            <span v-if="activeFilterCount" class="catalog__filter-badge">{{ activeFilterCount }}</span>
          </button>

          <div class="catalog__search">
            <svg
              viewBox="0 0 24 24"
              class="catalog__search-icon"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              v-model="searchInput"
              type="search"
              class="catalog__search-input"
              :placeholder="$t('ابحث عن دورة...')"
              :aria-label="$t('البحث في الدورات')"
            />
          </div>

          <div class="catalog__sort">
            <label for="sort-select" class="catalog__sort-label">
              {{ $t('ترتيب:') }}
            </label>
            <select
              id="sort-select"
              v-model="sortValue"
              class="catalog__sort-select"
            >
              <option value="newest">{{ $t('الأحدث') }}</option>
              <option value="popular">{{ $t('الأكثر طلباً') }}</option>
              <option value="price_asc">{{ $t('السعر: من الأقل') }}</option>
              <option value="price_desc">{{ $t('السعر: من الأعلى') }}</option>
            </select>
          </div>
        </div>

        <!-- Active filter chips -->
        <div v-if="activeChips.length" class="catalog__chips">
          <ds-tag
            v-for="chip in activeChips"
            :key="chip.key"
            variant="indigo"
            size="sm"
            closable
            @close="chip.onClear"
          >
            {{ chip.label }}
          </ds-tag>
        </div>

        <!-- =========== Results =========== -->
        <div v-if="coursesLoading && !coursesData" class="catalog__grid">
          <ds-card
            v-for="i in 6"
            :key="`sk-${i}`"
            class="catalog__skeleton"
          >
            <template #media>
              <ds-skeleton shape="rect" height="180px" radius="0" />
            </template>
            <ds-skeleton shape="line" width="85%" />
            <ds-skeleton shape="line" width="55%" />
            <template #footer>
              <ds-skeleton shape="pill" width="100%" />
            </template>
          </ds-card>
        </div>

        <ds-empty-state
          v-else-if="!coursesLoading && coursesEdgeCount <= 0"
          variant="search"
          size="md"
          :title="$t('لا توجد دورات تطابق البحث')"
          :body="$t('جرّب إزالة بعض الفلاتر أو تعديل كلمات البحث')"
        />

        <div v-else>
          <div ref="grid" class="catalog__grid">
            <course-card
              v-for="course in coursesEdges"
              :key="course.node.id"
              class="catalog__grid-item"
              :course="course.node"
              :name="course.node.title"
              :instructor="$t('مركز دكتور صبري ابو قرون')"
              :price="course.node.courseFee"
              unit="SDG"
            />
          </div>

          <div
            v-if="coursesHasNext"
            class="catalog__load-more"
          >
            <ds-button
              variant="secondary"
              :loading="coursesLoading"
              @click="loadMore()"
            >
              {{ $t('تحميل المزيد') }}
            </ds-button>
          </div>
        </div>
      </section>
    </div>

    <!-- =========== Mobile filter bottom sheet =========== -->
    <q-dialog v-model="mobileFilterOpen" position="bottom">
      <div class="filter-sheet">
        <!-- Sticky header -->
        <header class="filter-sheet__head">
          <div class="filter-sheet__grabber" aria-hidden="true"></div>
          <div class="filter-sheet__head-row">
            <h2 class="filter-sheet__heading">{{ $t('الفلاتر') }}</h2>
            <button
              type="button"
              class="filter-sheet__close"
              :aria-label="$t('إغلاق')"
              @click="mobileFilterOpen = false"
            >
              ✕
            </button>
          </div>
        </header>

        <!-- Scrollable body -->
        <div class="filter-sheet__body">
          <section class="filter-sheet__section">
            <label for="sheet-search" class="filter-sheet__label">{{ $t('البحث') }}</label>
            <div class="sheet-search">
              <svg viewBox="0 0 24 24" class="sheet-search__icon" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input
                id="sheet-search"
                v-model="searchInput"
                type="text"
                inputmode="search"
                class="sheet-search__input"
                :placeholder="$t('ابحث عن دورة...')"
                :aria-label="$t('البحث في الدورات')"
                dir="rtl"
              />
            </div>
          </section>

          <section class="filter-sheet__section">
            <label for="sheet-sort" class="filter-sheet__label">{{ $t('الترتيب') }}</label>
            <select
              id="sheet-sort"
              v-model="sortValue"
              class="sheet-select"
              dir="rtl"
            >
              <option value="newest">{{ $t('الأحدث') }}</option>
              <option value="popular">{{ $t('الأكثر طلباً') }}</option>
              <option value="price_asc">{{ $t('السعر: من الأقل') }}</option>
              <option value="price_desc">{{ $t('السعر: من الأعلى') }}</option>
            </select>
          </section>

          <section class="filter-sheet__section">
            <label class="filter-sheet__label">{{ $t('التخصص') }}</label>
            <div v-if="specialitiesLoading" class="filter-panel__skeletons">
              <ds-skeleton v-for="i in 6" :key="i" shape="pill" width="30%" />
            </div>
            <div v-else class="filter-sheet__pills">
              <button
                type="button"
                class="pill"
                :class="{ 'pill--active': activeSpecialityID === null }"
                @click="setSpeciality(null)"
              >
                {{ $t('كل التخصصات') }}
              </button>
              <button
                v-for="spec in specialitiesEdges"
                :key="spec.node.id"
                type="button"
                class="pill"
                :class="{ 'pill--active': activeSpecialityID === spec.node.pk }"
                @click="setSpeciality(spec.node.pk)"
              >
                {{ spec.node.speciality }}
              </button>
            </div>
          </section>
        </div>

        <!-- Sticky footer -->
        <footer class="filter-sheet__footer">
          <ds-button
            v-if="hasActiveFilters"
            variant="ghost"
            @click="clearAllFilters"
          >
            {{ $t('مسح الفلاتر') }}
          </ds-button>
          <ds-button
            variant="primary"
            full-width
            @click="mobileFilterOpen = false"
          >
            {{ $t('عرض النتائج') }}
          </ds-button>
        </footer>
      </div>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { GetAllCourses } from 'src/graphql/course_management/query/GetAllCourses.js'
import { GetSpecialities } from 'src/graphql/course_management/query/GetAllSpeciallites.js'
import courseCard from 'components/utils/courseCard.vue'
import DsBreadcrumb from 'src/design-system/components/DsBreadcrumb.vue'
import DsBreadcrumbItem from 'src/design-system/components/DsBreadcrumbItem.vue'
import DsTag from 'src/design-system/components/DsTag.vue'
import type {
  GetAllCoursesResult,
  GetAllCoursesVars,
  GetAllSpecialitiesResult,
  GetAllSpecialitiesVars,
} from 'src/types/courses/types'

type SortValue = 'newest' | 'popular' | 'price_asc' | 'price_desc'

interface Chip {
  key: string
  label: string
  onClear: () => void
}

const route = useRoute()
const auth = useAuthStore()
const settings = useSettingsStore()

// ---------------------------------------------------------------------------
// Query vars + reactive state
// ---------------------------------------------------------------------------
// Schema-allowed orderBy fields for allCourses include `created`, `title`,
// `course_fee`, etc. `createdAt` is NOT a valid key and triggers a
// "Cannot resolve keyword 'created_at'" error — use `-created` instead.
const queryVars = reactive<GetAllCoursesVars>({
  first: 12,
  orderBy: ['-created'],
  isDraft: false,
})

const searchInput = ref('')
const search = ref('')
const searchTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const activeSpecialityID = ref<number | null>(null)
const activeSpecialityLabel = ref('')
const sortValue = ref<SortValue>('newest')
const totalCount = ref<number | null>(null)
const mobileFilterOpen = ref(false)

// ---------------------------------------------------------------------------
// Specialities — sidebar filter list
// ---------------------------------------------------------------------------
const specQuery = useQuery<GetAllSpecialitiesResult, GetAllSpecialitiesVars>(
  GetSpecialities,
)
const specialitiesLoading = specQuery.loading

type SpecEdgeWithNode = {
  node: NonNullable<NonNullable<NonNullable<GetAllSpecialitiesResult['allCourseSpecialities']>['edges'][number]>['node']>
} & NonNullable<NonNullable<GetAllSpecialitiesResult['allCourseSpecialities']>['edges'][number]>

const specialitiesEdges = computed(
  () => (specQuery.result.value?.allCourseSpecialities?.edges ?? [])
    .filter((e): e is SpecEdgeWithNode => !!e && !!e.node),
)

// ---------------------------------------------------------------------------
// Courses — main listing
// ---------------------------------------------------------------------------
const coursesQuery = useQuery<GetAllCoursesResult, GetAllCoursesVars>(
  GetAllCourses,
  () => queryVars,
  { fetchPolicy: 'cache-and-network' },
)
const coursesData = computed(() => coursesQuery.result.value ?? null)
const coursesLoading = coursesQuery.loading
type CourseEdgeWithNode = {
  node: NonNullable<NonNullable<NonNullable<GetAllCoursesResult['allCourses']>['edges'][number]>['node']>
} & NonNullable<NonNullable<GetAllCoursesResult['allCourses']>['edges'][number]>

const coursesEdges = computed(
  () => (coursesData.value?.allCourses?.edges ?? [])
    .filter((e): e is CourseEdgeWithNode => !!e && !!e.node),
)
const coursesEdgeCount = computed(
  () => coursesData.value?.allCourses?.edgeCount ?? 0,
)
const coursesHasNext = computed(
  () => coursesData.value?.allCourses?.pageInfo?.hasNextPage ?? false,
)

coursesQuery.onResult((res) => {
  const tc = res.data?.allCourses?.totalCount
  if (Number.isFinite(Number(tc))) totalCount.value = Number(tc)
})

// ---------------------------------------------------------------------------
// Computed filter state
// ---------------------------------------------------------------------------
const orderBy = computed<string[]>(() => {
  switch (sortValue.value) {
    case 'price_asc': return ['course_fee']
    case 'price_desc': return ['-course_fee']
    case 'popular': return ['-created']
    case 'newest':
    default: return ['-created']
  }
})

const queryVariables = computed<GetAllCoursesVars>(() => {
  const vars: GetAllCoursesVars = {
    first: 12,
    orderBy: orderBy.value,
    isDraft: false,
  }
  const s = search.value.trim()
  if (s) vars.title_Icontains = s
  if (activeSpecialityID.value) vars.courseSpeciality = String(activeSpecialityID.value)
  return vars
})

watch(
  queryVariables,
  (vars) => {
    for (const k of Object.keys(queryVars) as Array<keyof GetAllCoursesVars>) {
      if (!(k in vars)) delete (queryVars as Record<string, unknown>)[k]
    }
    Object.assign(queryVars, vars)
  },
  { deep: true, immediate: true },
)

const hasActiveFilters = computed(
  () => !!activeSpecialityID.value || !!search.value.trim(),
)

const activeFilterCount = computed(() => {
  let n = 0
  if (activeSpecialityID.value) n += 1
  if (search.value.trim()) n += 1
  return n
})

const activeChips = computed<Chip[]>(() => {
  const chips: Chip[] = []
  const s = search.value.trim()
  if (s) {
    chips.push({
      key: 'search',
      label: `بحث: "${s}"`,
      onClear: () => { searchInput.value = ''; search.value = '' },
    })
  }
  if (activeSpecialityID.value) {
    chips.push({
      key: `spec-${activeSpecialityID.value}`,
      label: activeSpecialityLabel.value || 'تخصص محدد',
      onClear: () => setSpeciality(null),
    })
  }
  return chips
})

// ---------------------------------------------------------------------------
// Watchers
// ---------------------------------------------------------------------------
watch(searchInput, (val) => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => { search.value = val }, 300)
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function formatNum (n: number | null): string {
  const v = Number(n)
  if (!Number.isFinite(v)) return ''
  try {
    return new Intl.NumberFormat('ar-EG').format(v)
  } catch {
    return String(v)
  }
}

async function resolveSpecialityLabel (pk: number): Promise<void> {
  try {
    const { data } = await apolloClient.query<GetAllSpecialitiesResult, GetAllSpecialitiesVars>({
      query: GetSpecialities,
    })
    const edges = data?.allCourseSpecialities?.edges ?? []
    const match = edges.find(e => e?.node?.pk === pk)
    if (match?.node) activeSpecialityLabel.value = match.node.speciality
  } catch { /* ignore */ }
}

function hydrateFromRoute (): void {
  const q = route.query ?? {}
  const specRaw = q.speciality
  if (specRaw !== undefined && specRaw !== null && specRaw !== '') {
    const pk = Number(specRaw)
    if (Number.isFinite(pk)) {
      activeSpecialityID.value = pk
      void resolveSpecialityLabel(pk)
    }
  }
  if (typeof q.q === 'string') {
    searchInput.value = q.q
    search.value = q.q
  }
}

function setSpeciality (pk: number | null): void {
  activeSpecialityID.value = pk
  if (pk) {
    void resolveSpecialityLabel(pk)
  } else {
    activeSpecialityLabel.value = ''
  }
}

function clearAllFilters (): void {
  searchInput.value = ''
  search.value = ''
  activeSpecialityID.value = null
  activeSpecialityLabel.value = ''
}

async function loadMore (): Promise<void> {
  const data = coursesData.value
  const pageInfo = data?.allCourses?.pageInfo
  if (!data || !pageInfo?.hasNextPage) return
  await coursesQuery.fetchMore({
    variables: {
      ...queryVariables.value,
      after: pageInfo.endCursor,
    },
    updateQuery: (prev: GetAllCoursesResult, { fetchMoreResult }): GetAllCoursesResult => {
      if (!fetchMoreResult?.allCourses || !prev.allCourses) return prev
      const newEdges = fetchMoreResult.allCourses.edges
      return {
        allCourses: {
          __typename: prev.allCourses.__typename,
          totalCount: fetchMoreResult.allCourses.totalCount,
          edgeCount: fetchMoreResult.allCourses.edgeCount,
          edges: [...prev.allCourses.edges, ...newEdges],
          pageInfo: fetchMoreResult.allCourses.pageInfo,
        },
      }
    },
  })
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  settings.setActiveNav('COURSES')
  auth.setNavbarSearch(false)
  hydrateFromRoute()
})

onUnmounted(() => {
  auth.setNavbarSearch(true)
  if (searchTimer.value) clearTimeout(searchTimer.value)
})
</script>

<style lang="scss" scoped>
.catalog {
  min-block-size: 100vh;
  background: var(--ds-bg, var(--ds-surface-muted));
}

/* ---------- Cream header ---------- */
.catalog__head {
  background: var(--ds-cream, #F6F1EA);
  border-block-end: 1px solid var(--ds-border);
}

.catalog__head-inner {
  max-inline-size: 1240px;
  margin-inline: auto;
  padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-10);

  @media (min-width: 768px) {
    padding: var(--ds-space-12) var(--ds-space-6) var(--ds-space-12);
  }
}

.catalog__crumbs {
  margin-block-end: var(--ds-space-3);
}

.catalog__title {
  font-family: var(--ds-font-heading, 'Tajawal', sans-serif);
  font-weight: 700;
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem); /* 44-56px */
  line-height: 1.15;
  color: var(--ds-ink, var(--ds-text));
  margin: 0 0 var(--ds-space-2);
  letter-spacing: -0.01em;
}

.catalog__subtitle {
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-md);
  color: var(--ds-taupe, var(--ds-text-muted));
  margin: 0;
}

/* ---------- Shell (grid with sidebar) ---------- */
.catalog__shell {
  max-inline-size: 1240px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-4) var(--ds-space-16);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-6);

  @media (min-width: 960px) {
    /* sidebar first (inline-start — right in RTL, left in LTR), then main */
    grid-template-columns: 280px 1fr;
    padding: var(--ds-space-8) var(--ds-space-6) var(--ds-space-16);
    gap: var(--ds-space-8);
  }
}

.catalog__sidebar {
  @media (min-width: 960px) {
    grid-column: 1 / 2; /* inline-start */
    grid-row: 1 / 2;
    position: sticky;
    inset-block-start: var(--ds-space-6);
    align-self: start;
  }
}

.catalog__main {
  grid-column: 2 / 3; /* inline-end */
  min-inline-size: 0;
}

/* ---------- Filter panel ---------- */
.filter-panel {
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg, 14px);
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
}

.filter-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-2);
}

.filter-panel__heading {
  font-family: var(--ds-font-heading);
  font-weight: 700;
  font-size: var(--ds-text-lg);
  color: var(--ds-ink, var(--ds-text));
  margin: 0;
}

.filter-panel__clear {
  background: none;
  border: 0;
  padding: 0;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-brand-700, var(--ds-brand-600));
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover { color: var(--ds-accent-600, var(--ds-accent-300)); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); border-radius: 4px; }
}

.filter-panel__group {
  border-block-start: 1px solid var(--ds-border);
  padding-block-start: var(--ds-space-4);

  &:first-of-type {
    border-block-start: 0;
    padding-block-start: 0;
  }
}

.filter-panel__group-title {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: var(--ds-text-sm);
  color: var(--ds-ink, var(--ds-text));
  margin: 0 0 var(--ds-space-3);
  letter-spacing: 0.02em;
}

.filter-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  max-block-size: 280px;
  overflow-y: auto;
}

.filter-panel__skeletons {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

/* ---------- Custom check/radio ---------- */
.check {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  cursor: pointer;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__mark {
    inline-size: 18px;
    block-size: 18px;
    border-radius: 50%;
    border: 1.5px solid var(--ds-border);
    background: var(--ds-surface);
    flex: 0 0 auto;
    position: relative;
    transition:
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      background-color var(--ds-duration-fast) var(--ds-ease-out);

    &::after {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      background: var(--ds-brand-600);
      transform: scale(0);
      transition: transform var(--ds-duration-fast) var(--ds-ease-out);
    }
  }

  input:checked + &__mark {
    border-color: var(--ds-brand-600);
    &::after { transform: scale(1); }
  }

  input:focus-visible + &__mark {
    box-shadow: var(--ds-shadow-focus);
  }

  &__label {
    line-height: 1.4;
  }

  &:hover &__label { color: var(--ds-brand-700, var(--ds-brand-600)); }
}

/* ---------- Toolbar ---------- */
.catalog__toolbar {
  display: flex;
  gap: var(--ds-space-3);
  align-items: center;
  flex-wrap: wrap;
  margin-block-end: var(--ds-space-4);
}

.catalog__search {
  position: relative;
  flex: 1 1 280px;
  min-inline-size: 0;
}

.catalog__search-input {
  inline-size: 100%;
  padding: 0.75rem var(--ds-space-3) 0.75rem calc(var(--ds-space-10));
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill, 9999px);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-md);
  color: var(--ds-text);
  outline: 0;
  transition:
    border-color var(--ds-duration-fast) var(--ds-ease-out),
    box-shadow var(--ds-duration-fast) var(--ds-ease-out);

  &:focus {
    border-color: var(--ds-brand-600);
    box-shadow: var(--ds-shadow-focus);
  }

  &::placeholder { color: var(--ds-text-muted); }
}

.catalog__search-icon {
  position: absolute;
  inset-inline-start: var(--ds-space-3);
  inset-block-start: 50%;
  transform: translateY(-50%);
  inline-size: 1.125rem;
  block-size: 1.125rem;
  color: var(--ds-text-muted);
  pointer-events: none;
}

.catalog__sort {
  order: -1; /* inline-start in RTL */
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  margin-inline-end: auto;

  @media (max-width: 640px) {
    order: 0;
    margin-inline-end: 0;
    inline-size: 100%;
  }
}

.catalog__sort-label {
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text-muted);
  white-space: nowrap;
}

.catalog__sort-select {
  padding: 0.6rem var(--ds-space-3);
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md, 8px);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  min-inline-size: 160px;
  outline: 0;

  &:focus { border-color: var(--ds-brand-600); box-shadow: var(--ds-shadow-focus); }
}

/* ---------- Active chips ---------- */
.catalog__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
  margin-block-end: var(--ds-space-4);
}

/* ---------- Grid ---------- */
.catalog__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-6);
  align-items: stretch;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.catalog__grid-item {
  min-inline-size: 0;
}

.catalog__skeleton { block-size: 100%; }

.catalog__load-more {
  display: flex;
  justify-content: center;
  margin-block-start: var(--ds-space-8);
}

/* ---------- Mobile filter trigger (hidden on desktop) ---------- */
.catalog__filter-trigger {
  display: none;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 0.6rem var(--ds-space-3);
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill, 9999px);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;

  svg { inline-size: 1.125rem; block-size: 1.125rem; }

  &:hover { border-color: var(--ds-brand-600); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  @media (max-width: 959px) { display: inline-flex; }
}

.catalog__filter-badge {
  min-inline-size: 20px;
  block-size: 20px;
  padding-inline: 6px;
  border-radius: 9999px;
  background: var(--ds-brand-600);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Hide desktop sidebar + toolbar search/sort on mobile; sheet takes over */
@media (max-width: 959px) {
  .catalog__sidebar { display: none; }
  .catalog__search { display: none; }
  .catalog__sort { display: none; }
  .catalog__toolbar {
    justify-content: flex-start;
    gap: var(--ds-space-2);
  }
}

/* ---------- Bottom-sheet filter panel (mobile) ---------- */
/* Three-part layout: sticky header, scrollable body, sticky footer.
   q-dialog position="bottom" renders a full-width card aligned to the bottom;
   we clamp height so header+footer stay in view and only body scrolls. */
.filter-sheet {
  background: var(--ds-surface-elevated, #ffffff);
  border-start-start-radius: var(--ds-radius-xl, 20px);
  border-start-end-radius: var(--ds-radius-xl, 20px);
  inline-size: 100%;
  block-size: 85vh;
  max-block-size: 85vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.filter-sheet__head {
  position: sticky;
  inset-block-start: 0;
  background: var(--ds-surface-elevated, #ffffff);
  padding: var(--ds-space-2) var(--ds-space-5) var(--ds-space-3);
  border-block-end: 1px solid var(--ds-border);
  z-index: 2;
}

.filter-sheet__grabber {
  inline-size: 40px;
  block-size: 4px;
  border-radius: 9999px;
  background: var(--ds-border);
  margin: 0 auto var(--ds-space-3);
}

.filter-sheet__head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-sheet__heading {
  font-family: var(--ds-font-heading);
  font-weight: 700;
  font-size: var(--ds-text-lg);
  color: var(--ds-ink, var(--ds-text));
  margin: 0;
}

.filter-sheet__close {
  background: none;
  border: 0;
  font-size: 1.25rem;
  color: var(--ds-text-muted);
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  &:hover { color: var(--ds-text); }
}

.filter-sheet__body {
  overflow-y: auto;
  padding: var(--ds-space-4) var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
}

.filter-sheet__section {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.filter-sheet__label {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: var(--ds-text-sm);
  color: var(--ds-ink, var(--ds-text));
  letter-spacing: 0.02em;
}

/* Sheet-scoped search — isolated from .catalog__search so RTL icon placement
   and input padding are unambiguous. */
.sheet-search {
  position: relative;
  display: block;
  inline-size: 100%;
}

.sheet-search__input {
  inline-size: 100%;
  block-size: 44px;
  padding-inline-start: 2.5rem;
  padding-inline-end: var(--ds-space-3);
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill, 9999px);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-md);
  color: var(--ds-text);
  outline: 0;
  text-align: start;

  &:focus {
    border-color: var(--ds-brand-600);
    box-shadow: var(--ds-shadow-focus);
  }
  &::placeholder { color: var(--ds-text-muted); }
}

.sheet-search__icon {
  position: absolute;
  inset-inline-start: 0.75rem;
  inset-block-start: 50%;
  transform: translateY(-50%);
  inline-size: 18px;
  block-size: 18px;
  color: var(--ds-text-muted);
  pointer-events: none;
}

.sheet-select {
  inline-size: 100%;
  block-size: 44px;
  padding: 0 var(--ds-space-3);
  background: var(--ds-surface-elevated, #ffffff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md, 8px);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-md);
  color: var(--ds-text);
  text-align: start;
  outline: 0;
  &:focus { border-color: var(--ds-brand-600); box-shadow: var(--ds-shadow-focus); }
}

.filter-sheet__pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
}

.pill {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--ds-surface);
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out),
    color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { border-color: var(--ds-brand-600); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  &--active {
    background: var(--ds-brand-600);
    border-color: var(--ds-brand-600);
    color: #fff;
  }
}

.filter-sheet__footer {
  position: sticky;
  inset-block-end: 0;
  background: var(--ds-surface-elevated, #ffffff);
  display: flex;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-5);
  border-block-start: 1px solid var(--ds-border);
  z-index: 2;
}
</style>
