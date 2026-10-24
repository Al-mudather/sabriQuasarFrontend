import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import VdoCipherPlayer from 'src/components/classroom/player/VdoCipherPlayer.vue'

const LEGACY = 'https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=O&playbackInfo=P'
const block = (src: string): string =>
  `<div style="padding-top:56.34%;position:relative;"> <iframe src="${src}" allowFullScreen="true" allow="encrypted-media"></iframe> </div>`

const global = {
  mocks: { $t: (k: string) => k },
  stubs: { 'q-btn': { template: '<button @click="$emit(\'click\')">{{ label }}</button>', props: ['label'] } },
}

function iframeCount(): number {
  return document.querySelectorAll('iframe').length
}

describe('VdoCipherPlayer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = ''
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders ONE iframe even when the pasted embed code holds two', async () => {
    const w = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) + block(LEGACY) }, global, attachTo: document.body })
    jest.runAllTimers()
    await nextTick()
    expect(iframeCount()).toBe(1)
    const f = w.find('iframe')
    expect(f.attributes('src')).toBe(LEGACY)
    expect(f.attributes('allow')).toContain('encrypted-media')
    expect(f.attributes('allow')).toContain('fullscreen')
    w.unmount()
    expect(iframeCount()).toBe(0)
  })

  it('a lesson switch (key change) never has two iframes in the DOM', async () => {
    const pk = ref(1)
    const Host = defineComponent({
      setup: () => () => h(VdoCipherPlayer, { key: pk.value, cipherIframe: block(`${LEGACY}&l=${pk.value}`) }),
    })
    const w = mount(Host, { global, attachTo: document.body })
    jest.runAllTimers()
    await nextTick()
    expect(iframeCount()).toBe(1)
    pk.value = 2
    await nextTick()
    expect(iframeCount()).toBeLessThanOrEqual(1)
    jest.runAllTimers()
    await nextTick()
    expect(iframeCount()).toBe(1)
    expect(w.find('iframe').attributes('src')).toContain('l=2')
    w.unmount()
    expect(iframeCount()).toBe(0)
  })

  it('a second player revokes the first; "play here" takes it back', async () => {
    const a = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) }, global, attachTo: document.body })
    jest.runAllTimers(); await nextTick()
    const b = mount(VdoCipherPlayer, { props: { cipherIframe: block(LEGACY) }, global, attachTo: document.body })
    jest.runAllTimers(); await nextTick()
    expect(iframeCount()).toBe(1)
    expect(a.find('iframe').exists()).toBe(false)
    expect(a.text()).toContain('classroom.player.vdocipher.pausedElsewhere')
    expect(b.find('iframe').exists()).toBe(true)
    await a.find('button').trigger('click')
    jest.runAllTimers(); await nextTick()
    expect(iframeCount()).toBe(1)
    expect(a.find('iframe').exists()).toBe(true)
    a.unmount(); b.unmount()
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
