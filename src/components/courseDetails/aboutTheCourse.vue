<template>
  <section class="cd-about">
    <header class="cd-about__head">
      <h2>{{ $t('الوصف') }}</h2>
    </header>

    <div
      v-if="courseData && courseData.brief"
      ref="proseEl"
      class="cd-about__prose"
      :class="{ 'is-clamped': isClamped }"
      v-html="courseData.brief"
    />
    <div v-else class="cd-about__skeleton">
      <ds-skeleton shape="line" width="100%" />
      <ds-skeleton shape="line" width="92%" />
      <ds-skeleton shape="line" width="70%" />
    </div>

    <button
      v-if="showToggle"
      type="button"
      class="cd-about__toggle"
      @click="isClamped = !isClamped"
    >
      {{ isClamped ? $t('عرض المزيد') : $t('عرض أقل') }}
      <span aria-hidden="true" class="cd-about__toggle-chevron" :data-open="!isClamped">▾</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import type { CourseDetail } from 'src/types/courses/types'

interface Props {
  courseData: CourseDetail | null
}

const props = defineProps<Props>()

const proseEl = ref<HTMLElement | null>(null)
const isClamped = ref(true)
const needsClamp = ref(false)

const plainBrief = computed(() =>
  String(props.courseData?.brief ?? '').replace(/<[^>]*>/g, '').trim(),
)

// Show the toggle when the brief's plaintext length suggests it will overflow
// the clamp. Avoids a JS-measure pass on every render by using character count
// as a cheap heuristic (~480 chars fills roughly 8 Arabic lines at our column width).
const showToggle = computed(() => needsClamp.value || plainBrief.value.length > 480)

function measure(): void {
  const el = proseEl.value
  if (!el) { needsClamp.value = false; return }
  const prevClamped = isClamped.value
  isClamped.value = true
  void nextTick(() => {
    if (!el) return
    needsClamp.value = el.scrollHeight - el.clientHeight > 2
    isClamped.value = prevClamped
  })
}

onMounted(() => measure())
watch(() => props.courseData?.brief, () => measure())
</script>

<style lang="scss" scoped>
.cd-about {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  &__head h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: 700;
    color: var(--ds-text);
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__prose {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text);
    position: relative;
    transition: max-block-size var(--ds-duration-base) var(--ds-ease-out);

    :deep(p) { margin: 0 0 var(--ds-space-3); }
    :deep(p:last-child) { margin-block-end: 0; }
    :deep(ul), :deep(ol) {
      padding-inline-start: var(--ds-space-5);
      margin: 0 0 var(--ds-space-3);
    }
    :deep(li) { margin-block-end: var(--ds-space-1); }
    :deep(strong), :deep(b) {
      color: var(--ds-text);
      font-weight: var(--ds-weight-bold);
    }
    :deep(a) {
      color: var(--ds-brand-600);
      text-decoration: underline;
    }

    &.is-clamped {
      display: -webkit-box;
      -webkit-line-clamp: 8;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-block-size: calc(var(--ds-leading-arabic) * var(--ds-text-md) * 8);

      // Soft fade at the bottom so the clamp feels intentional.
      &::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block-end: 0;
        block-size: 2.5rem;
        background: linear-gradient(
          to bottom,
          rgba(246, 241, 234, 0) 0%,
          var(--ds-surface) 100%
        );
        pointer-events: none;
      }
    }
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
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
    &:focus-visible { outline: 2px solid var(--ds-brand-600); outline-offset: 2px; border-radius: 4px; }
  }

  &__toggle-chevron {
    display: inline-block;
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
    &[data-open='true'] { transform: rotate(180deg); }
  }
}
</style>
