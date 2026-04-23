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
        <strong v-if="hasField('enrollmentCount')">
          {{ enrollmentCount }}<span class="unit" v-if="courseData.enrollmentCount >= 1000">K</span>
        </strong>
        <ds-skeleton v-else shape="line" width="3ch" />
      </li>
      <li>
        <span class="label">{{ $t('عدد الساعات') }}</span>
        <strong v-if="hasField('courseHours')">
          {{ courseData.courseHours }}<span class="unit">H</span>
        </strong>
        <ds-skeleton v-else shape="line" width="3ch" />
      </li>
      <li>
        <span class="label">{{ $t('اللغة') }}</span>
        <strong v-if="hasField('courseLanguage')">
          {{ $_.get(courseData, '[courseLanguage][languageName]') }}
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
        @click="AddTheCourseToTheBasket"
      >
        {{ $t('أمتلك الأن') }}
      </ds-button>

      <!-- Affiliate share -->
      <form
        v-if="$_.size(myMarketingCode) > 4"
        class="course-main-card__share"
        @submit="COPY_THE_SHARING_LINK"
      >
        <input id="shar-link" type="text" :value="PREPARE_THE_COURSE_SHARING_LINK" readonly />
        <button type="submit" class="course-main-card__share-btn" :aria-label="$t('انسخ الرابط')">
          <q-tooltip>{{ message }}</q-tooltip>
          <img src="~assets/img/copyed.png" alt="" />
        </button>
      </form>
    </template>
  </ds-card>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

const priceLookup = [
  { value: 1,    symbol: '' },
  { value: 1e3,  symbol: 'k' },
  { value: 1e6,  symbol: 'M' },
  { value: 1e9,  symbol: 'B' }
]

const formatPrice = (num, digits = 3) => {
  if (!Number.isFinite(num) || num === 0) return String(num)
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = priceLookup.slice().reverse().find(it => num >= it.value)
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export default {
  name: 'CourseMainCard',
  props: ['courseData'],

  setup () {
    const auth = useAuthStore()
    const settings = useSettingsStore()
    const cart = useCartStore()
    const pyramid = usePyramidStore()
    const { user, token } = storeToRefs(auth)
    const { currency } = storeToRefs(settings)
    const { myMarketingCode } = storeToRefs(pyramid)
    return { auth, settings, cart, pyramid, user, token, currency, myMarketingCode }
  },

  data () {
    return {
      FORMAT_THE_IAMGE_URL,
      message: this.$t('انسخ الرابط')
    }
  },

  mounted () {
    if (this.token) this.pyramid.fetchMyMarketingCode()
  },

  computed: {
    enrollmentCount () {
      const n = this.$_.get(this.courseData, '[enrollmentCount]', 0)
      return n >= 1000 ? Math.round(n / 1000) : n
    },

    hasPrice () {
      try {
        const prices = JSON.parse(this.courseData.currency)
        return Number.isFinite(parseFloat(prices[this.currency]))
      } catch (e) {
        return false
      }
    },

    formattedPrice () {
      if (!this.hasPrice) return ''
      const prices = JSON.parse(this.courseData.currency)
      return formatPrice(parseFloat(prices[this.currency]))
    },

    PREPARE_THE_COURSE_SHARING_LINK () {
      return `${location.origin}/#/course/${this.myMarketingCode}/${this.$_.get(this.$route, '[params][pk]')}/${this.$_.get(this.$route, '[params][id]')}`
    }
  },

  methods: {
    hasField (key) {
      return !!this.$_.get(this.courseData, `[${key}]`)
    },

    COPY_THE_SHARING_LINK (e) {
      e.preventDefault()
      const copyText = document.getElementById('shar-link')
      copyText.focus()
      copyText.select()
      copyToClipboard(copyText.value).then(() => {
        this.message = this.$t('تم النسخ')
        this.$q.notify({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'top',
          message: this.$t('تم النسخ')
        })
      }).catch(() => {})
    },

    AddTheCourseToTheBasket () {
      this.cart.addCourseToCart({ user: this.user, course: this.courseData })
      this.$router.push({ name: 'cart' })
    }
  }
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
