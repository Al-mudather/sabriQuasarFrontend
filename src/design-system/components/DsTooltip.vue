<template>
  <span class="ds-tooltip-trigger">
    <slot />
    <q-tooltip
      :anchor="anchor"
      :self="self"
      :offset="[0, 8]"
      :delay="delay"
      transition-show="fade"
      transition-hide="fade"
      content-class="ds-tooltip"
    >
      {{ text }}
    </q-tooltip>
  </span>
</template>

<script>
const POSITION_MAP = {
  top:    { anchor: "top middle",    self: "bottom middle" },
  bottom: { anchor: "bottom middle", self: "top middle" },
  start:  { anchor: "center start",  self: "center end" },
  end:    { anchor: "center end",    self: "center start" },
};

export default {
  name: "DsTooltip",
  props: {
    text: { type: String, required: true },
    position: {
      type: String,
      default: "top",
      validator: (v) => ["top", "bottom", "start", "end"].includes(v),
    },
    delay: { type: Number, default: 400 },
  },
  computed: {
    resolved() {
      return POSITION_MAP[this.position] || POSITION_MAP.top;
    },
    anchor() { return this.resolved.anchor; },
    self()   { return this.resolved.self; },
  },
};
</script>

<style lang="scss">
.ds-tooltip-trigger {
  display: inline-flex;
}

.ds-tooltip.q-tooltip {
  background: var(--ds-ink);
  color: var(--ds-cream);
  border-radius: var(--ds-radius-sm);
  padding: 0.5rem 0.75rem;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 12px;
  line-height: var(--ds-leading-arabic);
  max-width: 240px;
  box-shadow: var(--ds-shadow-md);
  position: relative;

  // Arrow
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
  }

  &[data-v-anchor*="top"]::after,
  &.ds-tooltip--top::after {
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--ds-ink);
  }
}
</style>
