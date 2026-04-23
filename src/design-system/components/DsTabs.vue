<template>
  <div
    class="ds-tabs"
    :class="[`ds-tabs--${align}`, `ds-tabs--${size}`]"
  >
    <div
      ref="list"
      class="ds-tabs__list"
      role="tablist"
    >
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.name"
        :ref="setTabRef"
        type="button"
        role="tab"
        class="ds-tabs__tab"
        :class="{
          'is-active': tab.name === currentValue,
          'is-disabled': tab.disabled,
        }"
        :aria-selected="tab.name === currentValue ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : 'false'"
        :tabindex="tab.name === currentValue ? 0 : -1"
        :disabled="tab.disabled"
        @click="select(tab)"
        @keydown="onKeydown($event, idx)"
      >
        <span v-if="tab.icon" class="ds-tabs__icon">
          <i :class="tab.icon" aria-hidden="true"></i>
        </span>
        <span class="ds-tabs__label">{{ tab.label }}</span>
      </button>
      <span
        v-show="indicator.width > 0"
        class="ds-tabs__indicator"
        :style="indicatorStyle"
        aria-hidden="true"
      />
    </div>
    <div class="ds-tabs__panels">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DsTabs',
  provide() {
    const state = {};
    Object.defineProperty(state, 'active', {
      enumerable: true,
      get: () => this.currentValue,
    });
    return {
      dsTabs: {
        state,
        register: this.register,
        unregister: this.unregister,
      },
    };
  },
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: { type: [String, Number], default: null },
    align: {
      type: String,
      default: 'start',
      validator: (v) => ['start', 'center', 'end', 'stretch'].includes(v),
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
  },
  data() {
    return {
      tabs: [],
      tabRefs: [],
      indicator: { offset: 0, width: 0 },
    };
  },
  computed: {
    currentValue() {
      if (this.modelValue != null) return this.modelValue;
      const first = this.tabs.find((t) => !t.disabled);
      return first ? first.name : null;
    },
    isRTL() {
      if (typeof document === 'undefined') return false;
      return document.documentElement.getAttribute('dir') === 'rtl';
    },
    indicatorStyle() {
      return {
        transform: `translateX(${this.indicator.offset}px)`,
        width: `${this.indicator.width}px`,
      };
    },
  },
  watch: {
    currentValue() {
      this.$nextTick(this.updateIndicator);
    },
    tabs() {
      this.$nextTick(this.updateIndicator);
    },
  },
  mounted() {
    this.$nextTick(this.updateIndicator);
    window.addEventListener('resize', this.updateIndicator);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIndicator);
  },
  updated() {
    this.$nextTick(this.updateIndicator);
  },
  methods: {
    setTabRef(el) {
      if (el && !this.tabRefs.includes(el)) this.tabRefs.push(el);
    },
    register(tab) {
      if (!this.tabs.find((t) => t.name === tab.name)) {
        this.tabs.push(tab);
      }
    },
    unregister(name) {
      this.tabs = this.tabs.filter((t) => t.name !== name);
      this.tabRefs = [];
    },
    select(tab) {
      if (tab.disabled) return;
      this.$emit('update:modelValue', tab.name);
      this.$emit('change', tab.name);
    },
    updateIndicator() {
      const list = this.$refs.list;
      if (!list) return;
      const activeIdx = this.tabs.findIndex((t) => t.name === this.currentValue);
      if (activeIdx < 0) {
        this.indicator = { offset: 0, width: 0 };
        return;
      }
      const btn = list.querySelectorAll('.ds-tabs__tab')[activeIdx];
      if (!btn) return;
      this.indicator = {
        offset: btn.offsetLeft,
        width: btn.offsetWidth,
      };
    },
    onKeydown(e, idx) {
      const key = e.key;
      const rtl = this.isRTL;
      let dir = 0;
      if (key === 'ArrowRight') dir = rtl ? -1 : 1;
      else if (key === 'ArrowLeft') dir = rtl ? 1 : -1;
      else if (key === 'Home') dir = -999;
      else if (key === 'End') dir = 999;
      else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.select(this.tabs[idx]);
        return;
      } else return;

      e.preventDefault();
      const n = this.tabs.length;
      if (!n) return;
      let next;
      if (dir === -999) next = this.tabs.findIndex((t) => !t.disabled);
      else if (dir === 999) {
        for (let i = n - 1; i >= 0; i -= 1) {
          if (!this.tabs[i].disabled) { next = i; break; }
        }
      } else {
        next = idx;
        for (let step = 0; step < n; step += 1) {
          next = (next + dir + n) % n;
          if (!this.tabs[next].disabled) break;
        }
      }
      if (next == null) return;
      const btns = this.$refs.list.querySelectorAll('.ds-tabs__tab');
      const el = btns[next];
      if (el) el.focus();
      this.select(this.tabs[next]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../mixins.scss";

.ds-tabs {
  width: 100%;

  &__list {
    position: relative;
    display: flex;
    gap: var(--ds-space-2);
    border-bottom: 1px solid var(--ds-border);
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &--center &__list { justify-content: center; }
  &--end &__list    { justify-content: flex-end; }
  &--stretch &__list .ds-tabs__tab { flex: 1 1 0; }

  &__tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    background: transparent;
    border: 0;
    cursor: pointer;
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-text-muted);
    padding: var(--ds-space-3) var(--ds-space-4);
    transition: color var(--ds-duration-fast) var(--ds-ease-out);
    white-space: nowrap;

    &:hover:not(.is-disabled):not(.is-active) {
      color: var(--ds-text);
    }
    &.is-active { color: var(--ds-text); }
    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:focus-visible {
      @include ds-focus-ring;
      border-radius: var(--ds-radius-sm);
    }
  }

  &--sm &__tab { font-size: var(--ds-text-sm); padding: var(--ds-space-2) var(--ds-space-3); }
  &--md &__tab { font-size: var(--ds-text-md); }
  &--lg &__tab { font-size: var(--ds-text-lg); padding: var(--ds-space-4) var(--ds-space-5); }

  &__icon { display: inline-flex; align-items: center; }

  &__indicator {
    position: absolute;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: var(--ds-brand-600);
    border-radius: 2px;
    transition:
      transform var(--ds-duration-base) var(--ds-ease-out),
      width var(--ds-duration-base) var(--ds-ease-out);
    pointer-events: none;
  }

  &__panels {
    padding-top: var(--ds-space-4);
  }
}
</style>
