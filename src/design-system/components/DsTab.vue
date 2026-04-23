<template>
  <div
    v-if="isActive"
    class="ds-tab"
    role="tabpanel"
    :aria-labelledby="name"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DsTab',
  inject: {
    dsTabs: { default: null },
  },
  props: {
    name: { type: [String, Number], required: true },
    label: { type: String, default: '' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    isActive() {
      return this.dsTabs && this.dsTabs.state.active === this.name;
    },
  },
  watch: {
    name() { this.registerSelf(); },
    label() { this.registerSelf(); },
    icon() { this.registerSelf(); },
    disabled() { this.registerSelf(); },
  },
  created() {
    this.registerSelf();
  },
  beforeDestroy() {
    if (this.dsTabs) this.dsTabs.unregister(this.name);
  },
  methods: {
    registerSelf() {
      if (!this.dsTabs) return;
      this.dsTabs.unregister(this.name);
      this.dsTabs.register({
        name: this.name,
        label: this.label,
        icon: this.icon,
        disabled: this.disabled,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ds-tab {
  font-family: var(--ds-font-body);
  color: var(--ds-text);
  line-height: var(--ds-leading-arabic);
}
</style>
