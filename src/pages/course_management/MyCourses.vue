<template>
  <main class="my-courses">
    <!-- Page header -->
    <header class="my-courses__header">
      <h1 class="my-courses__title">{{ $t('دوراتي') }}</h1>
      <p v-if="!isLoading" class="my-courses__subtitle">
        {{ subheadingText }}
      </p>
    </header>

    <!-- Stats strip (hidden while loading or empty) -->
    <section
      v-if="!isLoading && total > 0"
      class="my-courses__stats"
      aria-label="Learning statistics"
    >
      <div class="stat-tile">
        <stat-card
          :value="total"
          :label="$t('إجمالي الدورات')"
          size="sm"
          variant="indigo"
        />
      </div>
      <div class="stat-tile">
        <stat-card
          :value="completedCount"
          :label="$t('دورات مكتملة')"
          :max="total || 1"
          size="sm"
          variant="terracotta"
        />
      </div>
      <div v-if="hoursWatched > 0" class="stat-tile">
        <stat-card
          :value="hoursWatched"
          :label="$t('ساعات مشاهدة')"
          size="sm"
          variant="indigo"
        />
      </div>
    </section>

    <!-- Tabs -->
    <ds-tabs
      v-if="!isLoading && total > 0"
      v-model="activeTab"
      align="start"
      size="md"
      class="my-courses__tabs"
    >
      <ds-tab
        name="in-progress"
        :label="`${$t('قيد التعلم')} (${inProgressCount})`"
      >
        <div v-if="inProgressList.length" class="my-courses__grid">
          <course-card
            v-for="item in inProgressList"
            :key="item.key"
            variant="enrolled"
            :course="item.course"
            class="my-courses__card"
            @cta-click="goToClassroom(item.course)"
          />
        </div>
        <ds-empty-state
          v-else
          variant="search"
          :title="$t('لا توجد دورات هنا بعد')"
          :body="$t('ابدأ رحلتك التعليمية الآن')"
          :cta-label="$t('تصفح الدورات')"
          @cta-click="goToCoursesPage"
        />
      </ds-tab>

      <ds-tab
        name="completed"
        :label="`${$t('مكتملة')} (${completedCount})`"
      >
        <div v-if="completedList.length" class="my-courses__grid">
          <course-card
            v-for="item in completedList"
            :key="item.key"
            variant="enrolled"
            :course="item.course"
            class="my-courses__card"
            @cta-click="goToClassroom(item.course)"
          />
        </div>
        <ds-empty-state
          v-else
          variant="search"
          :title="$t('لا توجد دورات هنا بعد')"
          :body="$t('ابدأ رحلتك التعليمية الآن')"
          :cta-label="$t('تصفح الدورات')"
          @cta-click="goToCoursesPage"
        />
      </ds-tab>

      <ds-tab
        name="all"
        :label="`${$t('جميع الدورات')} (${total})`"
      >
        <div v-if="allList.length" class="my-courses__grid">
          <course-card
            v-for="item in allList"
            :key="item.key"
            variant="enrolled"
            :course="item.course"
            class="my-courses__card"
            @cta-click="goToClassroom(item.course)"
          />
        </div>
        <ds-empty-state
          v-else
          variant="search"
          :title="$t('لا توجد دورات هنا بعد')"
          :body="$t('ابدأ رحلتك التعليمية الآن')"
          :cta-label="$t('تصفح الدورات')"
          @cta-click="goToCoursesPage"
        />
      </ds-tab>
    </ds-tabs>

    <!-- Loading skeletons -->
    <section v-if="isLoading" class="my-courses__grid" aria-busy="true">
      <ds-skeleton
        v-for="n in 6"
        :key="'sk-' + n"
        type="card"
      />
    </section>

    <!-- Global empty state: no enrollments at all -->
    <ds-empty-state
      v-if="!isLoading && total === 0"
      variant="search"
      :title="$t('لا توجد دورات هنا بعد')"
      :body="$t('ابدأ رحلتك التعليمية الآن')"
      :cta-label="$t('تصفح الدورات')"
      size="lg"
      @cta-click="goToCoursesPage"
    />
  </main>
</template>

<script>
/** @typedef {import('src/features/courses/types').Course} Course */

import CourseCard from 'src/components/shared/CourseCard.vue'
import StatCard from 'src/components/shared/StatCard.vue'
import DsTabs from 'src/design-system/components/DsTabs.vue'
import DsTab from 'src/design-system/components/DsTab.vue'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import { useSettingsStore } from 'src/stores/settings'
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'

