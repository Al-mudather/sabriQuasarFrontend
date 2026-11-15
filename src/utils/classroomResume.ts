// "Where should the classroom open?" — pure, unit-tested in
// test/jest/__tests__/classroomResume.spec.ts.
//
// A returning student used to land on lesson 1 every time (the lessons' own
// `completed` flag is never filled in), then tapped the lesson they were
// really on: two players created within seconds on every visit. Now the entry
// resolves ONE lesson from the learning-progress rows the layout already
// loads:
//   - no progress at all            → first lesson (unchanged);
//   - last touched lesson unfinished → that lesson;
//   - last touched lesson finished   → the first unfinished lesson after it;
//   - nothing unfinished after it    → the last touched lesson.

export interface ResumeRow {
  /** courseUnitContent.pk */
  contentPk: number
  /** Owning unit pk when the query returned it. */
  unitPk: number | null
  /** learning-progress row pk (tie-breaker: higher = created later). */
  progressPk: number
  begin: string | null
  complete: string | null
  updated: string | null
}

function ms(iso: string | null): number {
  if (!iso) return Number.NEGATIVE_INFINITY
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY
}

/** Latest moment the student touched this row. */
export function lastActivityMs(row: ResumeRow): number {
  return Math.max(ms(row.updated), ms(row.complete), ms(row.begin))
}

/** The row the student touched last, or null when there is no progress. */
export function pickResumeAnchor(rows: readonly ResumeRow[]): ResumeRow | null {
  let best: ResumeRow | null = null
  let bestAt = Number.NEGATIVE_INFINITY
  for (const row of rows) {
    const at = lastActivityMs(row)
    if (!best || at > bestAt || (at === bestAt && row.progressPk > best.progressPk)) {
      best = row
      bestAt = at
    }
  }
  return best
}

export type ResumeDecision =
  /** Open exactly this lesson. */
  | { kind: 'open'; contentPk: number }
  /** The anchor is not in the lessons given (unit not loaded / lesson deleted). */
  | { kind: 'anchor-not-found' }

/**
 * Given the course lessons in curriculum order (at least up to and after the
 * anchor), pick the lesson to open.
 */
export function resumeFrom(
  orderedLessonPks: readonly number[],
  anchor: ResumeRow,
  isComplete: (contentPk: number) => boolean,
  /** Can the student open this lesson? Default: yes. */
  canOpen: (contentPk: number) => boolean = () => true,
): ResumeDecision {
  const at = orderedLessonPks.indexOf(anchor.contentPk)
  // An anchor the student cannot open is as good as gone: the caller falls
  // back (server rows only, then the first lesson) instead of landing on a
  // "content missing" screen.
  if (at === -1 || !canOpen(anchor.contentPk)) return { kind: 'anchor-not-found' }
  if (!anchor.complete) return { kind: 'open', contentPk: anchor.contentPk }
  for (let i = at + 1; i < orderedLessonPks.length; i++) {
    const pk = orderedLessonPks[i] as number
    if (!isComplete(pk) && canOpen(pk)) return { kind: 'open', contentPk: pk }
  }
  return { kind: 'open', contentPk: anchor.contentPk }
}

/**
 * Does a lesson row carry something to open? The backend has no drip /
 * sequential lock; what it does (course_management/graphql/types.py,
 * `resolve_model_value`) is STRIP the payload of a lesson the viewer may not
 * access (no valid enrollment for that unit, e.g. a unit shared from another
 * course): a video loses `video`, `cipher_iframe` and `video_metadata`, a file
 * loses `attachment`. Such a lesson renders as "content missing", so resume
 * must not pick it.
 */
export function isOpenableLesson(kind: string, modelValueRaw: string | null): boolean {
  if (kind !== 'video' && kind !== 'file') return true
  let value: Record<string, unknown> | null = null
  try {
    const parsed: unknown = modelValueRaw ? JSON.parse(modelValueRaw) : null
    value = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    value = null
  }
  if (!value) return false
  const has = (key: string): boolean => {
    const v = value?.[key]
    return v !== null && v !== undefined && v !== ''
  }
  return kind === 'file' ? has('attachment') : has('video') || has('cipher_iframe') || has('video_metadata')
}

/** A device clock this far ahead of "now" is not believable. */
const HINT_FUTURE_TOLERANCE_MS = 60_000

/**
 * Add the device-local "last lesson on screen" hint to the server rows. When
 * the server already knows that lesson, its `complete` stamp is kept so a
 * lesson finished on this device resumes at the NEXT one.
 *
 * Clock skew: the hint is stamped by the device, the rows by the server. The
 * server wins whenever its row is newer (plain comparison in
 * pickResumeAnchor), and a hint stamped in the future — a wrong device clock,
 * which would otherwise win forever — is dropped.
 */
export function withLocalHint(
  rows: readonly ResumeRow[],
  hint: ResumeRow | null,
  now: number = Date.now(),
): ResumeRow[] {
  if (!hint) return [...rows]
  const at = lastActivityMs(hint)
  if (!Number.isFinite(at) || at > now + HINT_FUTURE_TOLERANCE_MS) return [...rows]
  const server = rows.find((r) => r.contentPk === hint.contentPk)
  return [...rows, { ...hint, complete: server?.complete ?? null }]
}
