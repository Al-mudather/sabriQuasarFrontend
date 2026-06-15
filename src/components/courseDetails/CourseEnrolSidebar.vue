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

      <button
        v-if="canPreview"
        type="button"
        class="enrol-rail__preview-trigger"
        :aria-label="$t('معاينة الدورة')"
        @click="emit('open-preview')"
      >
        <span class="enrol-rail__preview-ring" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <path
              d="M12 10 L22 16 L12 22 Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span class="enrol-rail__preview-label">{{ $t('معاينة الدورة') }}</span>
      </button>
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
        :loading="continueLoading"
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
          :loading="enrolLoading"
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
          :loading="cartLoading"
          @click="emitAddToCart"
        >
          {{ $t('أضف إلى السلة') }}
        </ds-button>
      </template>

      <!-- Actions -------------------------------------------------- -->
      <div class="enrol-rail__actions">
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
import DsButton from 'src/design-system/components/DsButton.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
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
  canPreview: boolean
  // Inline CTA spinners. The CTAs emit and the parent owns the async work
  // (enrol, add-to-cart, continue), so the parent drives these flags.
  enrolLoading?: boolean
  cartLoading?: boolean
  continueLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enrolLoading: false,
  cartLoading: false,
  continueLoading: false,
})
void props

const emit = defineEmits<{
  (e: 'enrol'): void
  (e: 'add-to-cart'): void
  (e: 'continue-to-classroom'): void
  (e: 'share'): void
  (e: 'gift'): void
  (e: 'open-preview'): void
}>()

function emitEnrol(): void { emit('enrol') }
function emitAddToCart(): void { emit('add-to-cart') }
function emitContinue(): void { emit('continue-to-classroom') }
function emitShare(): void { emit('share') }
function emitGift(): void { emit('gift') }
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

  // Preview trigger overlay on the cover image ------------------------------
  &__preview-trigger {
    position: absolute;
    inset: 0;
    appearance: none;
    border: 0;
    background: linear-gradient(
      to bottom,
      rgba(31, 24, 71, 0) 0%,
      rgba(31, 24, 71, 0.55) 100%
    );
    color: var(--ds-text-on-indigo, #f6f1ea);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    transition: background-color var(--ds-duration-base) var(--ds-ease-out);

    &:hover { background: rgba(31, 24, 71, 0.55); }
    &:focus-visible {
      outline: 2px solid var(--ds-accent-300);
      outline-offset: -4px;
    }
  }

  &__preview-ring {
    inline-size: 3.5rem;
    block-size: 3.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(246, 241, 234, 0.96);
    color: var(--ds-brand-700);
    box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.45);
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
  }

  &__preview-trigger:hover &__preview-ring {
    transform: scale(1.06);
  }

  &__preview-label {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-sm);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
