<template>
  <ds-card elevation="md" class="course-main-card">
    <template #media>
      <div class="course-main-card__media">
        <img
          v-if="courseData && courseData.profile"
          :src="FORMAT_THE_IAMGE_URL(courseData.profile)"
          :alt="courseData.title || ''"
        />
        <img v-else src="~assets/img/Mask Group 5.png" alt="" />
      </div>
    </template>

    <!-- Meta row: enrollment / hours / language -->
    <ul class="course-main-card__meta">
      <li>
        <span class="label">{{ $t('الطلاب الملتحقين') }}</span>
        <strong v-if="courseData && courseData.enrollmentCount != null">
          {{ enrollmentCount }}<span class="unit" v-if="(courseData.enrollmentCount ?? 0) >= 1000">K</span>
        </strong>
        <ds-skeleton v-else shape="line" width="3ch" />
      </li>
      <li>
        <span class="label">{{ $t('عدد الساعات') }}</span>
        <strong v-if="courseData && courseData.courseHours">
          {{ courseData.courseHours }}<span class="unit">H</span>
        </strong>
        <ds-skeleton v-else shape="line" width="3ch" />
      </li>
      <li>
        <span class="label">{{ $t('اللغة') }}</span>
        <strong v-if="courseData && courseData.courseLanguage">
          {{ courseData.courseLanguage?.languageName }}
        </strong>
        <ds-skeleton v-else shape="line" width="4ch" />
      </li>
    </ul>

    <template #footer>
      <!-- Price block -->
      <div class="course-main-card__price">
        <span class="course-main-card__price-amount" v-if="hasPrice">
          {{ formattedPrice }}
        </span>
        <ds-skeleton v-else shape="line" width="5ch" height="1.5rem" />
        <span class="course-main-card__price-currency">{{ currency }}</span>
      </div>

      <!-- Primary CTA -->
      <ds-button
        variant="accent"
        size="lg"
        full-width
        :disabled="!hasPrice"
        @click="addTheCourseToTheBasket"
      >
        {{ $t('أمتلك الأن') }}
      </ds-button>

      <!-- Affiliate share -->
      <form
        v-if="myMarketingCode && myMarketingCode.length > 4"
        class="course-main-card__share"
        @submit="copyTheSharingLink"
      >
        <input id="shar-link" type="text" :value="prepareCourseSharingLink" readonly />
        <button type="submit" class="course-main-card__share-btn" :aria-label="$t('انسخ الرابط')">
          <q-tooltip>{{ message }}</q-tooltip>
          <img src="~assets/img/copyed.png" alt="" />
        </button>
      </form>
    </template>
  </ds-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type { CourseDetail, CoursePricing } from 'src/types/courses/types'

const priceLookup = [
  { value: 1,    symbol: '' },
  { value: 1e3,  symbol: 'k' },
  { value: 1e6,  symbol: 'M' },
  { value: 1e9,  symbol: 'B' },
]

function formatPrice (num: number, digits = 3): string {
  if (!Number.isFinite(num) || num === 0) return String(num)
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = [...priceLookup].reverse().find(it => num >= it.value)
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

const props = defineProps<{
  courseData: CourseDetail | null
}>()

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { t } = useI18n()

const auth = useAuthStore()
const settings = useSettingsStore()
const cart = useCartStore()
const pyramid = usePyramidStore()

const { user, token } = storeToRefs(auth)
const { currency } = storeToRefs(settings)
const { myMarketingCode } = storeToRefs(pyramid)

const message = ref(t('انسخ الرابط'))

onMounted(() => {
  if (token.value) pyramid.fetchMyMarketingCode()
})

const enrollmentCount = computed<number>(() => {
  const n = props.courseData?.enrollmentCount ?? 0
  return n >= 1000 ? Math.round(n / 1000) : n
})

const parsedPrices = computed<CoursePricing | null>(() => {
  const raw = props.courseData?.currency
  if (!raw) return null
  // Apollo typePolicy parses CourseNode.currency at read time — it is already
  // a plain object here. No JSON.parse needed.
  return raw as unknown as CoursePricing
})

const hasPrice = computed<boolean>(() => {
  const prices = parsedPrices.value
  if (!prices) return false
  const value = parseFloat(String((prices as Record<string, number>)[currency.value ?? '']))
  return Number.isFinite(value) && value > 0
})

const formattedPrice = computed<string>(() => {
  if (!hasPrice.value) return ''
  const prices = parsedPrices.value as Record<string, number>
  return formatPrice(parseFloat(String(prices[currency.value ?? ''])))
})

const prepareCourseSharingLink = computed<string>(() => {
  const pk = route.params.pk as string | undefined ?? ''
  const id = route.params.id as string | undefined ?? ''
  return `${location.origin}/#/course/${myMarketingCode.value}/${pk}/${id}`
})

function copyTheSharingLink (e: Event): void {
  e.preventDefault()
  const el = document.getElementById('shar-link') as HTMLInputElement | null
  if (!el) return
  el.focus()
  el.select()
  copyToClipboard(el.value)
    .then(() => {
      message.value = t('تم النسخ')
      $q.notify({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'top',
        message: t('تم النسخ'),
      })
    })
    .catch(() => { /* ignore */ })
}

function addTheCourseToTheBasket (): void {
  if (!props.courseData) return
  const c = props.courseData
  cart.addCourseToCart({
    user: user.value,
    course: {
      id: c.id,
      pk: c.pk,
      name: c.title,
      currency: (c.currency as Record<string, number> | null) ?? {},
    },
  })
  void router.push({ name: 'cart' })
}
</script>

<style lang="scss" scoped>
.course-main-card {
  &__media {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__meta {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--ds-space-2);

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--ds-space-2);
      background: var(--ds-surface-muted);
      border-radius: var(--ds-radius-md);
      min-inline-size: 0;

      .label {
        font-size: var(--ds-text-2xs);
        color: var(--ds-text-muted);
        margin-block-end: var(--ds-space-1);
      }
      strong {
        font-family: var(--ds-font-heading);
        font-size: var(--ds-text-lg);
        font-weight: var(--ds-weight-bold);
        color: var(--ds-brand-700);
        font-variant-numeric: tabular-nums;
      }
      .unit {
        font-size: 0.65em;
        color: var(--ds-accent-500);
        margin-inline-start: 0.1em;
      }
    }
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-block-end: var(--ds-space-3);
    padding-block: var(--ds-space-2);
    border-block-start: 1px dashed var(--ds-border);
    border-block-end: 1px dashed var(--ds-border);

    &-amount {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-accent-600);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    &-currency {
      font-size: var(--ds-text-sm);
      color: var(--ds-text-muted);
    }
  }

  &__share {
    margin-block-start: var(--ds-space-3);
    display: flex;
    gap: var(--ds-space-2);
    background: var(--ds-surface-muted);
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-1);

    input {
      flex: 1;
      min-inline-size: 0;
      background: transparent;
      border: 0;
      outline: 0;
      padding: var(--ds-space-2);
      font-size: var(--ds-text-xs);
      color: var(--ds-text-muted);
      font-family: monospace;
    }
  }

  &__share-btn {
    background: var(--ds-brand-600);
    border: 0;
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-2);
    cursor: pointer;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { background: var(--ds-brand-700); }
    img { block-size: 1rem; inline-size: auto; filter: brightness(0) invert(1); }
  }
}
</style>
