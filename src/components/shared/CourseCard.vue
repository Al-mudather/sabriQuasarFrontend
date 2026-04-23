<template>
  <!-- Loading skeleton -->
  <ds-skeleton
    v-if="loading"
    type="card"
    :width="variant === 'detail' ? '100%' : null"
  />

  <!-- Error / empty state -->
  <ds-empty-state
    v-else-if="!course"
    variant="error"
    size="sm"
    :title="$t ? $t('الدورة غير متاحة') : 'الدورة غير متاحة'"
    :body="$t ? $t('تعذر تحميل بيانات الدورة') : 'تعذر تحميل بيانات الدورة'"
  />

  <!-- Main card -->
  <ds-card
    v-else
    :interactive="true"
    :to="resolvedTo"
    :elevation="variant === 'detail' ? 'md' : 'sm'"
    :variant="variant === 'featured' ? 'indigo-hero' : 'default'"
    class="course-card"
    :class="[
      `course-card--${variant}`,
      { 'course-card--featured-bleed': variant === 'featured' }
    ]"
  >
    <!-- =========== Media =========== -->
    <template #media>
      <div class="course-card__media" :class="`course-card__media--${variant}`">
        <img
          v-if="course.coverImage"
          :src="course.coverImage"
          :alt="course.name || ''"
          class="course-card__cover"
          loading="lazy"
        />
        <div
          v-else
          class="course-card__cover course-card__cover--placeholder"
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="course-card__cover-svg">
            <defs>
              <linearGradient id="ccph-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1B1E50"/>
                <stop offset="55%" stop-color="#322873"/>
                <stop offset="100%" stop-color="#4F46B8"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#ccph-grad)"/>
            <g fill="none" stroke="#F6F1EA" stroke-width="1" opacity="0.18">
              <path d="M0,80 C120,60 240,120 400,90"/>
              <path d="M0,150 C140,130 260,180 400,160"/>
              <path d="M0,220 C130,200 270,250 400,230"/>
            </g>
            <text
              x="200" y="170"
              text-anchor="middle"
              font-family="Tajawal, system-ui, sans-serif"
              font-weight="700"
              font-size="86"
              fill="#F6F1EA"
              opacity="0.28"
              letter-spacing="6"
            >STC</text>
          </svg>
        </div>

        <!-- Featured overlay gradient + overlaid body -->
        <div v-if="variant === 'featured'" class="course-card__featured-wrap">
          <div class="course-card__featured-gradient" aria-hidden="true"></div>
          <div class="course-card__featured-body">
            <span class="course-card__kicker">
              {{ $t ? $t('الدورة الأكثر طلباً') : 'الدورة الأكثر طلباً' }}
            </span>
            <h3 class="course-card__title course-card__title--featured">
              {{ course.name }}
            </h3>
            <p v-if="course.description" class="course-card__desc course-card__desc--featured">
              {{ course.description }}
            </p>
            <div class="course-card__featured-foot">
              <span class="course-card__price course-card__price--featured">
                <span class="course-card__price-amount">{{ formattedPrice }}</span>
                <span class="course-card__price-currency">{{ currencyLabel }}</span>
              </span>
              <span class="course-card__more-link">
                {{ $t ? $t('اعرف المزيد') : 'اعرف المزيد' }}
                <span aria-hidden="true">←</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Public: instructor avatar overlay -->
        <div
          v-else-if="variant === 'public' && course.instructor"
          class="course-card__avatar"
          :title="course.instructor.name"
        >
          <img
            v-if="course.instructor.avatar"
            :src="course.instructor.avatar"
            :alt="course.instructor.name || ''"
          />
          <span v-else class="course-card__avatar-fallback" aria-hidden="true">
            {{ avatarInitial }}
          </span>
        </div>

        <!-- Enrolled: progress-ring indicator -->
        <div
          v-else-if="variant === 'enrolled'"
          class="course-card__ring"
          :aria-label="progressLabel"
        >
          <svg viewBox="0 0 40 40" width="48" height="48" aria-hidden="true">
            <circle cx="20" cy="20" r="16" class="course-card__ring-track" />
            <circle
              cx="20"
              cy="20"
              r="16"
              class="course-card__ring-fill"
              :style="ringStyle"
            />
          </svg>
          <span class="course-card__ring-value">{{ clampedProgress }}%</span>
        </div>
      </div>
    </template>

    <!-- =========== Body =========== -->
    <!-- Featured renders body overlaid on media; other variants use normal body -->
    <template v-if="variant !== 'featured'">
      <!-- Category / kicker -->
      <span
        v-if="course.category"
        class="course-card__category"
      >{{ course.category }}</span>

      <!-- Title -->
      <h3
        class="course-card__title"
        :class="{ 'course-card__title--detail': variant === 'detail' }"
      >
        {{ course.name }}
      </h3>

      <!-- Description (1 line public/enrolled, full on detail) -->
      <p
        v-if="course.description"
        class="course-card__desc"
        :class="{ 'course-card__desc--detail': variant === 'detail' }"
      >
        {{ course.description }}
      </p>

      <!-- Detail: rating stars prominent -->
      <div v-if="variant === 'detail' && course.rating" class="course-card__rating-row">
        <span class="course-card__stars" aria-hidden="true">
          <span
            v-for="n in 5"
            :key="n"
            class="course-card__star"
            :class="{ 'course-card__star--on': n <= Math.round(course.rating) }"
          >★</span>
        </span>
        <span class="course-card__rating-value">{{ formatNum(course.rating, 1) }}</span>
        <span v-if="course.ratingCount" class="course-card__rating-count">
          ({{ formatNum(course.ratingCount) }})
        </span>
      </div>

      <!-- Hairline -->
      <div class="course-card__hairline" aria-hidden="true"></div>

      <!-- Metadata row -->
      <ul class="course-card__meta">
        <li v-if="course.duration">
          <span class="course-card__meta-icon" aria-hidden="true">◷</span>
          <span>{{ course.duration }}</span>
        </li>
        <li v-if="course.lessonCount">
          <span class="course-card__meta-icon" aria-hidden="true">▤</span>
          <span>{{ formatNum(course.lessonCount) }} {{ $t ? $t('درس') : 'درس' }}</span>
        </li>
        <li v-if="course.level">
          <span class="course-card__meta-icon" aria-hidden="true">◆</span>
          <span>{{ course.level }}</span>
        </li>
        <li v-if="variant === 'detail' && course.studentCount">
          <span class="course-card__meta-icon" aria-hidden="true">◉</span>
          <span>{{ formatNum(course.studentCount) }} {{ $t ? $t('طالب') : 'طالب' }}</span>
        </li>
      </ul>
    </template>

    <!-- =========== Footer =========== -->
    <template v-if="variant !== 'featured'" #footer>
      <!-- Enrolled: progress bar + continue CTA -->
      <template v-if="variant === 'enrolled'">
        <ds-progress-bar
          :value="clampedProgress"
          variant="indigo"
          size="sm"
          :label="progressLabel"
        />
        <ds-button
          variant="primary"
          size="sm"
          full-width
          class="course-card__cta"
          @click.stop="onCta"
        >
          {{ $t ? $t('متابعة الدورة') : 'متابعة الدورة' }}
        </ds-button>
      </template>

      <!-- Detail: prominent terracotta CTA -->
      <template v-else-if="variant === 'detail'">
        <div class="course-card__detail-foot">
          <span class="course-card__price course-card__price--detail">
            <span class="course-card__price-amount">{{ formattedPrice }}</span>
            <span class="course-card__price-currency">{{ currencyLabel }}</span>
            <span
              v-if="hasDiscount"
              class="course-card__price-original"
            >{{ formattedOriginalPrice }}</span>
          </span>
          <ds-button
            variant="accent"
            size="lg"
            full-width
            class="course-card__cta"
            @click.stop="onCta"
          >
            {{ $t ? $t('سجل في الدورة') : 'سجل في الدورة' }}
          </ds-button>
        </div>
      </template>

      <!-- Public: price + register button -->
      <template v-else>
        <div class="course-card__public-foot">
          <span class="course-card__price">
            <template v-if="isFree">
              <span class="course-card__price-free">مجاني</span>
            </template>
            <template v-else>
              <span class="course-card__price-amount">{{ formattedPrice }}</span>
              <span class="course-card__price-currency">{{ currencyLabel }}</span>
              <span
                v-if="hasDiscount"
                class="course-card__price-original"
              >{{ formattedOriginalPrice }}</span>
            </template>
          </span>
          <ds-button
            variant="primary"
            size="sm"
            class="course-card__cta"
            @click.stop="onCta"
          >
            {{ $t ? $t('سجل الآن') : 'سجل الآن' }}
          </ds-button>
        </div>
      </template>
    </template>
  </ds-card>
