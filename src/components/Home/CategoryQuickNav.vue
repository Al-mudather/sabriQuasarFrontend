<template>
  <nav class="cat-nav" :aria-label="$t('أقسام الدورات')">
    <ul ref="track" class="cat-nav__track">
      <li
        v-for="item in items"
        :key="item.id"
        class="cat-nav__item"
      >
        <a
          :href="`#${item.id}`"
          class="cat-nav__chip"
          :class="{ 'cat-nav__chip--active': item.id === activeId }"
          :aria-current="item.id === activeId ? 'true' : undefined"
          :data-cat="item.id"
          @click.prevent="onSelect(item.id)"
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

export interface QuickNavItem {
  id: string
  pk: number
  name: string
}

const props = defineProps<{
  items: QuickNavItem[]
  activeId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const track = ref<HTMLElement | null>(null)

function onSelect (id: string): void {
  emit('select', id)
}

// Keep the active chip in view within the horizontal track as scroll-spy moves.
watch(
  () => props.activeId,
  async (id) => {
    if (!id) return
    await nextTick()
    const chip = track.value?.querySelector<HTMLElement>(`[data-cat="${id}"]`)
    chip?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  },
)
</script>

<style lang="scss" scoped>
.cat-nav {
  position: sticky;
  inset-block-start: 64px; /* flush under the sticky app header */
  z-index: calc(var(--ds-z-sticky) - 1);
  background: var(--ds-cream);
  border-block-end: 1px solid var(--ds-border);

  @media (min-width: 600px) {
    inset-block-start: 72px;
  }
}

.cat-nav__track {
  list-style: none;
  margin: 0;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-3) clamp(1rem, 4vw, 2.5rem);
  display: flex;
  gap: var(--ds-space-2);
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }
}

.cat-nav__item {
  flex: 0 0 auto;
}

.cat-nav__chip {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0.4rem 0.9rem;
  border-radius: var(--ds-radius-pill);
  border: 1px solid var(--ds-border);
  background: var(--ds-ivory);
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out),
    color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover {
    border-color: var(--ds-brand-600);
    color: var(--ds-brand-600);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }

  &--active {
    background: var(--ds-brand-600);
    border-color: var(--ds-brand-600);
    color: var(--ds-ivory);
  }
}
</style>
