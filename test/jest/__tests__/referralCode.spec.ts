import { referralCodeFromQuery, referralCodeFromCourseParams } from 'src/utils/referral'

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

describe('referralCodeFromCourseParams', () => {
  it('reads the code segment of a current course link', () => {
    expect(referralCodeFromCourseParams({ name: 'AMC+MCQ+Course', code: 'P012979072021', pk: '182', id: 'Q291cnNlTm9kZToxODI=' })).toBe('P012979072021')
  })

  it('reads a code from the name slot of an old 3-segment link', () => {
    expect(referralCodeFromCourseParams({ name: 'P01862012252024', pk: '182', id: 'x' })).toBe('P01862012252024')
  })

  it('does not treat a course title as a code', () => {
    expect(referralCodeFromCourseParams({ name: 'AMC+MCQ+Course', pk: '182', id: 'x' })).toBeNull()
    expect(referralCodeFromCourseParams({ name: 'Biochemistry', pk: '182', id: 'x' })).toBeNull()
    expect(referralCodeFromCourseParams(null)).toBeNull()
  })
})