</template>

<script>
// Unified CourseCard — merges legacy utils/courseCard, MyCourses/courseCard,
// courseDetails/courseMainCard into one component with a `variant` prop.
//
// Phase 4 note: real API images only; inline SVG placeholder is used when
// course.coverImage is absent. No external stock photo services.

/** @typedef {import('src/features/courses/types').Course} Course */
/** @typedef {import('src/features/courses/types').CourseDetail} CourseDetail */
/** @typedef {import('src/features/courses/types').CoursePricing} CoursePricing */

/**
 * The CourseCard accepts a normalised view-model shape rather than the raw
 * GraphQL Course node, because it is consumed by Home / Courses listing /
 * Cart / MyCourses with slightly different source shapes. Callers flatten
 * the domain `Course` (see src/features/courses/types.ts) into this shape.
 *
 * @typedef {Object} CourseCardPrice
 * @property {number} [current]
 * @property {number} [original]
 * @property {string} [currency]
 *
 * @typedef {Object} CourseCardInstructor
 * @property {string} [name]
 * @property {string} [avatar]
 *
 * @typedef {Object} CourseCardProps
 * @property {string} [id]
 * @property {number|string} [pk]
 * @property {string} [name]
 * @property {string} [coverImage]
 * @property {string} [category]
 * @property {string} [description]
 * @property {string} [duration]
 * @property {number} [lessonCount]
 * @property {string} [level]
 * @property {number} [rating]
 * @property {number} [ratingCount]
 * @property {number} [studentCount]
 * @property {number} [progress]
 * @property {CourseCardInstructor} [instructor]
 * @property {CourseCardPrice} [price]
 */

