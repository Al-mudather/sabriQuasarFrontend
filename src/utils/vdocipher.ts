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

// ---------------------------------------------------------------------------
// Player URL helpers (lite mode, credentials for the Player API, redaction)
// ---------------------------------------------------------------------------

/** VdoCipher's Player API script (defines `window.VdoPlayer`). */
export const VDOCIPHER_API_SCRIPT = 'https://player.vdocipher.com/v2/api.js'

/** True for the current `/v2/` player; false for legacy `playerAssets/1.x`. */
export function isV2PlayerUrl(src: string | null | undefined): boolean {
  if (!src) return false
  try {
    const url = new URL(src)
    if (!VDOCIPHER_HOSTS.has(url.hostname.toLowerCase())) return false
    return url.pathname === '/v2' || url.pathname.startsWith('/v2/')
  } catch {
    return false
  }
}

/**
 * Add `litemode=true` to a v2 player URL. In lite mode the player shows only
 * the poster and requests NO licence / media until the viewer taps play, so a
 * lesson that is opened but never played opens no DRM session.
 * (https://www.vdocipher.com/docs/player/v2/config-player)
 *
 * String surgery on purpose: `URLSearchParams` would re-serialise the whole
 * query (`+` ↔ space, `=` → `%3D`) and the OTP / playbackInfo must reach the
 * player byte-for-byte. Legacy 1.x URLs are returned unchanged.
 */
export function withLiteMode(src: string): string {
  if (!isV2PlayerUrl(src)) return src
  const hashAt = src.indexOf('#')
  const head = hashAt === -1 ? src : src.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : src.slice(hashAt)
  const liteRe = /([?&#])litemode=[^&]*/i
  const queryAt = head.indexOf('?')
  const hasQuery = queryAt !== -1 && queryAt < head.length - 1
  // The player reads its parameters from `location.search || location.hash`.
  // A v2 URL with NO query and the credentials in the fragment must get the
  // flag in the fragment too: adding a query would make the player stop
  // reading the fragment and lose the OTP.
  if (!hasQuery && /[#&]otp=/.test(hash)) {
    const bare = queryAt === -1 ? head : head.slice(0, queryAt)
    if (liteRe.test(hash)) return bare + hash.replace(liteRe, '$1litemode=true')
    return `${bare}${hash}${hash.endsWith('&') ? '' : '&'}litemode=true`
  }
  if (liteRe.test(head)) return head.replace(liteRe, '$1litemode=true') + hash
  const sep = head.includes('?') ? (head.endsWith('?') || head.endsWith('&') ? '' : '&') : '?'
  return `${head}${sep}litemode=true${hash}`
}

export interface VdoCipherCredentials {
  otp: string
  playbackInfo: string
}

/**
 * Same lookup the VdoCipher player runs on its own URL
 * (`RegExp("[?&#]"+key+"=([^&]*)")` + decodeURIComponent, `+` → space), so the
 * value we hand to `player.api.loadVideo` is the one the iframe would have
 * read itself.
 */
function playerParam(key: string, text: string): string | null {
  const m = new RegExp(`[?&#]${key}=([^&]*)`).exec(text)
  if (!m || !m[1]) return null
  try {
    return decodeURIComponent(m[1].replace(/\+/g, ' '))
  } catch {
    return null
  }
}

/**
 * otp + playbackInfo of a player URL — query form (`/v2/?otp=…&playbackInfo=…`)
 * or legacy fragment form (`…/index.html#otp=…&playbackInfo=…`). The player
 * prefers the query when there is one; so do we.
 */
export function extractVdoCipherCredentials(src: string | null | undefined): VdoCipherCredentials | null {
  if (!src) return null
  let url: URL
  try {
    url = new URL(decodeEntities(src.trim()))
  } catch {
    return null
  }
  // Same precedence as the player: the query if there is one, else the fragment.
  for (const part of [url.search.length > 1 ? url.search : '', url.hash]) {
    if (!part) continue
    const otp = playerParam('otp', part)
    const playbackInfo = playerParam('playbackInfo', part)
    if (otp && playbackInfo) return { otp, playbackInfo }
  }
  return null
}

/** Strip OTP / playbackInfo values from anything that is about to be logged. */
export function redactVdoCipher(text: string | null | undefined): string {
  return String(text ?? '').replace(/(otp|playbackInfo)=[^&"'#\s]+/gi, '$1=…')
}
