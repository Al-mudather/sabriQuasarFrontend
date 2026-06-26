/**
 * useFullscreen — cross-browser fullscreen helper for the classroom players.
 *
 * Desktop Chrome/Firefox expose the W3C Fullscreen API on any element.
 * Safari / older Android WebKit expose a webkit-prefixed variant instead.
 * iOS Safari (mobile) does NOT implement element fullscreen at all — the only
 * way to get fullscreen on iOS is to call webkitEnterFullscreen() on the
 * <video> element itself, which hands control to the native iOS player.
 *
 * Strategy (in order):
 *   1. W3C   — el.requestFullscreen()
 *   2. WebKit — el.webkitRequestFullscreen()
 *   3. iOS video fallback — videoEl.webkitEnterFullscreen()  (HLS player only)
 *
 * For exit / state-reading we mirror the same prefix waterfall.
 *
 * No `as any`, no `@ts-expect-error`.  Vendor-prefixed APIs are typed through
 * narrow local interfaces below so TypeScript stays satisfied without disabling
 * type-checking.
 */

// ---------------------------------------------------------------------------
// Narrow vendor-prefix interfaces — only the properties we actually touch.
// ---------------------------------------------------------------------------

/** HTMLElement extended with the webkit fullscreen request method. */
interface FsElement extends HTMLElement {
  webkitRequestFullscreen?: () => void
}

/** HTMLVideoElement extended with the iOS-only native fullscreen method. */
interface FsVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void
}

/** Document extended with webkit fullscreen exit + state properties. */
interface FsDocument extends Document {
  webkitExitFullscreen?: () => void
  webkitFullscreenElement?: Element | null
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Returns the currently fullscreen element, checking both the W3C property and
 * the webkit-prefixed variant.
 */
export function getFullscreenElement(): Element | null {
  const doc = document as FsDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

/**
 * Request fullscreen on `el`, falling back to:
 *   1. webkitRequestFullscreen  (older WebKit / Android Chrome)
 *   2. videoEl.webkitEnterFullscreen()  (iOS Safari — only if provided)
 *
 * Returns true if a fullscreen request was dispatched (not necessarily granted
 * yet), false if no API was available (caller can decide whether to warn).
 */
export function requestFullscreen(
  el: HTMLElement,
  fallbackVideoEl?: HTMLVideoElement | null,
): boolean {
  const fsEl = el as FsElement

  if (typeof fsEl.requestFullscreen === 'function') {
    void fsEl.requestFullscreen()
    return true
  }

  if (typeof fsEl.webkitRequestFullscreen === 'function') {
    void fsEl.webkitRequestFullscreen()
    return true
  }

  // iOS Safari: element fullscreen is unavailable; try the <video> element's
  // native fullscreen method instead.  This opens the iOS native player with
  // its own controls — acceptable UX, the user gets fullscreen.
  if (fallbackVideoEl) {
    const vid = fallbackVideoEl as FsVideoElement
    if (typeof vid.webkitEnterFullscreen === 'function') {
      vid.webkitEnterFullscreen()
      return true
    }
  }

  return false
}

/**
 * Exit fullscreen, checking both W3C and webkit-prefixed exit methods.
 */
export function exitFullscreen(): void {
  const doc = document as FsDocument
  if (typeof doc.exitFullscreen === 'function') {
    void doc.exitFullscreen()
  } else if (typeof doc.webkitExitFullscreen === 'function') {
    void doc.webkitExitFullscreen()
  }
}

/**
 * The set of fullscreen-change event names to listen to (unprefixed + webkit).
 * Always attach a listener for BOTH to handle all browsers.
 */
export const FS_CHANGE_EVENTS = ['fullscreenchange', 'webkitfullscreenchange'] as const
