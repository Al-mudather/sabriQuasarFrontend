<template>
  <div class="ds-accordion">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DsAccordion',
  provide() {
    const state = {};
    Object.defineProperty(state, 'opened', {
      enumerable: true,
      get: () => this.internalOpened,
    });
    Object.defineProperty(state, 'multi', {
      enumerable: true,
      get: () => this.multi,
    });
    return {
      dsAccordion: {
        state,
        toggle: this.toggle,
        isOpen: this.isOpen,
        focusNeighbor: this.focusNeighbor,
        registerRef: this.registerRef,
        unregisterRef: this.unregisterRef,
      },
    };
  },
  emits: ['update:modelValue', 'change'],
  props: {
    multi: { type: Boolean, default: false },
    modelValue: { type: Array, default: null },
  },
  data() {
    return {
      internalOpened: this.modelValue ? [...this.modelValue] : [],
      refs: [],
    };
  },
  watch: {
    modelValue(val) {
      if (val) this.internalOpened = [...val];
    },
  },
  methods: {
    isOpen(name) {
      return this.internalOpened.includes(name);
    },
    toggle(name) {
      let next;
      if (this.internalOpened.includes(name)) {
        next = this.internalOpened.filter((n) => n !== name);
      } else if (this.multi) {
        next = [...this.internalOpened, name];
      } else {
        next = [name];
      }
      this.internalOpened = next;
      this.$emit('update:modelValue', next);
      this.$emit('change', next);
    },
    registerRef(name, el) {
      const existing = this.refs.find((r) => r.name === name);
      if (existing) existing.el = el;
      else this.refs.push({ name, el });
    },
    unregisterRef(name) {
      this.refs = this.refs.filter((r) => r.name !== name);
    },
    focusNeighbor(name, direction) {
      if (!this.refs.length) return;
      const idx = this.refs.findIndex((r) => r.name === name);
      if (idx < 0) return;
      const n = this.refs.length;
      const next = (idx + direction + n) % n;
      const target = this.refs[next];
      if (target && target.el && target.el.focus) target.el.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.ds-accordion {
  width: 100%;
  background: var(--ds-surface-elevated);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  box-shadow: var(--ds-shadow-sm);
}
</style>
