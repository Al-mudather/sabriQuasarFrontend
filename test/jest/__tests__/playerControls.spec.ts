import {
  AUTO_QUALITY_ID,
  DOUBLE_TAP_MS,
  INITIAL_TAP_STATE,
  NARROW_BAR_MAX_PX,
  SHEET_BAR_MAX_PX,
  TAP_CHAIN_MS,
  classifyTap,
  formatHeight,
  formatRate,
  hasQualityChoice,
  isNormalRate,
  qualityOptionLabel,
  qualityValueLabel,
  rateLabel,
  seekSecondsKey,
  shouldUseSheet,
  tapSide,
  type QualityChoice,
  type TapSide,
  type TapState,
} from 'src/utils/playerControls'

const AUTO: QualityChoice = { id: AUTO_QUALITY_ID, height: null, label: 'Auto' }
const LADDER: QualityChoice[] = [
  AUTO,
  { id: '2', height: 1080, label: '1080p' },
  { id: '1', height: 720, label: '720p' },
  { id: '0', height: 360, label: '360p' },
]

describe('playerControls speed labels', () => {
  it('formats rates without float noise', () => {
    expect(formatRate(1)).toBe('1×')
    expect(formatRate(1.25)).toBe('1.25×')
    expect(formatRate(0.5)).toBe('0.5×')
    expect(formatRate(2)).toBe('2×')
    expect(formatRate(1.7500000001)).toBe('1.75×')
  })

  it('falls back to 1× for nonsense', () => {
    expect(formatRate(Number.NaN)).toBe('1×')
    expect(formatRate(0)).toBe('1×')
    expect(formatRate(-2)).toBe('1×')
  })

  it('names the default speed', () => {
    expect(isNormalRate(1)).toBe(true)
    expect(isNormalRate(1.25)).toBe(false)
    expect(rateLabel(1, 'عادي')).toBe('عادي')
    expect(rateLabel(1.5, 'عادي')).toBe('1.5×')
    expect(rateLabel(0.75, 'Normal')).toBe('0.75×')
  })
})

describe('playerControls quality labels', () => {
  it('formats heights', () => {
    expect(formatHeight(720)).toBe('720p')
    expect(formatHeight(null)).toBeNull()
    expect(formatHeight(0)).toBeNull()
    expect(formatHeight(undefined)).toBeNull()
  })

  it('labels list entries, translating auto and falling back when the height is unknown', () => {
    expect(qualityOptionLabel(AUTO, 'تلقائي')).toBe('تلقائي')
    expect(qualityOptionLabel(LADDER[1] as QualityChoice, 'تلقائي')).toBe('1080p')
    expect(qualityOptionLabel({ id: '3', height: null, label: '#4' }, 'Auto')).toBe('#4')
  })

  it('shows the playing height next to auto when it is known', () => {
    expect(qualityValueLabel(LADDER, 'auto', 720, 'تلقائي')).toBe('تلقائي · 720p')
    expect(qualityValueLabel(LADDER, 'auto', null, 'تلقائي')).toBe('تلقائي')
    expect(qualityValueLabel(LADDER, 'auto', 0, 'Auto')).toBe('Auto')
  })

  it('shows only the locked rendition when one is picked', () => {
    expect(qualityValueLabel(LADDER, '1', 1080, 'تلقائي')).toBe('720p')
    expect(qualityValueLabel(LADDER, '0', null, 'Auto')).toBe('360p')
  })

  it('treats an unknown active id as auto', () => {
    expect(qualityValueLabel(LADDER, '99', 360, 'Auto')).toBe('Auto · 360p')
    expect(qualityValueLabel([], 'auto', null, 'Auto')).toBe('Auto')
  })

  it('offers a choice only with two or more real renditions', () => {
    expect(hasQualityChoice([])).toBe(false)
    expect(hasQualityChoice([AUTO])).toBe(false)
    expect(hasQualityChoice([AUTO, LADDER[1] as QualityChoice])).toBe(false)
    expect(hasQualityChoice(LADDER)).toBe(true)
  })
})

