<template>
  <aside class="enrol-rail">
    <!-- Cover ------------------------------------------------------ -->
    <figure class="enrol-rail__cover">
      <img
        v-if="courseData && (courseData.cover || courseData.profile)"
        :src="FORMAT_THE_IAMGE_URL((courseData.cover || courseData.profile) as string)"
        :alt="courseData.title || ''"
      />
      <svg
        v-else
        viewBox="0 0 400 300"
        class="enrol-rail__cover-fallback"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="enrolCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#322873"/>
            <stop offset="100%" stop-color="#1f1847"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#enrolCoverGrad)"/>
        <path d="M0 230 Q 100 200 200 220 T 400 210 L 400 300 L 0 300 Z" fill="rgba(246,241,234,0.08)"/>
        <path d="M0 250 Q 120 225 240 245 T 400 235 L 400 300 L 0 300 Z" fill="rgba(246,241,234,0.06)"/>
      </svg>
    </figure>

    <!-- Card ------------------------------------------------------- -->
    <div class="enrol-rail__card">
      <!-- Price --------------------------------------------------- -->
      <div class="enrol-rail__price" v-if="courseData">
        <price-display
          v-if="hasPrice"
          :amount="currentPrice ?? 0"
          :currency="selectedCurrency"
          size="xl"
          variant="terracotta"
        />
        <span
          v-else-if="courseData.isPaid === false"
          class="enrol-rail__price-free"
        >{{ $t('مجاني') }}</span>
        <ds-skeleton v-else shape="line" width="8ch" height="2rem" />
      </div>
      <ds-skeleton v-else shape="line" width="8ch" height="2rem" />

      <!-- CTAs ---------------------------------------------------- -->
      <ds-button
        v-if="isEnrolled"
        variant="primary"
        size="lg"
        full-width
        class="enrol-rail__cta"
        @click="emitContinue"
      >
        {{ $t('متابعة الدورة') }}
      </ds-button>

      <template v-else>
        <ds-button
          variant="accent"
          size="lg"
          full-width
          class="enrol-rail__cta"
          :disabled="!courseData"
          @click="emitEnrol"
        >
          {{ $t('سجل في الدورة') }}
        </ds-button>
        <ds-button
          variant="ghost"
          size="md"
          full-width
          class="enrol-rail__cta-secondary"
          :disabled="!courseData"
          @click="emitAddToCart"
        >
          {{ $t('أضف إلى السلة') }}
        </ds-button>
      </template>

      <!-- Guarantees ---------------------------------------------- -->
      <p class="enrol-rail__guarantee">{{ $t('وصول مدى الحياة') }}</p>

      <!-- Actions trio -------------------------------------------- -->
      <div class="enrol-rail__actions">
        <button
          type="button"
          class="enrol-rail__action"
          @click="showCoupon = !showCoupon"
        >
          <span aria-hidden="true">🏷</span>
          {{ $t('كود خصم') }}
        </button>
        <button
          type="button"
          class="enrol-rail__action"
          @click="emitShare"
        >
          <span aria-hidden="true">↗</span>
          {{ $t('مشاركة') }}
        </button>
        <button
          type="button"
          class="enrol-rail__action"
          @click="emitGift"
        >
          <span aria-hidden="true">◈</span>
          {{ $t('أهدِ الدورة') }}
        </button>
      </div>

      <!-- Coupon drawer ------------------------------------------- -->
      <div v-if="showCoupon" class="enrol-rail__coupon">
        <div class="enrol-rail__coupon-row">
          <ds-input
            v-model="couponInput"
            :placeholder="$t('أدخل كود الخصم')"
            :disabled="couponApplied"
          />
          <ds-button
            variant="ghost"
            size="md"
            :disabled="!couponInput || couponApplied"
            @click="applyCoupon"
          >
            {{ couponApplied ? $t('مطبَّق') : $t('تطبيق') }}
          </ds-button>
        </div>
        <p v-if="couponApplied" class="enrol-rail__coupon-hint">
          <span aria-hidden="true">✓</span>
          {{ $t('تم تطبيق الكود') }} ({{ couponInput }})
        </p>
      </div>

      <!-- Includes micro-list ------------------------------------- -->
      <ul class="enrol-rail__includes">
        <li v-if="courseData && courseData.courseHours">
          <span aria-hidden="true">◷</span>
          <span>{{ courseData.courseHours }} {{ $t('ساعة من الدروس') }}</span>
        </li>
        <li v-if="lessonTotal">
          <span aria-hidden="true">▤</span>
          <span>{{ lessonTotal }} {{ $t('درس') }}</span>
        </li>
        <li v-if="unitTotal">
          <span aria-hidden="true">⌘</span>
          <span>{{ unitTotal }} {{ $t('وحدات') }}</span>
        </li>
        <li>
          <span aria-hidden="true">★</span>
          <span>{{ $t('شهادة إتمام') }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsInput from 'src/design-system/components/DsInput.vue'
import PriceDisplay from 'src/components/shared/PriceDisplay.vue'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import type { CourseDetail } from 'src/types/courses/types'

interface Props {
  courseData: CourseDetail | null
  isEnrolled: boolean
  hasPrice: boolean
  currentPrice: number | null
  selectedCurrency: string
  lessonTotal: number
  unitTotal: number
}

const props = defineProps<Props>()
void props

const emit = defineEmits<{
  (e: 'enrol'): void
  (e: 'add-to-cart'): void
  (e: 'continue-to-classroom'): void
  (e: 'share'): void
  (e: 'gift'): void
  (e: 'apply-coupon', code: string): void
}>()

const showCoupon = ref(false)
const couponInput = ref('')
const couponApplied = ref(false)

function emitEnrol(): void { emit('enrol') }
function emitAddToCart(): void { emit('add-to-cart') }
function emitContinue(): void { emit('continue-to-classroom') }
function emitShare(): void { emit('share') }
function emitGift(): void { emit('gift') }

function applyCoupon(): void {
  if (!couponInput.value || couponApplied.value) return
  couponApplied.value = true
  emit('apply-coupon', couponInput.value)
}

// keep computed unused-import suppression happy
void computed
</script>

<style lang="scss" scoped>
.enrol-rail {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__cover {
    position: relative;
    aspect-ratio: 16 / 10;
    border-radius: var(--ds-radius-lg);
    overflow: hidden;
    background: var(--ds-surface-muted);
    box-shadow: 0 24px 48px -24px rgba(27, 20, 16, 0.28), var(--ds-shadow-md);
    outline: 1px solid rgba(27, 20, 16, 0.06);
    margin: 0;

    img,
    &-fallback {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__card {
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

  &__cta { font-family: var(--ds-font-heading); }
  &__cta-secondary { margin-block-start: calc(-1 * var(--ds-space-1)); }

  &__guarantee {
    margin: var(--ds-space-1) 0 0;
    text-align: center;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-2);
    padding-block-start: var(--ds-space-3);
    border-block-start: 1px solid var(--ds-border);
  }

  &__action {
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-brand-600);
    padding: var(--ds-space-1) var(--ds-space-2);
    border-radius: var(--ds-radius-sm);
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { background: var(--ds-brand-50, rgba(50, 40, 115, 0.06)); }
    &:focus-visible { outline: 2px solid var(--ds-brand-600); outline-offset: 2px; }
    span[aria-hidden] { font-size: 1em; }
  }

  &__coupon {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    padding: var(--ds-space-3);
    background: var(--ds-surface-muted, rgba(50, 40, 115, 0.03));
    border-radius: var(--ds-radius-md);
    margin-block-start: calc(-1 * var(--ds-space-1));
  }

  &__coupon-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--ds-space-2);
  }

  &__coupon-hint {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: var(--ds-text-xs);
    color: var(--ds-success, #5a8e3a);
  }

  &__includes {
    list-style: none;
    margin: var(--ds-space-2) 0 0;
    padding: var(--ds-space-3) 0 0;
    border-block-start: 1px solid var(--ds-border);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      color: var(--ds-text);

      span[aria-hidden] {
        inline-size: 1.25rem;
        display: inline-flex;
        justify-content: center;
        color: var(--ds-brand-600);
      }
    }
  }
}
</style>
