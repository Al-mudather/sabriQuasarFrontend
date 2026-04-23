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

<script>
export default {
  name: 'DsBreadcrumb',
  provide() {
    const state = {};
    Object.defineProperty(state, 'separator', {
      enumerable: true,
      get: () => this.separator,
    });
    Object.defineProperty(state, 'count', {
      enumerable: true,
      get: () => this.itemCount,
    });
    return { dsBreadcrumb: { state, getIndex: this.getIndex } };
  },
  props: {
    separator: { type: String, default: '›' },
  },
  data() {
    return { itemCount: 0 };
  },
  mounted() {
    this.refreshCount();
  },
  updated() {
    this.refreshCount();
  },
  methods: {
    refreshCount() {
      const items = (this.$children || []).filter(
        (c) => c.$options && c.$options.name === 'DsBreadcrumbItem',
      );
      this.itemCount = items.length;
      items.forEach((c, i) => {
        c.$_dsIndex = i;
        c.$_dsIsLast = i === items.length - 1;
      });
    },
    getIndex() {
      return this.itemCount;
    },
  },
};
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
