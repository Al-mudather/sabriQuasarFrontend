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
            {{ formatNum(totalCount) }} {{ $t('دورة متاحة') }}
          </template>
          <template v-else>
            {{ $t('استكشف مكتبة الدورات التدريبية') }}
          </template>
        </p>
      </div>
    </header>

    <div class="catalog__shell">
      <!-- =========== Sidebar (inline-end in RTL) =========== -->
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

          <!-- Price group -->
          <section class="filter-panel__group">
            <h3 class="filter-panel__group-title">{{ $t('السعر') }}</h3>
            <ul class="filter-panel__list">
              <li
                v-for="f in priceFilters"
                :key="f.id"
                class="filter-panel__item"
              >
                <label class="check">
                  <input
                    type="radio"
                    name="price"
                    :value="f.id"
                    :checked="activePriceFilter === f.id"
                    @change="applyPriceFilter(f.id)"
                  />
                  <span class="check__mark" aria-hidden="true"></span>
                  <span class="check__label">{{ f.label }}</span>
                </label>
              </li>
            </ul>
          </section>
        </div>
      </aside>

      <!-- =========== Main content =========== -->
      <section class="catalog__main">
        <!-- Toolbar: search + sort -->
        <div class="catalog__toolbar">
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
              instructor="مركز دكتور صبري ابو قرون"
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
  </main>
</template>

<script>
/** @typedef {import('src/features/courses/types').Course} Course */
/** @typedef {import('src/features/courses/types').Speciality} Speciality */
/** @typedef {import('src/features/courses/types').GetAllCoursesResult} GetAllCoursesResult */
/** @typedef {import('src/features/courses/types').GetAllCoursesVars} GetAllCoursesVars */
/** @typedef {import('src/features/courses/types').GetAllSpecialitiesResult} GetAllSpecialitiesResult */
/** @typedef {import('src/features/courses/types').GetAllSpecialitiesVars} GetAllSpecialitiesVars */

import courseCard from 'components/utils/courseCard.vue'
import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses.js'
import { GetSpecialities } from 'src/queries/course_management/query/GetAllSpeciallites.js'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useQuery } from '@vue/apollo-composable'
import { apolloClient } from 'src/apollo/client'
import { computed, ref, reactive } from 'vue'
import _ from 'lodash'
import { cascade } from 'src/design-system/motion.js'
import DsBreadcrumb from 'src/design-system/components/DsBreadcrumb.vue'
import DsBreadcrumbItem from 'src/design-system/components/DsBreadcrumbItem.vue'
import DsInput from 'src/design-system/components/DsInput.vue'
import DsTag from 'src/design-system/components/DsTag.vue'

