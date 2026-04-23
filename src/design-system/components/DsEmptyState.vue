<template>
  <div class="ds-empty" :class="`ds-empty--${size}`" role="status">
    <div v-if="$slots.illustration || icon" class="ds-empty__art">
      <slot name="illustration">
        <img v-if="icon" :src="icon" :alt="title || ''" />
      </slot>
    </div>
    <h3 v-if="title" class="ds-empty__title">{{ title }}</h3>
    <p v-if="description || $slots.description" class="ds-empty__desc">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.actions" class="ds-empty__actions"><slot name="actions" /></div>
  </div>
</template>

<script>
export default {
  name: 'DsEmptyState',
  props: {
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
    icon:        { type: String, default: null },
    size:        { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) }
  }
}
</script>

<style lang="scss" scoped>
.ds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--ds-space-3);
  padding-block: var(--ds-space-10);
  padding-inline: var(--ds-space-4);
  color: var(--ds-text);

  &--sm { padding-block: var(--ds-space-6);  max-inline-size: 26rem; margin-inline: auto; }
  &--md { padding-block: var(--ds-space-10); max-inline-size: 32rem; margin-inline: auto; }
  &--lg { padding-block: var(--ds-space-16); max-inline-size: 38rem; margin-inline: auto; }

  &__art img {
    inline-size: auto;
    block-size: auto;
    max-inline-size: 160px;
    max-block-size: 160px;
    opacity: 0.9;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__desc {
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text-muted);
    margin: 0;
    max-inline-size: 42ch;
  }

  &__actions {
    display: flex;
    gap: var(--ds-space-3);
    margin-block-start: var(--ds-space-2);
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
