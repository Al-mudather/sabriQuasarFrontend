<template>
  <header class="cls-header" role="banner">
    <button
      type="button"
      class="cls-header__exit"
      :aria-label="t('classroom.header.exit')"
      @click="onExit"
    >
      <q-icon name="arrow_back" size="18px" />
      <span class="cls-header__exit-label">{{ t('classroom.header.exit') }}</span>
    </button>

    <h1 class="cls-header__title" :title="title">
      {{ title }}
    </h1>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Loading...',
})

const router = useRouter()
const { t } = useI18n()

function onExit (): void {
  void router.push({ name: 'my-courses' })
}
</script>

<style lang="scss" scoped>
.cls-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  block-size: 56px;
  padding-inline: 16px;
  background: #120E22;
  color: #F5F2EA;
  border-block-end: 1px solid rgba(245, 242, 234, 0.08);

  &__exit {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: transparent;
    border: 1px solid rgba(245, 242, 234, 0.18);
    border-radius: 8px;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover { background: rgba(245, 242, 234, 0.06); }
  }

  &__exit-label {
    font-size: 13px;
  }

  // Absolutely centered in the bar (so it's viewport-centered regardless of the
  // differing widths of the back button and the progress ring). `pointer-events:
  // none` keeps it from blocking those controls; ellipsis + max width prevent a
  // long lesson name from overlapping them.
  &__title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-inline-size: 56%;
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }

}

@media (max-width: 600px) {
  .cls-header {
    gap: 8px;
    padding-inline: 10px;

    &__exit-label { display: none; }
    &__exit { padding: 6px 8px; }
    &__title { font-size: 13px; max-inline-size: 70%; }
  }
}
</style>
