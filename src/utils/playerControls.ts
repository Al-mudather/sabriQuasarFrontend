// =============================================================================
// playerControls — pure logic behind the Al-Hasif player's control bar.
//
// No Vue, no DOM: label formatting for the speed / quality buttons and the
// tap classifier that turns a stream of touch taps on the picture into
// "single tap" vs "double-tap seek" (YouTube-style). Kept here so it is unit
// tested without mounting a player (test/jest/__tests__/playerControls.spec.ts).
// =============================================================================

/** Minimal shape of a selectable rendition (matches QualityOption). */
export interface QualityChoice {
  /** 'auto' or the stringified quality-level index. */
  id: string
  /** Vertical resolution in px, when the manifest reports it. */
  height: number | null
  /** Fallback label when the height is unknown, e.g. "#2". */
  label: string
}

export const AUTO_QUALITY_ID = 'auto'

/** Bar width (px) at or below which the bar uses the stacked phone layout.
 *  Must stay in sync with the `@container (max-width: …)` rule in
 *  ClassroomVideoControls.vue. */
export const NARROW_BAR_MAX_PX = 680

/** Bar width (px) at or below which the lists open as a bottom sheet even
 *  with a mouse (a phone-sized player / browser window). */
export const SHEET_BAR_MAX_PX = 520

/** Viewport height (px) at or below which menus open as a sheet (landscape
 *  phones): an anchored popover has no room to grow there. */
export const SHORT_VIEWPORT_MAX_PX = 500

// ---- speed -----------------------------------------------------------------

/** "1×", "1.25×", "0.5×" — never "1.0×", never a float artefact. */
export function formatRate(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return '1×'
  return `${Number(rate.toFixed(2))}×`
}

/** True for the default speed (shown as «عادي» / "Normal"). */
export function isNormalRate(rate: number): boolean {
  return !Number.isFinite(rate) || Math.abs(rate - 1) < 0.001
}

/** Label for a rate: the translated "normal" word for 1×, else "1.5×". */
export function rateLabel(rate: number, normalText: string): string {
  return isNormalRate(rate) ? normalText : formatRate(rate)
}

// ---- quality ---------------------------------------------------------------

/** "720p" when the height is known, else null. */
export function formatHeight(height: number | null | undefined): string | null {
  if (typeof height !== 'number' || !Number.isFinite(height) || height <= 0) return null
  return `${Math.round(height)}p`
}

/** Label of one entry in the quality list. */
export function qualityOptionLabel(option: QualityChoice, autoText: string): string {
  if (option.id === AUTO_QUALITY_ID) return autoText
  return formatHeight(option.height) ?? option.label
}

/**
 * Value shown on the quality button.
 *  - auto + known playing height → "تلقائي · 720p"
 *  - auto, height unknown        → "تلقائي"
 *  - locked rendition            → "720p"
 */
export function qualityValueLabel(
  qualities: readonly QualityChoice[],
  activeId: string,
  playingHeight: number | null | undefined,
  autoText: string,
): string {
  const active = qualities.find((q) => q.id === activeId)
  if (!active || active.id === AUTO_QUALITY_ID) {
    const playing = formatHeight(playingHeight)
    return playing ? `${autoText} · ${playing}` : autoText
  }
  return qualityOptionLabel(active, autoText)
}

/** The quality control is pointless with a single rendition (list = auto + 1). */
export function hasQualityChoice(qualities: readonly QualityChoice[]): boolean {
  return qualities.filter((q) => q.id !== AUTO_QUALITY_ID).length > 1
}

/** When does the options list open as a bottom sheet rather than a popover? */
export function shouldUseSheet(env: {
  barWidth: number
  viewportHeight: number
  coarsePointer: boolean
}): boolean {
  return (
    env.coarsePointer ||
    (env.barWidth > 0 && env.barWidth <= SHEET_BAR_MAX_PX) ||
    (env.viewportHeight > 0 && env.viewportHeight <= SHORT_VIEWPORT_MAX_PX)
  )
}

// ---- double-tap seek -------------------------------------------------------

export type TapSide = 'back' | 'forward'

/** Two taps closer than this (ms) on the same half are a double-tap. Also the
 *  delay before a lone tap is acted on (touch only). */
export const DOUBLE_TAP_MS = 250
/** Once seeking, further taps within this window (ms) keep adding 10 s. */
export const TAP_CHAIN_MS = 600
/** Seconds moved per double-tap / chained tap. */
export const TAP_SEEK_SECONDS = 10

/**
 * Which half of the picture was tapped. Media time runs left→right in every
 * locale (the scrub row is pinned LTR), so the LEFT half always means "back",
 * also on RTL pages — same as YouTube.
 */
export function tapSide(x: number, width: number): TapSide {
  if (!(width > 0)) return 'forward'
  return x < width / 2 ? 'back' : 'forward'
}

export interface TapState {
  /** Timestamp (ms) of the previous tap, or null when there is none. */
  lastTime: number | null
  lastSide: TapSide | null
  /** Consecutive taps on the same side so far (1 = lone tap). */
  streak: number
}

export const INITIAL_TAP_STATE: TapState = { lastTime: null, lastSide: null, streak: 0 }

export type TapOutcome =
  /** First tap: wait `DOUBLE_TAP_MS`, then run the single-tap action. */
  | { kind: 'single-pending' }
  /** Second or later tap in a streak: seek now. `total` is the accumulated
   *  seconds of this streak, for the on-screen indicator. */
  | { kind: 'seek'; side: TapSide; delta: number; total: number }

/** Feed one tap; get the next state and what to do about it. Pure. */
export function classifyTap(
  prev: TapState,
  tap: { time: number; side: TapSide },
): { state: TapState; outcome: TapOutcome } {
  const window = prev.streak >= 2 ? TAP_CHAIN_MS : DOUBLE_TAP_MS
  const elapsed = prev.lastTime === null ? Number.POSITIVE_INFINITY : tap.time - prev.lastTime
  const continues = prev.streak >= 1 && prev.lastSide === tap.side && elapsed >= 0 && elapsed <= window

  if (!continues) {
    return {
      state: { lastTime: tap.time, lastSide: tap.side, streak: 1 },
      outcome: { kind: 'single-pending' },
    }
  }

  const streak = prev.streak + 1
  const sign = tap.side === 'back' ? -1 : 1
  return {
    state: { lastTime: tap.time, lastSide: tap.side, streak },
    outcome: {
      kind: 'seek',
      side: tap.side,
      delta: sign * TAP_SEEK_SECONDS,
      total: (streak - 1) * TAP_SEEK_SECONDS,
    },
  }
}

/** Arabic counts 3–10 take the plural («10 ثوانٍ»), 11+ the singular form
 *  («20 ثانية»); the i18n file carries one message per form. */
export function seekSecondsKey(total: number): 'seekSecondsFew' | 'seekSecondsMany' {
  return total <= 10 ? 'seekSecondsFew' : 'seekSecondsMany'
}
