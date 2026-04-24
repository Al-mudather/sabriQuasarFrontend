<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  actionLabel?: string
}

defineProps<Props>()
defineEmits<{ action: [] }>()
</script>

<template>
  <div class="cls-empty" role="status">
    <q-icon
      v-if="icon"
      :name="icon"
      size="80px"
      class="cls-empty__icon"
      aria-hidden="true"
    />
    <h3 class="cls-empty__title">{{ title }}</h3>
    <p v-if="description" class="cls-empty__desc">{{ description }}</p>
    <q-btn
      v-if="actionLabel"
      class="cls-empty__action"
      unelevated
      no-caps
      :label="actionLabel"
      @click="$emit('action')"
    />
  </div>
</template>

<style lang="scss" scoped>
.cls-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
  padding: var(--ds-space-8) var(--ds-space-6);
  background: var(--cls-surface);
  color: var(--cls-text-primary);
  gap: var(--ds-space-3);

  &__icon {
    color: var(--cls-text-dim);
    margin-bottom: var(--ds-space-2);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
    line-height: var(--ds-leading-tight);
  }

  &__desc {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--cls-text-muted);
    line-height: var(--ds-leading-normal);
  }

  &__action {
    margin-top: var(--ds-space-4);
    background: var(--cls-accent);
    color: var(--cls-text-primary);
    border-radius: var(--cls-radius-md);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-semibold);
    padding: var(--ds-space-2) var(--ds-space-5);
    transition:
      transform var(--cls-dur-fast) var(--cls-ease),
      filter var(--cls-dur-fast) var(--cls-ease);

    &:hover {
      filter: brightness(1.08);
    }

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }
}
</style>
