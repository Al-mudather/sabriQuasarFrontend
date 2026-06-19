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

    <div class="cls-header__meta">
      <ClassroomProgressRing
        :percent="safePercent"
        :size="36"
        :stroke="3"
        :show-label="true"
        :aria-label="t('classroom.header.progressLabel')"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ClassroomProgressRing from 'src/components/classroom/ClassroomProgressRing.vue'

interface Props {
  title?: string
  percent?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Loading...',
  percent: 0,
})

const router = useRouter()
const { t } = useI18n()

const safePercent = computed<number>(() => {
  const raw = Number(props.percent)
  if (!Number.isFinite(raw)) return 0
  return Math.max(0, Math.min(100, Math.round(raw)))
})

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

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__progress {
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: #F5F2EA;
    opacity: 0.9;
  }

}

@media (max-width: 600px) {
  .cls-header {
    gap: 8px;
    padding-inline: 10px;

    &__exit-label { display: none; }
    &__exit { padding: 6px 8px; }
    &__title { font-size: 13px; max-inline-size: 60%; }
    &__meta { gap: 6px; }
  }
}
</style>
