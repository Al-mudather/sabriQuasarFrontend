<template>
  <ds-card interactive class="public-course-card" @click="goToDetails">
    <template #media>
      <div class="public-course-card__media">
        <img
          v-if="course.cover"
          :src="FORMAT_THE_IAMGE_URL(course.cover)"
          :alt="displayTitle"
        />
        <img v-else src="~assets/img/moza.png" :alt="displayTitle" />
        <ds-badge v-if="isEnrolled" variant="success" class="public-course-card__badge">
          {{ $t('مشترك') }}
        </ds-badge>
      </div>
    </template>

    <h3 class="public-course-card__title">{{ displayTitle }}</h3>

    <div class="public-course-card__price">
      <template v-if="isFree">
        <span class="amount amount--free">{{ $t('مجاناً') }}</span>
      </template>
      <template v-else-if="displayAmount !== null">
        <span class="amount">{{ formatAmount(displayAmount) }}</span>
        <span class="currency">{{ displayCurrency }}</span>
      </template>
      <template v-else>
        <span class="amount amount--muted">{{ $t('السعر عند الطلب') }}</span>
      </template>
    </div>

    <template #footer>
      <div class="public-course-card__actions">
        <ds-button
          v-if="isEnrolled"
          variant="accent"
          full-width
          @click.stop="goToClassroom"
        >
          {{ $t('الى الدرس') }}
        </ds-button>
        <ds-button
          v-else
          variant="primary"
          full-width
          @click.stop="addToCart"
        >
          {{ $t('إضافة للسلة') }}
        </ds-button>
        <ds-button
          variant="ghost"
          size="sm"
          full-width
          @click.stop="goToDetails"
        >
          {{ $t('التفاصيل') }}
        </ds-button>
      </div>
    </template>
  </ds-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useCartStore } from 'src/stores/cart'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type {
  Course,
  CourseInSpeciality,
  CoursePricing,
  CurrencyCode,
} from 'src/types/courses/types'

// Accept both the rich `Course` shape (from `GetAllCourses`) and the lighter
// `CourseInSpeciality` shape (from `GetAllCoursesInSpeciality`). The card only
// reads fields common to both (pk, id, title, cover, courseFee, currency,
// enrolled) — TS enforces we don't reach for fields the narrower shape lacks.
interface Props {
  course: Course | CourseInSpeciality
  name?: string
  instructor?: string
  unit?: string
  price?: number | string | null
}

const props = defineProps<Props>()

const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const cart = useCartStore()
const { user } = storeToRefs(auth)
const { currency } = storeToRefs(settings)

const displayTitle = computed(() => props.name || props.course.title)

const isEnrolled = computed(() => Boolean(props.course.enrolled))

const pricing = computed<CoursePricing | null>(() => {
  // CourseNode.currency arrives pre-parsed from the Apollo typePolicy in
  // src/apollo/client.js. Treat it as CoursePricing directly.
  const raw = props.course.currency
  if (!raw || typeof raw !== 'object') return null
  return raw as CoursePricing
})

const selectedCurrency = computed<CurrencyCode>(
  () => (currency.value as CurrencyCode) || 'SDG',
)

const displayAmount = computed<number | null>(() => {
  const map = pricing.value
  if (map) {
    const priced = map[selectedCurrency.value]
    if (typeof priced === 'number' && Number.isFinite(priced) && priced > 0) {
      return priced
    }
  }
  // Fallback to CourseNode.courseFee (number) when the currency map is absent
  // or doesn't carry the selected currency.
  const fee = Number(props.course.courseFee)
  if (Number.isFinite(fee) && fee > 0) return fee
  return null
})

const isFree = computed(() => {
  if (displayAmount.value === 0) return true
  if (displayAmount.value === null) {
    // no pricing object and no fee — fall through to 'السعر عند الطلب'
    return false
  }
  return false
})

const displayCurrency = computed(() => selectedCurrency.value)

function formatAmount (n: number): string {
  try {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
  } catch {
    return String(n)
  }
}

function goToDetails (): void {
  router.push({
    name: 'course-details',
    params: { pk: String(props.course.pk), name: props.course.title, id: props.course.id },
  })
}

function goToClassroom (): void {
  window.location.href = `${location.origin}/classroom/#/class/${props.course.pk}/`
}

function addToCart (): void {
  if (!auth.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/courses' } })
    return
  }
  const c = props.course
  cart.addCourseToCart({
    user: user.value,
    course: {
      id: c.id,
      pk: c.pk,
      name: c.title,
      currency: (c.currency as Record<string, number> | null) ?? {},
    },
  })
  router.push({ name: 'cart' })
}
</script>

<style lang="scss" scoped>
.public-course-card {
  block-size: 100%;

  &__media {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
      transition: transform var(--ds-duration-slow) var(--ds-ease-out);
    }
  }

  &:hover &__media img { transform: scale(1.05); }

  &__badge {
    position: absolute;
    inset-block-start: var(--ds-space-3);
    inset-inline-start: var(--ds-space-3);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-block-size: calc(var(--ds-text-md) * var(--ds-leading-tight) * 2);
  }

  &__price {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35rem;
    .currency {
      font-size: var(--ds-text-sm);
      color: var(--ds-text-muted);
      font-family: var(--ds-font-body);
    }
    .amount {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-accent-600);
      font-variant-numeric: tabular-nums;

      &--free { color: var(--ds-success, #16a34a); }
      &--muted { color: var(--ds-text-muted); font-size: var(--ds-text-md); }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}
</style>
