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
): ResumeDecision {
  const at = orderedLessonPks.indexOf(anchor.contentPk)
  if (at === -1) return { kind: 'anchor-not-found' }
  if (!anchor.complete) return { kind: 'open', contentPk: anchor.contentPk }
  for (let i = at + 1; i < orderedLessonPks.length; i++) {
    const pk = orderedLessonPks[i] as number
    if (!isComplete(pk)) return { kind: 'open', contentPk: pk }
  }
  return { kind: 'open', contentPk: anchor.contentPk }
}

/**
 * Add the device-local "last lesson on screen" hint to the server rows. When
 * the server already knows that lesson, its `complete` stamp is kept so a
 * lesson finished on this device resumes at the NEXT one.
 */
export function withLocalHint(rows: readonly ResumeRow[], hint: ResumeRow | null): ResumeRow[] {
  if (!hint) return [...rows]
  const server = rows.find((r) => r.contentPk === hint.contentPk)
  return [...rows, { ...hint, complete: server?.complete ?? null }]
}