import DsCard from 'src/design-system/components/DsCard.vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsBadge from 'src/design-system/components/DsBadge.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsProgressBar from 'src/design-system/components/DsProgressBar.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'

export default {
  name: 'CourseCard',

  components: {
    DsCard,
    DsButton,
    // eslint-disable-next-line vue/no-unused-components
    DsBadge,
    DsSkeleton,
    DsProgressBar,
    DsEmptyState
  },

  props: {
    variant: {
      type: String,
      default: 'public',
      validator: v => ['public', 'enrolled', 'detail', 'featured'].includes(v)
    },
    course: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: null
    }
  },

  computed: {
    isArabic () {
      // best-effort; falls back to ar when i18n not available
      const loc = this.$i18n && this.$i18n.locale
      return loc ? String(loc).toLowerCase().startsWith('ar') : true
    },

    hasCoverImage () {
      return !!(this.course && this.course.coverImage)
    },

    resolvedTo () {
      if (this.to) return this.to
      if (!this.course) return null
      if (this.course.pk && this.course.name) {
        return {
          name: 'course-details',
          params: {
            name: String(this.course.name),
            pk: this.course.pk,
            id: this.course.id || this.course.pk
          }
        }
      }
      return null
    },

    clampedProgress () {
      const p = this.course && Number(this.course.progress)
      if (!Number.isFinite(p)) return 0
      return Math.max(0, Math.min(100, Math.round(p)))
    },

    progressLabel () {
      const tx = this.$t ? this.$t('التقدم') : 'التقدم'
      return `${tx}: ${this.clampedProgress}%`
    },

    ringStyle () {
      // circle r=16 → circumference = 2πr ≈ 100.53
      const circ = 2 * Math.PI * 16
      const offset = circ * (1 - this.clampedProgress / 100)
      return {
        strokeDasharray: `${circ}`,
        strokeDashoffset: `${offset}`
      }
    },

    avatarInitial () {
      const name = this.course && this.course.instructor && this.course.instructor.name
      return name ? String(name).trim().charAt(0) : '?'
    },

    currencyLabel () {
      return (this.course && this.course.price && this.course.price.currency) || ''
    },

    hasDiscount () {
      if (!this.course || !this.course.price) return false
      const cur = Number(this.course.price.current)
      const orig = Number(this.course.price.original)
      return Number.isFinite(cur) && Number.isFinite(orig) && orig > cur
    },

    isFree () {
      if (!this.course || !this.course.price) return true
      const cur = Number(this.course.price.current)
      return !Number.isFinite(cur) || cur <= 0
    },

    formattedPrice () {
      return this.formatPrice(this.course && this.course.price && this.course.price.current)
    },

    formattedOriginalPrice () {
      return this.formatPrice(this.course && this.course.price && this.course.price.original)
    }
  },

  methods: {
    formatNum (n, fractionDigits) {
      if (!Number.isFinite(Number(n))) return ''
      const locale = this.isArabic ? 'ar-EG' : 'en-US'
      const opts = {}
      if (Number.isFinite(fractionDigits)) {
        opts.minimumFractionDigits = fractionDigits
        opts.maximumFractionDigits = fractionDigits
      }
      try {
        return new Intl.NumberFormat(locale, opts).format(Number(n))
      } catch (_) {
        return String(n)
      }
    },

    formatPrice (n) {
      const num = Number(n)
      if (!Number.isFinite(num)) return '—'
      const locale = this.isArabic ? 'ar-EG' : 'en-US'
      try {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(num)
      } catch (_) {
        return String(num)
      }
    },

    onCta (e) {
      this.$emit('cta-click', { course: this.course, variant: this.variant, event: e })
    }
  }
}
</script>

