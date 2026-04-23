<template>
  <main class="stc-home">
    <HeroIndigo
      :learners-count="learnersCount"
      :courses-count="coursesCount"
    />

    <StatsWedges :courses-count="coursesCount" />

    <ValueProps />

    <template v-if="specialitiesLoading && !specialities.length">
      <div
        v-for="n in 3"
        :key="`cat-sk-${n}`"
        class="stc-home__cat-skeleton"
        aria-hidden="true"
      >
        <div class="stc-home__cat-skeleton-inner">
          <ds-skeleton type="text" :rows="1" />
          <div class="stc-home__cat-skeleton-rail">
            <ds-skeleton v-for="m in 3" :key="m" type="card" />
          </div>
        </div>
      </div>
    </template>

    <CategorySection
      v-for="edge in specialities"
      :key="edge.node.id"
      :speciality="edge.node"
    />

    <InstructorMarquee />

    <TestimonialSpread />

    <FinalCta />
  </main>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useSettingsStore } from 'src/stores/settings'

import { GetSpecialities } from 'src/queries/course_management/query/GetAllSpeciallites'
import { GetAllCoursesCountStatiscs } from 'src/queries/course_management/query/GetAllCoursesStatiscs'
/**
 * @typedef {import('src/features/courses/types').GetAllSpecialitiesResult} GetAllSpecialitiesResult
 * @typedef {import('src/features/courses/types').GetAllSpecialitiesVars} GetAllSpecialitiesVars
 */
// TODO: add to features/courses/types.ts — GetAllCoursesCountStatiscs not in generated.ts (schema drift)

import HeroIndigo from 'src/components/Home/HeroIndigo.vue'
import StatsWedges from 'src/components/Home/StatsWedges.vue'
import ValueProps from 'src/components/Home/ValueProps.vue'
import CategorySection from 'src/components/Home/CategorySection.vue'
import InstructorMarquee from 'src/components/Home/InstructorMarquee.vue'
import TestimonialSpread from 'src/components/Home/TestimonialSpread.vue'
import FinalCta from 'src/components/Home/FinalCta.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'

export default {
  name: 'Home',
  components: {
    HeroIndigo,
    StatsWedges,
    ValueProps,
    CategorySection,
    InstructorMarquee,
    TestimonialSpread,
    FinalCta,
    DsSkeleton
  },

  setup () {
    const settings = useSettingsStore()

    const specialitiesQuery = useQuery(GetSpecialities, null, {
      errorPolicy: 'all'
    })
    specialitiesQuery.onError((err) => {
      // eslint-disable-next-line no-console
      console.warn('[Home] specialities query failed', err)
    })

    const countQuery = useQuery(GetAllCoursesCountStatiscs, null, {
      errorPolicy: 'all'
    })
    countQuery.onError((err) => {
      // eslint-disable-next-line no-console
      console.warn('[Home] count query failed', err)
    })

    const allCourseSpecialities = computed(
      () => specialitiesQuery.result.value?.allCourseSpecialities || null
    )
    const allCoursesCount = computed(
      () => countQuery.result.value?.allCoursesCount ?? null
    )

    const specialities = computed(
      () => allCourseSpecialities.value?.edges || []
    )
    const specialitiesLoading = specialitiesQuery.loading

    const coursesCount = computed(() => {
      const n = Number(allCoursesCount.value)
      return Number.isFinite(n) && n > 0 ? n : null
    })
    const learnersCount = computed(() => null)

    onMounted(() => { settings.setActiveNav('HOME') })

    return {
      specialities,
      specialitiesLoading,
      coursesCount,
      learnersCount
    }
  }
}
</script>

<style lang="scss" scoped>
.stc-home {
  background: var(--ds-cream);
  color: var(--ds-ink);
  min-block-size: 100vh;
}

.stc-home__cat-skeleton {
  background: var(--ds-cream);
  padding-block: clamp(3rem, 6vw, 5rem);
}

.stc-home__cat-skeleton-inner {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stc-home__cat-skeleton-rail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .stc-home__cat-skeleton-rail { grid-template-columns: 1fr; }
}
</style>
