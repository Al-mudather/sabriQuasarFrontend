<template>
  <div class="rm">
    <div
      ref="contentEl"
      class="rm__content"
      :class="{ 'rm__content--clamped': clamped && expandable }"
      :style="{ '--rm-max': maxHeight + 'px' }"
    >
      <slot />
    </div>

    <button
      v-if="expandable"
      type="button"
      class="rm__toggle"
      @click="clamped = !clamped"
    >
      {{ clamped ? $t('عرض المزيد') : $t('عرض أقل') }}
      <span aria-hidden="true" class="rm__chev" :data-open="!clamped">▾</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// Reusable "read more" wrapper: clamps ANY slotted content to `maxHeight` with a
// soft fade, and reveals a toggle only when the content actually overflows.
// Mirrors aboutTheCourse.vue's clamp UX but works for arbitrary block content
// (lists, prose) — not just text — by measuring scrollHeight (which ignores the
// max-height clamp) against the threshold. A ResizeObserver re-measures when the
// content fills in asynchronously (e.g. after a GraphQL query resolves).
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{ maxHeight?: number }>(), {
  maxHeight: 260,
})

const contentEl = ref<HTMLElement | null>(null)
const clamped = ref(true)
const expandable = ref(false)
let ro: ResizeObserver | null = null

function measure(): void {
  const el = contentEl.value
  if (!el) {
    expandable.value = false
    return
  }
  // scrollHeight reports the FULL content height regardless of the active
  // max-height clamp, so this is reliable whether collapsed or expanded.
  expandable.value = el.scrollHeight > props.maxHeight + 4
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && contentEl.value) {
    ro = new ResizeObserver(() => measure())
    ro.observe(contentEl.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})
</script>

<style lang="scss" scoped>
.rm {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);

  &__content {
    position: relative;
    transition: max-block-size var(--ds-duration-base) var(--ds-ease-out);

    &--clamped {
      max-block-size: var(--rm-max, 260px);
      overflow: hidden;

      // Soft fade at the bottom so the clamp reads as intentional.
      &::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block-end: 0;
        block-size: 3rem;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0) 0%,
          var(--ds-surface) 100%
        );
        pointer-events: none;
      }
    }
  }

  &__toggle {
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    align-self: flex-start;
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-600);
    padding: var(--ds-space-2) 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3em;

    &:hover { color: var(--ds-brand-700); text-decoration: underline; }
    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__chev {
    display: inline-block;
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
    &[data-open='true'] { transform: rotate(180deg); }
  }
}
</style>
