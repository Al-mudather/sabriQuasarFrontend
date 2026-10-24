// "One active VdoCipher player per browser" arbitration — unit-tested in
// test/jest/__tests__/singleActivePlayer.spec.ts.
//
// VdoCipher raises "Error 6006 — Multiple active videos" when a second player
// opens a DRM session while another is still alive on the device (Android has
// very few DRM slots). Inside one page the classroom renders a single player,
// but a phone's Chrome keeps old tabs alive, each possibly holding a live
// VdoCipher iframe. VdoCipher's guidance: keep ONLY ONE player loaded.
//
// Protocol (BroadcastChannel, or a localStorage fallback):
//   claim    {tabId, playerId, ts}  — "I want to play". Every claim carries a
//            monotonic timestamp; ties break on tabId. A tab whose own claim
//            is NEWER ignores the remote one, so two tabs never stop each
//            other; an older holder stops its player and answers:
//   released {tabId, stopped}       — "I hold nothing now" (stopped=true when a
//            player was actually torn down). Also sent on unmount/pagehide.
//
// The claimer does not load its iframe until (a) every tab known to hold a
// player has answered `released`, bounded by `releaseTimeoutMs`, (b) a short
// discovery window has passed so holders it did not know about can answer,
// and (c) `releaseGapMs` has passed since the last release anywhere, giving
// the device time to drop the previous DRM session.

export interface PlayerClaimMessage {
  type: 'claim'
  tabId: string
  playerId: string
  ts: number
}

export interface PlayerReleasedMessage {
  type: 'released'
  tabId: string
  /** True when this tab actually tore a player down. */
  stopped: boolean
}

export type PlayerLockMessage = PlayerClaimMessage | PlayerReleasedMessage

/** Transport between tabs (BroadcastChannel / localStorage / test fake). */
export interface PlayerLockChannel {
  postMessage(message: PlayerLockMessage): void
  /** Register the receiver for messages from OTHER tabs. */
  listen(handler: (message: unknown) => void): void
  close(): void
}

export interface ArbiterOptions {
  tabId: string
  /** Opens a channel; called again after resume(). Null → single-tab mode. */
  channelFactory?: (() => PlayerLockChannel | null) | null
  now?: () => number
  /** Gap kept between one player's release and the next one's load. */
  releaseGapMs?: number
  /** Max wait for known holders in other tabs to answer `released`. */
  releaseTimeoutMs?: number
  /** Window in which unknown holders in other tabs can answer a claim. */
  discoveryMs?: number
}

interface ClaimKey {
  ts: number
  tabId: string
}

interface Holder {
  playerId: string
  key: ClaimKey
  onRevoke: () => void
  onReady: () => void
  ready: boolean
  /** Remote tabs we wait on before loading. */
  pending: Set<string>
  startedAt: number
  timer: ReturnType<typeof setTimeout> | null
}

/** >0 when a is newer than b. */
export function compareClaims(a: ClaimKey, b: ClaimKey): number {
  if (a.ts !== b.ts) return a.ts - b.ts
  return a.tabId < b.tabId ? -1 : a.tabId > b.tabId ? 1 : 0
}

function isClaim(v: unknown): v is PlayerClaimMessage {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return o.type === 'claim' && typeof o.tabId === 'string' && typeof o.playerId === 'string' && typeof o.ts === 'number'
}

function isReleased(v: unknown): v is PlayerReleasedMessage {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return o.type === 'released' && typeof o.tabId === 'string'
}

export class SinglePlayerArbiter {
  private holder: Holder | null = null
  private lastReleasedAt = Number.NEGATIVE_INFINITY
  private lastTs = 0
  /** Remote tabs believed to hold a player, with their claim. */
  private readonly remoteHolders = new Map<string, ClaimKey>()
  private channel: PlayerLockChannel | null = null
  private readonly tabId: string
  private readonly channelFactory: (() => PlayerLockChannel | null) | null
  private readonly now: () => number
  private readonly releaseGapMs: number
  private readonly releaseTimeoutMs: number
  private readonly discoveryMs: number

  constructor(opts: ArbiterOptions) {
    this.tabId = opts.tabId
    this.channelFactory = opts.channelFactory ?? null
    this.now = opts.now ?? (() => Date.now())
    this.releaseGapMs = opts.releaseGapMs ?? 400
    this.releaseTimeoutMs = opts.releaseTimeoutMs ?? 600
    this.discoveryMs = opts.discoveryMs ?? 120
    this.openChannel()
  }

