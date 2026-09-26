/**
 * PyramidAffiliate (registration-code) fault detection.
 *
 * The backend does not return a typed error code for registration-code
 * problems — it lets the raw Django ORM exception text through in the GraphQL
 * `errors[]` array, with `data.<field>: null`. Two distinct dialects show up:
 *
 *   MISSING    "PyramidAffiliate matching query does not exist."
 *              The user never entered a registration code. Recoverable by the
 *              user: send them to the registration-code page.
 *
 *   DUPLICATE  "get() returned more than one PyramidAffiliate -- it returned 2!"
 *              The account is linked to MORE THAN ONE affiliate row. This is a
 *              data-integrity fault on the server, NOT something the user did
 *              or can fix — every affiliate-touching call for that account will
 *              keep failing until someone deletes the duplicate row.
 *
 * Why this file exists: the duplicate case used to be invisible. Apollo is
 * configured with `errorPolicy: 'all'` (src/apollo/client.js), so a top-level
 * GraphQL error does NOT throw — it arrives as `result.errors` alongside
 * `data.<field> === null`. The checkout code only ever inspected the payload's
 * own `data.<field>.errors`, so a duplicate-affiliate rejection fell through to
 * the generic fallback and told the user
 * "لم يتم قبول الإيصال، يرجى التأكد من وضوح الصورة" — blaming their receipt
 * photo for a broken database row. They would then re-crop and re-upload the
 * same image forever.
 *
 * Everything here is text matching against server exception strings, which is
 * fragile by nature. It is contained in this one module so there is exactly one
 * place to update if the backend ever starts returning real error codes.
 */

import logger from 'src/utils/logger'
import { toast } from 'src/design-system/toast'
import { i18n } from 'src/boot/i18n'

/** A registration-code fault the UI must react to differently. */
export type PyramidAffiliateFault = 'missing' | 'duplicate'

/**
 * Short, quotable handle the user can read out to support and we can grep for
 * in logs. Rendered inside the user-facing message on purpose.
 */
export const DUPLICATE_AFFILIATE_CODE = 'DUP-AFFILIATE'

const MISSING_RE = /PyramidAffiliate matching query does not exist/i
// Django's MultipleObjectsReturned text. The trailing count varies ("2", "3"),
// and `get()` may be spelled with the queryset in front, so match the stable
// middle of the sentence only.
const DUPLICATE_RE = /returned more than one PyramidAffiliate/i

interface MessageLike { message?: unknown }

/**
 * Pull every candidate error string out of whatever the caller has in hand.
 * Accepts, in any nesting: a raw string, an `Error`/`ApolloError` (including
 * its `graphQLErrors` / `networkError`), an array of `{ message }`, or an
 * Apollo result object (`{ errors }`) — because the same fault reaches us
 * through all of those shapes depending on the operation and errorPolicy.
 */
export function collectErrorMessages (source: unknown, depth = 0): string[] {
  if (source == null || depth > 4) return []
  if (typeof source === 'string') return source ? [source] : []
  if (Array.isArray(source)) return source.flatMap((s) => collectErrorMessages(s, depth + 1))

  if (typeof source !== 'object') return []
  const obj = source as MessageLike & Record<string, unknown>
  const out: string[] = []
  if (typeof obj.message === 'string' && obj.message) out.push(obj.message)
  for (const key of ['errors', 'graphQLErrors', 'networkError'] as const) {
    if (obj[key] != null) out.push(...collectErrorMessages(obj[key], depth + 1))
  }
  return out
}

/**
 * Classify a PyramidAffiliate fault, or `null` when the source says nothing
 * about affiliates. `duplicate` wins over `missing` when both appear, since it
 * is the one the user cannot act on alone.
 */
export function pyramidAffiliateFault (source: unknown): PyramidAffiliateFault | null {
  const messages = collectErrorMessages(source)
  if (messages.some((m) => DUPLICATE_RE.test(m))) return 'duplicate'
  if (messages.some((m) => MISSING_RE.test(m))) return 'missing'
  return null
}

/** True when the source carries the duplicate-affiliate data fault. */
export function isDuplicateAffiliateError (source: unknown): boolean {
  return pyramidAffiliateFault(source) === 'duplicate'
}

/**
 * Log the fault with its raw server text. `logger.error` always forwards, in
 * production too, so the exact exception is in the console of the device that
 * hit it — which is how this was diagnosed in the first place.
 */
export function logDuplicateAffiliate (where: string, source: unknown): void {
  logger.error(
    `[${DUPLICATE_AFFILIATE_CODE}] ${where}: the account is linked to more than one ` +
    'PyramidAffiliate row. This is a server-side data fault — the duplicate row must be ' +
    'removed before any affiliate-touching operation (checkout, receipt upload, ' +
    'commission) can succeed for this user. Raw server error(s):',
    collectErrorMessages(source),
  )
}

/**
 * The one user-facing message for this fault, shared by every checkout surface
 * that can hit it (cart, payment page, Bankak receipt) so the wording — and the
 * DUP-AFFILIATE code the user quotes to support — cannot drift between them.
 *
 * Sticky (`duration: 0`) on purpose: this is not retryable. Re-cropping the
 * receipt, re-uploading, or re-entering a registration code will never clear it
 * — only deleting the duplicate row server-side will — so the message must
 * survive long enough to be read, screenshotted and quoted, rather than
 * vanishing on the usual 5s error timeout. The action button is what dismisses
 * it, since a sticky toast has no timer of its own.
 */
export function notifyDuplicateAffiliate (): void {
  const t = (key: string): string => i18n.global.t(key) as unknown as string
  toast.danger(
    `${t('تعذّر إتمام العملية: حسابك مرتبط بأكثر من رمز تسجيل')}. ` +
    t('هذه مشكلة في بيانات الحساب لدينا وليست في الإيصال أو الصورة. يرجى التواصل مع الدعم وذكر رمز الخطأ: DUP-AFFILIATE'),
    { duration: 0, actions: [{ label: t('حسناً') }] },
  )
}

/**
 * Classify `source`; if it carries the duplicate-affiliate fault, log the raw
 * server text and show the message. Returns `true` when handled, so the caller
 * stops instead of falling through to a generic, misleading error.
 */
export function reportDuplicateAffiliate (where: string, source: unknown): boolean {
  if (!isDuplicateAffiliateError(source)) return false
  logDuplicateAffiliate(where, source)
  notifyDuplicateAffiliate()
  return true
}
