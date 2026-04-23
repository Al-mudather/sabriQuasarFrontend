<template>
  <main class="course-details">
    <!-- Hero: course title + brand stripe -->
    <header class="course-details__hero">
      <div class="course-details__hero-inner">
        <h1 v-if="courseData.title" class="course-details__title">
          {{ courseData.title }}
        </h1>
        <ds-skeleton v-else shape="line" width="60%" height="2.25rem" />
      </div>
    </header>

    <!-- Content: side card + detail stack -->
    <div class="course-details__layout">
      <aside class="course-details__sidebar">
        <courseMainCard :courseData="courseData" />
      </aside>

      <section class="course-details__content">
        <aboutTheCourse :courseData="courseData" />
        <whatIwillLearn :course_id="courseID" />
        <coursePreRequisites :course_id="coursePK" />
        <courseUnits :course_id="courseID" />
        <courseInstructors :course_id="courseID" />
      </section>
    </div>

    <!-- Related courses -->
    <section class="course-details__related">
      <header class="course-details__section-head">
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <h2>{{ $t('دورات ذات صلة') }}</h2>
      </header>
      <relatedCoureses :courseData="courseData" />
    </section>
  </main>
</template>

<script>
import relatedCoureses from 'src/components/courseDetails/relatedCoureses'
import courseMainCard from 'components/courseDetails/courseMainCard.vue'
import aboutTheCourse from 'components/courseDetails/aboutTheCourse'
import whatIwillLearn from 'components/courseDetails/whatIwillLearn.vue'
import coursePreRequisites from 'components/courseDetails/coursePreRequisites'
import courseUnits from 'components/courseDetails/courseUnits.vue'
import courseInstructors from 'components/courseDetails/courseInstructors'
import { GetCourseByID } from 'src/queries/course_management/query/GetCourseByID'
import { FORMAT_THE_IAMGE_URL, FORMAT_THE_WEB_SIT_URL } from 'src/utils/functions.js'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CourseDetails',

  components: {
    relatedCoureses,
    courseMainCard,
    aboutTheCourse,
    whatIwillLearn,
    coursePreRequisites,
    courseUnits,
    courseInstructors
  },

  data () {
    return {
      FORMAT_THE_IAMGE_URL,
      FORMAT_THE_WEB_SIT_URL,
      courseID: '',
      coursePK: '',
      courseData: ''
    }
  },

  metaInfo () {
    const title = this.courseData.title || ''
    const brief = this.courseData.brief || ''
    const image = this.courseData.profile ? this.FORMAT_THE_IAMGE_URL(this.courseData.profile) : ''
    const url = (this.courseData.pk && this.courseData.id)
      ? this.FORMAT_THE_WEB_SIT_URL(`#/course/${this.courseData.title}/${this.courseData.pk}/${this.courseData.id}`)
      : ''

    return {
      title,
      meta: [
        { charset: 'utf-8' },
        { vmid: 'description', name: 'description', content: brief },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:domain', content: location.origin },
        { name: 'twitter:url', content: url },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: brief },
        { name: 'twitter:image', content: image },
        { itemprop: 'name', content: title },
        { itemprop: 'description', content: brief },
        { p: 'og:title', c: title },
        { p: 'og:image', c: image },
        { p: 'og:image:alt', c: title },
        { p: 'og:image:width', c: '300' },
        { p: 'og:image:height', c: '300' },
        { p: 'og:url', c: url },
        { p: 'og:site_name', c: location.host }
      ]
    }
  },

  computed: {
    ...mapState('authentication', ['token']),
    ...mapState('settings', ['isEnglish'])
  },

  watch: {
    '$route.params': {
      immediate: true,
      deep: true,
      handler: async function (params) {
        this.courseID = params.id
        this.coursePK = params.pk
        const marketerCode = this.$_.get(params, '[code]')
        this.SET_REGISTERATION_CODE_ACTION(marketerCode)

        const res = await this.$apollo.query({
          query: GetCourseByID,
          variables: { coursePk: params.pk }
        })
        this.courseData = res.data.course
      }
    }
  },

  methods: {
    ...mapActions('pyramidManagement', ['SET_REGISTERATION_CODE_ACTION'])
  }
}
</script>

<style lang="scss" scoped>
.course-details {
  background: var(--ds-surface-muted);
  min-block-size: 100vh;
  padding-block-end: var(--ds-space-16);

  &__hero {
    background: linear-gradient(135deg, var(--ds-brand-700), var(--ds-brand-600));
    color: var(--ds-text-onBrand);
    padding: var(--ds-space-10) var(--ds-space-4);
    margin-block-end: var(--ds-space-8);
  }

  &__hero-inner {
    max-inline-size: 1200px;
    margin-inline: auto;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    line-height: var(--ds-leading-tight);
    margin: 0;

    @media (min-width: 900px) {
      font-size: var(--ds-text-4xl);
      max-inline-size: 70%;
    }
  }

  &__layout {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: var(--ds-space-3);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-6);

    @media (min-width: 900px) {
      grid-template-columns: 360px 1fr;
      padding-inline: var(--ds-space-4);
      gap: var(--ds-space-8);
      align-items: start;
    }
  }

  &__sidebar {
    // Sidebar sticks on desktop so the CTA is always reachable while reading.
    @media (min-width: 900px) {
      position: sticky;
      inset-block-start: var(--ds-space-6);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-6);
  }

  &__related {
    max-inline-size: 1200px;
    margin: var(--ds-space-12) auto 0;
    padding-inline: var(--ds-space-3);

    @media (min-width: 900px) {
      padding-inline: var(--ds-space-4);
    }
  }

  &__section-head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    margin-block-end: var(--ds-space-5);

    img { block-size: 1.5rem; inline-size: auto; }
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-2xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }
}
</style>

