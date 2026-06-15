<template>
  <!-- Compact single-button popup (used in the dense desktop header). One
       button shows the current language; clicking opens a menu to pick. -->
  <div
    v-if="mode === 'menu'"
    class="lang-switch lang-switch--menu"
    :class="`lang-switch--${variant}`"
  >
    <button
      type="button"
      class="lang-switch__trigger"
      :aria-label="$t('settings.language.label')"
    >
      <svg
        class="lang-switch__globe"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z" />
      </svg>
      <span class="lang-switch__current">{{ currentLabel }}</span>
      <svg
        class="lang-switch__caret"
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>

      <q-menu
        anchor="bottom end"
        self="top end"
        :offset="[0, 8]"
        class="lang-switch__menu"
      >
        <q-list class="lang-switch__list">
          <q-item
            v-for="opt in options"
            :key="opt.value"
            v-close-popup
            clickable
            :active="locale === opt.value"
            class="lang-switch__option"
            @click="choose(opt.value)"
          >
            <q-item-section>{{ opt.label }}</q-item-section>
            <q-item-section v-if="locale === opt.value" side>
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </button>
  </div>

  <!-- Default inline toggle (sidebar, drawer, classroom header). -->
  <div
    v-else
    class="lang-switch"
    :class="`lang-switch--${variant}`"
    role="group"
    :aria-label="$t('settings.language.label')"
  >
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
import { useAppLocale, type AppLocale } from 'src/composables/useAppLocale'

withDefaults(defineProps<{
  /** 'light' for cream/ivory surfaces (sidebar, light header). 'dark' for the classroom header chrome. */
  variant?: 'light' | 'dark'
  /** 'toggle' = inline Arabic/English switch (default). 'menu' = compact single button + popup. */
  mode?: 'toggle' | 'menu'
}>(), { variant: 'light', mode: 'toggle' })

const { locale, setLocale } = useAppLocale()

const isEnglishModel = computed<boolean>({
  get: () => locale.value === 'en',
  set: (val) => { void setLocale(val ? 'en' : 'ar') },
})

// Each language is shown in its OWN script — the conventional, locale-agnostic
// way to present a language picker.
const options: { value: AppLocale; label: string }[] = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
]

const currentLabel = computed<string>(
  () => (locale.value === 'en' ? 'English' : 'العربية'),
)

function choose (next: AppLocale): void {
  if (next !== locale.value) void setLocale(next)
}
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

/* ---------- Menu mode (compact single button) ---------- */
.lang-switch--menu {
  padding: 0;
}

.lang-switch__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--ds-border, rgba(50, 40, 115, 0.16));
  border-radius: var(--ds-radius-pill, 999px);
  color: var(--ds-ink, #2a2438);
  font-family: var(--ds-font-body);
  font-size: 13px;
  font-weight: var(--ds-weight-medium, 500);
  line-height: 1;
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast, 150ms) var(--ds-ease-out, ease-out),
    border-color     var(--ds-duration-fast, 150ms) var(--ds-ease-out, ease-out),
    color            var(--ds-duration-fast, 150ms) var(--ds-ease-out, ease-out);

  &:hover,
  &:focus-visible {
    background: var(--ds-cream-sunken, rgba(50, 40, 115, 0.06));
    border-color: var(--ds-border-strong, rgba(50, 40, 115, 0.28));
    color: var(--ds-indigo, #322873);
    outline: none;
  }
}

.lang-switch__globe {
  flex: 0 0 auto;
  color: var(--ds-indigo, #322873);
}

.lang-switch__current {
  white-space: nowrap;
}

.lang-switch__caret {
  flex: 0 0 auto;
  color: var(--ds-taupe, #8a7a6a);
}

/* Dark variant trigger (classroom / indigo chrome). */
.lang-switch--menu.lang-switch--dark .lang-switch__trigger {
  color: rgba(245, 242, 234, 0.85);
  border-color: rgba(245, 242, 234, 0.22);

  .lang-switch__globe { color: #F5F2EA; }
  .lang-switch__caret { color: rgba(245, 242, 234, 0.6); }

  &:hover,
  &:focus-visible {
    background: rgba(245, 242, 234, 0.12);
    border-color: rgba(245, 242, 234, 0.4);
    color: #F5F2EA;
  }
}
</style>

<style lang="scss">
/* Unscoped: the q-menu teleports to <body>, so its inner styling can't be
   scoped to this component. Namespaced under .lang-switch__menu to stay local. */
.lang-switch__menu .lang-switch__list {
  min-inline-size: 160px;
  padding: 4px;
}

.lang-switch__menu .lang-switch__option {
  border-radius: var(--ds-radius-sm, 8px);
  font-family: var(--ds-font-body);
  font-size: 14px;
  min-height: 40px;
  color: var(--ds-ink, #2a2438);

  &.q-item--active {
    color: var(--ds-indigo, #322873);
    font-weight: var(--ds-weight-semibold, 600);
    background: var(--ds-cream-sunken, rgba(50, 40, 115, 0.06));
  }
}
</style>
