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

/**
 * Marketer code carried in a course link.
 *
 * Current links put it in its own segment: #/course/<name>/<code>/<pk>/<id>.
 * The pre-2026 course page shared #/course/<code>/<pk>/<id> instead, so the code
 * lands in the `name` slot. Backend codes are "P0" + user pk + MMDDYYYY
 * (pyramid_marketing_management/models.py), which no course title matches.
 */
const PYRAMID_CODE_RE = /^P0\d{7,}$/i

export function referralCodeFromCourseParams (params: Record<string, unknown> | null | undefined): string | null {
  const pick = (v: unknown): string => (Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '')).trim()
  const code = pick(params?.code)
  if (code && CODE_RE.test(code)) return code
  const name = pick(params?.name)
  return PYRAMID_CODE_RE.test(name) ? name : null
}
