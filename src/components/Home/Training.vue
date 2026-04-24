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

      <div v-if="courses.edgeCount > 0" class="home-training__grid">
        <course-card
          v-for="course in courses.edges"
          :key="course.node.id"
          :course="course.node"
          :name="course.node.title"
          instructor="مركز دكتور صبري ابو قرون"
          :price="course.node.courseFee"
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

      <div v-if="courses.edgeCount > 0" class="home-training__cta">
        <ds-button variant="primary" size="lg" @click="gotTocoursesPage">
          {{ $t('جمــــيع الدورات') }}
        </ds-button>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import courseCard from 'components/utils/courseCard.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { GetSpecialities } from 'src/graphql/course_management/query/GetAllSpeciallites'
import { GetAllCoursesInSpeciality } from 'src/graphql/course_management/query/GetAllCoursesInSpeciality.js'
/**
 * @typedef {import('src/types/courses/types').GetAllSpecialitiesResult} GetAllSpecialitiesResult
 * @typedef {import('src/types/courses/types').GetAllSpecialitiesVars} GetAllSpecialitiesVars
 * @typedef {import('src/types/courses/types').AllCoursesInSpecialityResult} AllCoursesInSpecialityResult
 * @typedef {import('src/types/courses/types').AllCoursesInSpecialityVars} AllCoursesInSpecialityVars
 * @typedef {import('src/types/courses/types').Speciality} Speciality
 * @typedef {import('src/types/courses/types').CourseInSpeciality} CourseInSpeciality
 */
import { apolloClient } from 'src/apollo/client'
import { useSettingsStore } from 'src/stores/settings'

export default {
  name: 'Training',
  components: { courseCard, Swiper, SwiperSlide },

  setup () {
    const settings = useSettingsStore()
    const { result } = useQuery(GetSpecialities, null, { errorPolicy: 'all' })
    const allCourseSpecialities = computed(() => result.value?.allCourseSpecialities || { edges: [] })
    return { settings, allCourseSpecialities }
  },

  data () {
    return {
      counter: 0,
      edgeCount: 0,
      totalCount: 0,
      isDraft: false,
      courses: [],
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: { rotate: 500, stretch: 0, depth: 100, modifier: 1, slideShadows: false }
      }
    }
  },

  mounted () {
    if (this.$refs.mySwiper?.swiper) {
      this.$refs.mySwiper.swiper.slideTo(4, 1000, false)
    }
  },

  updated () {
    if (this.counter !== 0 || !this.$refs.cat) return
    const l1 = this.$refs.cat.firstChild
    const l2 = l1 && l1.firstChild
    const l3 = l2 && l2.firstChild
    const firstTab = l3 && l3.firstChild
    if (firstTab) {
      firstTab.classList.add('active')
      const specialityId = JSON.parse(firstTab.dataset.course)
      this.changeCourseData(specialityId)
      this.counter += 10
    }
  },

  methods: {
    gotTocoursesPage () {
      this.settings.setActiveNav('COURSES')
      this.$router.push({ name: 'courses' })
    },

    async changeCourseData (specialityId) {
      const res = await apolloClient.query({
        query: GetAllCoursesInSpeciality,
        variables: { specialityId, first: 4, isDraft: this.isDraft, orderBy: ['id'] }
      })
      this.courses = res.data.allCoursesInSpeciality
      this.totalCount = res.data.allCoursesInSpeciality.totalCount
      this.edgeCount = res.data.allCoursesInSpeciality.edgeCount
    },

    changeTab (e) {
      e.preventDefault()
      const clickedLiParent = e.target.closest('.nav-item')
      if (!clickedLiParent) return
      const ulParent = clickedLiParent.parentElement
      for (const liParent of ulParent.childNodes) {
        if (liParent.firstChild) liParent.firstChild.classList.remove('active')
      }
      clickedLiParent.firstChild.classList.add('active')
    }
  }
}
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
