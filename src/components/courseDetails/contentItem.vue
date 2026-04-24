<template>
  <button
    v-if="content.isFree"
    type="button"
    class="content-row content-row--free"
    @click="onFreeClick"
  >
    <span class="content-row__icon content-row__icon--accent" aria-hidden="true">
      <!-- video: circle-play -->
      <svg
        v-if="content.modelName === 'ContentVideo'"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="10" cy="10" r="7.5" />
        <path d="M8.5 7.25 L13 10 L8.5 12.75 Z" fill="currentColor" stroke="none" />
      </svg>
      <!-- file: document with folded corner + down arrow -->
      <svg
        v-else-if="content.modelName === 'ContentFile'"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 2.75 H12 L15.25 6 V16.25 A1 1 0 0 1 14.25 17.25 H5 A1 1 0 0 1 4 16.25 V3.75 A1 1 0 0 1 5 2.75 Z" />
        <path d="M12 2.75 V6 H15.25" />
        <path d="M9.625 9 V13.25" />
        <path d="M7.75 11.5 L9.625 13.5 L11.5 11.5" />
      </svg>
      <!-- quiz: checklist -->
      <svg
        v-else-if="content.modelName === 'ContentQuiz'"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3.25" y="3.25" width="13.5" height="13.5" rx="2" />
        <path d="M6.5 8 L8 9.5 L11 6.5" />
        <path d="M6.5 13 H13.5" />
      </svg>
      <!-- fallback: generic free / unlock -->
      <svg
        v-else
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="4.25" y="9" width="11.5" height="8" rx="1.75" />
        <path d="M6.75 9 V6.25 A3.25 3.25 0 0 1 13.25 6 V6.75" />
      </svg>
    </span>

    <span class="content-row__title">{{ formatTitle }}</span>

    <ds-badge v-if="showFreeBadge" variant="success" size="sm">{{ $t('مجاني') }}</ds-badge>

    <span v-if="duration" class="content-row__duration">{{ duration }}</span>

    <span class="content-row__chevron" aria-hidden="true">
      <svg
        viewBox="0 0 20 20"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 6 L6 10 L10 14" />
      </svg>
    </span>
  </button>

  <div
    v-else
    class="content-row content-row--locked"
    :aria-disabled="true"
  >
    <span class="content-row__icon" aria-hidden="true">
      <!-- locked padlock -->
      <svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="4.25" y="9" width="11.5" height="8" rx="1.75" />
        <path d="M6.75 9 V6.25 A3.25 3.25 0 0 1 13.25 6.25 V9" />
      </svg>
    </span>

    <span class="content-row__title">{{ formatTitle }}</span>

    <span v-if="duration" class="content-row__duration">{{ duration }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CourseUnitContent } from 'src/types/courses/types'

// modelValue is a JSONString scalar. Apollo's typePolicy only parses
// CourseNode.currency — not CourseUnitContentNode.modelValue — so at runtime
// the field can arrive either as a raw JSON-encoded string (no policy) or as
// the parsed object that codegen advertises. Accept both and narrow locally.
type RawContent = Omit<CourseUnitContent, 'modelValue'> & {
  modelValue: string | Record<string, unknown> | null
}

const props = defineProps<{ content: RawContent }>()

const emit = defineEmits<{
  (e: 'preview-content', payload: {
    id: string
    pk: number | null
    title: string
    modelName: string
    content: RawContent
  }): void
}>()

function readModelValue (): Record<string, unknown> | null {
  const raw = props.content.modelValue
  if (!raw) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as Record<string, unknown> } catch { return null }
  }
  return raw as Record<string, unknown>
}

const formatTitle = computed<string>(() => {
  const r = readModelValue()
  if (!r) return ''
  if (props.content.modelName === 'ContentFile') {
    return String((r.attachment as string | undefined)?.split('/attachment/')[1] ?? '')
  }
  if (props.content.modelName === 'ContentQuiz') {
    return String(r.quiz_title ?? '')
  }
  return String(r.title ?? '')
})

const duration = computed<string>(() => {
  const r = readModelValue()
  if (!r) return ''
  const d = r.duration ?? r.video_duration ?? r.minutes
  return d ? String(d) : ''
})

const showFreeBadge = computed<boolean>(() => {
  // Keep the "مجاني" pill only for non-video rows, where there isn't already
  // a strong tap-to-play affordance from the circle-play icon.
  return props.content.modelName !== 'ContentVideo'
})

function onFreeClick (): void {
  emit('preview-content', {
    id: String((props.content as unknown as { id?: string }).id ?? ''),
    pk: props.content.pk ?? null,
    title: formatTitle.value,
    modelName: String(props.content.modelName ?? ''),
    content: props.content,
  })
}
</script>

<style lang="scss" scoped>
.content-row {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  inline-size: 100%;
  text-align: inherit;
  padding: var(--ds-space-3) var(--ds-space-4);
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  line-height: var(--ds-leading-normal);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &--locked {
    color: var(--ds-text-muted);
    cursor: default;
  }

  &--free {
    cursor: pointer;

    &:hover {
      background: var(--ds-brand-50, rgba(50, 40, 115, 0.06));
      color: var(--ds-brand-700);
    }

    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 2px;
    }
  }

  &__icon {
    flex: 0 0 auto;
    inline-size: 1.25rem;
    block-size: 1.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-text-muted);

    &--accent {
      color: var(--ds-brand-600);
    }
  }

  &__title {
    flex: 1 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__duration {
    flex: 0 0 auto;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    font-variant-numeric: tabular-nums;
  }

  &__chevron {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-text-muted);
  }
}
</style>

<style lang="scss">
[dir='rtl'] .content-row__chevron svg {
  transform: scaleX(-1);
}
</style>
