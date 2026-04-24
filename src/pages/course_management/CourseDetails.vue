<template>
  <main class="course-details" :class="{ 'is-loading': !courseData }">
    <!-- ======================= Error State ======================= -->
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
      <!-- ======================= Breadcrumb ======================= -->
      <div class="course-details__container course-details__breadcrumb-wrap">
        <ds-breadcrumb separator="›">
          <ds-breadcrumb-item to="/">{{ $t('الرئيسية') }}</ds-breadcrumb-item>
          <ds-breadcrumb-item to="/courses">{{ $t('الدورات') }}</ds-breadcrumb-item>
          <ds-breadcrumb-item v-if="specialityLabel" :to="`/courses`">
            {{ specialityLabel }}
          </ds-breadcrumb-item>
          <ds-breadcrumb-item>
            <template v-if="courseData && courseData.title">{{ courseData.title }}</template>
            <template v-else>…</template>
          </ds-breadcrumb-item>
        </ds-breadcrumb>
      </div>

      <!-- ======================= Hero ======================= -->
      <header class="course-details__hero" ref="hero">
        <div class="course-details__container course-details__hero-grid">
          <!-- LEFT: text + meta -->
          <div class="course-details__hero-copy">
            <span class="course-details__kicker">{{ $t('دورة') }}</span>
            <h1 v-if="courseData && courseData.title" class="course-details__title">
              {{ courseData.title }}
            </h1>
            <ds-skeleton v-else shape="line" width="70%" height="3rem" />

            <p
              v-if="courseData && courseData.brief"
              class="course-details__summary"
              v-html="truncatedBrief"
            />
            <div v-else class="course-details__summary-skeleton">
              <ds-skeleton shape="line" width="94%" />
              <ds-skeleton shape="line" width="80%" />
              <ds-skeleton shape="line" width="64%" />
            </div>

            <!-- Meta row -->
            <ul class="course-details__meta">
              <li v-if="leadInstructor">
                <span class="course-details__meta-avatar">
                  <img
                    v-if="leadInstructor.image"
                    :src="FORMAT_THE_IAMGE_URL(leadInstructor.image)"
                    :alt="leadInstructor.name"
                  />
                  <span v-else aria-hidden="true">{{ leadInstructor.initial }}</span>
                </span>
                <span class="course-details__meta-text">
                  <span class="course-details__meta-label">{{ $t('المدرب') }}</span>
                  <strong>{{ leadInstructor.name }}</strong>
                </span>
              </li>
              <li v-if="courseData && courseData.courseHours">
                <span class="course-details__meta-icon" aria-hidden="true">◷</span>
                <span class="course-details__meta-text">
                  <span class="course-details__meta-label">{{ $t('المدة') }}</span>
                  <strong>{{ courseData.courseHours }} {{ $t('ساعة') }}</strong>
                </span>
              </li>
              <li v-if="lessonTotal > 0">
                <span class="course-details__meta-icon" aria-hidden="true">▤</span>
                <span class="course-details__meta-text">
                  <span class="course-details__meta-label">{{ $t('الدروس') }}</span>
                  <strong>{{ lessonTotal }}</strong>
                </span>
              </li>
              <li v-if="courseData && courseData.enrollmentCount">
                <span class="course-details__meta-icon" aria-hidden="true">◉</span>
                <span class="course-details__meta-text">
                  <span class="course-details__meta-label">{{ $t('الملتحقون') }}</span>
                  <strong>{{ formatCount(courseData.enrollmentCount) }}</strong>
                </span>
              </li>
            </ul>
          </div>

          <!-- RIGHT: Cover + sticky sidebar -->
          <aside class="course-details__hero-aside">
            <div class="course-details__cover">
              <img
                v-if="courseData && (courseData.cover || courseData.profile)"
                :src="FORMAT_THE_IAMGE_URL(courseData.cover || courseData.profile)"
                :alt="courseData.title || ''"
              />
              <svg v-else viewBox="0 0 400 300" class="course-details__cover-fallback" aria-hidden="true">
                <defs>
                  <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#322873"/>
                    <stop offset="100%" stop-color="#1f1847"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#coverGrad)"/>
                <path d="M0 230 Q 100 200 200 220 T 400 210 L 400 300 L 0 300 Z" fill="rgba(246,241,234,0.08)"/>
                <path d="M0 250 Q 120 225 240 245 T 400 235 L 400 300 L 0 300 Z" fill="rgba(246,241,234,0.06)"/>
              </svg>
            </div>

            <div class="course-details__enrol-sticky">
              <div class="course-details__enrol-card">
                <div class="course-details__price" v-if="courseData">
                  <price-display
                    v-if="hasPrice"
                    :amount="currentPrice"
                    :currency="selectedCurrency"
                    size="xl"
                    variant="terracotta"
                  />
                  <span v-else-if="courseData.isPaid === false" class="course-details__price-free">
                    {{ $t('مجاني') }}
                  </span>
                  <ds-skeleton v-else shape="line" width="8ch" height="2rem" />
                </div>
                <ds-skeleton v-else shape="line" width="8ch" height="2rem" />

                <ds-button
                  v-if="isEnrolled"
                  variant="primary"
                  size="lg"
                  full-width
                  class="course-details__cta"
                  @click="continueToClassroom"
                >
                  {{ $t('متابعة الدورة') }}
                </ds-button>
                <template v-else>
                  <ds-button
                    variant="accent"
                    size="lg"
                    full-width
                    class="course-details__cta"
                    :disabled="!courseData"
                    @click="enrolNow"
                  >
                    {{ $t('سجل في الدورة') }}
                  </ds-button>
                  <ds-button
                    variant="ghost"
                    size="md"
                    full-width
                    class="course-details__cta-secondary"
                    :disabled="!courseData"
                    @click="addToCart"
                  >
                    {{ $t('أضف إلى السلة') }}
                  </ds-button>
                </template>

                <ul class="course-details__enrol-meta">
                  <li v-if="courseData && courseData.courseLanguage">
                    <span>{{ $t('اللغة') }}</span>
                    <strong>{{ courseData && courseData.courseLanguage && courseData.courseLanguage.languageName }}</strong>
                  </li>
                  <li v-if="courseData && courseData.courseHours">
                    <span>{{ $t('المدة') }}</span>
                    <strong>{{ courseData.courseHours }}{{ $t('س') }}</strong>
                  </li>
                  <li v-if="lessonTotal">
                    <span>{{ $t('الدروس') }}</span>
                    <strong>{{ lessonTotal }}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <!-- ======================= Tabs ======================= -->
      <section class="course-details__container course-details__tabs">
        <ds-tabs v-model="activeTab" size="md">
          <ds-tab name="overview" :label="$t('نظرة عامة')">
            <about-the-course :courseData="courseData" />
            <what-iwill-learn v-if="courseID" :course_id="courseID" />
            <course-pre-requisites v-if="coursePK" :course_id="coursePK" />
          </ds-tab>

          <ds-tab name="curriculum" :label="$t('المنهج')">
            <course-units v-if="courseID" :course_id="courseID" />
            <ds-empty-state
              v-else
              :title="$t('لا يوجد منهج متاح')"
              size="sm"
            />
          </ds-tab>

          <ds-tab name="instructor" :label="$t('المدرب')">
            <course-instructors v-if="courseID" :course_id="courseID" />
          </ds-tab>

          <ds-tab name="reviews" :label="$t('التقييمات')">
            <ds-empty-state
              :title="$t('لا توجد تقييمات بعد')"
              :body="$t('كن أول من يشارك تجربته مع هذه الدورة')"
              size="md"
            />
          </ds-tab>
        </ds-tabs>
      </section>

      <!-- ======================= Related ======================= -->
      <section class="course-details__container course-details__related">
        <header class="course-details__section-head">
          <h2>{{ $t('دورات ذات صلة') }}</h2>
        </header>
        <related-coureses v-if="courseData" :courseData="courseData" />
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
import { FORMAT_THE_IAMGE_URL, FORMAT_THE_WEB_SIT_URL } from 'src/utils/functions.js'
import { contourDrift } from 'src/design-system/motion'
import type { CourseDetail, CoursePricing } from 'src/types/courses/types'
import type { GetCourseByIdResult, GetCourseByIdVars } from 'src/types/courses/types'

