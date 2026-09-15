// Recognises the two shapes the backend uses to say "there is no logged-in
// user behind this request" — it silently treats an expired, malformed, or
// missing JWT as anonymous, so this is the ONLY signal the client gets that a
// session has died:
//
//   1. graphql_jwt `login_required` on queries — a top-level GraphQL error
//      "You do not have permission to perform this action" with the field
//      resolved to null (e.g. `me`, `checkPyramidAffiliate`).
//   2. django-graphql-auth `login_required` on mutations — a normal payload
//      with success:false and errors.nonFieldErrors[{code:"unauthenticated"}]
//      (e.g. `updateUserProfile`).
//   3. the backend's own field-level guard (security/types_security.py) —
//      a top-level error "Authentication required" on user fields such as
//      `username` inside otherwise public queries.
//
// Shape 1 is ambiguous (the same message is used for real permission
// denials), so callers must confirm with `verifyToken` before acting.

export interface GraphQLErrorLike {
  message?: string
}

export interface ExecutionResultLike {
  errors?: ReadonlyArray<GraphQLErrorLike> | null
  data?: Record<string, unknown> | null
}

const UNAUTHENTICATED_MESSAGE_RE =
  /^(You do not have permission to perform this action|Authentication required|Unauthenticated\.?|Signature has expired|Error decoding signature|Invalid token)$/i

// Auth-lifecycle operations whose own failures must never be mistaken for a
// dead session (logging out with a stale token, verifying a token, …).
export const SESSION_CHECK_EXEMPT_OPERATIONS: ReadonlySet<string> = new Set([
  'LoginUser',
  'SocialAuth',
  'RefreshUserToken',
  'RevokeUserRefreshToken',
  'LogoutUser',
  'VerifyUserToken',
  'RegisterNewUser',
])

interface NonFieldError {
  message?: string
  code?: string
}

function payloadSaysUnauthenticated (value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const errors = (value as { errors?: unknown }).errors
  if (!errors || typeof errors !== 'object') return false
  const nonField = (errors as { nonFieldErrors?: unknown }).nonFieldErrors
  if (!Array.isArray(nonField)) return false
  return nonField.some((e: NonFieldError) =>
    e?.code === 'unauthenticated' || UNAUTHENTICATED_MESSAGE_RE.test(e?.message ?? ''))
}

/** True when the GraphQL result indicates the server saw no authenticated user. */
export function isUnauthenticatedResult (result: ExecutionResultLike | null | undefined): boolean {
  if (!result) return false
  if (result.errors?.some((e) => UNAUTHENTICATED_MESSAGE_RE.test(e?.message ?? ''))) return true
  const data = result.data
  if (data && typeof data === 'object') {
    return Object.values(data).some(payloadSaysUnauthenticated)
  }
  return false
}

/** True when a single (django-graphql-auth style) error entry is the auth one. */
export function isUnauthenticatedError (entry: NonFieldError | null | undefined): boolean {
  if (!entry) return false
  return entry.code === 'unauthenticated' || UNAUTHENTICATED_MESSAGE_RE.test(entry.message ?? '')
}
