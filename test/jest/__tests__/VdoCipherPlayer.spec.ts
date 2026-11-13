import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VdoCipherPlayer from 'src/components/classroom/player/VdoCipherPlayer.vue'

const LEGACY = 'https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=O&playbackInfo=P'
const block = (src: string): string =>
  `<div style="padding-top:56.34%;position:relative;"> <iframe src="${src}" allowFullScreen="true" allow="encrypted-media"></iframe> </div>`

const V2 = (n: number): string => `https://player.vdocipher.com/v2/?otp=O${n}&playbackInfo=P${n}`

const global = {
  mocks: { $t: (k: string) => k },
  stubs: {
    'q-btn': { template: '<button @click="$emit(\'click\')">{{ label }}</button>', props: ['label'] },
    'q-spinner': { template: '<i class="spinner" />' },
  },
}

function iframeCount(): number {
  return document.querySelectorAll('iframe').length
}

// Let timers AND the promise chains between them run.
const settle = async (ms = 3000): Promise<void> => {
  await jest.advanceTimersByTimeAsync(ms)
  await nextTick()
}

// Minimal api.js stand-in so the component can see "play" and errors.
type Handler = (payload: unknown) => void
const videoHandlers = new Map<string, Handler[]>()
const apiHandlers = new Map<string, Handler[]>()
const loadVideo = jest.fn(() => Promise.resolve())
const fire = (map: Map<string, Handler[]>, event: string, payload?: unknown): void =>
  map.get(event)?.forEach((h) => h(payload))

// The arbiter is a page-wide singleton whose release gap outlives a test, so
// each test starts well after the previous one on the fake clock.
let clock = Date.now()

describe('VdoCipherPlayer', () => {
  beforeEach(() => {
    clock += 3_600_000
    jest.useFakeTimers({ now: clock })
    document.body.innerHTML = ''
    videoHandlers.clear()
    apiHandlers.clear()
    loadVideo.mockClear()
    ;(window as unknown as { VdoPlayer: unknown }).VdoPlayer = {
      getInstance: () => ({
        video: { addEventListener: (e: string, h: Handler) => videoHandlers.set(e, [...(videoHandlers.get(e) ?? []), h]) },
        api: {
          addEventListener: (e: string, h: Handler) => apiHandlers.set(e, [...(apiHandlers.get(e) ?? []), h]),
          loadVideo,
        },
      }),
    }
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders ONE iframe even when the pasted embed code holds two', async () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) + block(LEGACY) }, global, attachTo: document.body })
    await settle()
    expect(iframeCount()).toBe(1)
    const f = w.find('iframe')
    expect(f.attributes('src')).toBe(LEGACY) // legacy 1.x URLs are not touched
    expect(f.attributes('allow')).toContain('encrypted-media')
    expect(f.attributes('allow')).toContain('fullscreen')
    w.unmount()
    expect(iframeCount()).toBe(0)
  })

  it('loads v2 embeds in lite mode (no DRM session until play)', async () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(V2(1)), title: 'L1' }, global, attachTo: document.body })
    await settle()
    expect(w.find('iframe').attributes('src')).toBe(`${V2(1)}&litemode=true`)
    expect(w.find('iframe').attributes('title')).toBe('L1')
    w.unmount()
  })

  it('a lesson switch (prop change, no key) never has two iframes in the DOM', async () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(V2(1)) }, global, attachTo: document.body })
    await settle()
    expect(iframeCount()).toBe(1)
    await w.setProps({ cipherIframe: block(V2(2)) })
    expect(iframeCount()).toBeLessThanOrEqual(1)
    for (let i = 0; i < 30; i++) {
      await jest.advanceTimersByTimeAsync(50)
      expect(iframeCount()).toBeLessThanOrEqual(1)
    }
    await settle()
    expect(iframeCount()).toBe(1)
    expect(w.find('iframe').attributes('src')).toBe(`${V2(2)}&litemode=true`)
    expect(loadVideo).not.toHaveBeenCalled() // never played → plain rebuild
    w.unmount()
    expect(iframeCount()).toBe(0)
  })

  it('after playback, a lesson switch keeps the SAME iframe and uses loadVideo', async () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(V2(1)), title: 'L1' }, global, attachTo: document.body })
    await settle()
    const frame = w.find('iframe').element
    fire(videoHandlers, 'play')
    await w.setProps({ cipherIframe: block(V2(2)), title: 'L2' })
    await settle(400)
    expect(loadVideo).toHaveBeenCalledWith({ otp: 'O2', playbackInfo: 'P2' })
    fire(videoHandlers, 'loadstart')
    await settle()
    expect(iframeCount()).toBe(1)
    expect(w.find('iframe').element).toBe(frame)
    expect(w.find('iframe').attributes('title')).toBe('L2')
    w.unmount()
  })

  it('a second player revokes the first; "play here" takes it back', async () => {
    const a = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) }, global, attachTo: document.body })
    await settle()
    const b = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) }, global, attachTo: document.body })
    await settle()
    expect(iframeCount()).toBe(1)
    expect(a.find('iframe').exists()).toBe(false)
    expect(a.text()).toContain('classroom.player.vdocipher.pausedElsewhere')
    expect(b.find('iframe').exists()).toBe(true)
    await a.find('button').trigger('click')
    await settle()
    expect(iframeCount()).toBe(1)
    expect(a.find('iframe').exists()).toBe(true)
    a.unmount(); b.unmount()
  })

  it('session error: recovers twice on its own, then shows the help panel with a working retry', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(V2(1)) }, global, attachTo: document.body })
    await settle()
    fire(apiHandlers, 'error', { code: 6006 })
    await nextTick()
    expect(w.text()).toContain('classroom.player.vdocipher.recovering')
    await settle(5000)
    expect(iframeCount()).toBe(1)
    expect(w.text()).not.toContain('classroom.player.vdocipher.recovering')
    fire(apiHandlers, 'error', { code: 6006 })
    await settle(8000)
    expect(iframeCount()).toBe(1)
    fire(apiHandlers, 'error', { code: 6006 })
    await settle(1000)
    expect(iframeCount()).toBe(0)
    expect(w.attributes('data-state')).toBe('failed')
    for (const key of ['title', 'intro', 'closeOthers', 'restart', 'browser', 'protectedContent', 'retry']) {
      expect(w.text()).toContain(`classroom.player.vdocipher.help.${key}`)
    }
    expect(w.emitted('error')).toEqual([['vdocipher-session-failed']])
    await w.find('button').trigger('click')
    await settle()
    expect(iframeCount()).toBe(1)
    expect(w.attributes('data-state')).toBe('player')
    expect(JSON.stringify(warn.mock.calls)).not.toMatch(/O1|P1/)
    warn.mockRestore()
    w.unmount()
  })

  it('shows the invalid-embed message, warns and emits error for an unrecognised code', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: '<p>oops</p>' }, global })
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.text()).toContain('classroom.player.vdocipher.invalidEmbed')
    expect(w.emitted('error')).toEqual([['invalid-vdocipher-embed']])
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('shows the missing-credentials message when there is no code at all', () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: '' }, global })
    expect(w.text()).toContain('classroom.player.vdocipher.missingCredentials')
  })

  it('warns when the code holds several players (double paste)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) + block(LEGACY), title: 'CNS Pathology L7' }, global })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('several players'), expect.objectContaining({ iframeCount: 2 }))
    warn.mockRestore()
    w.unmount()
  })
})