<style lang="scss" scoped>
/* =========================================================================
   CourseCard — unified component styling
   All colors via CSS custom properties; RTL-safe logical properties.
   ========================================================================= */

.course-card {
  block-size: 100%;
  line-height: 1.5;
  display: flex;
  flex-direction: column;

  /* ---------- Media ---------- */
  &__media {
    position: relative;
    overflow: hidden;
    background: var(--ds-surface-muted);

    &--public,
    &--enrolled {
      aspect-ratio: 16 / 10;
      border-start-start-radius: 14px;
      border-start-end-radius: 14px;
    }

    &--detail {
      aspect-ratio: 4 / 3;
    }

    &--featured {
      aspect-ratio: 4 / 5;
    }
  }

  &__cover {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.92) contrast(1.05);
    transition: transform var(--ds-duration-slow) var(--ds-ease-out);
  }

  &:hover &__cover {
    transform: scale(1.03);
  }

  /* ---------- Public: instructor avatar ---------- */
  &__avatar {
    position: absolute;
    inset-block-end: -24px;
    inset-inline-end: var(--ds-space-4);
    inline-size: 48px;
    block-size: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--ds-cream, var(--ds-surface-elevated));
    background: var(--ds-surface-muted);
    box-shadow: var(--ds-shadow-xs);
    z-index: 2;

    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }

  &__avatar-fallback {
    display: flex;
    inline-size: 100%;
    block-size: 100%;
    align-items: center;
    justify-content: center;
    font-family: var(--ds-font-heading);
    font-weight: 600;
    color: var(--ds-brand-700);
    background: var(--ds-surface-muted);
  }

  /* ---------- Enrolled: progress ring ---------- */
  &__ring {
    position: absolute;
    inset-block-end: -24px;
    inset-inline-end: var(--ds-space-4);
    inline-size: 48px;
    block-size: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--ds-surface-elevated);
    border-radius: 50%;
    box-shadow: var(--ds-shadow-xs);
    z-index: 2;

    svg {
      position: absolute;
      inset: 0;
      transform: rotate(-90deg);
    }
  }

  &__ring-track {
    fill: none;
    stroke: rgba(27, 20, 16, 0.08);
    stroke-width: 3.5;
  }

  &__ring-fill {
    fill: none;
    stroke: var(--ds-brand-600);
    stroke-width: 3.5;
    stroke-linecap: round;
    transition: stroke-dashoffset 600ms var(--ds-ease-out);
  }

  &__ring-value {
    font-family: var(--ds-font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--ds-brand-700);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  /* ---------- Body text ---------- */
  &__category {
    font-family: var(--ds-font-body);
    font-weight: 500;
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
    letter-spacing: 0.02em;
    text-transform: none;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: 1.0625rem !important; // 17px — hard cap, overrides DsCard body typography
    color: var(--ds-ink, var(--ds-text));
    line-height: 1.35 !important;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-block-size: calc(2 * 1.35 * 1.0625rem); // reserve 2 lines → equal card heights

    &--detail {
      font-weight: 700;
      font-size: 28px;
      line-height: 1.3;
      -webkit-line-clamp: 3;
    }

    &--featured {
      font-family: var(--ds-font-tajawal, var(--ds-font-heading));
      font-weight: 600;
      font-size: var(--ds-text-lg);
      color: var(--ds-cream, var(--ds-text-on-indigo));
      line-height: 1.35;
      -webkit-line-clamp: 2;
    }
  }

  &__desc {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    line-height: 1.85;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &--detail {
      -webkit-line-clamp: 4;
    }

    &--featured {
      color: var(--ds-cream-taupe, rgba(255, 255, 255, 0.78));
      -webkit-line-clamp: 2;
      font-weight: 400;
    }
  }

  &__hairline {
    block-size: 1px;
    background: var(--ds-border);
    opacity: 0.6;
    margin-block: var(--ds-space-2);
  }

  /* ---------- Meta ---------- */
  &__meta {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-weight: 500;
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      min-inline-size: 0;
    }
  }

  &__meta-icon {
    color: var(--ds-brand-600);
    font-size: 0.9em;
    line-height: 1;
  }

  /* ---------- Rating ---------- */
  &__rating-row {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
  }

  &__stars {
    display: inline-flex;
    gap: 1px;
    color: rgba(27, 20, 16, 0.18);
    font-size: 1rem;
    line-height: 1;
  }

  &__star--on {
    color: var(--ds-accent-300);
  }

  &__rating-value {
    font-family: var(--ds-font-mono);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--ds-ink, var(--ds-text));
  }

  &__rating-count {
    color: var(--ds-text-muted);
  }

  /* ---------- Price ---------- */
  &__price {
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
  }

  &__price-amount {
    font-family: var(--ds-font-mono);
    font-weight: 600;
    font-size: var(--ds-text-lg);
    color: var(--ds-accent-600, var(--ds-accent-300));
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__price-currency {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__price-original {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    text-decoration: line-through;
    margin-inline-start: var(--ds-space-1);
  }

  &__price-free {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-md);
    color: var(--ds-brand-600);
    letter-spacing: 0.02em;
  }

  /* ---------- Footer rows ---------- */
  &__public-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    inline-size: 100%;
  }

  &__detail-foot {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    inline-size: 100%;
  }

  &__price--detail &__price-amount {
    font-size: var(--ds-text-3xl, 1.875rem);
  }

  /* ---------- Variant: detail (landscape) ---------- */
  &--detail {
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: stretch;

    /* DsCard stacks media / body / footer vertically via its internal layout;
       we force horizontal on wide screens via CSS grid on the root. */
    :deep(.ds-card__media) {
      grid-column: 1 / 2;
      grid-row: 1 / span 3;
    }
    :deep(.ds-card__body) {
      grid-column: 2 / 3;
    }
    :deep(.ds-card__footer) {
      grid-column: 2 / 3;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      :deep(.ds-card__media),
      :deep(.ds-card__body),
      :deep(.ds-card__footer) {
        grid-column: 1 / -1;
      }
    }
  }

  /* ---------- Variant: featured (bleed) ---------- */
  &--featured {
    position: relative;
    color: var(--ds-cream, var(--ds-text-on-indigo));

    /* Zero-out body & footer padding — body is overlaid on media. */
    :deep(.ds-card__body) {
      display: none;
    }
    :deep(.ds-card__footer) {
      display: none;
    }
    :deep(.ds-card__media) {
      block-size: 100%;
    }
  }

  &__featured-gradient {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    block-size: 62%;
    background: linear-gradient(
      to top,
      var(--ds-brand-700, rgba(27, 30, 80, 0.88)) 0%,
      rgba(27, 30, 80, 0.55) 45%,
      transparent 100%
    );
    pointer-events: none;
  }

  &__featured-body {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    padding: var(--ds-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    z-index: 2;
  }

  &__kicker {
    font-family: var(--ds-font-body);
    font-weight: 600;
    font-size: var(--ds-text-2xs, 0.6875rem);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ds-accent-300);
  }

  &__featured-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    margin-block-start: var(--ds-space-2);
  }

  &__price--featured &__price-amount {
    color: var(--ds-accent-300);
  }
  &__price--featured &__price-currency {
    color: var(--ds-cream-taupe, rgba(255, 255, 255, 0.78));
  }

  &__more-link {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-on-indigo);
    opacity: 0.9;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: opacity var(--ds-duration-fast) var(--ds-ease-out);
  }

  &:hover &__more-link {
    opacity: 1;
  }

  /* ---------- Public/Enrolled body — tight, uniform spacing ---------- */
  &--public :deep(.ds-card__body),
  &--enrolled :deep(.ds-card__body) {
    padding-block-start: calc(var(--ds-space-4) + 12px);
    padding-inline: var(--ds-space-5);
    padding-block-end: var(--ds-space-3);
    gap: var(--ds-space-2);
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-block-size: 0;
  }

  &--public :deep(.ds-card__footer),
  &--enrolled :deep(.ds-card__footer) {
    margin-block-start: auto;
    padding-inline: var(--ds-space-5);
    padding-block-end: var(--ds-space-4);
  }

  /* ---------- CTA block tweaks ---------- */
  &__cta {
    white-space: nowrap;
  }

  /* ---------- Placeholder cover (no API image) ---------- */
  &__cover--placeholder {
    inline-size: 100%;
    block-size: 100%;
    display: block;
    position: relative;
  }

  &__cover-svg {
    inline-size: 100%;
    block-size: 100%;
    display: block;
  }

  /* ---------- Public/enrolled: enforce rigid card layout ---------- */
  &--public,
  &--enrolled {
    display: flex;
    flex-direction: column;

    :deep(.ds-card__body) {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: var(--ds-space-2);
      min-inline-size: 0;
    }

    :deep(.ds-card__footer) {
      margin-block-start: auto;
    }
  }

  /* Hard clamp title/desc regardless of DsCard defaults */
  &--public &__title,
  &--enrolled &__title {
    font-size: var(--ds-text-md) !important;
    line-height: 1.35;
    max-inline-size: 100%;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  &--public &__desc,
  &--enrolled &__desc {
    font-size: var(--ds-text-sm) !important;
  }
}

/* Reduced motion: disable hover scale on cover */
@media (prefers-reduced-motion: reduce) {
  .course-card__cover { transition: none; }
  .course-card:hover .course-card__cover { transform: none; }
  .course-card__ring-fill { transition: none; }
}
</style>
