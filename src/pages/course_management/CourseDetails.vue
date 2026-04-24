<template>
  <main class="course-details" :class="{ 'is-loading': !courseData }">
    <!-- Error state -->
    <template v-if="errorLoading">
      <div class="course-details__container course-details__container--center">
        <ds-empty-state
          variant="error"
          :title="$t('تعذر تحميل الدورة')"
          :body="$t('لم نتمكن من تحميل بيانات الدورة. يرجى المحاولة مرة أخرى.')"
        />
      </div>
    </template>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="course-details__container course-details__breadcrumb-wrap">
        <ds-breadcrumb separator="›">
          <ds-breadcrumb-item to="/">{{ $t('الرئيسية') }}</ds-breadcrumb-item>
          <ds-breadcrumb-item to="/courses">{{ $t('الدورات') }}</ds-breadcrumb-item>
          <ds-breadcrumb-item v-if="specialityLabel" to="/courses">
            {{ specialityLabel }}
          </ds-breadcrumb-item>
          <ds-breadcrumb-item>
            <template v-if="courseData && courseData.title">{{ courseData.title }}</template>
            <template v-else>…</template>
          </ds-breadcrumb-item>
        </ds-breadcrumb>
      </div>

      <!-- Shell: main column + sticky rail -->
      <div class="course-details__container course-details__shell">
        <div class="course-details__main">
          <course-hero
            ref="heroRef"
            :course-data="courseData"
            :lead-instructor="leadInstructor"
            :lesson-total="lessonTotal"
          />

          <!-- Course sections -->
          <section class="course-details__section" data-section="what-you-will-learn">
            <what-iwill-learn v-if="courseID" :course_id="courseID" />
          </section>

          <section class="course-details__section" data-section="topics">
            <course-topics-rail :course-data="courseData" />
          </section>

          <section class="course-details__section" data-section="includes">
            <course-includes
              :course-data="courseData"
              :lesson-total="lessonTotal"
              :unit-total="unitTotal"
            />
          </section>

          <section class="course-details__section" data-section="content">
            <course-units v-if="courseID" :course_id="courseID" />
          </section>

          <section class="course-details__section" data-section="requirements">
            <course-pre-requisites v-if="coursePK" :course_id="coursePK" />
          </section>

          <section class="course-details__section" data-section="about">
            <about-the-course :courseData="courseData" />
          </section>

          <section class="course-details__section" data-section="instructor">
            <course-instructors v-if="courseID" :course_id="courseID" />
          </section>
        </div>

        <!-- Sticky rail (desktop ≥ 960px) / inlined after hero on mobile -->
        <course-enrol-sidebar
          class="course-details__rail"
          :course-data="courseData"
          :is-enrolled="isEnrolled"
          :has-price="hasPrice"
          :current-price="currentPrice"
          :selected-currency="selectedCurrency"
          :lesson-total="lessonTotal"
          :unit-total="unitTotal"
          @enrol="enrolNow"
          @add-to-cart="addToCart"
          @continue-to-classroom="continueToClassroom"
          @share="shareCourse"
          @gift="giftCourse"
          @apply-coupon="onApplyCoupon"
        />
      </div>

      <!-- Related (full width) -->
      <section class="course-details__container course-details__related">
        <header class="course-details__section-head">
          <h2>{{ $t('دورات ذات صلة') }}</h2>
        </header>
        <related-coureses v-if="courseData" :courseData="courseData" />
      </section>

      <!-- Sticky viewport bars -->
      <course-sticky-bar
        :course-data="courseData"
        :is-enrolled="isEnrolled"
        :has-price="hasPrice"
        :current-price="currentPrice"
        :selected-currency="selectedCurrency"
        @enrol="enrolNow"
        @continue-to-classroom="continueToClassroom"
      />
      <course-mobile-bar
        :course-data="courseData"
        :is-enrolled="isEnrolled"
        :has-price="hasPrice"
        :current-price="currentPrice"
        :selected-currency="selectedCurrency"
        @enrol="enrolNow"
        @continue-to-classroom="continueToClassroom"
      />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'
