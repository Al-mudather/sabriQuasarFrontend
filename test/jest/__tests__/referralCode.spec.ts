import { referralCodeFromQuery } from 'src/utils/referral'

describe('referralCodeFromQuery', () => {
  it('reads the code from ?ref=', () => {
    expect(referralCodeFromQuery({ ref: 'P01862012252024' })).toBe('P01862012252024')
  })

  it('trims surrounding whitespace', () => {
    expect(referralCodeFromQuery({ ref: '  P029152026 ' })).toBe('P029152026')
  })

  it('takes the first value of a repeated ref', () => {
    expect(referralCodeFromQuery({ ref: ['P029152026', 'P0310182026'] })).toBe('P029152026')
  })

  it('ignores a missing, empty or malformed ref', () => {
    expect(referralCodeFromQuery({})).toBeNull()
    expect(referralCodeFromQuery(null)).toBeNull()
    expect(referralCodeFromQuery({ ref: '' })).toBeNull()
    expect(referralCodeFromQuery({ ref: 'abc' })).toBeNull()
    expect(referralCodeFromQuery({ ref: '<script>' })).toBeNull()
  })
})
