// Client-side JWT inspection. Decoding only — we never verify signatures here
// (the backend is the authority); we just read the `exp` claim so the app can
// tell a dead session apart from a live one without a network round-trip.

export interface JwtPayload {
  exp?: number
  origIat?: number
  [claim: string]: unknown
}

function base64UrlDecode (segment: string): string {
  const b64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  // atob yields a binary string; JWT payloads are ASCII JSON in practice.
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  )
}

/** Payload claims of a JWT, or null when the token is not a decodable JWT. */
export function decodeJwtPayload (token: string | null | undefined): JwtPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as unknown
    return payload && typeof payload === 'object' ? (payload as JwtPayload) : null
  } catch {
    return null
  }
}

/**
 * True when the token carries an `exp` claim that is already in the past
 * (minus `skewSeconds` of tolerance for clock drift). Tokens without `exp`, or
 * that cannot be decoded at all, are NOT reported as expired — the server's
 * own answer decides those (see utils/session.ts).
 */
export function isJwtExpired (
  token: string | null | undefined,
  skewSeconds = 30,
  nowMs: number = Date.now(),
): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return false
  return payload.exp * 1000 <= nowMs + skewSeconds * 1000
}
