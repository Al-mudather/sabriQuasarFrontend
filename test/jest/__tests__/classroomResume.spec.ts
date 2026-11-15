import { isOpenableLesson, lastActivityMs, pickResumeAnchor, resumeFrom, withLocalHint, type ResumeRow } from 'src/utils/classroomResume'
import { recallLesson, rememberLesson } from 'src/utils/classroomResumeHint'

let seq = 700
const row = (contentPk: number, over: Partial<ResumeRow> = {}): ResumeRow => ({
  contentPk,
  unitPk: 101,
  progressPk: seq++,
  begin: '2026-11-01T10:00:00+00:00',
  complete: '2026-11-01T10:10:00+00:00',
  updated: '2026-11-01T10:10:00+00:00',
  ...over,
})
const completeIn = (rows: ResumeRow[]) => (pk: number): boolean => rows.some((r) => r.contentPk === pk && !!r.complete)

describe('classroomResume pickResumeAnchor', () => {
  it('has no anchor without progress', () => {
    expect(pickResumeAnchor([])).toBeNull()
  })

  it('picks the row touched last (updated, complete or begin — whichever is latest)', () => {
    const rows = [
      row(1001),
      row(1002, { updated: '2026-11-03T08:00:00+00:00' }),
      row(1003, { begin: '2026-11-02T08:00:00+00:00', complete: null, updated: null }),
    ]
    expect(pickResumeAnchor(rows)?.contentPk).toBe(1002)
    expect(lastActivityMs(rows[2] as ResumeRow)).toBe(Date.parse('2026-11-02T08:00:00+00:00'))
  })

  it('breaks ties with the newest progress row', () => {
    const rows = [row(1001), row(1002), row(1003)]
    expect(pickResumeAnchor(rows)?.contentPk).toBe(1003)
    expect(pickResumeAnchor([...rows].reverse())?.contentPk).toBe(1003)
  })

  it('survives rows with no usable timestamp', () => {
    const rows = [row(1001, { begin: null, complete: null, updated: 'garbage' }), row(1002, { begin: null, complete: null, updated: null })]
    expect(pickResumeAnchor(rows)?.contentPk).toBe(1002)
  })
})

describe('classroomResume resumeFrom', () => {
  const lessons = [1001, 1002, 1003, 1004, 1005, 1006]

  it('opens the last touched lesson when it is unfinished (in progress)', () => {
    const rows = [row(1001), row(1002), row(1003, { complete: null, updated: '2026-11-05T00:00:00+00:00' })]
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(resumeFrom(lessons, anchor, completeIn(rows))).toEqual({ kind: 'open', contentPk: 1003 })
  })

  it('opens the first unfinished lesson after a finished anchor', () => {
    const rows = [row(1001), row(1002), row(1003), row(1004), row(1005)]
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(anchor.contentPk).toBe(1005)
    expect(resumeFrom(lessons, anchor, completeIn(rows))).toEqual({ kind: 'open', contentPk: 1006 })
  })

  it('skips lessons after the anchor that are already finished (rewatching an old lesson)', () => {
    const rows = [row(1001), row(1002, { updated: '2026-11-09T00:00:00+00:00' }), row(1003), row(1004)]
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(anchor.contentPk).toBe(1002)
    expect(resumeFrom(lessons, anchor, completeIn(rows))).toEqual({ kind: 'open', contentPk: 1005 })
  })

  it('stays on the anchor when nothing after it is unfinished (course done)', () => {
    const rows = lessons.map((pk) => row(pk))
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(resumeFrom(lessons, anchor, completeIn(rows))).toEqual({ kind: 'open', contentPk: 1006 })
  })

  it('reports an anchor that is not among the lessons (deleted lesson / unit not loaded)', () => {
    expect(resumeFrom(lessons, row(4242), () => false)).toEqual({ kind: 'anchor-not-found' })
    expect(resumeFrom([], row(1001), () => false)).toEqual({ kind: 'anchor-not-found' })
  })
})

describe('classroomResume lessons the student cannot open', () => {
  const lessons = [1001, 1002, 1003, 1004]

  it('knows a stripped payload from a playable one (what the backend returns without access)', () => {
    expect(isOpenableLesson('video', JSON.stringify({ id: 1, title: 'L', cipher_iframe: '<iframe>' }))).toBe(true)
    expect(isOpenableLesson('video', JSON.stringify({ id: 1, title: 'L', video: '76979871' }))).toBe(true)
    expect(isOpenableLesson('video', JSON.stringify({ id: 1, title: 'L', video_metadata: { videoData: {} } }))).toBe(true)
    // ContentVideo with video / cipher_iframe / video_metadata popped:
    expect(isOpenableLesson('video', JSON.stringify({ id: 1, title: 'L', video_time: '00:10:00' }))).toBe(false)
    expect(isOpenableLesson('video', JSON.stringify({ id: 1, video: null, cipher_iframe: '', video_metadata: null }))).toBe(false)
    expect(isOpenableLesson('file', JSON.stringify({ id: 1, title: 'F', attachment: '/media/x.pdf' }))).toBe(true)
    expect(isOpenableLesson('file', JSON.stringify({ id: 1, title: 'F' }))).toBe(false)
    expect(isOpenableLesson('video', null)).toBe(false)
    expect(isOpenableLesson('video', '{broken')).toBe(false)
    expect(isOpenableLesson('quiz', JSON.stringify({ id: 7 }))).toBe(true)
  })

  it('skips an unfinished lesson the student cannot open', () => {
    const rows = [row(1001), row(1002)]
    const anchor = pickResumeAnchor(rows) as ResumeRow
    const canOpen = (pk: number): boolean => pk !== 1003
    expect(resumeFrom(lessons, anchor, completeIn(rows), canOpen)).toEqual({ kind: 'open', contentPk: 1004 })
  })

  it('an anchor that cannot be opened is treated as gone (caller falls back)', () => {
    const rows = [row(1001), row(1002, { complete: null, updated: '2026-11-09T00:00:00+00:00' })]
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(resumeFrom(lessons, anchor, completeIn(rows), (pk) => pk !== 1002)).toEqual({ kind: 'anchor-not-found' })
  })
})

