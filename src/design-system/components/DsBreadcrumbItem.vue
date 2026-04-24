<template>
  <li
    class="ds-breadcrumb-item"
    :class="{ 'is-current': isCurrent }"
  >
    <component
      :is="tagName"
      v-if="!isCurrent && (to || href)"
      :to="to || undefined"
      :href="!to ? href : undefined"
      class="ds-breadcrumb-item__link"
    >
      <slot />
    </component>
    <span
      v-else
      class="ds-breadcrumb-item__text"
      :aria-current="isCurrent ? 'page' : undefined"
    >
      <slot />
    </span>
    <span
      v-if="!isCurrent"
      class="ds-breadcrumb-item__sep"
      aria-hidden="true"
    >{{ separator }}</span>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { DsBreadcrumbKey } from './ds-breadcrumb-key'

defineOptions({ name: 'DsBreadcrumbItem' })

interface Props {
  to?: string | Record<string, unknown> | null
  href?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  to: null,
  href: null,
})

const api = inject(DsBreadcrumbKey, null) as {
  separator: { value: string }
  register: (item: object) => () => void
  isLast: (item: object) => boolean
} | null

const token: object = {}

let unregister: (() => void) | null = null
if (api) {
  unregister = api.register(token)
  onBeforeUnmount(() => {
    if (unregister) unregister()
  })
}

const separator = computed(() => (api ? api.separator.value : '›'))
const isCurrent = computed(() => (api ? api.isLast(token) : false))
const tagName = computed(() => (props.to ? 'router-link' : 'a'))
</script>

<style lang="scss" scoped>
.ds-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  color: var(--ds-text-muted);

  &.is-current {
    color: var(--ds-text);
    font-weight: var(--ds-weight-semibold);
  }

  &__link {
    color: var(--ds-text-muted);
    text-decoration: none;
    transition: color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      color: var(--ds-brand-600);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 2px;
      border-radius: var(--ds-radius-xs);
    }
  }

  &__text {
    color: inherit;
  }

  &__sep {
    color: var(--ds-text-muted);
    opacity: 0.6;
    display: inline-block;
    font-size: 1em;
    line-height: 1;
  }
}

// `:global(html[dir='rtl']) ...` compiled incorrectly under Vue 3 scoped
// styles (dropped the inner selector and flipped the whole <html>). Plain
// ancestor-attr selector compiles correctly and targets only the separator.
[dir='rtl'] .ds-breadcrumb-item__sep {
  transform: scaleX(-1);
}
</style>
