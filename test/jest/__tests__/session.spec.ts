import { decodeJwtPayload, isJwtExpired } from 'src/utils/jwt'
import {
  isUnauthenticatedResult,
  isUnauthenticatedError,
  SESSION_CHECK_EXEMPT_OPERATIONS,
} from 'src/utils/session'

function fakeJwt (payload: Record<string, unknown>): string {
  const enc = (o: unknown): string =>
    Buffer.from(JSON.stringify(o)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(payload)}.signature-not-checked`
}

describe('utils/jwt', () => {
  it('decodes the payload claims of a JWT', () => {
    const token = fakeJwt({ email: 'a@b.c', exp: 1700000000, origIat: 1699999000 })
    expect(decodeJwtPayload(token)).toEqual({ email: 'a@b.c', exp: 1700000000, origIat: 1699999000 })
  })

  it('returns null for non-JWT strings and empty input', () => {
    expect(decodeJwtPayload('garbage')).toBeNull()
    expect(decodeJwtPayload('a.b')).toBeNull()
    expect(decodeJwtPayload('')).toBeNull()
    expect(decodeJwtPayload(null)).toBeNull()
    expect(decodeJwtPayload('x.!!!notbase64!!!.y')).toBeNull()
  })

  it('reports an expired token (30-day backend tokens past their exp)', () => {
    const now = 1_800_000_000_000
    const expired = fakeJwt({ exp: now / 1000 - 60 })
    const live = fakeJwt({ exp: now / 1000 + 3600 })
    expect(isJwtExpired(expired, 30, now)).toBe(true)
    expect(isJwtExpired(live, 30, now)).toBe(false)
  })

  it('treats a token expiring within the skew window as expired', () => {
    const now = 1_800_000_000_000
    const almost = fakeJwt({ exp: now / 1000 + 10 })
    expect(isJwtExpired(almost, 30, now)).toBe(true)
  })

  it('never calls undecodable or exp-less tokens expired (server decides)', () => {
    expect(isJwtExpired('garbage')).toBe(false)
    expect(isJwtExpired(fakeJwt({ email: 'a@b.c' }))).toBe(false)
    expect(isJwtExpired(null)).toBe(false)
  })
})

describe('utils/session — recognising the backend "no user" replies', () => {
  it('flags the django-graphql-auth mutation payload (observed in production)', () => {
    const result = {
      data: {
        updateUserProfile: {
          success: false,
          errors: { nonFieldErrors: [{ message: 'Unauthenticated.', code: 'unauthenticated' }] },
        },
      },
    }
    expect(isUnauthenticatedResult(result)).toBe(true)
  })

  it('flags the graphql_jwt query error (me / checkPyramidAffiliate as anonymous)', () => {
    const result = {
      errors: [{ message: 'You do not have permission to perform this action' }],
      data: { me: null },
    }
    expect(isUnauthenticatedResult(result)).toBe(true)
  })

  it('flags the backend field-level guard error (types_security.login_required)', () => {
    const result = {
      errors: [{ message: 'Authentication required', path: ['allCourseInstructors', 'edges', 0, 'node', 'instructor', 'user', 'username'] }],
      data: { allCourseInstructors: { edges: [] } },
    }
    expect(isUnauthenticatedResult(result)).toBe(true)
  })

  it('flags an explicit expired-signature error', () => {
    expect(isUnauthenticatedResult({ errors: [{ message: 'Signature has expired' }] })).toBe(true)
  })

  it('does not flag ordinary validation errors or successes', () => {
    expect(isUnauthenticatedResult({
      data: {
        updateUserProfile: {
          success: false,
          errors: { phoneNumber2: [{ message: 'Enter a valid phone number.', code: 'invalid' }] },
        },
      },
    })).toBe(false)
    expect(isUnauthenticatedResult({ data: { updateUserProfile: { success: true, errors: null } } })).toBe(false)
    expect(isUnauthenticatedResult({ errors: [{ message: 'PyramidAffiliate matching query does not exist.' }], data: { checkPyramidAffiliate: null } })).toBe(false)
    expect(isUnauthenticatedResult({ data: { me: null } })).toBe(false)
    expect(isUnauthenticatedResult(null)).toBe(false)
  })

  it('recognises a single unauthenticated error entry', () => {
    expect(isUnauthenticatedError({ message: 'Unauthenticated.', code: 'unauthenticated' })).toBe(true)
    expect(isUnauthenticatedError({ message: 'Enter a valid value.', code: 'invalid' })).toBe(false)
    expect(isUnauthenticatedError(null)).toBe(false)
  })

  it('exempts the auth lifecycle operations from session checks', () => {
    for (const op of ['LoginUser', 'SocialAuth', 'RefreshUserToken', 'LogoutUser', 'VerifyUserToken']) {
      expect(SESSION_CHECK_EXEMPT_OPERATIONS.has(op)).toBe(true)
    }
    expect(SESSION_CHECK_EXEMPT_OPERATIONS.has('UpdateUserProfile')).toBe(false)
  })
})
