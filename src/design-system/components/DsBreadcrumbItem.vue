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
      :aria-current="isCurrent ? 'page' : null"
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

<script>
export default {
  name: 'DsBreadcrumbItem',
  inject: {
    dsBreadcrumb: { default: null },
  },
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
  },
  data() {
    return { tickKey: 0 };
  },
  computed: {
    separator() {
      return this.dsBreadcrumb ? this.dsBreadcrumb.state.separator : '›';
    },
    isCurrent() {
      // eslint-disable-next-line no-unused-expressions
      this.tickKey;
      return !!this.$_dsIsLast;
    },
    tagName() {
      if (this.to) return 'router-link';
      return 'a';
    },
  },
  mounted() { this.tickKey += 1; },
  updated() { this.tickKey += 1; },
};
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

:global(html[dir='rtl']) .ds-breadcrumb-item__sep {
  transform: scaleX(-1);
}
</style>
