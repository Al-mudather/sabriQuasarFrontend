<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  ClassroomBootstrap,
  CurriculumUnit,
  CurriculumContent,
} from 'src/types/classroom/types'
import CurriculumItem from './CurriculumItem.vue'

interface Props {
  /** Renamed from `enrollment` — now the full classroom bootstrap object. */
  bootstrap: ClassroomBootstrap | null
  currentContentPk: number | null
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const emit = defineEmits<{
  select: [contentPk: number]
  toggleCollapse: []
}>()

// Track which units are expanded. Default: expand the unit that contains
// the current content, fall back to the first unit.
const expandedByPk = ref<Record<number, boolean>>({})

const activeUnitPk = computed<number | null>(() => {
  if (!props.bootstrap || props.currentContentPk == null) return null
  for (const unit of props.bootstrap.units) {
    if (unit.contents.some((c) => c.pk === props.currentContentPk)) return unit.pk
  }
  return null
})

watch(
  () => [props.bootstrap, activeUnitPk.value] as const,
  ([b, activePk]) => {
    if (!b) return
    const next: Record<number, boolean> = { ...expandedByPk.value }
    if (activePk != null) {
      next[activePk] = true
    } else if (b.units.length && Object.keys(next).length === 0) {
      const first = b.units[0]
      if (first) next[first.pk] = true
    }
    expandedByPk.value = next
  },
  { immediate: true },
)

function isExpanded(unit: CurriculumUnit): boolean {
  return !!expandedByPk.value[unit.pk]
}

function onUpdateExpanded(unit: CurriculumUnit, value: boolean) {
  expandedByPk.value = { ...expandedByPk.value, [unit.pk]: value }
}

function completedCount(unit: CurriculumUnit): number {
  return unit.contents.filter((c) => c.completed).length
}

// TODO: when the plan defines gating (e.g. sequential unlock), wire locked
// logic here. For now, treat all items as unlocked regardless of `isFree`.
function isLocked(_content: CurriculumContent): boolean {
  return false
}

function statusDotColor(content: CurriculumContent): string {
  if (content.completed) return 'var(--cls-status-complete)'
  if (content.inProgress) return 'var(--cls-status-inprogress)'
  return 'var(--cls-text-dim)'
}

function handleSelect(content: CurriculumContent) {
  if (isLocked(content)) return
  emit('select', content.pk)
}
</script>

<template>
  <aside
    class="cls-rail"
    :class="{ 'cls-rail--collapsed': collapsed }"
    :aria-label="bootstrap ? `Course content: ${bootstrap.courseTitle}` : 'Course content'"
  >
    <div class="cls-rail__header">
      <span v-if="!collapsed" class="cls-rail__title">Course content</span>
      <button
        type="button"
        class="cls-rail__toggle"
        :aria-label="collapsed ? 'Expand course content' : 'Collapse course content'"
        :aria-expanded="!collapsed"
        @click="emit('toggleCollapse')"
      >
        <q-icon
          :name="collapsed ? 'chevron_right' : 'chevron_left'"
          size="20px"
          class="cls-rail__toggle-icon"
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="cls-rail__body">
      <!-- Loading skeleton -->
      <div v-if="bootstrap === null" class="cls-rail__skeleton" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="cls-rail__skeleton-unit">
          <div class="cls-rail__skeleton-bar cls-rail__skeleton-bar--lg" />
          <div class="cls-rail__skeleton-bar" />
          <div class="cls-rail__skeleton-bar" />
          <div class="cls-rail__skeleton-bar cls-rail__skeleton-bar--short" />
        </div>
      </div>

      <!-- Collapsed: status dots only -->
      <div v-else-if="collapsed" class="cls-rail__collapsed">
        <div
          v-for="unit in bootstrap.units"
          :key="unit.pk"
          class="cls-rail__collapsed-group"
          :aria-label="unit.title"
        >
          <span
            v-for="content in unit.contents"
            :key="content.pk"
            class="cls-rail__dot"
            :class="{ 'cls-rail__dot--active': content.pk === currentContentPk }"
            :style="{ backgroundColor: statusDotColor(content) }"
            :title="content.title"
          />
          <span class="cls-rail__collapsed-sep" aria-hidden="true" />
        </div>
      </div>

