// Dev-only log relay. Lines tagged with the `[classroom]...` prefix are
// forwarded to a tiny local HTTP listener on :9777 (see /tmp/devlog-server.js)
// so the operator can `tail -f /tmp/devlog.log` from a terminal instead of
// asking the user to copy/paste devtools output.
//
// Behaviour:
//   - In dev mode (location.hostname === 'localhost' or '127.0.0.1') we send
//     a fire-and-forget POST with Content-Type: text/plain so the browser
//     does not preflight.
//   - In production the relay is unreachable and the network error is
//     swallowed by the `.catch(() => {})` — so it is safe to call from any
//     classroom composable. We additionally short-circuit when not on
//     localhost so we don't litter the network panel.
//
// Usage:
//   import { dlog } from 'src/composables/classroom/devLog'
//   dlog('[classroom][unit-contents] fetch →', { unitPk, fetchPolicy })

const RELAY_URL = 'http://127.0.0.1:9777/log'

function isLocalDev(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

const ENABLED = isLocalDev()

function safeStringify(args: unknown[]): string {
  try {
    return JSON.stringify(args, (_k, v) => {
      if (v instanceof Error) return { name: v.name, message: v.message, stack: v.stack }
      return v
    })
  } catch {
    try { return JSON.stringify(args.map((a) => String(a))) } catch { return '[]' }
  }
}

export function dlog(...args: unknown[]): void {
  // Always also print to the real console so devtools still works.
  console.log(...args)
  if (!ENABLED) return
  try {
    void fetch(RELAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: safeStringify(args),
      // Don't include credentials — that triggers stricter CORS.
      credentials: 'omit',
      mode: 'cors',
      keepalive: true,
    }).catch(() => { /* relay not running — silent */ })
  } catch {
    /* never throw out of a log call */
  }
}

export function dwarn(...args: unknown[]): void {
  console.warn(...args)
  if (!ENABLED) return
  try {
    void fetch(RELAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: safeStringify(['__WARN__', ...args]),
      credentials: 'omit',
      mode: 'cors',
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* never throw */
  }
}
