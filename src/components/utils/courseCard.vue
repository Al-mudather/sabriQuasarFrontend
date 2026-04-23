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
        <ds-badge v-if="course.enrolled" variant="success" class="public-course-card__badge">
          {{ $t('مشترك') }}
        </ds-badge>
      </div>
    </template>

    <h3 class="public-course-card__title">{{ displayTitle }}</h3>

    <div class="public-course-card__price">
      <span class="currency">{{ currency }}</span>
      <span class="amount">{{ formattedPrice }}</span>
    </div>

    <template #footer>
      <div class="public-course-card__actions">
        <ds-button
          v-if="course.enrolled"
          variant="accent"
          full-width
          @click.native.stop="goToClassroom"
        >
          {{ $t('الى الدرس') }}
        </ds-button>
        <ds-button
          v-else
          variant="primary"
          full-width
          @click.native.stop="addToCart"
        >
          {{ $t('إضافة للسلة') }}
        </ds-button>
        <ds-button
          variant="ghost"
          size="sm"
          full-width
          @click.native.stop="goToDetails"
        >
          {{ $t('التفاصيل') }}
        </ds-button>
      </div>
    </template>
  </ds-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

const formatPrice = (num, digits = 3) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' }
  ]
  if (!Number.isFinite(num) || num === 0) return String(num)
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup.slice().reverse().find(it => num >= it.value)
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export default {
  name: 'courseCard',
  props: ['name', 'instructor', 'unit', 'price', 'course'],

  data () {
    return { FORMAT_THE_IAMGE_URL }
  },

  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('settings', ['isEnglish', 'currency']),

    displayTitle () { return this.name || this.course.title },

    formattedPrice () {
      try {
        const prices = JSON.parse(this.course.currency)
        const raw = parseFloat(prices[this.currency])
        return formatPrice(raw)
      } catch (e) {
        return '—'
      }
    }
  },

  methods: {
    ...mapActions('shoppingCart', ['setShoppingCartDataListAction']),

    goToDetails () {
      this.$router.push({
        name: 'course-details',
        params: { pk: this.course.pk, name: this.course.title, id: this.course.id }
      })
    },

    goToClassroom () {
      window.location.href = `${location.origin}/classroom/#/class/${this.course.pk}/`
    },

    addToCart () {
      this.setShoppingCartDataListAction({ user: this.user, course: this.course })
      this.$router.push({ name: 'cart' })
    }
  }
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
    gap: 0.25rem;
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
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}
</style>