import { GetCourseByID } from 'src/graphql/course_management/query/GetCourseByID'
import { FORMAT_THE_WEB_SIT_URL, FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type { CourseDetail, CoursePricing } from 'src/types/courses/types'
import type { GetCourseByIdResult, GetCourseByIdVars } from 'src/types/courses/types'

import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import DsBreadcrumb from 'src/design-system/components/DsBreadcrumb.vue'
import DsBreadcrumbItem from 'src/design-system/components/DsBreadcrumbItem.vue'

import CourseHero from 'src/components/courseDetails/CourseHero.vue'
import CourseEnrolSidebar from 'src/components/courseDetails/CourseEnrolSidebar.vue'
import CourseIncludes from 'src/components/courseDetails/CourseIncludes.vue'
import CourseTopicsRail from 'src/components/courseDetails/CourseTopicsRail.vue'
import CourseStickyBar from 'src/components/courseDetails/CourseStickyBar.vue'
import CourseMobileBar from 'src/components/courseDetails/CourseMobileBar.vue'

import aboutTheCourse from 'components/courseDetails/aboutTheCourse.vue'
import whatIwillLearn from 'components/courseDetails/whatIwillLearn.vue'
import coursePreRequisites from 'components/courseDetails/coursePreRequisites.vue'
import courseUnits from 'components/courseDetails/courseUnits.vue'
import courseInstructors from 'components/courseDetails/courseInstructors.vue'
import relatedCoureses from 'src/components/courseDetails/relatedCoureses.vue'

// Stores + router -----------------------------------------------------------
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const auth = useAuthStore()
const settings = useSettingsStore()
const cart = useCartStore()
const pyramid = usePyramidStore()

const { user } = storeToRefs(auth)
const { currency } = storeToRefs(settings)

// Local state ---------------------------------------------------------------
const courseID = ref('')
const coursePK = ref('')
const courseData = ref<CourseDetail | null>(null)
const errorLoading = ref(false)

const heroRef = ref<InstanceType<typeof CourseHero> | null>(null)

// SEO / Head ----------------------------------------------------------------
useHead({
  title: computed(() => courseData.value?.title ?? ''),
  meta: computed(() => {
    const c = courseData.value
    const title = c?.title ?? ''
    const brief = (c?.brief ?? '').replace(/<[^>]*>/g, '').slice(0, 160)
    const image = c?.profile ? FORMAT_THE_IAMGE_URL(c.profile) : ''
    const url = (c?.pk && c?.id)
      ? FORMAT_THE_WEB_SIT_URL(`#/course/${c.title}/${c.pk}/${c.id}`)
      : ''
    return [
      { name: 'description', content: brief },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: brief },
      { name: 'twitter:image', content: image },
      { property: 'og:title', content: title },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
    ]
  }),
})

// Computed ------------------------------------------------------------------
const selectedCurrency = computed<string>(() =>
  (currency.value || 'SAR').toUpperCase(),
)

const parsedPrices = computed<CoursePricing | null>(() => {
  if (!courseData.value?.currency) return null
  return courseData.value.currency as unknown as CoursePricing
})

const currentPrice = computed<number | null>(() => {
  const prices = parsedPrices.value
  if (!prices) return null
  const value = parseFloat(String((prices as Record<string, number>)[selectedCurrency.value]))
  return Number.isFinite(value) ? value : null
})

const hasPrice = computed<boolean>(
  () => Number.isFinite(currentPrice.value) && (currentPrice.value ?? 0) > 0,
)

const lessonTotal = computed<number>(() => {
  const edges = courseData.value?.courseunitSet?.edges ?? []
  return edges.reduce((sum, edge) => {
    return sum + (edge?.node?.courseunitcontentSet?.totalCount ?? 0)
  }, 0)
})

const unitTotal = computed<number>(
  () => courseData.value?.courseunitSet?.edges?.length ?? 0,
)

const specialityLabel = computed<string>(
  () => courseData.value?.courseSpeciality?.speciality ?? '',
)

const leadInstructor = computed<{ name: string; image: string; initial: string } | null>(() => {
  const edges = courseData.value?.courseinstructorSet?.edges ?? []
  if (!edges.length) return null
  const instructor = edges[0]?.node?.instructor
  if (!instructor) return null
  const firstName = instructor.user?.firstName ?? ''
  const lastName = instructor.user?.lastName ?? ''
  const username = instructor.user?.username ?? ''
  const name = (`${firstName} ${lastName}`).trim() || username.split('@')[0]
  return {
    name,
    image: instructor.image ?? '',
    initial: (name || '?').trim().charAt(0),
  }
})

const isEnrolled = computed<boolean>(() => !!(courseData.value?.enrolled))

// Watch route params → reload ----------------------------------------------
watch(
  () => route.params,
  (params) => { void loadCourse(params) },
  { immediate: true, deep: true },
)

// Methods -------------------------------------------------------------------
async function loadCourse (params: Record<string, string | string[]>): Promise<void> {
  if (!params || !params.pk) {
    errorLoading.value = true
    courseData.value = null
    return
  }
  courseID.value = String(params.id ?? '')
  coursePK.value = String(params.pk)
  const marketerCode = params.code ? String(params.code) : undefined
  if (marketerCode) pyramid.setRegisterationCode(marketerCode)
  errorLoading.value = false
  courseData.value = null

  try {
    const res = await apolloClient.query<GetCourseByIdResult, GetCourseByIdVars>({
      query: GetCourseByID,
      variables: { coursePk: parseInt(String(params.pk), 10) },
    })
    if (res?.data?.course) {
      courseData.value = res.data.course
    } else {
      errorLoading.value = true
    }
  } catch {
    errorLoading.value = true
  }
}

