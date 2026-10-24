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

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

/** Returns the URL if it is an https VdoCipher player URL, else null. */
export function toVdoCipherPlayerUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const candidate = decodeEntities(raw.trim())
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  if (!VDOCIPHER_HOSTS.has(url.hostname.toLowerCase())) return null
  return url.toString()
}

/**
 * Parse the pasted VdoCipher embed code (or a bare player URL) into exactly
 * one player URL. Returns null when nothing usable is found.
 */
export function parseVdoCipherEmbed(code: string | null | undefined): VdoCipherEmbed | null {
  if (!code) return null
  const text = String(code).trim()
  if (!text) return null

  // A bare URL pasted instead of the embed code.
  if (!text.includes('<')) {
    const src = toVdoCipherPlayerUrl(text)
    return src ? { src, iframeCount: 1 } : null
  }

  const srcs: string[] = []
  const tagRe = /<iframe\b[^>]*>/gi
  const srcRe = /\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(text)) !== null) {
    const s = m[0].match(srcRe)
    const value = s?.[1] ?? s?.[2] ?? s?.[3] ?? null
    const src = toVdoCipherPlayerUrl(value)
    if (src) srcs.push(src)
  }
  if (srcs.length === 0) return null
  return { src: srcs[0] as string, iframeCount: srcs.length }
}
