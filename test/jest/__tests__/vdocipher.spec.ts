import { decodeEntities, parseVdoCipherEmbed, toVdoCipherPlayerUrl, VDOCIPHER_IFRAME_ALLOW } from 'src/utils/vdocipher'

const V2 = 'https://player.vdocipher.com/v2/?otp=OTP1&playbackInfo=PB1'
const LEGACY = 'https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=OTP2&playbackInfo=PB2'

// Shapes copied from real ContentVideo.cipher_iframe rows (secrets replaced).
const single = `<div style="padding-top:55%;position:relative;"> <iframe src="${V2}" style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%;" allowFullScreen="true" allow="encrypted-media"></iframe> </div>`
const legacyBlock = `<div style="padding-top:56.34%;position:relative;"> <iframe src="${LEGACY}" style="border:0;" allowFullScreen="true" allow="encrypted-media"></iframe> </div>`
// "CNS Pathology L7": the embed code pasted twice.
const doubled = legacyBlock + legacyBlock
// "Hem Physiology L1": doubled AND a malformed style attribute.
const malformed = `<div style=padding-top:56.25%;position:relative;"> <iframe src="${LEGACY}" allowFullScreen="true" allow="encrypted-media"></iframe> </div>`.repeat(2)

describe('utils/vdocipher parseVdoCipherEmbed', () => {
  it('extracts the single player URL from the standard v2 embed', () => {
    expect(parseVdoCipherEmbed(single)).toEqual({ src: V2, iframeCount: 1 })
  })

  it('keeps the legacy playerAssets URL including its #otp fragment', () => {
    expect(parseVdoCipherEmbed(legacyBlock)?.src).toBe(LEGACY)
  })

  it('returns ONE src when the embed code was pasted twice', () => {
    expect(parseVdoCipherEmbed(doubled)).toEqual({ src: LEGACY, iframeCount: 2 })
    expect(parseVdoCipherEmbed(malformed)).toEqual({ src: LEGACY, iframeCount: 2 })
  })

  it('accepts a bare player URL and decodes &amp;', () => {
    expect(parseVdoCipherEmbed(V2)?.src).toBe(V2)
    expect(parseVdoCipherEmbed(`<iframe src='${V2.replace('&', '&amp;')}'></iframe>`)?.src).toBe(V2)
  })

  it('ignores non-VdoCipher and non-https iframes, scripts and junk', () => {
    expect(parseVdoCipherEmbed('<iframe src="https://evil.example/x"></iframe>')).toBeNull()
    expect(parseVdoCipherEmbed('<iframe src="http://player.vdocipher.com/v2/?otp=a"></iframe>')).toBeNull()
    expect(parseVdoCipherEmbed('<script src="https://player.vdocipher.com/v2/api.js"></script>')).toBeNull()
    expect(parseVdoCipherEmbed('<iframe src="javascript:alert(1)"></iframe>')).toBeNull()
    expect(parseVdoCipherEmbed('')).toBeNull()
    expect(parseVdoCipherEmbed(null)).toBeNull()
    expect(parseVdoCipherEmbed('not a url')).toBeNull()
  })

  it('skips a foreign iframe and picks the VdoCipher one', () => {
    const mixed = `<iframe src="https://www.youtube.com/embed/x"></iframe>${single}`
    expect(parseVdoCipherEmbed(mixed)).toEqual({ src: V2, iframeCount: 1 })
  })

  it('toVdoCipherPlayerUrl rejects look-alike hosts', () => {
    expect(toVdoCipherPlayerUrl('https://player.vdocipher.com.evil.io/v2/')).toBeNull()
    expect(toVdoCipherPlayerUrl('https://player.vdocipher.com/v2/?otp=1')).toBe('https://player.vdocipher.com/v2/?otp=1')
  })

  it('allow list carries the permissions VdoCipher needs', () => {
    for (const p of ['encrypted-media', 'fullscreen', 'picture-in-picture']) {
      expect(VDOCIPHER_IFRAME_ALLOW).toContain(p)
    }
  })

  it('accepts protocol-relative //player.vdocipher.com URLs (iframe and bare)', () => {
    const rel = '//player.vdocipher.com/v2/?otp=OTP1&playbackInfo=PB1'
    expect(parseVdoCipherEmbed(`<iframe src="${rel}"></iframe>`)?.src).toBe(V2)
    expect(parseVdoCipherEmbed(rel)?.src).toBe(V2)
    expect(toVdoCipherPlayerUrl('//evil.example/v2/')).toBeNull()
  })

  it('decodes an HTML-escaped embed before parsing', () => {
    const escaped = single.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    expect(parseVdoCipherEmbed(escaped)).toEqual({ src: V2, iframeCount: 1 })
  })

  it('decodes numeric entities (&#38; and &#x26;) in the src', () => {
    expect(parseVdoCipherEmbed(`<iframe src="${V2.replace('&', '&#38;')}"></iframe>`)?.src).toBe(V2)
    expect(parseVdoCipherEmbed(`<iframe src="${V2.replace('&', '&#x26;')}"></iframe>`)?.src).toBe(V2)
    expect(decodeEntities('a&#60;b&#x3e;c&amp;d')).toBe('a<b>c&d')
  })

  it('finds a bare URL surrounded by text, but never upgrades http://', () => {
    expect(parseVdoCipherEmbed(`Lecture 1 video: ${V2} (new)`)).toEqual({ src: V2, iframeCount: 1 })
    expect(parseVdoCipherEmbed('see http://player.vdocipher.com/v2/?otp=a')).toBeNull()
  })

  it('returns null when iframes exist but none is VdoCipher (no text fallback)', () => {
    expect(parseVdoCipherEmbed(`<iframe src="https://evil.example/?u=${V2}"></iframe>`)).toBeNull()
  })
})
