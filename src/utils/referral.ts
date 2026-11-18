/**
 * Referral (registration) code carried in a share link.
 *
 * The marketing page shares `#/register?ref=<pyramidCode>` (MyMarketingPage.vue).
 * Pyramid codes are alphanumeric, e.g. "P029152026" or "P01862012252024".
 * Anything else in `ref` is ignored rather than stored.
 */
const CODE_RE = /^[A-Za-z0-9]{5,32}$/

type QueryValue = string | null | undefined | ReadonlyArray<string | null>

export function referralCodeFromQuery (query: Record<string, QueryValue> | null | undefined): string | null {
  const raw = query?.ref
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value !== 'string') return null
  const code = value.trim()
  return CODE_RE.test(code) ? code : null
}
