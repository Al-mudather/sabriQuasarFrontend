import {
  VdoCipherSession,
  stopVdoCipherPlayers,
  type VdoPlayerInstance,
  type VdoPlayerStatic,
  type VdoSessionPhase,
} from 'src/composables/classroom/useVdoCipherSession'
import type { ReleaseInfo } from 'src/utils/vdoPlayerPolicy'

const url = (n: number): string => `https://player.vdocipher.com/v2/?otp=OTP${n}&playbackInfo=PB${n}`
const LEGACY = 'https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=OTPL&playbackInfo=PBL'
const t = (n: number): { src: string; title: string } => ({ src: url(n), title: `Lecture ${n}` })

type Handler = (payload: unknown) => void

/** Stand-in for api.js: one fake player per iframe, events fired by the test. */
function fakeApi(): {
  api: VdoPlayerStatic
  loadVideo: jest.Mock
  emitVideo: (event: string) => void
  emitError: (payload: unknown) => void
  instances: () => number
} {
  const players = new Map<HTMLIFrameElement, { video: Map<string, Handler[]>; api: Map<string, Handler[]> }>()
  let last: { video: Map<string, Handler[]>; api: Map<string, Handler[]> } | null = null
  const loadVideo = jest.fn(() => Promise.resolve())
  const on = (map: Map<string, Handler[]>) => (event: string, handler: Handler): void => {
    map.set(event, [...(map.get(event) ?? []), handler])
  }
  return {
    loadVideo,
    instances: () => players.size,
    emitVideo: (event) => last?.video.get(event)?.forEach((h) => h(undefined)),
    emitError: (payload) => last?.api.get('error')?.forEach((h) => h(payload)),
    api: {
      getInstance(iframe: HTMLIFrameElement): VdoPlayerInstance {
        const entry = { video: new Map<string, Handler[]>(), api: new Map<string, Handler[]>() }
        players.set(iframe, entry)
        last = entry
        return {
          video: { addEventListener: on(entry.video) },
          api: { addEventListener: on(entry.api), loadVideo },
        }
      },
    },
  }
}

function setup(over: { api?: VdoPlayerStatic | null; gap?: () => number } = {}): {
  session: VdoCipherSession
  host: HTMLElement
  phases: VdoSessionPhase[]
  released: ReleaseInfo[]
  frames: () => HTMLIFrameElement[]
} {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const phases: VdoSessionPhase[] = []
  const released: ReleaseInfo[] = []
  const session = new VdoCipherSession({
    host: () => host,
    arbiter: { noteRelease: (info) => released.push(info), gapLeftMs: over.gap ?? (() => 0) },
    onPhase: (p) => phases.push(p),
    frameClass: 'cls-vdo__frame',
    loadApi: () => Promise.resolve(over.api === undefined ? null : over.api),
  })
  return { session, host, phases, released, frames: () => [...host.querySelectorAll('iframe')] }
}

const tick = (ms = 0): Promise<void> => jest.advanceTimersByTimeAsync(ms)