  /** The player id currently allowed to (eventually) hold an iframe here. */
  activeId(): string | null {
    return this.holder?.playerId ?? null
  }

  /**
   * Make `playerId` the single active player. Any other local holder is
   * revoked synchronously; other tabs are asked to stop theirs. `onReady`
   * fires once the iframe may load; `onRevoke` fires if another player
   * (here or in another tab) takes over first or later.
   */
  claim(playerId: string, onRevoke: () => void, onReady: () => void): void {
    const prev = this.holder
    if (prev) {
      this.clearTimer(prev)
      this.holder = null
      if (prev.playerId !== playerId) {
        this.lastReleasedAt = this.now()
        prev.onRevoke()
      }
    }
    const ts = this.nextTs()
    const holder: Holder = {
      playerId,
      key: { ts, tabId: this.tabId },
      onRevoke,
      onReady,
      ready: false,
      pending: new Set(this.channel ? this.remoteHolders.keys() : []),
      startedAt: this.now(),
      timer: null,
    }
    this.holder = holder
    this.send({ type: 'claim', tabId: this.tabId, playerId, ts })
    this.schedule(holder)
  }

  /** The player unmounted or stopped. No-op if it is not the holder. */
  release(playerId: string): void {
    const h = this.holder
    if (!h || h.playerId !== playerId) return
    this.clearTimer(h)
    this.holder = null
    this.lastReleasedAt = this.now()
    this.send({ type: 'released', tabId: this.tabId, stopped: h.ready })
  }

  /**
   * Page is being hidden for good / frozen (pagehide, freeze): stop the
   * player, tell the other tabs, and close the channel (keeps the page
   * bfcache-eligible). The stopped player shows its "play here" state.
   */
  suspend(): void {
    const h = this.holder
    if (h) {
      this.clearTimer(h)
      this.holder = null
      this.lastReleasedAt = this.now()
      h.onRevoke()
      this.send({ type: 'released', tabId: this.tabId, stopped: true })
    }
    this.channel?.close()
    this.channel = null
  }

  /** Page is back (pageshow / resume): reopen the channel. Never auto-plays. */
  resume(): void {
    if (!this.channel) this.openChannel()
  }

  // -------------------------------------------------------------------------

  private openChannel(): void {
    try {
      this.channel = this.channelFactory?.() ?? null
    } catch {
      this.channel = null
    }
    this.channel?.listen((m) => this.onRemote(m))
  }

  private send(message: PlayerLockMessage): void {
    try {
      this.channel?.postMessage(message)
    } catch {
      /* channel gone — local arbitration still holds */
    }
  }

  private nextTs(): number {
    this.lastTs = Math.max(this.now(), this.lastTs + 1)
    return this.lastTs
  }

  private clearTimer(h: Holder): void {
    if (h.timer) {
      clearTimeout(h.timer)
      h.timer = null
    }
  }

  /** Decide whether the pending claim may load now, else re-check later. */
  private schedule(h: Holder): void {
    if (this.holder !== h || h.ready) return
    this.clearTimer(h)
    const now = this.now()
    const waits: number[] = []
    if (this.channel) {
      const discoveryLeft = h.startedAt + this.discoveryMs - now
      if (discoveryLeft > 0) waits.push(discoveryLeft)
      const timeoutLeft = h.startedAt + this.releaseTimeoutMs - now
      if (h.pending.size > 0 && timeoutLeft > 0) waits.push(timeoutLeft)
    }
    const gapLeft = this.lastReleasedAt + this.releaseGapMs - now
    if (gapLeft > 0) waits.push(gapLeft)

    if (waits.length === 0) {
      h.ready = true
      h.onReady()
      return
    }
    // Wake at the earliest deadline; a `released` message re-schedules sooner.
    h.timer = setTimeout(() => {
      h.timer = null
      this.schedule(h)
    }, Math.max(1, Math.min(...waits)))
  }