/**
 * Progress derivation
 * ------------------------------------------------------------------
 * The backend does not expose a precomputed `progress` field on an
 * enrollment. It exposes:
 *   enrollment.learningprogressSet.totalCount            (lessons done)
 *   course.courseunitSet.edges[].node.courseunitcontentSet.totalCount (lessons total)
 * We compute progress percent client-side from those two numbers.
 */
function computeProgress (enrollmentNode) {
  const course = enrollmentNode && enrollmentNode.course
  if (!course || !course.courseunitSet) return 0
  const done = (enrollmentNode.learningprogressSet && enrollmentNode.learningprogressSet.totalCount) || 0
  const total = (course.courseunitSet.edges || []).reduce(
    (acc, u) => acc + ((u.node && u.node.courseunitcontentSet && u.node.courseunitcontentSet.totalCount) || 0),
    0
  )
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)))
}

export default {
  name: 'MyCourses',

  components: { CourseCard, StatCard, DsTabs, DsTab },

  setup () {
    const settings = useSettingsStore()
    // TODO: AllEnrollmentsForCurrentUser belongs to the enrollment feature and
    // has no matching Result/Vars alias in src/features/courses/types.ts.
    // Wire up typed generics once the enrollments feature types land.
    const enrollQuery = useQuery(
      AllEnrollmentsForCurrentUser,
      { limit: 100, cursor: '' },
      { fetchPolicy: 'network-only' }
    )
    const allEnrollmentsForCurrentUser = computed(
      () => enrollQuery.result.value?.allEnrollmentsForCurrentUser || null
    )
    return {
      settings,
      allEnrollmentsForCurrentUser,
      _enrollLoading: enrollQuery.loading
    }
  },

  data () {
    return {
      activeTab: 'in-progress'
    }
  },

  computed: {
    enrollments () {
      return (this.allEnrollmentsForCurrentUser && this.allEnrollmentsForCurrentUser.edges) || []
    },

    isLoading () {
      return this._enrollLoading && this.enrollments.length === 0
    },

    /**
     * Normalised view-model for the CourseCard shared component.
     * Shared card expects: { id, pk, name, coverImage, category, progress }
     */
    items () {
      return this.enrollments.map((edge) => {
        const node = edge.node || {}
        const c = node.course || {}
        return {
          key: node.id || c.id || c.pk,
          pk: c.pk,
          enrollmentPk: node.pk,
          progress: computeProgress(node),
          course: {
            id: c.id,
            pk: c.pk,
            name: c.title,
            coverImage: c.cover ? FORMAT_THE_IAMGE_URL(c.cover) : null,
            category: null,
            progress: computeProgress(node)
          }
        }
      })
    },

    total () { return this.items.length },

    inProgressList () {
      return this.items.filter(i => i.progress > 0 && i.progress < 100)
    },

    completedList () {
      return this.items.filter(i => i.progress >= 100)
    },

    allList () { return this.items },

    inProgressCount () { return this.inProgressList.length },
    completedCount () { return this.completedList.length },

    // Only surfaced if we can derive an honest value. We do not fake.
    hoursWatched () { return 0 },

    subheadingText () {
      if (this.total === 0) return this.$t('ابدأ رحلتك التعليمية الآن')
      return this.$t('تتابع الآن {n} دورات', { n: this.total })
        // graceful fallback for plain $t without interpolation
        .replace('{n}', this.total)
    }
  },

  mounted () {
    this.settings.setActiveNav('BORD')
  },

  methods: {
    goToCoursesPage () {
      this.$router.push({ name: 'courses' })
    },
    goToClassroom ({ pk } = {}) {
      const id = pk || ''
      if (!id) return
      window.location.href = `${location.origin}/classroom/#/class/${id}/`
    }
  }
}
</script>

<style lang="scss" scoped>
.my-courses {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-5) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__header {
    margin-block-end: var(--ds-space-6);
  }

  &__title {
    font-family: var(--ds-font-heading, 'Tajawal', system-ui, sans-serif);
    font-weight: 700;
    font-size: clamp(28px, 4vw, 44px);
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

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--ds-space-4);
    margin-block-end: var(--ds-space-6);
    justify-items: center;
  }

  .stat-tile {
    background: var(--ds-surface, #fff);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-3);
    box-shadow: var(--ds-shadow-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
  }

  &__tabs {
    margin-block-end: var(--ds-space-4);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-5);
    align-items: stretch;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (min-width: 992px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__card {
    animation: my-courses-rise 420ms var(--ds-ease-out, ease-out) both;
  }

  // Gentle cascade — first paint only. No repeat on tab switch via
  // using animation-fill-mode only; browser re-triggers per-element
  // on initial v-for, subsequent renders just re-use existing DOM.
  @for $i from 1 through 12 {
    &__card:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 40}ms;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__card { animation: none; }
  }
}

@keyframes my-courses-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
</style>
