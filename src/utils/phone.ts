// Phone number helpers for global (any-country) phone entry.
//
// All numbers are persisted in E.164 (`+249912345678`) so the three formats
// that historically coexisted in phoneNumber/phoneNumber2/phoneNumber3
// (raw `09…`, dial-code-prefixed, bare digits) converge on one canonical
// shape. `splitE164` accepts all the legacy shapes on the way in.
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/min'

export type { CountryCode }

export interface CountryOption {
  iso: CountryCode
  name: string
  dialCode: string
  flag: string
}

// 🇸🇩 etc. — two regional-indicator code points derived from the ISO code.
export function countryFlag (iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(0x1f1a5 + ch.charCodeAt(0)))
}

const optionsCache = new Map<string, CountryOption[]>()

// Every country libphonenumber knows, named in the given locale via
// Intl.DisplayNames (no bundled country-name dataset needed).
export function getCountryOptions (locale: string): CountryOption[] {
  const key = locale || 'en'
  const cached = optionsCache.get(key)
  if (cached) return cached

  let displayNames: Intl.DisplayNames | null = null
  try {
    displayNames = new Intl.DisplayNames([key], { type: 'region' })
  } catch {
    displayNames = null
  }

  const options: CountryOption[] = getCountries().map((iso) => ({
    iso,
    name: displayNames?.of(iso) ?? iso,
    dialCode: `+${getCountryCallingCode(iso)}`,
    flag: countryFlag(iso),
  }))
  options.sort((a, b) => a.name.localeCompare(b.name, key))

  optionsCache.set(key, options)
  return options
}

// National input -> canonical E.164, or null when not a valid number for
// that country.
export function toE164 (iso: CountryCode, national: string): string | null {
  const parsed = parsePhoneNumberFromString(national, iso)
  return parsed?.isValid() ? parsed.number : null
}

// Stored value -> { country, national digits } for prefilling the input.
// Handles the legacy shapes: E.164 (`+2499…`), and country-less local
// numbers (`0912345678`) which are retried against the fallback country.
// Unparseable values are returned verbatim so the user sees and fixes them —
// never re-prefixed (this is what fixes the historical double-dial-code bug).
export function splitE164 (
  stored: string | null | undefined,
  fallbackIso: CountryCode = 'SD',
): { iso: CountryCode, national: string } {
  const raw = (stored ?? '').trim()
  if (!raw) return { iso: fallbackIso, national: '' }

  const parsed =
    parsePhoneNumberFromString(raw) ??
    parsePhoneNumberFromString(raw, fallbackIso)
  if (parsed) {
    const iso = parsed.country ?? parsed.getPossibleCountries()[0] ?? fallbackIso
    return { iso, national: parsed.nationalNumber }
  }
  return { iso: fallbackIso, national: raw }
}
