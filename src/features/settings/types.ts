/**
 * Settings feature — source of truth for runtime UI settings
 * (currency + language). Values are persisted by the Pinia settings store.
 */

// Currency codes referenced across the app. Sources cross-checked:
//   - src/stores/settings.js (default 'SDG')
//   - src/components/Home/Currency.vue (user-selectable: 'SDG', 'USD')
//   - src/components/shared/PriceDisplay.vue ('SAR', 'AED' symbol map)
//   - src/components/Home/CategorySection.vue, CourseDetails.vue ('SAR' fallback)
// Course.currency is a JSONString scalar in the schema that maps currency
// code -> price; we narrow that map to this closed union downstream.
export type CurrencyCode = 'USD' | 'SAR' | 'AED' | 'SDG'

// Course.currency is a JSONString scalar in the schema; codegen maps it to
// Record<string, number>. Narrow it here to a closed CurrencyCode map so
// callers get autocomplete and exhaustiveness.
export type CurrencyPriceMap = Partial<Record<CurrencyCode, number>>

// Supported UI languages, per src/i18n/ (ar, en).
export type LanguageCode = 'ar' | 'en'

export interface SettingsState {
  currency: CurrencyCode
  language: LanguageCode
}
