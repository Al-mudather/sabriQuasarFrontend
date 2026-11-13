// Device-local "last lesson on screen" hint for resume-on-entry.
//
// The server progress list is cached for up to ten minutes, so a student who
// leaves the classroom and comes straight back would resume from a stale
// snapshot. The lesson they last had on screen on THIS device is remembered
// here (per enrollment, so two accounts on one phone never mix) and competes
// with the server rows by timestamp in src/utils/classroomResume.ts.
// Storage can be missing or throw (private modes): every access is guarded.

import type { ResumeRow } from 'src/utils/classroomResume'

const KEY = 'stc.classroom.resume.v1'
/** Keep the map small: only the most recently used enrollments. */
const MAX_ENTRIES = 30

interface StoredHint {
  c: number
  u: number
  t: number
}

function readAll(): Record<string, StoredHint> {
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, StoredHint>) : {}
  } catch {
    return {}
  }
}

export function rememberLesson(enrollmentPk: number, contentPk: number, unitPk: number, now: number = Date.now()): void {
  try {
    const all = readAll()
    all[String(enrollmentPk)] = { c: contentPk, u: unitPk, t: now }
    const keep = Object.entries(all)
      .sort((a, b) => (b[1]?.t ?? 0) - (a[1]?.t ?? 0))
      .slice(0, MAX_ENTRIES)
    window.localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(keep)))
  } catch {
    /* storage unavailable — resume falls back to server progress */
  }
}

/** The remembered lesson as a resume row (never marked complete), or null. */
export function recallLesson(enrollmentPk: number): ResumeRow | null {
  const hint = readAll()[String(enrollmentPk)]
  if (!hint || !Number.isFinite(hint.c) || !Number.isFinite(hint.u) || !Number.isFinite(hint.t)) return null
  const at = new Date(hint.t).toISOString()
  return {
    contentPk: hint.c,
    unitPk: hint.u,
    progressPk: Number.MAX_SAFE_INTEGER,
    begin: at,
    complete: null,
    updated: at,
  }
}
