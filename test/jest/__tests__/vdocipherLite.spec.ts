import {
  extractVdoCipherCredentials,
  isV2PlayerUrl,
  parseVdoCipherEmbed,
  redactVdoCipher,
  withLiteMode,
} from 'src/utils/vdocipher'

const V2 = 'https://player.vdocipher.com/v2/?otp=OTP1&playbackInfo=PB1'
const LEGACY = 'https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=OTP2&playbackInfo=PB2'

describe('utils/vdocipher lite mode', () => {
  it('recognises v2 player URLs only', () => {
    expect(isV2PlayerUrl(V2)).toBe(true)
    expect(isV2PlayerUrl('https://player.vdocipher.com/v2?otp=a&playbackInfo=b')).toBe(true)
    expect(isV2PlayerUrl(LEGACY)).toBe(false)
    expect(isV2PlayerUrl('https://player.vdocipher.com/v20/?otp=a')).toBe(false)
    expect(isV2PlayerUrl('https://evil.example/v2/?otp=a')).toBe(false)
    expect(isV2PlayerUrl('not a url')).toBe(false)
    expect(isV2PlayerUrl(null)).toBe(false)
  })

  it('adds litemode=true to a v2 URL', () => {
    expect(withLiteMode(V2)).toBe(`${V2}&litemode=true`)
    expect(withLiteMode('https://player.vdocipher.com/v2/')).toBe('https://player.vdocipher.com/v2/?litemode=true')
    expect(withLiteMode('https://player.vdocipher.com/v2/?')).toBe('https://player.vdocipher.com/v2/?litemode=true')
  })

  it('never duplicates litemode, and turns a false into true', () => {
    const once = withLiteMode(V2)
    expect(withLiteMode(once)).toBe(once)
    expect(withLiteMode(`${V2}&litemode=false`)).toBe(`${V2}&litemode=true`)
    expect(withLiteMode('https://player.vdocipher.com/v2/?litemode=false&otp=a&playbackInfo=b')).toBe(
      'https://player.vdocipher.com/v2/?litemode=true&otp=a&playbackInfo=b',
    )
    expect(withLiteMode(once).match(/litemode=/g)).toHaveLength(1)
  })

  it('keeps the query byte-for-byte (no re-encoding of + / =) and the fragment last', () => {
    const raw = 'https://player.vdocipher.com/v2/?otp=20160313abc+/==&playbackInfo=eyJ2aWRlb0lkIjoiYSJ9+x=#t=10'
    expect(withLiteMode(raw)).toBe(
      'https://player.vdocipher.com/v2/?otp=20160313abc+/==&playbackInfo=eyJ2aWRlb0lkIjoiYSJ9+x=&litemode=true#t=10',
    )
  })

  it('leaves legacy 1.x URLs unchanged', () => {
    expect(withLiteMode(LEGACY)).toBe(LEGACY)
  })

  it('works on the URL parsed out of a stored embed', () => {
    const code = `<div style="padding-top:41%;position:relative;"><iframe src="${V2.replace(/&/g, '&amp;')}" allowFullScreen="true" allow="encrypted-media"></iframe></div>`
    const src = parseVdoCipherEmbed(code)?.src ?? ''
    expect(withLiteMode(src)).toBe(`${V2}&litemode=true`)
  })
})

describe('utils/vdocipher extractVdoCipherCredentials', () => {
  it('reads the query form', () => {
    expect(extractVdoCipherCredentials(V2)).toEqual({ otp: 'OTP1', playbackInfo: 'PB1' })
    expect(extractVdoCipherCredentials(`${V2}&litemode=true`)).toEqual({ otp: 'OTP1', playbackInfo: 'PB1' })
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?playbackInfo=PB&x=1&otp=O')).toEqual({
      otp: 'O',
      playbackInfo: 'PB',
    })
  })

  it('reads the legacy fragment form', () => {
    expect(extractVdoCipherCredentials(LEGACY)).toEqual({ otp: 'OTP2', playbackInfo: 'PB2' })
  })

  it('decodes HTML entities and percent-encoding like the player does', () => {
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?otp=A%3D%3D&amp;playbackInfo=eyJ4Ijoi%2BSJ9')).toEqual({
      otp: 'A==',
      playbackInfo: 'eyJ4Ijoi+SJ9',
    })
    // The player turns "+" into a space before decoding; so do we.
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?otp=a+b&playbackInfo=c')).toEqual({
      otp: 'a b',
      playbackInfo: 'c',
    })
  })

  it('returns null when either value is missing or the URL is unusable', () => {
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?otp=O')).toBeNull()
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?playbackInfo=P')).toBeNull()
    expect(extractVdoCipherCredentials('https://player.vdocipher.com/v2/?otp=%E0%A4%A&playbackInfo=P')).toBeNull()
    expect(extractVdoCipherCredentials('nope')).toBeNull()
    expect(extractVdoCipherCredentials(null)).toBeNull()
  })
})

describe('utils/vdocipher redactVdoCipher', () => {
  it('hides otp and playbackInfo wherever they appear', () => {
    const out = redactVdoCipher(`<iframe src="${V2}"></iframe> ${LEGACY}`)
    expect(out).not.toMatch(/OTP1|PB1|OTP2|PB2/)
    expect(out).toContain('otp=…')
    expect(out).toContain('playbackInfo=…')
    expect(redactVdoCipher(null)).toBe('')
  })
})
