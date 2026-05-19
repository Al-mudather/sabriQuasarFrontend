// Locale-aware Intl wrappers. Reactive: re-renders when the app locale
// flips through `useAppLocale.setLocale`. Use these instead of new
// Intl.NumberFormat('ar-SA') / new Intl.DateTimeFormat('ar-EG') so
// numbers and dates flip language with everything else.
//
// Usage in a `<script setup>`:
//   const { numberLocale, formatNumber, formatDate, formatCurrency } = useIntl()
//   const display = computed(() => formatNumber(price, { maximumFractionDigits: 2 }))

import { computed, type ComputedRef } from 'vue'
import { useAppLocale } from 'src/composables/useAppLocale'

/** Tagged BCP-47 locales we use for Intl APIs. */
export type IntlLocale = 'ar-EG' | 'en-US'

export function useIntl (): {
  /** Current locale tag for Intl.NumberFormat — `'ar-EG'` or `'en-US'`. */
  numberLocale: ComputedRef<IntlLocale>
  /** Current locale tag for Intl.DateTimeFormat — `'ar-EG'` or `'en-US'`. */
  dateLocale: ComputedRef<IntlLocale>
  /** Current 2-letter locale code — `'ar'` or `'en'`. */
  shortLocale: ComputedRef<'ar' | 'en'>
  /** Format a number per current locale. */
  formatNumber: (value: number, opts?: Intl.NumberFormatOptions) => string
  /** Format a currency value per current locale. */
  formatCurrency: (value: number, currency: string, opts?: Intl.NumberFormatOptions) => string
  /** Format a Date / date-string / timestamp per current locale. */
  formatDate: (value: Date | string | number, opts?: Intl.DateTimeFormatOptions) => string
  /** Format a relative-time delta (e.g. "3 hours ago"). Accepts an absolute date. */
  formatRelativeTime: (value: Date | string | number) => string
} {
  const { locale } = useAppLocale()
  const shortLocale = locale
  const numberLocale = computed<IntlLocale>(() => (locale.value === 'en' ? 'en-US' : 'ar-EG'))
  const dateLocale = computed<IntlLocale>(() => (locale.value === 'en' ? 'en-US' : 'ar-EG'))

  function formatNumber (value: number, opts?: Intl.NumberFormatOptions): string {
    if (!Number.isFinite(value)) return ''
    return new Intl.NumberFormat(numberLocale.value, opts).format(value)
  }

  function formatCurrency (value: number, currency: string, opts?: Intl.NumberFormatOptions): string {
    if (!Number.isFinite(value)) return ''
    return new Intl.NumberFormat(numberLocale.value, { style: 'currency', currency, ...opts }).format(value)
  }

  function formatDate (value: Date | string | number, opts?: Intl.DateTimeFormatOptions): string {
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat(dateLocale.value, opts).format(d)
  }

  // Relative-time units, ordered smallest → largest. Picks the largest
  // unit whose absolute delta is < threshold.
  const UNITS: { sec: number; unit: Intl.RelativeTimeFormatUnit; div?: number }[] = [
    { sec: 60,       unit: 'second' },
    { sec: 3600,     unit: 'minute', div: 60 },
    { sec: 86400,    unit: 'hour',   div: 3600 },
    { sec: 604800,   unit: 'day',    div: 86400 },
    { sec: 2629800,  unit: 'week',   div: 604800 },
    { sec: 31557600, unit: 'month',  div: 2629800 },
    { sec: Infinity, unit: 'year',   div: 31557600 },
  ]

  function formatRelativeTime (value: Date | string | number): string {
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    const diffSec = Math.round((d.getTime() - Date.now()) / 1000)
    try {
      const rtf = new Intl.RelativeTimeFormat(shortLocale.value, { numeric: 'auto' })
      const abs = Math.abs(diffSec)
      for (const u of UNITS) {
        if (abs < u.sec) {
          const div = u.div ?? 1
          return rtf.format(Math.round(diffSec / div), u.unit)
        }
      }
      return rtf.format(Math.round(diffSec / 31557600), 'year')
    } catch {
      return ''
    }
  }

  return { numberLocale, dateLocale, shortLocale, formatNumber, formatCurrency, formatDate, formatRelativeTime }
}