import DsButton from 'src/design-system/components/DsButton.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import DsBreadcrumb from 'src/design-system/components/DsBreadcrumb.vue'
import DsBreadcrumbItem from 'src/design-system/components/DsBreadcrumbItem.vue'
import DsTabs from 'src/design-system/components/DsTabs.vue'
import DsTab from 'src/design-system/components/DsTab.vue'
import PriceDisplay from 'src/components/shared/PriceDisplay.vue'
import aboutTheCourse from 'components/courseDetails/aboutTheCourse.vue'
import whatIwillLearn from 'components/courseDetails/whatIwillLearn.vue'
import coursePreRequisites from 'components/courseDetails/coursePreRequisites.vue'
import courseUnits from 'components/courseDetails/courseUnits.vue'
import courseInstructors from 'components/courseDetails/courseInstructors.vue'
import relatedCoureses from 'src/components/courseDetails/relatedCoureses.vue'

// ---------------------------------------------------------------------------
// Stores + router
// ---------------------------------------------------------------------------
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const auth = useAuthStore()
const settings = useSettingsStore()
const cart = useCartStore()
const pyramid = usePyramidStore()

const { user } = storeToRefs(auth)
const { currency } = storeToRefs(settings)

// ---------------------------------------------------------------------------
// Local state
// ---------------------------------------------------------------------------
const courseID = ref('')
const coursePK = ref('')
const courseData = ref<CourseDetail | null>(null)
const errorLoading = ref(false)
const activeTab = ref('overview')
const hero = ref<HTMLElement | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const motionHandles = ref<any[]>([])

