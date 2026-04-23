<template>
  <main class="my-courses">
    <!-- Page header + progress summary -->
    <header class="my-courses__header">
      <div class="my-courses__head-row">
        <h1 class="my-courses__title">
          <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
          <span>{{ $t('كورساتـي') }}</span>
        </h1>
      </div>

      <dl v-if="!isLoading && total > 0" class="my-courses__stats">
        <div class="stat">
          <dt>{{ $t('قيد التقدم') }}</dt>
          <dd>{{ inProgressCount }}</dd>
        </div>
        <div class="stat">
          <dt>{{ $t('مكتمل') }}</dt>
          <dd>{{ completedCount }}</dd>
        </div>
        <div class="stat">
          <dt>{{ $t('الإجمالي') }}</dt>
          <dd>{{ total }}</dd>
        </div>
      </dl>
    </header>

    <!-- Filter chips -->
    <nav v-if="!isLoading && total > 0" class="my-courses__filters" aria-label="Filter courses">
      <button
        v-for="f in filterOptions"
        :key="f.id"
        type="button"
        class="chip"
        :class="{ 'chip--active': activeFilter === f.id }"
        @click="activeFilter = f.id"
      >
        {{ f.label }}
        <span class="chip__count">{{ f.count }}</span>
      </button>
    </nav>

    <!-- States -->
    <section class="my-courses__body">
      <!-- Loading: skeleton grid -->
      <div v-if="isLoading" class="my-courses__grid">
        <course-card-skeleton v-for="n in 8" :key="'sk-' + n" />
      </div>

      <!-- Empty state: no enrollments -->
      <ds-empty-state
        v-else-if="total === 0"
        :title="$t('لا توجد كورسات بعد')"
        size="lg"
      >
        <template #illustration>
          <img src="~assets/img/notCores.png" alt="" />
        </template>
        <template #description>
          {{ $t('ليس لديك أي اشتراك في الوقت الحالي. ابدأ رحلتك التعليمية بتصفح الكورسات المتاحة.') }}
        </template>
        <template #actions>
          <ds-button variant="primary" @click="GO_TO_COURSES_PAGE">
            {{ $t('تصفح الكورسات') }}
          </ds-button>
        </template>
      </ds-empty-state>

      <!-- Empty state: filter matched nothing -->
      <ds-empty-state
        v-else-if="filteredEnrollments.length === 0"
        :title="$t('لا توجد نتائج')"
        :description="$t('جرّب تغيير الفلتر للعثور على كورسات أخرى.')"
        size="md"
      >
        <template #actions>
          <ds-button variant="secondary" @click="activeFilter = 'all'">
            {{ $t('عرض الكل') }}
          </ds-button>
        </template>
      </ds-empty-state>

      <!-- Data: course grid -->
      <div v-else class="my-courses__grid">
        <course-card
          v-for="enrollment in filteredEnrollments"
          :key="enrollment.node.id"
          :course="enrollment.node.course"
          :total-finished-course-contents="enrollment.node.learningprogressSet.totalCount"
        />
      </div>
    </section>
  </main>
</template>

<script>
import courseCard from 'src/components/MyCourses/courseCard.vue'
import CourseCardSkeleton from 'src/components/MyCourses/CourseCardSkeleton.vue'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { mapActions } from 'vuex'

const progressOf = (enrollment) => {
  const course = enrollment.node.course
  const done = enrollment.node.learningprogressSet.totalCount
  const total = course.courseunitSet.edges.reduce(
    (acc, u) => acc + u.node.courseunitcontentSet.totalCount,
    0
  )
  if (total <= 0) return 0
  return Math.round((done / total) * 100)
}

export default {
  name: 'MyCourses',

  components: { courseCard, CourseCardSkeleton },

  data () {
    return {
      lodash: this.$_,
      courseLimit: 100,
      activeFilter: 'all',
      allEnrollmentsForCurrentUser: {}
    }
  },

  apollo: {
    allEnrollmentsForCurrentUser: {
      query () { return AllEnrollmentsForCurrentUser },
      variables () { return { limit: this.courseLimit, cursor: '' } },
      fetchPolicy: 'network-only'
    }
  },

  computed: {
    enrollments () {
      return this.lodash.get(this.allEnrollmentsForCurrentUser, 'edges', []) || []
    },

    isLoading () {
      return this.$apollo.queries.allEnrollmentsForCurrentUser.loading &&
        this.enrollments.length === 0
    },

    total () { return this.enrollments.length },

    inProgressCount () {
      return this.enrollments.filter(e => {
        const p = progressOf(e); return p > 0 && p < 100
      }).length
    },

    completedCount () {
      return this.enrollments.filter(e => progressOf(e) >= 100).length
    },

    notStartedCount () {
      return this.enrollments.filter(e => progressOf(e) === 0).length
    },

    filterOptions () {
      return [
        { id: 'all',         label: this.$t('الكل'),         count: this.total },
        { id: 'in-progress', label: this.$t('قيد التقدم'),   count: this.inProgressCount },
        { id: 'completed',   label: this.$t('مكتمل'),        count: this.completedCount },
        { id: 'not-started', label: this.$t('لم يبدأ بعد'),  count: this.notStartedCount }
      ]
    },

    filteredEnrollments () {
      const f = this.activeFilter
      if (f === 'all') return this.enrollments
      return this.enrollments.filter(e => {
        const p = progressOf(e)
        if (f === 'completed')   return p >= 100
        if (f === 'in-progress') return p > 0 && p < 100
        if (f === 'not-started') return p === 0
        return true
      })
    }
  },

  mounted () {
    this.setActiveNavAction('BORD')
  },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),
    GO_TO_COURSES_PAGE () { this.$router.push({ name: 'courses' }) }
  }
}
</script>

<style lang="scss" scoped>
.my-courses {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);

  &__header {
    margin-block-end: var(--ds-space-6);
  }

  &__head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-4);
    flex-wrap: wrap;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-3);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
    img { block-size: 2rem; inline-size: auto; }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--ds-space-3);
    margin: var(--ds-space-6) 0 0;
    padding: 0;

    .stat {
      background: var(--ds-surface);
      border: 1px solid var(--ds-border);
      border-radius: var(--ds-radius-lg);
      padding: var(--ds-space-4);
      display: flex;
      flex-direction: column;
      gap: var(--ds-space-1);
      box-shadow: var(--ds-shadow-xs);

      dt {
        font-size: var(--ds-text-sm);
        color: var(--ds-text-muted);
        font-family: var(--ds-font-body);
      }
      dd {
        font-family: var(--ds-font-heading);
        font-size: var(--ds-text-3xl);
        font-weight: var(--ds-weight-bold);
        color: var(--ds-brand-700);
        margin: 0;
        font-variant-numeric: tabular-nums;
      }
    }
  }

  &__filters {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-6);
    padding-block: var(--ds-space-2);
    border-block-end: 1px solid var(--ds-border);
  }

  &__body {
    min-block-size: 20rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--ds-space-5);
    align-items: stretch;
  }
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  color: var(--ds-text);
  border-radius: var(--ds-radius-pill);
  padding: 0.5rem 1rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-weight-medium);
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { background: var(--ds-surface-muted); }
  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }

  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
    &:hover { background: var(--ds-brand-700); }
    .chip__count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--ds-text-onBrand);
    }
  }

  &__count {
    background: var(--ds-neutral-100);
    color: var(--ds-text-muted);
    font-size: var(--ds-text-2xs);
    padding: 0.15rem 0.5rem;
    border-radius: var(--ds-radius-pill);
    font-variant-numeric: tabular-nums;
  }
}
</style>
