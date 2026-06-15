// Per-locale message loaders.
//
// Each entry is a dynamic `import()` so Vite emits the Arabic and English
// message bundles (~112 KB + ~100 KB of source) as SEPARATE chunks. The app
// boots with ONLY the active locale's chunk (see src/boot/i18n.js); the other
// locale is fetched on demand the first time the user switches language (see
// src/composables/useAppLocale.ts).
//
// This keeps the inactive locale (~100 KB) off the first-load critical path —
// the default Arabic (RTL) users never download the English bundle unless they
// explicitly switch, and vice-versa.
export const localeLoaders = {
  en: () => import('./en'),
  ar: () => import('./ar'),
}

// Resolve a locale's message object, or {} for an unknown locale.
export async function loadLocaleMessages (locale) {
  const loader = localeLoaders[locale]
  if (!loader) return {}
  const mod = await loader()
  return mod.default
}
