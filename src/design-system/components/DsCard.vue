<template>
  <component
    :is="tag"
    class="ds-card"
    :class="[
      `ds-card--${elevation}`,
      { 'ds-card--interactive': interactive, 'ds-card--flat': elevation === 'flat' }
    ]"
    :tabindex="interactive ? 0 : null"
    :role="interactive ? 'button' : null"
    @click="interactive && $emit('click', $event)"
    @keydown.enter="interactive && $emit('click', $event)"
    @keydown.space.prevent="interactive && $emit('click', $event)"
  >
    <div v-if="$slots.media" class="ds-card__media"><slot name="media" /></div>
    <div class="ds-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ds-card__footer"><slot name="footer" /></div>
  </component>
</template>

<script>
export default {
  name: 'DsCard',
  props: {
    tag:         { type: String,  default: 'div' },
    elevation:   {
      type: String,
      default: 'sm',
      validator: v => ['flat', 'xs', 'sm', 'md', 'lg'].includes(v)
    },
    interactive: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
@import '../mixins.scss';

.ds-card {
  display: flex;
  flex-direction: column;
  background: var(--ds-surface);
  border-radius: var(--ds-radius-lg);
  overflow: hidden;
  transition:
    transform var(--ds-duration-base) var(--ds-ease-out),
    box-shadow var(--ds-duration-base) var(--ds-ease-out);

  &--flat { box-shadow: none; border: 1px solid var(--ds-border); }
  &--xs   { box-shadow: var(--ds-shadow-xs); }
  &--sm   { box-shadow: var(--ds-shadow-sm); }
  &--md   { box-shadow: var(--ds-shadow-md); }
  &--lg   { box-shadow: var(--ds-shadow-lg); }

  &--interactive {
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--ds-shadow-lg);
    }
    &:focus-visible { @include ds-focus-ring; }
  }

  &__media {
    position: relative;
    line-height: 0;
    ::v-deep img, ::v-deep video {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 16 / 10;
      object-fit: cover;
    }
  }

  &__body {
    padding: var(--ds-space-4);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    flex: 1;
  }

  &__footer {
    padding: 0 var(--ds-space-4) var(--ds-space-4);
  }
}
</style>
