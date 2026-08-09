/**
 * The platform prices and sells in ONE currency: US dollars.
 *
 * There used to be a user-facing SDG/USD switcher (`components/Home/Currency.vue`)
 * backed by a persisted `settings.currency` field. Both are gone — pricing is
 * unified on USD, so there is nothing left to switch and nothing left to convert.
 *
 * Course pricing still arrives from the backend as `CourseNode.currency`, a
 * JSONString map keyed by currency code (`{"USD": 120, "SDG": 90000, …}`) that
 * the Apollo typePolicy in `src/apollo/client.js` parses at read time. We simply
 * only ever read the USD key. Every price surface must import this constant
 * rather than hardcoding a code, so a future currency change is one edit.
 */
export const DISPLAY_CURRENCY = 'USD' as const

export type DisplayCurrency = typeof DISPLAY_CURRENCY

/**
 * A parsed course pricing map. Deliberately `Partial<Record<string, …>>` rather
 * than `Record<string, number>` so it accepts both the codegen shape
 * (`Record<string, number>`, from the JSONString scalar) and the narrowed
 * feature alias `CoursePricing` (`Partial<Record<CurrencyCode, number>>`)
 * without a cast at any call site.
 */
export type PriceMap = Partial<Record<string, number>>

/**
 * Read the USD amount out of a parsed `CourseNode.currency` map.
 *
 * Returns `null` when the map is missing or carries no usable USD price, so
 * callers can distinguish "no price yet" from a genuine 0 (free course). The
 * value is re-parsed rather than trusted as a number because the backend sends
 * these as a JSONString and has been observed to encode amounts as strings.
 */
export function usdPriceOf (map: PriceMap | null | undefined): number | null {
  if (!map || typeof map !== 'object') return null
  const raw: unknown = map[DISPLAY_CURRENCY]
  if (raw == null) return null
  const value = typeof raw === 'number' ? raw : parseFloat(String(raw))
  return Number.isFinite(value) ? value : null
}
