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

// At-a-glance type icon next to the kind label. Deliberately uses `smart_display`
// for video (not `play_circle`, which the status column already uses to mean
// "in progress" — keeping type and status icons distinct avoids confusion).
const kindIcon = computed(() => {
  switch (kindLabel.value) {
    case 'video': return 'smart_display'
    case 'quiz': return 'quiz'
    case 'file': return 'description'
    case 'article': return 'article'
    default: return 'circle'
  }
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
        <q-icon
          :name="kindIcon"
          size="14px"
          aria-hidden="true"
          class="cls-curriculum-item__kind-icon"
        />
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
  border-inline-start: 4px solid transparent;
  transition:
    background-color var(--cls-dur-fast) var(--cls-ease),
    border-color var(--cls-dur-fast) var(--cls-ease),
    box-shadow var(--cls-dur-fast) var(--cls-ease);

  &:hover {
    background: var(--cls-rail-hover);
  }

  &:focus-visible {
    outline: var(--cls-focus-ring);
    outline-offset: -2px;
  }

  // Active = the lesson currently on screen. Visually loud on a dark
  // surface: saturated terracotta tint, accent-colored title, persistent
  // left rail, and an inset glow so it never blends into hover states.
  &--active {
    background: rgba(193, 98, 60, 0.22);
    border-inline-start-color: var(--cls-accent);
    box-shadow: inset 0 0 0 1px rgba(193, 98, 60, 0.32);

    &:hover {
      background: rgba(193, 98, 60, 0.28);
    }

    .cls-curriculum-item__title {
      color: var(--cls-accent);
      font-weight: var(--ds-weight-semibold);
    }

    .cls-curriculum-item__kind,
    .cls-curriculum-item__kind-icon {
      color: var(--cls-accent);
    }
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

  &__kind-icon {
    flex-shrink: 0;
    color: var(--cls-text-muted);
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
