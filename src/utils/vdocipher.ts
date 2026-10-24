// VdoCipher embed helpers — pure, DOM-free, unit-tested in
// test/jest/__tests__/vdocipher.spec.ts.
//
// The dashboard stores VdoCipher lessons as the embed code an admin pasted
// from the VdoCipher dashboard (`ContentVideo.cipher_iframe`), e.g.
//
//   <div style="padding-top:55%;position:relative;">
//     <iframe src="https://player.vdocipher.com/v2/?otp=…&playbackInfo=…"
//             allowFullScreen="true" allow="encrypted-media"></iframe>
//   </div>
//
// That blob is free text. Real rows contain the code pasted TWICE (two
// iframes for the same video — e.g. "CNS Pathology L7", "Hem Physiology L1"),
// malformed attributes, or the legacy `playerAssets/1.x/…#otp=` URL.
// Injecting it as raw HTML mounts every iframe it contains, and two live
// VdoCipher players on one page is exactly what makes the player raise
// "Error 6006 — Multiple active videos" (each holds a DRM session; Android
// devices only have room for one). So we never inject the blob: we pull out
// ONE player URL and render ONE <iframe> ourselves.

/** Hosts a VdoCipher player iframe may be served from. */
const VDOCIPHER_HOSTS = new Set(['player.vdocipher.com'])

/**
 * `allow` list for the VdoCipher iframe. VdoCipher's own embed ships
 * `allow="encrypted-media"` + legacy `allowFullScreen`; Chromium ignores the
 * legacy attribute once an `allow` list omits `fullscreen`, so we add
 * `fullscreen` (and PiP) explicitly.
 */
export const VDOCIPHER_IFRAME_ALLOW = 'encrypted-media; fullscreen; picture-in-picture'

export interface VdoCipherEmbed {
  /** The single player URL to load. */
  src: string
  /** How many player iframes the pasted code contained (diagnostics). */
  iframeCount: number
}

/** Decode the HTML entities an embed code can arrive with (named + numeric). */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => safeFromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => safeFromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    // &amp; last, so "&amp;lt;" decodes to the literal text "&lt;" only once.
    .replace(/&amp;/gi, '&')
}

function safeFromCodePoint(n: number): string {
  try {
    return Number.isFinite(n) && n > 0 ? String.fromCodePoint(n) : ''
  } catch {
    return ''
  }
}

/** Returns the URL if it is an https VdoCipher player URL, else null. */
export function toVdoCipherPlayerUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const candidate = decodeEntities(raw.trim())
  let url: URL
  try {
    // Protocol-relative embeds (`//player.vdocipher.com/...`) resolve against
    // the player origin; anything else must already be absolute.
    url = candidate.startsWith('//')
      ? new URL(candidate, 'https://player.vdocipher.com')
      : new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  if (!VDOCIPHER_HOSTS.has(url.hostname.toLowerCase())) return null
  return url.toString()
}

/**
 * Parse the pasted VdoCipher embed code (or a player URL, possibly surrounded
 * by other text) into exactly one player URL. Returns null when nothing
 * usable is found. HTML-escaped embeds (`&lt;iframe …`) are decoded first.
 */
export function parseVdoCipherEmbed(code: string | null | undefined): VdoCipherEmbed | null {
  if (!code) return null
  const text = decodeEntities(String(code)).trim()
  if (!text) return null

  const srcs: string[] = []
  const tagRe = /<iframe\b[^>]*>/gi
  const srcRe = /\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i
  let m: RegExpExecArray | null
  let sawIframe = false
  while ((m = tagRe.exec(text)) !== null) {
    sawIframe = true
    const s = m[0].match(srcRe)
    const value = s?.[1] ?? s?.[2] ?? s?.[3] ?? null
    const src = toVdoCipherPlayerUrl(value)
    if (src) srcs.push(src)
  }
  if (srcs.length > 0) return { src: srcs[0] as string, iframeCount: srcs.length }
  // Markup without a usable player iframe (e.g. a <script> embed) is not a
  // player — only plain text gets the bare-URL fallback below.
  if (sawIframe || /<[a-z]/i.test(text)) return null

  // Plain text: a bare player URL, possibly with text around it.
  // `http://` is not upgraded: group 1 must be start-of-text or a character
  // other than ':' / word char, so `//` right after `http:` never matches.
  // (No lookbehind assertion: Safari < 16.4 throws a SyntaxError on them.)
  const urlRe = /(^|[^:\w])((?:https:)?\/\/player\.vdocipher\.com\/[^\s"'<>()]*)/gi
  const found: string[] = []
  let u: RegExpExecArray | null
  while ((u = urlRe.exec(text)) !== null) {
    const src = toVdoCipherPlayerUrl(u[2])
    if (src) found.push(src)
  }
  if (found.length === 0) return null
  return { src: found[0] as string, iframeCount: found.length }
}
