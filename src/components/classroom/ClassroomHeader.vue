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

      <button
        type="button"
        class="cls-header__lang"
        :aria-label="locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'"
        @click="toggleLocale"
      >
        {{ locale === 'ar' ? 'EN' : 'ع' }}
      </button>
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
const { t, locale } = useI18n()

const safePercent = computed<number>(() => {
  const raw = Number(props.percent)
  if (!Number.isFinite(raw)) return 0
  return Math.max(0, Math.min(100, Math.round(raw)))
})

function onExit (): void {
  void router.push({ name: 'my-courses' })
}

function toggleLocale (): void {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}
</script>

<style lang="scss" scoped>
.cls-header {
  display: flex;
  align-items: center;
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

  &__title {
    flex: 1 1 auto;
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

  &__lang {
    inline-size: 36px;
    block-size: 32px;
    background: transparent;
    border: 1px solid rgba(245, 242, 234, 0.18);
    border-radius: 8px;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover { background: rgba(245, 242, 234, 0.06); }
  }
}

@media (max-width: 600px) {
  .cls-header {
    gap: 8px;
    padding-inline: 10px;

    &__exit-label { display: none; }
    &__exit { padding: 6px 8px; }
    &__title { font-size: 13px; }
    &__meta { gap: 6px; }
  }
}
</style>