describe('classroomResume local hint', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('remembers the last lesson per enrollment', () => {
    expect(recallLesson(501)).toBeNull()
    rememberLesson(501, 1008, 102, Date.parse('2026-11-10T00:00:00Z'))
    rememberLesson(777, 2001, 201, Date.parse('2026-11-11T00:00:00Z'))
    expect(recallLesson(501)).toMatchObject({ contentPk: 1008, unitPk: 102, complete: null, updated: '2026-11-10T00:00:00.000Z' })
    expect(recallLesson(777)?.contentPk).toBe(2001)
    expect(recallLesson(999)).toBeNull()
  })

  it('ignores corrupt storage and never throws when storage is unavailable', () => {
    window.localStorage.setItem('stc.classroom.resume.v1', '{not json')
    expect(recallLesson(501)).toBeNull()
    window.localStorage.setItem('stc.classroom.resume.v1', JSON.stringify({ 501: { c: 'x' } }))
    expect(recallLesson(501)).toBeNull()
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded')
    })
    expect(() => rememberLesson(501, 1, 1)).not.toThrow()
    spy.mockRestore()
  })

  it('a newer local hint beats stale server rows; an older one does not', () => {
    const server = [row(1001), row(1002)] // last activity 2026-11-01
    rememberLesson(501, 1005, 102, Date.parse('2026-11-12T00:00:00Z'))
    expect(pickResumeAnchor(withLocalHint(server, recallLesson(501)))?.contentPk).toBe(1005)
    rememberLesson(501, 1005, 102, Date.parse('2026-10-01T00:00:00Z'))
    expect(pickResumeAnchor(withLocalHint(server, recallLesson(501)))?.contentPk).toBe(1002)
    expect(withLocalHint(server, null)).toEqual(server)
  })

  it('clock skew: a hint stamped in the future is dropped; the server wins whenever it is newer', () => {
    const now = Date.parse('2026-11-13T00:00:00Z')
    const server = [row(1001), row(1002, { updated: '2026-11-12T00:00:00+00:00' })]
    // Device clock a day ahead: without the guard this hint would win forever.
    rememberLesson(501, 1001, 101, now + 86_400_000)
    expect(withLocalHint(server, recallLesson(501), now)).toEqual(server)
    expect(pickResumeAnchor(withLocalHint(server, recallLesson(501), now))?.contentPk).toBe(1002)
    // A few seconds ahead is ordinary drift: still used.
    rememberLesson(501, 1001, 101, now + 5_000)
    expect(pickResumeAnchor(withLocalHint(server, recallLesson(501), now))?.contentPk).toBe(1001)
    // Device clock behind, server row newer: the server row wins.
    rememberLesson(501, 1001, 101, Date.parse('2026-11-11T00:00:00Z'))
    expect(pickResumeAnchor(withLocalHint(server, recallLesson(501), now))?.contentPk).toBe(1002)
  })

  it('a stale hint (lesson gone) is not found, so the caller can retry with the server rows alone', () => {
    const server = [row(1001), row(1002)]
    rememberLesson(501, 4242, 999, Date.parse('2026-11-12T00:00:00Z'))
    const hinted = pickResumeAnchor(withLocalHint(server, recallLesson(501), Date.parse('2026-11-13T00:00:00Z'))) as ResumeRow
    expect(hinted.contentPk).toBe(4242)
    expect(resumeFrom([1001, 1002, 1003], hinted, completeIn(server))).toEqual({ kind: 'anchor-not-found' })
    const serverOnly = pickResumeAnchor(server) as ResumeRow
    expect(resumeFrom([1001, 1002, 1003], serverOnly, completeIn(server))).toEqual({ kind: 'open', contentPk: 1003 })
  })

  it('keeps the server completion of the hinted lesson, so a finished lesson resumes at the next one', () => {
    const server = [row(1001), row(1002)]
    rememberLesson(501, 1002, 101, Date.parse('2026-11-12T00:00:00Z'))
    const rows = withLocalHint(server, recallLesson(501))
    const anchor = pickResumeAnchor(rows) as ResumeRow
    expect(anchor.contentPk).toBe(1002)
    expect(anchor.complete).toBeTruthy()
    expect(resumeFrom([1001, 1002, 1003], anchor, completeIn(server))).toEqual({ kind: 'open', contentPk: 1003 })
  })
})
