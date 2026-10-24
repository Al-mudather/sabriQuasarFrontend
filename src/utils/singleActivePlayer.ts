// "One active VdoCipher player per browser" arbitration — pure logic,
// unit-tested in test/jest/__tests__/singleActivePlayer.spec.ts.
//
// VdoCipher raises "Error 6006 — Multiple active videos" when a second player
// opens a DRM session while another is still alive on the device. Inside one
// page the classroom renders a single player, but a phone's Chrome keeps old
// tabs alive: a student who opened the classroom (or a course preview) from a
// few links has several tabs, each holding a live VdoCipher iframe. VdoCipher's
// guidance is to keep ONLY ONE player loaded at a time.
//
// The arbiter enforces that across every player in this tab AND across tabs
// of the same origin (BroadcastChannel):
//   - claim(id) makes `id` the only holder; any other holder (local or in
//     another tab) is told to unmount its iframe via its onRevoke callback.
//   - release(id) records when the last player went away so the next one can
//     wait a moment for the device's DRM session to be torn down before
//     loading (claim() returns that wait in `waitMs`).

export interface PlayerClaimMessage {
  type: 'claim'
  tabId: string
  playerId: string
}

/** Subset of BroadcastChannel the arbiter uses (injectable for tests). */
export interface PlayerLockChannel {
  postMessage(message: PlayerClaimMessage): void
  onmessage: ((ev: { data: unknown }) => void) | null
}

export interface ArbiterOptions {
  tabId: string
  channel?: PlayerLockChannel | null
  now?: () => number
  /** Gap kept between one player's release and the next one's load. */
  releaseGapMs?: number
}

interface Holder {
  playerId: string
  onRevoke: () => void
}

function isClaimMessage(v: unknown): v is PlayerClaimMessage {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return o.type === 'claim' && typeof o.tabId === 'string' && typeof o.playerId === 'string'
}

export class SinglePlayerArbiter {
  private holder: Holder | null = null
  private lastReleasedAt = Number.NEGATIVE_INFINITY
  private readonly tabId: string
  private readonly channel: PlayerLockChannel | null
  private readonly now: () => number
  private readonly releaseGapMs: number

  constructor(opts: ArbiterOptions) {
    this.tabId = opts.tabId
    this.channel = opts.channel ?? null
    this.now = opts.now ?? (() => Date.now())
    this.releaseGapMs = opts.releaseGapMs ?? 400
    if (this.channel) {
      this.channel.onmessage = (ev) => this.onRemote(ev.data)
    }
  }

  /** The player id currently allowed to keep an iframe in this tab. */
  activeId(): string | null {
    return this.holder?.playerId ?? null
  }

  /**
   * Make `playerId` the single active player. Revokes any other local holder
   * synchronously and tells other tabs to revoke theirs.
   * Returns how long the caller should wait before loading its iframe.
   */
  claim(playerId: string, onRevoke: () => void): { waitMs: number } {
    const prev = this.holder
    if (prev && prev.playerId !== playerId) {
      this.holder = null
      this.lastReleasedAt = this.now()
      prev.onRevoke()
    }
    this.holder = { playerId, onRevoke }
    try {
      this.channel?.postMessage({ type: 'claim', tabId: this.tabId, playerId })
    } catch {
      /* channel closed — local arbitration still holds */
    }
    const waitMs = Math.max(0, this.lastReleasedAt + this.releaseGapMs - this.now())
    return { waitMs }
  }

  /** The player unmounted (or stopped). No-op if it is not the holder. */
  release(playerId: string): void {
    if (this.holder?.playerId !== playerId) return
    this.holder = null
    this.lastReleasedAt = this.now()
  }

  private onRemote(data: unknown): void {
    if (!isClaimMessage(data)) return
    if (data.tabId === this.tabId) return
    const prev = this.holder
    if (!prev) return
    this.holder = null
    this.lastReleasedAt = this.now()
    prev.onRevoke()
  }
}

let shared: SinglePlayerArbiter | null = null

/** Process-wide arbiter; wires a BroadcastChannel when the browser has one. */
export function getPlayerArbiter(): SinglePlayerArbiter {
  if (shared) return shared
  const tabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  let channel: PlayerLockChannel | null = null
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('stc-vdocipher-player') as unknown as PlayerLockChannel
    }
  } catch {
    channel = null
  }
  shared = new SinglePlayerArbiter({ tabId, channel })
  return shared
}
