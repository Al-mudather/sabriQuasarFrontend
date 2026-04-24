<template>
  <section class="home-training">
    <div class="home-training__tabs-wrap">
      <div ref="cat" @click="changeTab" class="swiper-container home-training__tabs">
        <swiper
          ref="mySwiper"
          class="nav nav-tabs"
          :space-between="1"
          :slides-per-view="'auto'"
          :grab-cursor="true"
          :centered-slides="true"
        >
          <swiper-slide
            class="nav-item"
            v-for="spec in (allCourseSpecialities && allCourseSpecialities.edges) || []"
            :key="spec.node.id"
          >
            <a
              :data-course="spec.node.pk"
              @click="changeCourseData(spec.node.pk)"
              class="nav-link"
              role="tab"
            >
              <img src="~assets/img/brain.png" alt="" aria-hidden="true" />
              <span>{{ spec.node.speciality }}</span>
            </a>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <div class="home-training__inner">
      <header class="home-training__heading">
        <h2>{{ $t('الــــدورات') }}</h2>
        <p v-if="totalCount > 0">
          {{ $t('عرض') }}
          <strong>{{ edgeCount || 0 }}</strong>
          {{ $t('من اصل') }}
          <strong>{{ totalCount || 0 }}</strong>
        </p>
      </header>

      <div v-if="courses && courses.edgeCount && courses.edgeCount > 0" class="home-training__grid">
        <course-card
          v-for="course in courses.edges"
          :key="course && course.node ? course.node.id : String(Math.random())"
          :course="course.node"
          :name="course.node ? course.node.title : ''"
          instructor="مركز دكتور صبري ابو قرون"
          :price="course.node ? course.node.courseFee : 0"
        />
      </div>

      <ds-empty-state
        v-else
        :title="$t('لا توجد دورات في هذا القسم في الوقت الحالي')"
        size="sm"
      >
        <template #illustration>
          <img src="~assets/img/Blue.png" alt="" />
        </template>
      </ds-empty-state>

      <div v-if="courses && courses.edgeCount && courses.edgeCount > 0" class="home-training__cta">
        <ds-button variant="primary" size="lg" @click="gotTocoursesPage">
          {{ $t('جمــــيع الدورات') }}
        </ds-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import courseCard from 'components/utils/courseCard.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { GetSpecialities } from 'src/graphql/course_management/query/GetAllSpeciallites'
import { GetAllCoursesInSpeciality } from 'src/graphql/course_management/query/GetAllCoursesInSpeciality.js'
import { useSettingsStore } from 'src/stores/settings'
import type {
  GetAllSpecialitiesResult,
  GetAllSpecialitiesVars,
  AllCoursesInSpecialityResult,
  AllCoursesInSpecialityVars,
} from 'src/types/courses/types'

// ---------------------------------------------------------------------------
// Router + stores
// ---------------------------------------------------------------------------
const router = useRouter()
const settings = useSettingsStore()

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const counter = ref(0)
const isDraft = ref(false)

/** The pk of whichever speciality tab is currently active. */
const activeSpecialityPk = ref<number | null>(null)

// Template refs
const cat = ref<HTMLElement | null>(null)
const mySwiper = ref<InstanceType<typeof Swiper> | null>(null)

// ---------------------------------------------------------------------------
// Specialities query (tab list)
// ---------------------------------------------------------------------------
const { result: specResult } = useQuery<GetAllSpecialitiesResult, GetAllSpecialitiesVars>(
  GetSpecialities,
  null,
  { errorPolicy: 'all' },
)
const allCourseSpecialities = computed(
  () => specResult.value?.allCourseSpecialities ?? { edges: [] },
)

// ---------------------------------------------------------------------------
// Courses query — variables are reactive: update activeSpecialityPk to re-fetch
// ---------------------------------------------------------------------------
const { result: coursesResult } = useQuery<AllCoursesInSpecialityResult, AllCoursesInSpecialityVars>(
  GetAllCoursesInSpeciality,
  () => ({
    specialityId: activeSpecialityPk.value ?? 0,
    first: 6,
    isDraft: isDraft.value,
    orderBy: ['id'],
  }),
  () => ({
    enabled: activeSpecialityPk.value !== null && activeSpecialityPk.value !== 0,
    errorPolicy: 'all',
  }),
)

/** The full allCoursesInSpeciality connection (or null while no tab selected). */
const courses = computed<AllCoursesInSpecialityResult['allCoursesInSpeciality'] | null>(
  () => coursesResult.value?.allCoursesInSpeciality ?? null,
)

const totalCount = computed<number>(() => courses.value?.totalCount ?? 0)
const edgeCount = computed<number>(() => courses.value?.edgeCount ?? 0)

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function gotTocoursesPage (): void {
  settings.setActiveNav('COURSES')
  void router.push({ name: 'courses' })
}

function changeCourseData (specialityId: number): void {
  activeSpecialityPk.value = specialityId
}

function changeTab (e: Event): void {
  e.preventDefault()
  const target = e.target as HTMLElement
  const clickedLiParent = target.closest('.nav-item')
  if (!clickedLiParent) return
  const ulParent = clickedLiParent.parentElement
  if (!ulParent) return
  for (const liParent of ulParent.childNodes) {
    const el = liParent as HTMLElement
    if (el.firstChild) (el.firstChild as HTMLElement).classList.remove('active')
  }
  ;(clickedLiParent.firstChild as HTMLElement).classList.add('active')
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  const swiperEl = mySwiper.value as unknown as { swiper?: { slideTo: (idx: number, speed: number, runCallbacks: boolean) => void } } | null
  if (swiperEl?.swiper) {
    swiperEl.swiper.slideTo(4, 1000, false)
  }
})

onUpdated(() => {
  if (counter.value !== 0 || !cat.value) return
  const l1 = cat.value.firstChild as HTMLElement | null
  const l2 = l1?.firstChild as HTMLElement | null
  const l3 = l2?.firstChild as HTMLElement | null
  const firstTab = l3?.firstChild as HTMLElement | null
  if (firstTab) {
    firstTab.classList.add('active')
    const specialityId = Number(firstTab.dataset.course)
    if (Number.isFinite(specialityId) && specialityId !== 0) {
      changeCourseData(specialityId)
    }
    counter.value += 10
  }
})
</script>

<style lang="scss" scoped>
.home-training {
  padding: var(--ds-space-10) 0 var(--ds-space-16);
  background: var(--ds-surface-muted);

  &__tabs-wrap {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: var(--ds-space-4);
    margin-block-end: var(--ds-space-8);
  }

  &__inner {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: var(--ds-space-4);
  }

  &__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-4);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-6);

    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
    p {
      font-size: var(--ds-text-sm);
      color: var(--ds-text-muted);
      margin: 0;
      strong {
        color: var(--ds-brand-700);
        font-variant-numeric: tabular-nums;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--ds-space-5);
    align-items: stretch;
  }

  &__cta {
    display: flex;
    justify-content: center;
    margin-block-start: var(--ds-space-10);
  }
}

// Tab nav — kept minimal; swiper handles layout
:deep(.home-training__tabs) .nav-link {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 0.5rem 1rem;
  border-radius: var(--ds-radius-pill);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  color: var(--ds-text);
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-weight-medium);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out);
  cursor: pointer;

  img { block-size: 1em; inline-size: auto; }

  &:hover { background: var(--ds-surface-muted); }

  &.active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
    img { filter: brightness(0) invert(1); }
  }
}
</style>