function redirectToLogin (): void {
  $q.notify({
    type: 'info',
    position: 'top',
    message: 'سجل دخول أولاً للمتابعة',
    progress: true,
    timeout: 2000,
  })
  void router.push({
    name: 'login',
    query: { redirect: route.fullPath },
  })
}

function buildCartItem () {
  const c = courseData.value
  if (!c) return null
  return {
    id: c.id,
    pk: c.pk,
    name: c.title,
    currency: (c.currency as Record<string, number> | null) ?? {},
  }
}

function addToCart (): void {
  const item = buildCartItem()
  if (!item) return
  if (!auth.isAuthenticated) { redirectToLogin(); return }
  cart.addCourseToCart({ user: user.value, course: item })
  $q.notify({
    type: 'positive',
    position: 'top',
    message: 'تمت الإضافة إلى السلة',
    progress: true,
    timeout: 2200,
  })
}

function enrolNow (): void {
  const item = buildCartItem()
  if (!item) return
  if (!auth.isAuthenticated) { redirectToLogin(); return }
  cart.addCourseToCart({ user: user.value, course: item })
  void router.push({ name: 'cart' })
}

function continueToClassroom (): void {
  const pk = coursePK.value || courseData.value?.pk
  if (!pk) return
  window.location.href = `${location.origin}/classroom/#/class/${pk}/`
}

function shareCourse (): void {
  const url = location.href
  if (navigator.share) {
    void navigator.share({ title: courseData.value?.title ?? '', url })
    return
  }
  try {
    void navigator.clipboard.writeText(url)
    $q.notify({ type: 'positive', position: 'top', message: 'تم نسخ الرابط', timeout: 1800 })
  } catch {
    /* ignore */
  }
}

function giftCourse (): void {
  $q.notify({
    type: 'info',
    position: 'top',
    message: 'قريباً: إهداء الدورة',
    timeout: 1800,
  })
}

function onApplyCoupon (code: string): void {
  if (!code) return
  // UI-only for now — cart flow owns real redemption.
  $q.notify({
    type: 'positive',
    position: 'top',
    message: `تم حفظ كود الخصم (${code})`,
    timeout: 1800,
  })
}

// Keep the previous onMounted/onBeforeUnmount shape for future motion cleanup.
onMounted(() => { /* noop — motion handles live inside CourseHero */ })
onBeforeUnmount(() => { /* noop */ })
</script>

<style lang="scss" scoped>
.course-details {
  background: var(--ds-surface);
  min-block-size: 100vh;
  padding-block-end: var(--ds-space-16);
  color: var(--ds-text);

  &__container {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: var(--ds-space-4);

    @media (min-width: 900px) {
      padding-inline: var(--ds-space-6);
    }

    &--center {
      padding-block: var(--ds-space-16);
      display: flex;
      justify-content: center;
    }
  }

  /* Breadcrumb row */
  &__breadcrumb-wrap {
    padding-block: var(--ds-space-5) var(--ds-space-3);
  }

  /* Shell: main + rail grid */
  &__shell {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-8);
    align-items: start;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
      gap: var(--ds-space-10);
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-10);
    min-inline-size: 0;
  }

  &__section {
    padding-block: var(--ds-space-2);

    & + & {
      border-block-start: 1px solid var(--ds-border);
      padding-block-start: var(--ds-space-8);
    }
  }

  /* Sticky rail */
  &__rail {
    @media (min-width: 960px) {
      position: sticky;
      inset-block-start: var(--ds-space-6);
      max-block-size: calc(100vh - var(--ds-space-8));
      overflow-y: auto;
      // Order flips the rail to the END on mobile; on desktop order doesn't
      // matter since grid places it in column 2.
      order: 2;
    }

    @media (max-width: 959px) {
      order: -1;
    }
  }

  /* Related */
  &__related {
    margin-block-start: var(--ds-space-12);
  }

  &__section-head {
    margin-block-end: var(--ds-space-5);

    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-2xl);
      font-weight: 700;
      color: var(--ds-text);
      margin: 0;
      letter-spacing: -0.01em;
    }
  }
}

/* Reduced-motion respect; also un-stick on very short desktop viewports. */
@media (max-height: 720px) and (min-width: 960px) {
  .course-details__rail { position: static; }
}

/* Give the mobile action bar bottom safety space so the last section
   isn't hidden under the fixed bar. */
@media (max-width: 767px) {
  .course-details { padding-block-end: calc(4rem + env(safe-area-inset-bottom, 0)); }
}
</style>