describe('playerControls shouldUseSheet', () => {
  it('uses a sheet on narrow bars, short viewports and touch devices', () => {
    expect(shouldUseSheet({ barWidth: 332, viewportHeight: 640, coarsePointer: false })).toBe(true)
    expect(shouldUseSheet({ barWidth: SHEET_BAR_MAX_PX, viewportHeight: 900, coarsePointer: false })).toBe(true)
    expect(shouldUseSheet({ barWidth: 812, viewportHeight: 375, coarsePointer: false })).toBe(true)
    expect(shouldUseSheet({ barWidth: 1000, viewportHeight: 900, coarsePointer: true })).toBe(true)
  })

  it('uses a popover on a roomy desktop bar, and before the bar is measured', () => {
    expect(shouldUseSheet({ barWidth: 900, viewportHeight: 800, coarsePointer: false })).toBe(false)
    // Desktop side-by-side classroom: stacked bar layout, but still a mouse.
    expect(shouldUseSheet({ barWidth: NARROW_BAR_MAX_PX - 100, viewportHeight: 800, coarsePointer: false })).toBe(false)
    expect(shouldUseSheet({ barWidth: 0, viewportHeight: 0, coarsePointer: false })).toBe(false)
  })
})

describe('playerControls tap zones', () => {
  it('maps the left half to back and the right half to forward (also on RTL pages)', () => {
    expect(tapSide(10, 360)).toBe('back')
    expect(tapSide(179, 360)).toBe('back')
    expect(tapSide(180, 360)).toBe('forward')
    expect(tapSide(350, 360)).toBe('forward')
  })

  it('does not blow up on an unmeasured surface', () => {
    expect(tapSide(5, 0)).toBe('forward')
  })
})

describe('playerControls classifyTap', () => {
  const run = (taps: Array<[number, TapSide]>) => {
    let state: TapState = INITIAL_TAP_STATE
    return taps.map(([time, side]) => {
      const r = classifyTap(state, { time, side })
      state = r.state
      return r.outcome
    })
  }

  it('a lone tap is a pending single tap', () => {
    expect(run([[1000, 'forward']])).toEqual([{ kind: 'single-pending' }])
  })

  it('two quick taps on the right seek forward 10 s', () => {
    expect(run([[1000, 'forward'], [1000 + DOUBLE_TAP_MS, 'forward']])[1]).toEqual({
      kind: 'seek', side: 'forward', delta: 10, total: 10,
    })
  })

  it('two quick taps on the left seek back 10 s', () => {
    expect(run([[1000, 'back'], [1150, 'back']])[1]).toEqual({
      kind: 'seek', side: 'back', delta: -10, total: 10,
    })
  })

  it('two slow taps are two single taps', () => {
    expect(run([[1000, 'back'], [1000 + DOUBLE_TAP_MS + 1, 'back']])).toEqual([
      { kind: 'single-pending' }, { kind: 'single-pending' },
    ])
  })

  it('quick taps on opposite halves are not a double-tap', () => {
    expect(run([[1000, 'back'], [1100, 'forward']])).toEqual([
      { kind: 'single-pending' }, { kind: 'single-pending' },
    ])
  })

  it('keeps adding 10 s while the taps keep coming, with a longer window', () => {
    const out = run([
      [1000, 'forward'],
      [1150, 'forward'],
      [1150 + TAP_CHAIN_MS, 'forward'],
      [2000, 'forward'],
    ])
    expect(out.map((o) => (o.kind === 'seek' ? o.total : 0))).toEqual([0, 10, 20, 30])
    expect(out.every((o, i) => i === 0 || (o.kind === 'seek' && o.delta === 10))).toBe(true)
  })

  it('a pause longer than the chain window starts over', () => {
    const out = run([[1000, 'back'], [1100, 'back'], [1100 + TAP_CHAIN_MS + 1, 'back']])
    expect(out[2]).toEqual({ kind: 'single-pending' })
  })

  it('changing side mid-streak starts over', () => {
    const out = run([[1000, 'back'], [1100, 'back'], [1200, 'forward'], [1300, 'forward']])
    expect(out[2]).toEqual({ kind: 'single-pending' })
    expect(out[3]).toEqual({ kind: 'seek', side: 'forward', delta: 10, total: 10 })
  })

  it('ignores a tap with a timestamp before the previous one', () => {
    expect(run([[1000, 'back'], [900, 'back']])[1]).toEqual({ kind: 'single-pending' })
  })

  it('does not mutate the state it is given', () => {
    const frozen = Object.freeze({ ...INITIAL_TAP_STATE })
    expect(() => classifyTap(frozen, { time: 1, side: 'back' })).not.toThrow()
  })

  it('picks the Arabic plural form by count', () => {
    expect(seekSecondsKey(10)).toBe('seekSecondsFew')
    expect(seekSecondsKey(20)).toBe('seekSecondsMany')
  })
})
