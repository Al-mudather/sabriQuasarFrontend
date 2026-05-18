<template>
  <div class="lang-switch" :class="`lang-switch--${variant}`" role="group" :aria-label="$t('settings.language.label')">
    <span class="lang-switch__label" :class="{ 'is-active': locale === 'ar' }">
      {{ $t('common.arabic') }}
    </span>
    <q-toggle
      v-model="isEnglishModel"
      :aria-label="$t('settings.language.label')"
      class="lang-switch__toggle"
      size="sm"
      :color="variant === 'dark' ? 'amber' : 'indigo'"
    />
    <span class="lang-switch__label" :class="{ 'is-active': locale === 'en' }">
      {{ $t('common.english') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppLocale } from 'src/composables/useAppLocale'

withDefaults(defineProps<{
  /** 'light' for cream/ivory surfaces (sidebar, light header). 'dark' for the classroom header chrome. */
  variant?: 'light' | 'dark'
}>(), { variant: 'light' })

const { locale, setLocale } = useAppLocale()

const isEnglishModel = computed<boolean>({
  get: () => locale.value === 'en',
  set: (val) => { void setLocale(val ? 'en' : 'ar') },
})
</script>

<style lang="scss" scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2, 8px);
  padding-block: 6px;
  padding-inline: var(--ds-space-2, 8px);
  border-radius: var(--ds-radius-md, 10px);

  &__label {
    font-family: var(--ds-font-body);
    font-size: 13px;
    font-weight: var(--ds-weight-medium, 500);
    line-height: 1;
    color: var(--ds-taupe, #8a7a6a);
    transition: color var(--ds-duration-fast, 150ms) var(--ds-ease-out, ease-out);
    user-select: none;

    &.is-active {
      color: var(--ds-indigo, #322873);
    }
  }

  &__toggle {
    margin: 0;
  }

  &--dark {
    .lang-switch__label {
      color: rgba(245, 242, 234, 0.55);

      &.is-active {
        color: #F5F2EA;
      }
    }
  }
}
</style>
