<script setup lang="ts">
import { computed } from 'vue'
import type { CurriculumContent } from 'src/types/classroom/types'

interface Props {
  content: CurriculumContent
  active: boolean
  locked: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ click: [] }>()

const statusIcon = computed(() => {
  if (props.locked) return 'lock'
  if (props.content.completed) return 'check_circle'
  if (props.content.inProgress) return 'play_circle'
  return 'radio_button_unchecked'
})

const statusColor = computed(() => {
  if (props.locked) return 'var(--cls-status-locked)'
  if (props.content.completed) return 'var(--cls-status-complete)'
  if (props.content.inProgress) return 'var(--cls-status-inprogress)'
  return 'var(--cls-text-dim)'
})

const kindLabel = computed(() => {
  const m = (props.content.modelName || '').toLowerCase()
  if (m.includes('video')) return 'video'
  if (m.includes('quiz') || m.includes('exam')) return 'quiz'
  if (m.includes('article') || m.includes('text') || m.includes('lesson')) return 'article'
  if (m.includes('file') || m.includes('attachment') || m.includes('pdf')) return 'file'
  return m || 'content'
})

function handleClick() {
  if (props.locked) return
  emit('click')
}

function handleKeydown(e: KeyboardEvent) {
  if (props.locked) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <div
    class="cls-curriculum-item"
    :class="{
      'cls-curriculum-item--active': active,
      'cls-curriculum-item--locked': locked,
    }"
    role="button"
    :tabindex="locked ? -1 : 0"
    :aria-disabled="locked"
    :aria-current="active ? 'true' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span class="cls-curriculum-item__status" :style="{ color: statusColor }">
      <q-icon :name="statusIcon" size="20px" aria-hidden="true" />
    </span>

    <span class="cls-curriculum-item__main">
      <span class="cls-curriculum-item__title">{{ content.title }}</span>
      <span class="cls-curriculum-item__meta">
        <span class="cls-curriculum-item__kind">{{ kindLabel }}</span>
        <span v-if="content.isFree" class="cls-curriculum-item__badge cls-curriculum-item__badge--free">
          FREE
        </span>
        <span
          v-if="content.isMandatory"
          class="cls-curriculum-item__dot"
          aria-label="Mandatory"
          title="Mandatory"
        />
      </span>
    </span>

    <span class="cls-curriculum-item__right" aria-hidden="true" />
  </div>
</template>

<style lang="scss" scoped>
.cls-curriculum-item {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  min-height: 64px;
  padding: var(--ds-space-2) var(--ds-space-4);
  width: 100%;
  background: transparent;
  color: var(--cls-text-primary);
  cursor: pointer;
  user-select: none;
  border: 0;
  border-inline-start: 3px solid transparent;
  transition:
    background-color var(--cls-dur-fast) var(--cls-ease),
    border-color var(--cls-dur-fast) var(--cls-ease);

  &:hover {
    background: var(--cls-rail-hover);
  }

  &:focus-visible {
    outline: var(--cls-focus-ring);
    outline-offset: -2px;
  }

  &--active {
    background: var(--cls-accent-soft);
    border-inline-start-color: var(--cls-accent);
  }

  &--locked {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
    }
  }

  &__status {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--cls-text-primary);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__kind {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-2xs);
    font-weight: var(--ds-weight-medium);
    color: var(--cls-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__badge {
    font-family: var(--ds-font-body);
    font-size: 10px;
    font-weight: var(--ds-weight-bold);
    letter-spacing: 0.06em;
    padding: 2px 6px;
    border-radius: var(--cls-radius-sm);
    line-height: 1;

    &--free {
      background: var(--cls-accent-soft);
      color: var(--cls-accent);
    }
  }

  &__dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cls-status-inprogress);
  }

  &__right {
    flex-shrink: 0;
    min-width: 0;
  }
}
</style>
