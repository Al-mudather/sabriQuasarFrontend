/**
 * Settings feature — source of truth for runtime UI settings (language).
 * Values are persisted by the Pinia settings store.
 *
 * NOTE: currency is no longer a *setting*. The platform sells in USD only, so
 * the display currency is the compile-time constant `DISPLAY_CURRENCY` in
 * `src/utils/currency.ts` — not a user preference. The SDG/USD switcher and the
 * persisted `settings.currency` field were both removed.
 */

// The one currency the UI ever displays. Kept as a named type (rather than a
// bare 'USD' literal scattered around) so re-introducing a second currency is a
// typed change with a compiler-visible blast radius.
export type CurrencyCode = 'USD'

// Course.currency is a JSONString scalar in the schema; codegen maps it to
// Record<string, number>. Narrow it here to a closed CurrencyCode map so
// callers get autocomplete and exhaustiveness.
export type CurrencyPriceMap = Partial<Record<CurrencyCode, number>>

// Supported UI languages, per src/i18n/ (ar, en).
export type LanguageCode = 'ar' | 'en'

export interface SettingsState {
  language: LanguageCode
}
