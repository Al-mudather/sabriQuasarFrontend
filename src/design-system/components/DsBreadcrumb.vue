<template>
  <nav
    class="ds-breadcrumb"
    aria-label="breadcrumb"
  >
    <ol class="ds-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { shallowReactive, computed, provide } from 'vue'
import { DsBreadcrumbKey } from './ds-breadcrumb-key'

defineOptions({ name: 'DsBreadcrumb' })

interface Props {
  separator?: string
}

const props = withDefaults(defineProps<Props>(), {
  separator: '›',
})

// Use shallowReactive so stored tokens are not wrapped in proxies
// (keeps reference equality stable for isLast comparison).
const items = shallowReactive<object[]>([])

const api = {
  separator: computed(() => props.separator),
  register(item: object): () => void {
    items.push(item)
    return () => {
      const i = items.indexOf(item)
      if (i !== -1) items.splice(i, 1)
    }
  },
  isLast(item: object): boolean {
    return items.length > 0 && items[items.length - 1] === item
  },
}

provide(DsBreadcrumbKey, api)
</script>

<style lang="scss" scoped>
.ds-breadcrumb {
  width: 100%;

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
  }
}
</style>
