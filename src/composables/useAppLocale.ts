// Canonical control center for the app's UI locale.
//
// Anyone wanting to switch between Arabic and English — sidebar toggle,
// classroom header, marketing navbar, automated tests, programmatic deep
// links — calls through here. The composable funnels every flip into a
// single function so the four things that have to move in lockstep stay
// in lockstep:
//
//   1. settings.isEnglish  — Pinia state, persisted to LocalStorage
//   2. i18n.global.locale  — vue-i18n active language
//   3. Quasar.lang pack    — Quasar widget language + rtl flag
//   4. <html dir / lang>   — document-level direction + language attrs
//
// Previously each layout (Main / User / Home) carried its own
// `applyLocale()` clone and the classroom header twiddled `locale.value`
// directly. Three sources of truth → drift was inevitable.

import { computed, type ComputedRef } from 'vue'
import { Quasar } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { useSettingsStore } from 'src/stores/settings'

export type AppLocale = 'ar' | 'en'

async function loadQuasarLang (next: AppLocale): Promise<void> {
  try {
    const pack = next === 'en'
      ? await import('quasar/lang/en-US')
      : await import('quasar/lang/ar')
    Quasar.lang.set({ ...pack.default, rtl: next === 'ar' })
  } catch {
    /* lang pack missing in this build — leave Quasar's current pack alone */
  }
}

function syncDom (next: AppLocale): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', next)
}

function applyI18nLocale (next: AppLocale): void {
  // i18n was created with `legacy: true`, so `i18n.global.locale` is a
  // plain string (not a Ref). Setting it triggers reactivity throughout
  // the app for both Options-API `$t()` and Composition-API `t()` calls.
  // The cast keeps the file vue-i18n-v10-compatible — legacy mode types
  // `locale` as `Composer | VueI18n['locale']` depending on the version.
  ;(i18n.global as unknown as { locale: AppLocale }).locale = next
}

/**
 * Runtime locale setter. Use from `<script setup>` or any code that runs
 * after Pinia is registered. Idempotent: calling with the current locale
 * is a no-op for the store but still re-syncs DOM + Quasar (cheap).
 */
export async function setAppLocale (next: AppLocale): Promise<void> {
  const settings = useSettingsStore()
  settings.setIsEnglish(next === 'en')
  applyI18nLocale(next)
  syncDom(next)
  await loadQuasarLang(next)
}

/**
 * Composable accessor. Returns a reactive `locale` plus the canonical
 * setters. Bind UI controls via `setLocale` / `toggle`; read `locale`
 * in templates or computeds.
 */
export function useAppLocale (): {
  locale: ComputedRef<AppLocale>
  setLocale: (next: AppLocale) => Promise<void>
  toggle: () => Promise<void>
} {
  const settings = useSettingsStore()
  const locale = computed<AppLocale>(() => (settings.isEnglish ? 'en' : 'ar'))
  return {
    locale,
    setLocale: setAppLocale,
    toggle: () => setAppLocale(locale.value === 'ar' ? 'en' : 'ar'),
  }
}
