<template>
  <Teleport to="body">
    <div
      class="sticky-bar"
      :data-visible="visible"
      role="complementary"
      :aria-hidden="visible ? 'false' : 'true'"
    >
      <div class="sticky-bar__inner">
        <p class="sticky-bar__title" :title="courseData?.title ?? ''">
          {{ courseData?.title ?? '' }}
        </p>
        <div class="sticky-bar__right">
          <price-display
            v-if="hasPrice"
            class="sticky-bar__price"
            :amount="currentPrice ?? 0"
            :currency="selectedCurrency"
            size="sm"
            variant="terracotta"
          />
          <span v-else-if="courseData?.isPaid === false" class="sticky-bar__free">
            {{ $t('مجاني') }}
          </span>
          <ds-button
            v-if="isEnrolled"
            variant="primary"
            size="md"
            @click="emit('continue-to-classroom')"
          >
            {{ $t('متابعة الدورة') }}
          </ds-button>
          <ds-button
            v-else
            variant="accent"
            size="md"
            @click="emit('enrol')"
          >
            {{ $t('سجل في الدورة') }}
          </ds-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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

const emit = defineEmits<{
  (e: 'enrol'): void
  (e: 'continue-to-classroom'): void
}>()

const visible = ref(false)
let io: IntersectionObserver | null = null

function attach(): boolean {
  const target = document.querySelector<HTMLElement>('[data-hero-title]')
  if (!target) return false
  teardown()
  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      visible.value = !entry.isIntersecting
    },
    { threshold: 0 },
  )
  io.observe(target)
  return true
}

function teardown(): void {
  if (io) { io.disconnect(); io = null }
}

onMounted(() => {
  // Try immediately; if the hero H1 isn't in the DOM yet (v-if on courseData),
  // poll briefly until it mounts.
  if (attach()) return
  const start = Date.now()
  const timer = setInterval(() => {
    if (attach() || Date.now() - start > 10_000) clearInterval(timer)
  }, 200)
})

// Re-attach whenever courseData swaps (new course route).
watch(() => props.courseData?.id, () => {
  void Promise.resolve().then(() => attach())
})

onBeforeUnmount(teardown)
</script>

<style lang="scss" scoped>
.sticky-bar {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 50;
  background: var(--ds-surface-elevated);
  border-block-end: 1px solid var(--ds-border);
  box-shadow: var(--ds-shadow-sm);
  transform: translateY(-100%);
  transition: transform var(--ds-duration-base) var(--ds-ease-out);

  &[data-visible='true'] { transform: translateY(0); }

  &__inner {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: var(--ds-space-4);
    padding-block: var(--ds-space-3);
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);

    @media (min-width: 900px) {
      padding-inline: var(--ds-space-6);
    }
  }

  &__title {
    flex: 1;
    min-inline-size: 0;
    margin: 0;
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__right {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-3);
    flex-shrink: 0;
  }

  &__price { flex-shrink: 0; }

  &__free {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-md);
    color: var(--ds-accent-300);
  }

  // Hide on small screens; CourseMobileBar covers that surface instead.
  @media (max-width: 767px) {
    display: none;
  }
}
</style>