export default {
  name: 'Courses',

  components: {
    courseCard,
    DsBreadcrumb,
    DsBreadcrumbItem,
    // eslint-disable-next-line vue/no-unused-components
    DsInput,
    DsTag
  },

  setup () {
    const auth = useAuthStore()
    const settings = useSettingsStore()

    // Specialities filter list
    /** @type {import('@vue/apollo-composable').UseQueryReturn<GetAllSpecialitiesResult, GetAllSpecialitiesVars>} */
    const specQuery = useQuery(GetSpecialities, { courseNumber: 20 })
    const specialitiesLoading = specQuery.loading
    const specialitiesEdges = computed(
      () => _.get(specQuery.result.value, 'allCourseSpecialities.edges', []) || []
    )

    // Reactive query variables — shared ref so useQuery updates on filter change.
    const queryVars = reactive({ first: 12, orderBy: ['-createdAt'], isDraft: false })
    /** @type {import('@vue/apollo-composable').UseQueryReturn<GetAllCoursesResult, GetAllCoursesVars>} */
    const coursesQuery = useQuery(GetAllCourses, () => queryVars, {
      fetchPolicy: 'cache-and-network'
    })
    const coursesData = computed(() => coursesQuery.result.value || null)
    const coursesLoading = coursesQuery.loading
    const coursesEdges = computed(
      () => _.get(coursesData.value, 'allCourses.edges', []) || []
    )
    const coursesEdgeCount = computed(
      () => _.get(coursesData.value, 'allCourses.edgeCount', 0) || 0
    )
    const coursesHasNext = computed(
      () => _.get(coursesData.value, 'allCourses.pageInfo.hasNextPage', false) || false
    )

    const totalCount = ref(null)
    coursesQuery.onResult((res) => {
      const tc = res.data && res.data.allCourses && res.data.allCourses.totalCount
      if (Number.isFinite(Number(tc))) totalCount.value = Number(tc)
    })

    return {
      auth,
      settings,
      _coursesQuery: coursesQuery,
      queryVars,
      specialitiesLoading,
      specialitiesEdges,
      coursesData,
      coursesLoading,
      coursesEdges,
      coursesEdgeCount,
      coursesHasNext,
      totalCount
    }
  },

  data () {
    return {
      // raw input — debounced into `search`
      searchInput: '',
      search: '',
      searchTimer: null,
      activeSpecialityID: null,
      activeSpecialityLabel: '',
      activePriceFilter: 'all',
      sortValue: 'newest',
      isDraft: false,
      didInitialCascade: false
    }
  },

  computed: {
    priceFilters () {
      return [
        { id: 'all',  label: this.$t('الكل') },
        { id: 'free', label: this.$t('مجاناً') },
        { id: 'paid', label: this.$t('مدفوعة') }
      ]
    },

    orderBy () {
      switch (this.sortValue) {
        case 'price_asc':  return ['courseFee']
        case 'price_desc': return ['-courseFee']
        case 'popular':    return ['-enrolled']
        case 'newest':
        default:           return ['-createdAt']
      }
    },

    queryVariables () {
      const vars = {
        first: 12,
        orderBy: this.orderBy,
        isDraft: this.isDraft
      }
      if (this.search && this.search.trim()) {
        vars.title_Icontains = this.search.trim()
      }
      if (this.activeSpecialityID) {
        vars.courseSpeciality = this.activeSpecialityID
      }
      if (this.activePriceFilter === 'free') vars.isPaid = false
      if (this.activePriceFilter === 'paid') vars.isPaid = true
      return vars
    },

    effectiveVars () {
      // Syncs computed filters into the reactive object feeding useQuery.
      const v = this.queryVariables
      // Clear keys that are no longer set so useQuery sees removed filters.
      Object.keys(this.queryVars).forEach(k => {
        if (!(k in v)) delete this.queryVars[k]
      })
      Object.assign(this.queryVars, v)
      return v
    },

    hasActiveFilters () {
      return (
        !!this.activeSpecialityID ||
        this.activePriceFilter !== 'all' ||
        !!(this.search && this.search.trim())
      )
    },

    activeChips () {
      const chips = []
      if (this.search && this.search.trim()) {
        chips.push({
          key: 'search',
          label: `${this.$t('بحث')}: "${this.search.trim()}"`,
          onClear: () => { this.searchInput = ''; this.search = '' }
        })
      }
      if (this.activeSpecialityID) {
        chips.push({
          key: `spec-${this.activeSpecialityID}`,
          label: this.activeSpecialityLabel || this.$t('تخصص محدد'),
          onClear: () => this.setSpeciality(null)
        })
      }
      if (this.activePriceFilter !== 'all') {
        const f = this.priceFilters.find(x => x.id === this.activePriceFilter)
        chips.push({
          key: `price-${this.activePriceFilter}`,
          label: f ? f.label : '',
          onClear: () => this.applyPriceFilter('all')
        })
      }
      return chips
    }
  },

  watch: {
    searchInput (val) {
      if (this.searchTimer) clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.search = val
      }, 300)
    },
    queryVariables: {
      deep: true,
      handler (v) {
        Object.keys(this.queryVars).forEach(k => {
          if (!(k in v)) delete this.queryVars[k]
        })
        Object.assign(this.queryVars, v)
      }
    }
  },

  mounted () {
    this.settings.setActiveNav('COURSES')
    this.auth.setNavbarSearch(false)
    this.hydrateFromRoute()
    // Prime queryVars on mount.
    Object.assign(this.queryVars, this.queryVariables)
  },

  unmounted () {
    this.auth.setNavbarSearch(true)
    if (this.searchTimer) clearTimeout(this.searchTimer)
  },

  methods: {
    formatNum (n) {
      const v = Number(n)
      if (!Number.isFinite(v)) return ''
      try {
        return new Intl.NumberFormat('ar-EG').format(v)
      } catch (_) {
        return String(v)
      }
    },

    hydrateFromRoute () {
      const q = this.$route.query || {}
      const specRaw = q.speciality
      if (specRaw !== undefined && specRaw !== null && specRaw !== '') {
        const pk = Number(specRaw)
        if (Number.isFinite(pk)) {
          this.activeSpecialityID = pk
          this.resolveSpecialityLabel(pk)
        }
      }
      if (q.q && typeof q.q === 'string') {
        this.searchInput = q.q
        this.search = q.q
      }
    },

    async resolveSpecialityLabel (pk) {
      try {
        const { data } = await apolloClient.query({
          query: GetSpecialities,
          variables: { courseNumber: 50 }
        })
        const edges = (data && data.allCourseSpecialities && data.allCourseSpecialities.edges) || []
        const match = edges.find(e => e.node.pk === pk)
        if (match) this.activeSpecialityLabel = match.node.speciality
      } catch (_) { /* ignore */ }
    },

    setSpeciality (pk) {
      this.activeSpecialityID = pk
      if (pk) {
        this.resolveSpecialityLabel(pk)
      } else {
        this.activeSpecialityLabel = ''
      }
    },

    applyPriceFilter (id) {
      this.activePriceFilter = id
    },

    clearAllFilters () {
      this.searchInput = ''
      this.search = ''
      this.activeSpecialityID = null
      this.activeSpecialityLabel = ''
      this.activePriceFilter = 'all'
    },

    async loadMore () {
      const data = this.coursesData
      if (!data || !data.allCourses || !data.allCourses.pageInfo.hasNextPage) return
      await this._coursesQuery.fetchMore({
        variables: {
          ...this.queryVariables,
          cursor: data.allCourses.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const newEdges = fetchMoreResult.allCourses.edges
          return {
            allCourses: {
              __typename: prev.allCourses.__typename,
              totalCount: fetchMoreResult.allCourses.totalCount,
              edgeCount: fetchMoreResult.allCourses.edgeCount,
              edges: [...prev.allCourses.edges, ...newEdges],
              pageInfo: fetchMoreResult.allCourses.pageInfo
            }
          }
        }
      })
    }
  }
}
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
    grid-template-columns: 1fr 280px; /* main then sidebar (sidebar inline-end via order in RTL) */
    padding: var(--ds-space-8) var(--ds-space-6) var(--ds-space-16);
    gap: var(--ds-space-8);
  }
}

.catalog__sidebar {
  @media (min-width: 960px) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    position: sticky;
    inset-block-start: var(--ds-space-6);
    align-self: start;
  }
}

.catalog__main {
  grid-column: 1 / 2;
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
</style>