      <!-- Expanded: accordion list -->
      <div v-else class="cls-rail__list">
        <q-expansion-item
          v-for="unit in bootstrap.units"
          :key="unit.pk"
          class="cls-rail__unit"
          :model-value="isExpanded(unit)"
          header-class="cls-rail__unit-header"
          expand-icon-class="cls-rail__unit-chevron"
          @update:model-value="(v: boolean) => onUpdateExpanded(unit, v)"
        >
          <template #header>
            <div class="cls-rail__unit-header-inner">
              <span class="cls-rail__unit-title">{{ unit.title }}</span>
              <span class="cls-rail__unit-count">
                {{ completedCount(unit) }}/{{ unit.contents.length }}
              </span>
            </div>
          </template>

          <div class="cls-rail__unit-body">
            <CurriculumItem
              v-for="content in unit.contents"
              :key="content.pk"
              :content="content"
              :active="content.pk === currentContentPk"
              :locked="isLocked(content)"
              @click="handleSelect(content)"
            />
          </div>
        </q-expansion-item>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.cls-rail {
  display: flex;
  flex-direction: column;
  width: var(--cls-rail-w);
  height: 100%;
  background: var(--cls-rail-bg);
  color: var(--cls-text-primary);
  border-inline-end: 1px solid var(--cls-divider);
  transition: width var(--cls-dur-med) var(--cls-ease);
  overflow: hidden;

  // On mobile the rail lives inside the side-panel as a tab and must fill
  // the available width edge-to-edge. The 320px desktop column rule would
  // leave a margin to one side of the panel.
  @media (max-width: 1023px) {
    width: 100%;
    border-inline-end: 0;
  }

  &--collapsed {
    width: var(--cls-rail-w-collapsed);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-2);
    min-height: var(--cls-header-h);
    padding: 0 var(--ds-space-3);
    border-block-end: 1px solid var(--cls-divider);
    flex-shrink: 0;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--cls-radius-sm);
    background: transparent;
    border: 0;
    color: var(--cls-text-muted);
    cursor: pointer;
    transition: background-color var(--cls-dur-fast) var(--cls-ease);

    &:hover {
      background: var(--cls-rail-hover);
      color: var(--cls-text-primary);
    }

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }

  &__toggle-icon {
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--cls-divider) transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--cls-divider);
      border-radius: 3px;
    }
  }

  // ---- Skeleton ----
  &__skeleton {
    padding: var(--ds-space-3);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__skeleton-unit {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__skeleton-bar {
    height: 12px;
    border-radius: var(--cls-radius-sm);
    background: var(--cls-rail-hover);
    animation: cls-rail-pulse 1.2s ease-in-out infinite;

    &--lg {
      height: 16px;
      width: 70%;
    }
    &--short {
      width: 45%;
    }
  }

  // ---- Collapsed state ----
  &__collapsed {
    padding: var(--ds-space-3) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-2);
  }

  &__collapsed-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__collapsed-sep {
    width: 16px;
    height: 1px;
    background: var(--cls-divider);
    margin: 6px 0;
  }

  &__dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cls-text-dim);

    &--active {
      box-shadow: 0 0 0 2px var(--cls-accent);
    }
  }

  // ---- Accordion list ----
  &__list {
    display: flex;
    flex-direction: column;
  }

  &__unit {
    border-block-end: 1px solid var(--cls-divider);
  }

  :deep(.cls-rail__unit-header) {
    min-height: 52px;
    padding: 0 var(--ds-space-4);
    color: var(--cls-text-primary);
    background: transparent;
    transition: background-color var(--cls-dur-fast) var(--cls-ease);

    &:hover {
      background: var(--cls-rail-hover);
    }
  }

  :deep(.cls-rail__unit-chevron) {
    color: var(--cls-text-muted);
  }

  &__unit-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    width: 100%;
    min-width: 0;
  }

  &__unit-title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
    line-height: 1.3;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__unit-count {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-2xs);
    color: var(--cls-text-muted);
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  &__unit-body {
    display: flex;
    flex-direction: column;
    padding-block: var(--ds-space-1);
    background: transparent;
  }
}

@keyframes cls-rail-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cls-rail__skeleton-bar {
    animation: none;
  }
}
</style>