// ---------------------------------------------------------------------------
// Head / SEO
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const selectedCurrency = computed<string>(() =>
  (currency.value || 'SAR').toUpperCase(),
)

const parsedPrices = computed<CoursePricing | null>(() => {
  if (!courseData.value?.currency) return null
  // Apollo's CourseNode.currency typePolicy parses the JSONString at read time.
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

const truncatedBrief = computed<string>(() => {
  const raw = courseData.value?.brief ?? ''
  if (!raw) return ''
  const text = String(raw).replace(/<[^>]*>/g, '').trim()
  return text.length > 260 ? text.slice(0, 260) + '…' : text
})

const isEnrolled = computed<boolean>(
  () => !!(courseData.value?.enrolled),
)

// ---------------------------------------------------------------------------
// Watch route params → reload
// ---------------------------------------------------------------------------
watch(
  () => route.params,
  (params) => { void loadCourse(params) },
  { immediate: true, deep: true },
)

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
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

function formatCount (n: number | null | undefined): string {
  const num = Number(n)
  if (!Number.isFinite(num)) return '0'
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
  return String(num)
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

function addToCart (): void {
  if (!courseData.value) return
  if (!auth.isAuthenticated) { redirectToLogin(); return }
  cart.addCourseToCart({ user: user.value, course: courseData.value })
  $q.notify({
    type: 'positive',
    position: 'top',
    message: 'تمت الإضافة إلى السلة',
    progress: true,
    timeout: 2200,
  })
}

function enrolNow (): void {
  if (!courseData.value) return
  if (!auth.isAuthenticated) { redirectToLogin(); return }
  cart.addCourseToCart({ user: user.value, course: courseData.value })
  void router.push({ name: 'cart' })
}

function continueToClassroom (): void {
  const pk = coursePK.value || courseData.value?.pk
  if (!pk) return
  window.location.href = `${location.origin}/classroom/#/class/${pk}/`
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  nextTick(() => {
    if (hero.value) {
      const handle = contourDrift(hero.value, { distance: '1.5%', duration: 32 })
      if (handle) motionHandles.value.push(handle)
    }
  })
})

onBeforeUnmount(() => {
  motionHandles.value.forEach((h) => h?.kill?.())
  motionHandles.value = []
})
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

  /* -------- Breadcrumb ---------------------------------------- */
  &__breadcrumb-wrap {
    padding-block: var(--ds-space-5) var(--ds-space-3);
  }

  /* -------- Hero ---------------------------------------------- */
  &__hero {
    position: relative;
    padding-block: var(--ds-space-6) var(--ds-space-10);
    background:
      radial-gradient(120% 80% at 85% 0%, rgba(50, 40, 115, 0.08), transparent 55%),
      var(--ds-surface);
  }

  &__hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-8);

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: var(--ds-space-10);
      align-items: start;
    }
  }

  &__hero-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__kicker {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-sm);
    letter-spacing: 0.14em;
    text-transform: none;
    color: var(--ds-brand-600);
    background: var(--ds-brand-50, rgba(50, 40, 115, 0.08));
    padding: 0.35em 0.9em;
    border-radius: var(--ds-radius-pill);
    align-self: flex-start;
    line-height: 1.2;
  }

  &__title {
    font-family: var(--ds-font-display, var(--ds-font-heading));
    font-weight: 700;
    font-size: clamp(2rem, 3.5vw + 1rem, 3.5rem);
    line-height: 1.15;
    color: var(--ds-ink, var(--ds-text));
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__summary {
    font-family: var(--ds-font-body);
    font-weight: 400;
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-taupe, var(--ds-text-muted));
    margin: 0;
    max-inline-size: 56ch;
  }

  &__summary-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    max-inline-size: 56ch;
  }

  /* -------- Meta row ------------------------------------------ */
  &__meta {
    list-style: none;
    margin: var(--ds-space-2) 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-5) var(--ds-space-6);

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      min-inline-size: 0;
    }
  }

  &__meta-avatar {
    inline-size: 2.25rem;
    block-size: 2.25rem;
    border-radius: 50%;
    overflow: hidden;
    background: var(--ds-surface-muted);
    border: 2px solid var(--ds-surface-elevated, #fff);
    box-shadow: var(--ds-shadow-xs);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img { inline-size: 100%; block-size: 100%; object-fit: cover; }
    span {
      font-family: var(--ds-font-heading);
      font-weight: 700;
      color: var(--ds-brand-700);
    }
  }

  &__meta-icon {
    color: var(--ds-brand-600);
    font-size: 1.1rem;
    line-height: 1;
  }

  &__meta-text {
    display: inline-flex;
    flex-direction: column;
    line-height: 1.25;
  }

  &__meta-label {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__meta-text strong {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    font-variant-numeric: tabular-nums;
  }

  /* -------- Hero aside / cover + sticky sidebar --------------- */
  &__hero-aside {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }

  &__cover {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: var(--ds-radius-lg);
    overflow: hidden;
    background: var(--ds-surface-muted);
    box-shadow: 0 24px 48px -24px rgba(27, 20, 16, 0.28), var(--ds-shadow-md);
    outline: 1px solid rgba(27, 20, 16, 0.06);

    img,
    &-fallback {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__enrol-sticky {
    @media (min-width: 960px) {
      position: sticky;
      inset-block-start: 120px;
    }
  }

  &__enrol-card {
    background: var(--ds-surface-elevated, #fff);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-5);
    box-shadow: var(--ds-shadow-sm);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: var(--ds-space-2);
    padding-block-end: var(--ds-space-3);
    border-block-end: 1px dashed var(--ds-border);
  }

  &__price-free {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-2xl);
    color: var(--ds-accent-300);
  }

  &__cta {
    font-family: var(--ds-font-heading);
  }

  &__cta-secondary {
    margin-block-start: calc(-1 * var(--ds-space-1));
  }

  &__enrol-meta {
    list-style: none;
    margin: var(--ds-space-2) 0 0;
    padding: var(--ds-space-3) 0 0;
    border-block-start: 1px solid var(--ds-border);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ds-space-3);

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2px;

      span {
        font-size: var(--ds-text-2xs, 0.6875rem);
        color: var(--ds-text-muted);
        letter-spacing: 0.02em;
      }
      strong {
        font-family: var(--ds-font-heading);
        font-weight: 700;
        font-size: var(--ds-text-sm);
        color: var(--ds-brand-700);
        font-variant-numeric: tabular-nums;
      }
    }
  }

  /* -------- Tabs --------------------------------------------- */
  &__tabs {
    margin-block-start: var(--ds-space-8);

    :deep(.ds-tabs__panels) {
      display: flex;
      flex-direction: column;
      gap: var(--ds-space-5);
      padding-block-start: var(--ds-space-6);
    }
  }

  /* -------- Related ------------------------------------------ */
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

/* Reduced-motion respect: the motion primitives already guard, but we
   also disable the sticky-translation on very short viewports. */
@media (max-height: 720px) and (min-width: 960px) {
  .course-details__enrol-sticky { position: static; }
}
</style>