  private onRemote(data: unknown): void {
    if (isClaim(data)) {
      if (data.tabId === this.tabId) return
      this.lastTs = Math.max(this.lastTs, data.ts)
      const remoteKey: ClaimKey = { ts: data.ts, tabId: data.tabId }
      this.remoteHolders.set(data.tabId, remoteKey)
      const h = this.holder
      if (h && compareClaims(h.key, remoteKey) > 0) {
        // Ours is newer: the remote tab will stop when it sees our claim.
        // Wait for its `released` before loading, if we have not loaded yet.
        if (!h.ready) h.pending.add(data.tabId)
        return
      }
      let stopped = false
      if (h) {
        this.clearTimer(h)
        this.holder = null
        this.lastReleasedAt = this.now()
        stopped = h.ready
        h.onRevoke()
      }
      this.send({ type: 'released', tabId: this.tabId, stopped })
      return
    }
    if (isReleased(data)) {
      if (data.tabId === this.tabId) return
      this.remoteHolders.delete(data.tabId)
      if (data.stopped) this.lastReleasedAt = this.now()
      const h = this.holder
      if (h && !h.ready) {
        h.pending.delete(data.tabId)
        this.schedule(h)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

const CHANNEL_NAME = 'stc-vdocipher-player'

/** Typed adapter over BroadcastChannel. */
export class BroadcastPlayerChannel implements PlayerLockChannel {
  private readonly bc: BroadcastChannel
  constructor(name: string = CHANNEL_NAME) {
    this.bc = new BroadcastChannel(name)
  }
  postMessage(message: PlayerLockMessage): void {
    this.bc.postMessage(message)
  }
  listen(handler: (message: unknown) => void): void {
    this.bc.onmessage = (ev: MessageEvent<unknown>) => handler(ev.data)
  }
  close(): void {
    this.bc.onmessage = null
    this.bc.close()
  }
}

/**
 * Fallback for browsers without BroadcastChannel: the `storage` event fires
 * in every OTHER tab of the origin when a key changes. Every access is
 * guarded — Safari private mode may throw on setItem.
 */
export class StoragePlayerChannel implements PlayerLockChannel {
  private readonly key: string
  private readonly storage: Storage
  private readonly target: Pick<Window, 'addEventListener' | 'removeEventListener'>
  private listener: ((ev: StorageEvent) => void) | null = null
  private seq = 0

  constructor(
    storage: Storage,
    target: Pick<Window, 'addEventListener' | 'removeEventListener'>,
    key: string = CHANNEL_NAME,
  ) {
    this.storage = storage
    this.target = target
    this.key = key
  }

  postMessage(message: PlayerLockMessage): void {
    try {
      // A unique value per write so identical messages still fire `storage`.
      this.storage.setItem(this.key, JSON.stringify({ m: message, n: `${Date.now()}-${this.seq++}` }))
      this.storage.removeItem(this.key)
    } catch {
      /* storage unavailable — single-tab mode */
    }
  }

  listen(handler: (message: unknown) => void): void {
    this.listener = (ev: StorageEvent) => {
      if (ev.key !== this.key || !ev.newValue) return
      try {
        const parsed = JSON.parse(ev.newValue) as { m?: unknown }
        handler(parsed.m)
      } catch {
        /* ignore malformed */
      }
    }
    this.target.addEventListener('storage', this.listener as EventListener)
  }

  close(): void {
    if (this.listener) this.target.removeEventListener('storage', this.listener as EventListener)
    this.listener = null
  }
}

/** Best transport this browser offers, or null (single-tab arbitration). */
export function openPlayerChannel(): PlayerLockChannel | null {
  try {
    if (typeof BroadcastChannel !== 'undefined') return new BroadcastPlayerChannel()
  } catch {
    /* fall through */
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return new StoragePlayerChannel(window.localStorage, window)
    }
  } catch {
    /* localStorage access can throw (privacy modes) */
  }
  return null
}

let shared: SinglePlayerArbiter | null = null

/**
 * Process-wide arbiter. Wires the page lifecycle: `pagehide` / `freeze` stop
 * the player and release the claim; `pageshow` / `resume` reopen the channel
 * and leave the player in its stopped "play here" state (no auto-play).
 * Plain `visibilitychange` is deliberately NOT handled, so switching apps
 * keeps picture-in-picture playing.
 */
export function getPlayerArbiter(): SinglePlayerArbiter {
  if (shared) return shared
  const tabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  const arbiter = new SinglePlayerArbiter({ tabId, channelFactory: openPlayerChannel })
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.addEventListener('pagehide', () => arbiter.suspend())
    window.addEventListener('pageshow', () => arbiter.resume())
    document.addEventListener('freeze', () => arbiter.suspend())
    document.addEventListener('resume', () => arbiter.resume())
  }
  shared = arbiter
  return arbiter
}
