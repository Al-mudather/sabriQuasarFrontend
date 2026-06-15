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
import { loadLocaleMessages } from 'src/i18n'
import { useSettingsStore } from 'src/stores/settings'

export type AppLocale = 'ar' | 'en'

// Minimal view of the legacy vue-i18n global (typed as `Composer | VueI18n`
// depending on version; we only touch these three members).
type LegacyI18nGlobal = {
  locale: AppLocale
  availableLocales: readonly string[]
  setLocaleMessage: (locale: string, message: Record<string, unknown>) => void
}

const i18nGlobal = i18n.global as unknown as LegacyI18nGlobal

// The app boots with only the active locale's messages (see boot/i18n.js).
// Before switching TO a locale, make sure its bundle is loaded — fetched once,
// then cached by vue-i18n for the rest of the session.
async function ensureLocaleMessages (next: AppLocale): Promise<void> {
  if (i18nGlobal.availableLocales.includes(next)) return
  const msgs = await loadLocaleMessages(next)
  i18nGlobal.setLocaleMessage(next, msgs)
}

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
  i18nGlobal.locale = next
}

/**
 * Runtime locale setter. Use from `<script setup>` or any code that runs
 * after Pinia is registered. Idempotent: calling with the current locale
 * is a no-op for the store but still re-syncs DOM + Quasar (cheap).
 *
 * Awaits the target locale's message bundle first (lazy-loaded on first
 * switch — see boot/i18n.js) so the flip never renders a half-translated UI.
 */
export async function setAppLocale (next: AppLocale): Promise<void> {
  await ensureLocaleMessages(next)
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
