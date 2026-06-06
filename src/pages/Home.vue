<template>
  <main class="stc-home">
    <HeroIndigo :courses-count="coursesCount" />

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

    <FinalCta />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useSettingsStore } from 'src/stores/settings'
import { GetSpecialities } from 'src/graphql/course_management/query/GetAllSpeciallites'
import { GetAllCoursesCountStatiscs } from 'src/graphql/course_management/query/GetAllCoursesStatiscs'
import type {
  GetAllSpecialitiesResult,
  GetAllSpecialitiesVars,
  GetAllCoursesCountResult,
  GetAllCoursesCountVars,
} from 'src/types/courses/types'
import HeroIndigo from 'src/components/Home/HeroIndigo.vue'
import StatsWedges from 'src/components/Home/StatsWedges.vue'
import ValueProps from 'src/components/Home/ValueProps.vue'
import CategorySection from 'src/components/Home/CategorySection.vue'
import InstructorMarquee from 'src/components/Home/InstructorMarquee.vue'
import FinalCta from 'src/components/Home/FinalCta.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'

const settings = useSettingsStore()

const specialitiesQuery = useQuery<GetAllSpecialitiesResult, GetAllSpecialitiesVars>(
  GetSpecialities,
  {},
  { errorPolicy: 'all' },
)
specialitiesQuery.onError((err) => {
  console.warn('[Home] specialities query failed', err)
})

const countQuery = useQuery<GetAllCoursesCountResult, GetAllCoursesCountVars>(
  GetAllCoursesCountStatiscs,
  {},
  { errorPolicy: 'all' },
)
countQuery.onError((err) => {
  console.warn('[Home] count query failed', err)
})

const allCourseSpecialities = computed(
  () => specialitiesQuery.result.value?.allCourseSpecialities || null,
)
const allCoursesCount = computed(
  () => countQuery.result.value?.allCoursesCount ?? null,
)

type SpecEdgeNN = NonNullable<NonNullable<typeof allCourseSpecialities['value']>['edges'][number]> & {
  node: NonNullable<NonNullable<NonNullable<typeof allCourseSpecialities['value']>['edges'][number]>['node']>
}

const specialities = computed(
  () => (allCourseSpecialities.value?.edges ?? []).filter(
    (e): e is SpecEdgeNN => !!e && !!e.node,
  ),
)
const specialitiesLoading = specialitiesQuery.loading

const coursesCount = computed(() => {
  const n = Number(allCoursesCount.value)
  return Number.isFinite(n) && n > 0 ? n : null
})

onMounted(() => { settings.setActiveNav('HOME') })
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