describe('VdoCipherSession', () => {
  let warn: jest.SpyInstance
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = ''
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })
  afterEach(async () => {
    await stopVdoCipherPlayers()
    warn.mockRestore()
    jest.useRealTimers()
  })

  it('builds ONE lite iframe for the first lesson, with the permissions the player needs', async () => {
    const s = setup({ api: fakeApi().api })
    s.session.show(t(1))
    await tick()
    const [f] = s.frames()
    expect(s.frames()).toHaveLength(1)
    expect(f?.getAttribute('src')).toBe(`${url(1)}&litemode=true`)
    expect(f?.getAttribute('title')).toBe('Lecture 1')
    expect(f?.getAttribute('allow')).toContain('encrypted-media')
    expect(f?.getAttribute('allow')).toContain('fullscreen')
    expect(f?.hasAttribute('allowfullscreen')).toBe(true)
    expect(f?.className).toBe('cls-vdo__frame')
    expect(s.session.loaded).toBe(url(1))
    expect(s.session.hasSession).toBe(false)
    expect(s.phases[s.phases.length - 1]).toBe('ready')
    s.session.destroy()
  })

  it('never played: the next lesson rebuilds a lite player and reports that NO session was released', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    const first = s.frames()[0]
    s.session.show(t(2))
    await tick(349)
    expect(s.frames()[0]).toBe(first) // trailing debounce: nothing yet
    await tick(1)
    await tick(500) // blank document (or its timeout)
    expect(s.frames()).toHaveLength(1)
    expect(s.frames()[0]).not.toBe(first)
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(2)}&litemode=true`)
    expect(fake.loadVideo).not.toHaveBeenCalled()
    expect(s.released).toEqual([{ kind: 'vdocipher', hadSession: false }])
    s.session.destroy()
  })

  it('played: the next lesson is loaded INSIDE the same iframe with loadVideo', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    const first = s.frames()[0]
    fake.emitVideo('play')
    expect(s.session.hasSession).toBe(true)
    s.session.show(t(2))
    await tick(350)
    expect(fake.loadVideo).toHaveBeenCalledTimes(1)
    expect(fake.loadVideo).toHaveBeenCalledWith({ otp: 'OTP2', playbackInfo: 'PB2' })
    expect(s.phases[s.phases.length - 1]).toBe('loading')
    fake.emitVideo('loadstart')
    await tick()
    expect(s.phases[s.phases.length - 1]).toBe('ready')
    expect(s.frames()).toEqual([first]) // the iframe survived
    expect(first?.getAttribute('title')).toBe('Lecture 2')
    expect(s.session.loaded).toBe(url(2))
    expect(s.released).toEqual([]) // nothing was destroyed
    expect(fake.instances()).toBe(1)
    s.session.destroy()
  })

  it('rapid taps after playing: only the last lesson is loaded', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    fake.emitVideo('play')
    s.session.show(t(2))
    await tick(200)
    s.session.show(t(3))
    await tick(200)
    s.session.show(t(4))
    await tick(350)
    expect(fake.loadVideo).toHaveBeenCalledTimes(1)
    expect(fake.loadVideo).toHaveBeenCalledWith({ otp: 'OTP4', playbackInfo: 'PB4' })
    s.session.destroy()
  })

  it('serialised: a second loadVideo waits until the first shows a sign of life', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    fake.emitVideo('play')
    s.session.show(t(2))
    await tick(350)
    expect(fake.loadVideo).toHaveBeenCalledTimes(1)
    s.session.show(t(3))
    await tick(1000) // debounce long gone, but lesson 2 is still loading
    expect(fake.loadVideo).toHaveBeenCalledTimes(1)
    fake.emitVideo('loadedmetadata')
    await tick()
    expect(fake.loadVideo).toHaveBeenCalledTimes(2)
    expect(fake.loadVideo).toHaveBeenLastCalledWith({ otp: 'OTP3', playbackInfo: 'PB3' })
    // No sign of life at all: the queue is released after the settle timeout.
    s.session.show(t(4))
    await tick(4000)
    expect(fake.loadVideo).toHaveBeenCalledTimes(3)
    s.session.destroy()
  })

  it('loadVideo rejects → graceful teardown (session released) and a fresh lite player', async () => {
    const fake = fakeApi()
    fake.loadVideo.mockImplementationOnce(() => Promise.reject(new Error('nope')))
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    const first = s.frames()[0]
    fake.emitVideo('play')
    s.session.show(t(2))
    await tick(350)
    expect(first?.getAttribute('src')).toBe('about:blank') // blanked BEFORE removal
    await tick(500)
    expect(s.released).toEqual([{ kind: 'vdocipher', hadSession: true }])
    expect(s.frames()).toHaveLength(1)
    expect(s.frames()[0]).not.toBe(first)
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(2)}&litemode=true`)
    s.session.destroy()
  })

  it('api.js unavailable: a tap inside the iframe (window blur) counts as a session; switch = graceful rebuild', async () => {
    const s = setup({ api: null })
    s.session.show(t(1))
    await tick()
    const first = s.frames()[0] as HTMLIFrameElement
    first.focus()
    Object.defineProperty(document, 'activeElement', { configurable: true, get: () => first })
    window.dispatchEvent(new Event('blur'))
    delete (document as unknown as { activeElement?: unknown }).activeElement
    expect(s.session.hasSession).toBe(true)
    s.session.show(t(2))
    await tick(350)
    await tick(500)
    expect(s.released).toEqual([{ kind: 'vdocipher', hadSession: true }])
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(2)}&litemode=true`)
    s.session.destroy()
  })

  it('legacy 1.x embed: URL untouched, no API, always treated as holding a session', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show({ src: LEGACY, title: 'Old' })
    await tick()
    expect(s.frames()[0]?.getAttribute('src')).toBe(LEGACY)
    expect(fake.instances()).toBe(0)
    expect(s.session.hasSession).toBe(true)
    s.session.show(t(2))
    await tick(350)
    await tick(500)
    expect(fake.loadVideo).not.toHaveBeenCalled()
    expect(s.released).toEqual([{ kind: 'vdocipher', hadSession: true }])
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(2)}&litemode=true`)
    s.session.destroy()
  })

  it('waits for the arbiter gap before building a player', async () => {
    let gap = 1500
    const start = Date.now()
    const s = setup({ api: null, gap: () => Math.max(0, gap - (Date.now() - start)) })
    s.session.show(t(1))
    await tick(1499)
    expect(s.frames()).toHaveLength(0)
    await tick(1)
    expect(s.frames()).toHaveLength(1)
    gap = 0
    s.session.destroy()
  })

  it('session error 6006: rebuild after 2 s, then 4 s, then give up; retry starts over', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    const first = s.frames()[0]
    fake.emitVideo('play')
    fake.emitError({ code: 6006, message: 'Multiple active videos', payload: { code: 6006, shaka: 6006, vdo: 0 } })
    expect(s.phases[s.phases.length - 1]).toBe('recovering')
    await tick()
    expect(first?.getAttribute('src')).toBe('about:blank')
    await tick(500)
    expect(s.frames()).toHaveLength(0) // removed, waiting out the backoff
    expect(s.released[0]).toEqual({ kind: 'vdocipher', hadSession: true })
    await tick(1400)
    expect(s.frames()).toHaveLength(0)
    await tick(600)
    expect(s.frames()).toHaveLength(1) // fresh player after ~2 s
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(1)}&litemode=true`)
    expect(s.phases[s.phases.length - 1]).toBe('ready')

    // Second failure (composite code): 4 s this time.
    fake.emitError({ code: 60062001 })
    await tick(500)
    await tick(3400)
    expect(s.frames()).toHaveLength(0)
    await tick(600)
    expect(s.frames()).toHaveLength(1)

    // Third failure: no more automatic retries.
    fake.emitError({ payload: { shaka: 6003 } })
    expect(s.phases[s.phases.length - 1]).toBe('failed')
    await tick(500)
    expect(s.frames()).toHaveLength(0)
    await tick(10000)
    expect(s.frames()).toHaveLength(0)

    s.session.retry()
    await tick()
    expect(s.frames()).toHaveLength(1)
    expect(s.phases[s.phases.length - 1]).toBe('ready')
    s.session.destroy()
  })

  it('playback resets the retry budget; other errors are left to the player', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    fake.emitError({ code: 6006 })
    await tick(3000)
    fake.emitVideo('playing') // it works again
    fake.emitError({ code: 6006 })
    expect(s.phases[s.phases.length - 1]).toBe('recovering')
    await tick(500)
    await tick(1400)
    expect(s.frames()).toHaveLength(0)
    await tick(600) // 2 s again, not 4 s
    expect(s.frames()).toHaveLength(1)

    const frame = s.frames()[0]
    fake.emitError({ code: 60072013 }) // OTP problem, not a session error
    fake.emitError({ code: 2013 })
    await tick(5000)
    expect(s.frames()).toEqual([frame])
    expect(s.phases[s.phases.length - 1]).toBe('ready')
    s.session.destroy()
  })

  it('a failed lesson is left behind by picking another lesson', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    for (let i = 0; i < 3; i++) {
      fake.emitError({ code: 6006 })
      await tick(5000)
    }
    expect(s.phases[s.phases.length - 1]).toBe('failed')
    s.session.show(t(1)) // same lesson: the retry button decides
    await tick(1000)
    expect(s.frames()).toHaveLength(0)
    s.session.show(t(2))
    await tick(1000)
    expect(s.frames()[0]?.getAttribute('src')).toBe(`${url(2)}&litemode=true`)
    s.session.destroy()
  })

  it('logs the code and user agent of an error, never the OTP or playbackInfo', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    fake.emitError({ code: 6006, message: `failed for otp=OTP1`, details: { url: url(1) }, payload: { code: 6006 } })
    const logged = JSON.stringify(warn.mock.calls)
    expect(logged).toContain('6006')
    expect(logged).toContain('userAgent')
    expect(logged).not.toMatch(/OTP1|PB1/)
    s.session.destroy()
  })

  it('stop() is graceful: about:blank first, removal after its load (or the timeout), then the release note', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    const frame = s.frames()[0] as HTMLIFrameElement
    fake.emitVideo('play')
    let info: ReleaseInfo | null = null
    void s.session.stop().then((i) => { info = i })
    expect(frame.getAttribute('src')).toBe('about:blank')
    expect(frame.isConnected).toBe(true) // not removed in the same tick
    expect(s.released).toEqual([])
    frame.dispatchEvent(new Event('load'))
    await tick()
    expect(frame.isConnected).toBe(false)
    expect(info).toEqual({ kind: 'vdocipher', hadSession: true })
    expect(s.released).toEqual([{ kind: 'vdocipher', hadSession: true }])
    expect(s.phases[s.phases.length - 1]).toBe('idle')
    // Stopped is not destroyed: the same session can show a lesson again.
    s.session.show(t(1))
    await tick()
    expect(s.frames()).toHaveLength(1)
    s.session.destroy()
    expect(s.frames()).toHaveLength(0)
  })

  it('stop() cancels a pending switch and a running backoff', async () => {
    const fake = fakeApi()
    const s = setup({ api: fake.api })
    s.session.show(t(1))
    await tick()
    s.session.show(t(2))
    void s.session.stop()
    await tick(2000)
    expect(s.frames()).toHaveLength(0)

    s.session.show(t(1))
    await tick()
    fake.emitError({ code: 6006 })
    await tick(600)
    void s.session.stop()
    await tick(10000)
    expect(s.frames()).toHaveLength(0)
    s.session.destroy()
  })

  it('stopSync / destroy (pagehide, unmount) remove the iframe in the same tick', async () => {
    const s = setup({ api: null })
    s.session.show(t(1))
    await tick()
    const frame = s.frames()[0] as HTMLIFrameElement
    expect(s.session.stopSync()).toEqual({ kind: 'vdocipher', hadSession: false })
    expect(frame.isConnected).toBe(false)
    expect(frame.getAttribute('src')).toBe('about:blank')
    s.session.destroy()
    s.session.show(t(2)) // ignored after destroy
    await tick(1000)
    expect(s.frames()).toHaveLength(0)
  })

  it('stopVdoCipherPlayers() stops every live session and waits for them', async () => {
    const a = setup({ api: null })
    const b = setup({ api: null })
    a.session.show(t(1))
    b.session.show(t(2))
    await tick()
    let done = false
    void stopVdoCipherPlayers().then(() => { done = true })
    expect(done).toBe(false) // asynchronous: it waits for the blank documents
    expect(a.frames()[0]?.getAttribute('src')).toBe('about:blank')
    await tick(500)
    expect(done).toBe(true)
    expect(a.frames()).toHaveLength(0)
    expect(b.frames()).toHaveLength(0)
    a.session.destroy()
    b.session.destroy()
  })
})
