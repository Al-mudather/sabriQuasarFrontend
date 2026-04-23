<template>
  <main class="courses-page">
    <header class="courses-page__head">
      <h1 class="courses-page__title">
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('الـــدورات') }}</span>
      </h1>

      <form class="courses-page__search" @submit.prevent="GetAllCoursesByTitle">
        <svg viewBox="0 0 24 24" class="courses-page__search-icon" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="search"
          type="search"
          :placeholder="$t('ما الذي تبحث عنة في التخصص المختار ادناه؟')"
          @keydown.enter.prevent="GetAllCoursesByTitle"
        />
      </form>

      <div class="courses-page__filters">
        <button
          v-for="f in filters"
          :key="f.id"
          type="button"
          class="chip"
          :class="{ 'chip--active': activePriceFilter === f.id }"
          @click="applyPriceFilter(f.id)"
        >{{ f.label }}</button>

        <div class="courses-page__sorters">
          <button
            type="button"
            class="sort-btn"
            :class="{ 'sort-btn--active': activeOrder === 'ACE' }"
            :aria-label="$t('ترتيب تصاعدي')"
            @click="GetAllCoursesByOrderingDecendinOrAcending('ACE')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 14l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            class="sort-btn"
            :class="{ 'sort-btn--active': activeOrder === 'DEC' }"
            :aria-label="$t('ترتيب تنازلي')"
            @click="GetAllCoursesByOrderingDecendinOrAcending('DEC')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <section class="courses-page__tabs">
      <div ref="cat" @click="changeTab" class="swiper-container">
        <swiper
          ref="mySwiper"
          class="courses-page__tab-list"
          :space-between="1"
          :options="swiperOptions"
        >
          <div v-if="$_.isEmpty(allCourseSpecialities.edges)" class="courses-page__tab-skeletons">
            <ds-skeleton v-for="i in 6" :key="i" shape="pill" width="7rem" />
          </div>
          <swiper-slide
            v-else
            class="nav-item"
            v-for="spec in allCourseSpecialities.edges"
            :key="spec.node.id"
          >
            <a
              :data-pk="spec.node.pk"
              class="nav-link"
              role="tab"
              @click="changeCourseData(spec.node.pk)"
            >
              <img src="~assets/img/brain.png" alt="" aria-hidden="true" />
              <span>{{ spec.node.speciality }}</span>
            </a>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <section class="courses-page__body">
      <ApolloQuery
        :query="GetAllCoursesInSpeciality"
        :variables="{
          specialityId: activeSpecialityID,
          first: 8,
          ...filter,
          ...searchFilter,
          ...orderingFilter,
          isDraft: isDraft
        }"
        :skip="!activeSpecialityID"
      >
        <template v-slot="{ result: { loading, data }, query }">
          <div v-if="loading" class="courses-page__grid">
            <ds-card v-for="i in 8" :key="i" class="courses-page__card-skeleton">
              <template #media>
                <ds-skeleton shape="rect" height="100%" radius="0" />
              </template>
              <ds-skeleton shape="line" width="85%" />
              <ds-skeleton shape="line" width="55%" />
              <template #footer>
                <ds-skeleton shape="pill" width="100%" />
              </template>
            </ds-card>
          </div>

          <ds-empty-state
            v-else-if="$_.get(data, '[allCoursesInSpeciality][edgeCount]', 0) <= 0"
            :title="$t('لا توجد نتائج للبحث')"
            :description="$t('حاول الكتابة بشكل مختلف')"
            size="md"
          >
            <template #illustration>
              <img src="~assets/img/search(1).png" alt="" />
            </template>
          </ds-empty-state>

          <div v-else>
            <div class="courses-page__grid">
              <course-card
                v-for="course in $_.get(data, '[allCoursesInSpeciality][edges]', [])"
                :key="course.node.id"
                :course="course.node"
                :name="course.node.title"
                instructor="مركز دكتور صبري ابو قرون"
                :price="course.node.courseFee"
                unit="SDG"
              />
            </div>

            <div v-if="data.allCoursesInSpeciality.pageInfo.hasNextPage" class="courses-page__load-more">
              <ds-button variant="secondary" @click="loadMoreData(query, data)">
                {{ $t('عرض المزيد') }}
              </ds-button>
            </div>
          </div>
        </template>
      </ApolloQuery>
    </section>
  </main>
</template>

<script>
import courseCard from 'components/utils/courseCard.vue'
import { GetAllCoursesInSpeciality } from 'src/queries/course_management/query/GetAllCoursesInSpeciality.js'
import { GetSpecialities } from 'src/queries/course_management/query/GetAllSpeciallites'
import { mapActions } from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'

