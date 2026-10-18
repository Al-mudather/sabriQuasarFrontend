import { matchesError, payloadErrorMessages } from 'src/utils/graphqlErrors'

export type JoinPlatformOutcome = 'joined' | 'already' | 'invalid' | 'error'

interface JoinPlatformPayload {
  success?: unknown
  errors?: unknown
}

/**
 * Classify a `joinPlatform` mutation result.
 *
 * The backend serialises concurrent calls, so a second call for the same user
 * answers "Already exists" even though the user did join — that is a success.
 */
export function joinPlatformOutcome (result: unknown): JoinPlatformOutcome {
  const data = (result as { data?: { joinPlatform?: JoinPlatformPayload | null } } | null | undefined)?.data
  const payload = data?.joinPlatform ?? null

  if (payload?.success === true) return 'joined'
  if (payload && payloadErrorMessages(payload.errors).some((m) => /already exists/i.test(m))) return 'already'
  if (matchesError(result, /Pyramid matching query does not exist/i)) return 'invalid'
  if (payload && payload.success === false) return 'invalid'
  return 'error'
}
