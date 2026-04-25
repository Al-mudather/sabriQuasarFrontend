<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type TabKey = 'curriculum' | 'overview' | 'qa'

interface Props {
  activeTab: TabKey
  /** When true, prepend a "Curriculum" tab. Used on mobile where the standalone
   *  rail aside is hidden and the curriculum lives inside the side panel. */
  showCurriculum?: boolean
}

const props = withDefaults(defineProps<Props>(), { showCurriculum: false })
const emit = defineEmits<{ 'update:activeTab': [value: TabKey] }>()
const { t } = useI18n()

interface TabDef {
  key: TabKey
  label: string
}

const tabs = computed<TabDef[]>(() => {
  const out: TabDef[] = []
  if (props.showCurriculum) out.push({ key: 'curriculum', label: t('classroom.panel.curriculum') })
  out.push({ key: 'overview', label: t('classroom.panel.overview') })
  out.push({ key: 'qa', label: t('classroom.panel.qa') })
  return out
})

// If the curriculum tab disappears (resize to desktop) while it was active,
// fall back to overview so the panel doesn't render an empty body.
watch(
  () => props.showCurriculum,
  (show) => {
    if (!show && props.activeTab === 'curriculum') emit('update:activeTab', 'overview')
  },
)

const tabRefs = ref<Record<string, HTMLButtonElement | null>>({})

function setTabRef(key: TabKey, el: Element | null) {
  tabRefs.value[key] = el as HTMLButtonElement | null
}

const activeIndex = computed(() => tabs.value.findIndex((t) => t.key === props.activeTab))

function selectIndex(idx: number) {
  const tab = tabs.value[idx]
  if (!tab) return
  emit('update:activeTab', tab.key)
  void nextTick(() => {
    tabRefs.value[tab.key]?.focus()
  })
}

function onKeydown(e: KeyboardEvent) {
  const count = tabs.value.length
  const cur = activeIndex.value < 0 ? 0 : activeIndex.value
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      selectIndex((cur + 1) % count)
      break
    case 'ArrowLeft':
      e.preventDefault()
      selectIndex((cur - 1 + count) % count)
      break
    case 'Home':
      e.preventDefault()
      selectIndex(0)
      break
    case 'End':
      e.preventDefault()
      selectIndex(count - 1)
      break
  }
}
</script>

<template>
  <aside class="cls-panel" aria-label="Lesson side panel">
    <div
      class="cls-panel__tabs"
      role="tablist"
      aria-label="Side panel tabs"
      @keydown="onKeydown"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :ref="(el) => setTabRef(tab.key, el as Element | null)"
        type="button"
        role="tab"
        :id="`cls-panel-tab-${tab.key}`"
        :aria-controls="`cls-panel-panel-${tab.key}`"
        :aria-selected="tab.key === activeTab"
        :tabindex="tab.key === activeTab ? 0 : -1"
        class="cls-panel__tab"
        :class="{ 'cls-panel__tab--active': tab.key === activeTab }"
        @click="emit('update:activeTab', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      class="cls-panel__body"
      role="tabpanel"
      :id="`cls-panel-panel-${activeTab}`"
      :aria-labelledby="`cls-panel-tab-${activeTab}`"
    >
      <slot v-if="activeTab === 'curriculum'" name="curriculum" />
      <slot v-else-if="activeTab === 'overview'" name="overview" />
      <slot v-else-if="activeTab === 'qa'" name="qa" />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.cls-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--cls-surface-elevated);
  color: var(--cls-text-primary);
  border-inline-start: 1px solid var(--cls-divider);
  overflow: hidden;

  @media (max-width: 1023px) {
    border-inline-start: 0;
    border-block-start: 1px solid var(--cls-divider);
  }

  &__tabs {
    display: flex;
    align-items: stretch;
    min-height: var(--cls-header-h);
    border-block-end: 1px solid var(--cls-divider);
    flex-shrink: 0;
    padding: 0 var(--ds-space-2);
    gap: var(--ds-space-1);
  }

  &__tab {
    position: relative;
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    color: var(--cls-text-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    padding: 0 var(--ds-space-2);
    cursor: pointer;
    transition: color var(--cls-dur-fast) var(--cls-ease);

    &::after {
      content: '';
      position: absolute;
      inset-inline: var(--ds-space-2);
      bottom: 0;
      height: 2px;
      background: transparent;
      border-radius: 2px 2px 0 0;
      transition: background-color var(--cls-dur-med) var(--cls-ease);
    }

    &:hover {
      color: var(--cls-text-primary);
    }

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: -2px;
      border-radius: var(--cls-radius-sm);
    }

    &--active {
      color: var(--cls-text-primary);

      &::after {
        background: var(--cls-accent);
      }
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--ds-space-4);

    // On mobile the panel hosts the full-bleed curriculum rail; any inline
    // padding here would create the "centered with margins" look the user
    // saw on iPhone XR.
    @media (max-width: 1023px) {
      padding: 0;
    }
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
}
</style>
