<template>
  <div
    class="ds-accordion-item"
    :class="{ 'is-open': open, 'is-disabled': disabled }"
  >
    <button
      ref="header"
      type="button"
      class="ds-accordion-item__header"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="bodyId"
      :aria-disabled="disabled ? 'true' : 'false'"
      :disabled="disabled"
      :id="headerId"
      @click="onToggle"
      @keydown="onKeydown"
    >
      <span v-if="$slots.icon || icon" class="ds-accordion-item__icon">
        <slot name="icon">
          <i v-if="icon" :class="icon" aria-hidden="true"></i>
        </slot>
      </span>
      <span class="ds-accordion-item__titles">
        <span class="ds-accordion-item__title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span
          v-if="subtitle || $slots.subtitle"
          class="ds-accordion-item__subtitle"
        >
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
      </span>
      <span class="ds-accordion-item__chevron" aria-hidden="true">
        <slot name="chevron">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </span>
    </button>
    <div
      :id="bodyId"
      role="region"
      :aria-labelledby="headerId"
      class="ds-accordion-item__panel"
      :style="panelStyle"
      :aria-hidden="open ? 'false' : 'true'"
    >
      <div ref="inner" class="ds-accordion-item__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
let uid = 0;

export default {
  name: 'DsAccordionItem',
  inject: {
    dsAccordion: { default: null },
  },
  props: {
    name: {
      type: [String, Number],
      default: () => `ds-acc-${uid += 1}`,
    },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      bodyHeight: 0,
      _rafId: null,
    };
  },
  computed: {
    open() {
      return this.dsAccordion ? this.dsAccordion.isOpen(this.name) : false;
    },
    headerId() { return `${this.name}-header`; },
    bodyId()   { return `${this.name}-body`; },
    panelStyle() {
      return {
        maxHeight: this.open ? `${this.bodyHeight}px` : '0px',
      };
    },
  },
  watch: {
    open() {
      this.measure();
    },
  },
  mounted() {
    this.measure();
    if (this.dsAccordion) this.dsAccordion.registerRef(this.name, this.$refs.header);
    this._ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => this.measure())
      : null;
    if (this._ro && this.$refs.inner) this._ro.observe(this.$refs.inner);
  },
  beforeUnmount() {
    if (this.dsAccordion) this.dsAccordion.unregisterRef(this.name);
    if (this._ro) this._ro.disconnect();
  },
  updated() {
    this.measure();
  },
  methods: {
    measure() {
      if (!this.$refs.inner) return;
      const h = this.$refs.inner.scrollHeight;
      if (h !== this.bodyHeight) this.bodyHeight = h;
    },
    onToggle() {
      if (this.disabled || !this.dsAccordion) return;
      this.dsAccordion.toggle(this.name);
    },
    onKeydown(e) {
      if (!this.dsAccordion) return;
      const k = e.key;
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        this.onToggle();
      } else if (k === 'ArrowDown') {
        e.preventDefault();
        this.dsAccordion.focusNeighbor(this.name, 1);
      } else if (k === 'ArrowUp') {
        e.preventDefault();
        this.dsAccordion.focusNeighbor(this.name, -1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../mixins.scss";

.ds-accordion-item {
  background: var(--ds-surface-elevated);
  border-radius: var(--ds-radius-md);

  & + & {
    border-top: 1px solid var(--ds-border);
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    background: transparent;
    border: 0;
    cursor: pointer;
    text-align: start;
    padding: var(--ds-space-4) var(--ds-space-5);
    color: var(--ds-text);
    font-family: var(--ds-font-heading);
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover:not(:disabled) {
      background-color: var(--ds-surface-sunken);
    }
    &:focus-visible {
      @include ds-focus-ring;
      border-radius: var(--ds-radius-sm);
    }
  }

  &.is-disabled &__header {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-brand-600);
  }

  &__titles {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-normal);
  }

  &__chevron {
    flex: 0 0 auto;
    color: var(--ds-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--ds-duration-base) var(--ds-ease-out);
  }

  &.is-open &__chevron {
    transform: rotate(-180deg);
  }

  &__panel {
    overflow: hidden;
    max-height: 0;
    transition: max-height var(--ds-duration-base) var(--ds-ease-out);
    will-change: max-height;
  }

  &__body {
    padding: 0 var(--ds-space-5) var(--ds-space-4);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: var(--ds-text-md);
    color: var(--ds-text);
    line-height: var(--ds-leading-arabic);
  }
}

:global(html[dir='rtl']) .ds-accordion-item__chevron {
  // chevron SVG points down by default; rotation logic identical in RTL
  // (vertical rotation is direction-agnostic)
}
</style>
