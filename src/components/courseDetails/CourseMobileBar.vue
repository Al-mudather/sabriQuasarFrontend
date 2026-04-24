<template>
  <Teleport to="body">
    <div class="mobile-bar" role="complementary">
      <price-display
        v-if="hasPrice"
        class="mobile-bar__price"
        :amount="currentPrice ?? 0"
        :currency="selectedCurrency"
        size="md"
        variant="terracotta"
      />
      <span
        v-else-if="courseData?.isPaid === false"
        class="mobile-bar__free"
      >{{ $t('مجاني') }}</span>
      <span v-else class="mobile-bar__free">—</span>

      <ds-button
        v-if="isEnrolled"
        variant="primary"
        size="lg"
        class="mobile-bar__cta"
        @click="emit('continue-to-classroom')"
      >
        {{ $t('متابعة الدورة') }}
      </ds-button>
      <ds-button
        v-else
        variant="accent"
        size="lg"
        class="mobile-bar__cta"
        @click="emit('enrol')"
      >
        {{ $t('سجل في الدورة') }}
      </ds-button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import DsButton from 'src/design-system/components/DsButton.vue'
import PriceDisplay from 'src/components/shared/PriceDisplay.vue'
import type { CourseDetail } from 'src/types/courses/types'

interface Props {
  courseData: CourseDetail | null
  isEnrolled: boolean
  hasPrice: boolean
  currentPrice: number | null
  selectedCurrency: string
}

const props = defineProps<Props>()
void props

const emit = defineEmits<{
  (e: 'enrol'): void
  (e: 'continue-to-classroom'): void
}>()
</script>

<style lang="scss" scoped>
.mobile-bar {
  display: none;

  @media (max-width: 767px) {
    display: flex;
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: 50;
    padding: var(--ds-space-3) var(--ds-space-4);
    padding-block-end: calc(var(--ds-space-3) + env(safe-area-inset-bottom, 0));
    background: var(--ds-surface-elevated);
    border-block-start: 1px solid var(--ds-border);
    box-shadow: 0 -4px 16px -8px rgba(27, 20, 16, 0.18);
    align-items: center;
    gap: var(--ds-space-3);
  }

  &__price { flex-shrink: 0; }

  &__free {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-lg);
    color: var(--ds-accent-300);
  }

  &__cta {
    flex: 1;
    min-inline-size: 0;
  }
}
</style>