export default {
  name: 'Courses',
  components: { courseCard, Swiper, SwiperSlide },

  data () {
    return {
      GetAllCoursesInSpeciality,
      counter: 0,
      isDraft: false,
      search: '',
      activeSpecialityID: null,
      activePriceFilter: 'all',
      activeOrder: null,
      allCourseSpecialities: '',
      filter: {},
      searchFilter: {},
      orderingFilter: {},
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: { rotate: 500, stretch: 0, depth: 100, modifier: 1, slideShadows: false }
      }
    }
  },

  computed: {
    swiper () { return this.$refs.mySwiper.$swiper },

    filters () {
      return [
        { id: 'all',  label: this.$t('الكل') },
        { id: 'free', label: this.$t('مجاناً') },
        { id: 'paid', label: this.$t('مدفوعه') }
      ]
    }
  },

  apollo: {
    allCourseSpecialities: {
      query () { return GetSpecialities },
      variables () { return { courseNumber: 20 } }
    }
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler (params) {
        this.search = params.search || ''
        this.GetAllCoursesByTitle()
      }
    },
    search (val) { if (this.$_.isEmpty(val)) this.GetAllCoursesByTitle() }
  },

  mounted () {
    this.setActiveNavAction('COURSES')
    this.swiper.slideTo(3, 1000, false)
    this.setNavbarSearchAction(false)
  },

  destroyed () { this.setNavbarSearchAction(true) },

  updated () {
    if (this.counter !== 0 || !this.$refs.cat) return
    const l1 = this.$refs.cat.firstChild
    const l2 = l1 && l1.firstChild
    const l3 = l2 && l2.firstChild
    const firstTab = l3 && l3.firstChild
    if (!firstTab) return
    firstTab.classList.add('active')
    const specialityID = JSON.parse(firstTab.dataset.pk)
    this.changeCourseData(specialityID)
    this.activeSpecialityID = specialityID
    this.counter += 10
  },

  methods: {
    ...mapActions('authentication', ['setNavbarSearchAction']),
    ...mapActions('settings', ['setActiveNavAction']),

    GetAllCoursesByOrderingDecendinOrAcending (type) {
      this.activeOrder = type
      this.orderingFilter = { orderBy: [type === 'DEC' ? '-title' : 'title'] }
      this.changeCourseData(this.activeSpecialityID)
    },

    GetAllCoursesByTitle () {
      this.searchFilter = { title_Icontains: this.search }
      this.changeCourseData(this.activeSpecialityID)
    },

    applyPriceFilter (id) {
      this.activePriceFilter = id
      if (id === 'free') this.filter = { isPaid: false }
      else if (id === 'paid') this.filter = { isPaid: true }
      else this.filter = {}
      this.changeCourseData(this.activeSpecialityID)
    },

    async changeCourseData (specialityID) {
      this.activeSpecialityID = specialityID
    },

    async loadMoreData (query, data) {
      await query.fetchMore({
        variables: {
          specialityId: this.activeSpecialityID,
          cursor: data.allCoursesInSpeciality.pageInfo.endCursor,
          isDraft: this.isDraft
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allCoursesInSpeciality.edges
          const pageInfo = fetchMoreResult.allCoursesInSpeciality.pageInfo
          if (newEdges.length) {
            return {
              allCoursesInSpeciality: {
                __typename: previousResult.allCoursesInSpeciality.__typename,
                edges: [...previousResult.allCoursesInSpeciality.edges, ...newEdges],
                pageInfo
              }
            }
          }
          return previousResult
        }
      })
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
.courses-page {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-16);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    margin-block-end: var(--ds-space-6);
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
    img { block-size: 1.75rem; inline-size: auto; }
  }

  &__search {
    position: relative;
    max-inline-size: 560px;

    input {
      inline-size: 100%;
      padding: 0.85rem var(--ds-space-3) 0.85rem calc(var(--ds-space-10) + 0.5rem);
      background: var(--ds-surface);
      border: 1px solid var(--ds-border);
      border-radius: var(--ds-radius-pill);
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
  }

  &__search-icon {
    position: absolute;
    inset-inline-start: var(--ds-space-3);
    inset-block-start: 50%;
    transform: translateY(-50%);
    inline-size: 1.25rem;
    block-size: 1.25rem;
    color: var(--ds-text-muted);
    pointer-events: none;
  }

  &__filters {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    align-items: center;
  }

  &__sorters {
    margin-inline-start: auto;
    display: flex;
    gap: var(--ds-space-1);
  }

  &__tabs {
    margin-block-end: var(--ds-space-6);
  }

  &__tab-list {
    padding-block: var(--ds-space-2);
  }

  &__tab-skeletons {
    display: flex;
    gap: var(--ds-space-2);
  }

  &__body {
    min-block-size: 30rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--ds-space-5);
    align-items: stretch;
  }

  &__card-skeleton { height: 100%; }

  &__load-more {
    display: flex;
    justify-content: center;
    margin-block-start: var(--ds-space-8);
  }
}

.chip {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  color: var(--ds-text);
  border-radius: var(--ds-radius-pill);
  padding: 0.5rem 1rem;
  white-space: nowrap;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-weight-medium);
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color var(--ds-duration-fast) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { background: var(--ds-surface-muted); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
    &:hover { background: var(--ds-brand-700); }
  }
}

.sort-btn {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  color: var(--ds-text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-out),
              color var(--ds-duration-fast) var(--ds-ease-out);

  svg { inline-size: 1.1rem; block-size: 1.1rem; }

  &:hover { background: var(--ds-surface-muted); }
  &--active { background: var(--ds-brand-600); color: var(--ds-text-onBrand); border-color: var(--ds-brand-600); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
}

::v-deep .courses-page__tab-list .nav-link {
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
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color var(--ds-duration-fast) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out);

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
