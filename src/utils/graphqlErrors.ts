/**
 * Shared extraction of human-readable messages from GraphQL error shapes.
 *
 * Two families reach the UI:
 *  - Payload errors (`data.<mutation>.errors`): a string, `{ message }`,
 *    `{ field: [{ message }] }`, a list of `{ message }`, or (Stripe checkout)
 *    a list of single-key objects such as `[{ stripe: "…" }]`.
 *  - Top-level errors (`result.errors[].message`), which with Apollo's
 *    `errorPolicy: 'all'` arrive in the result instead of being thrown.
 */
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

/** Top-level GraphQL / Apollo errors (`result.errors[].message`). */
export const resultErrorMessages = collectErrorMessages

function walkPayload (value: unknown, depth: number): string[] {
  if (value == null || depth > 4) return []
  if (typeof value === 'string') return value ? [value] : []
  if (Array.isArray(value)) return value.flatMap((v) => walkPayload(v, depth + 1))
  if (typeof value !== 'object') return []
  const obj = value as Record<string, unknown>
  if (typeof obj.message === 'string' && obj.message) return [obj.message]
  // Field map or single-key object: every value may itself carry messages.
  return Object.values(obj).flatMap((v) => walkPayload(v, depth + 1))
}

/** Messages from a mutation payload's own `errors` field. */
export function payloadErrorMessages (errors: unknown): string[] {
  return walkPayload(errors, 0)
}

/** True when any message from either walker matches `re`. */
export function matchesError (source: unknown, re: RegExp): boolean {
  return [...payloadErrorMessages(source), ...resultErrorMessages(source)].some((m) => re.test(m))
}
