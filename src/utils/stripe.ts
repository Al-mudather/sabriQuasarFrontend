/**
 * Stripe helpers. The backend returns `stripePublishableKey: null` in
 * production (Stripe is dev/test only), so Stripe.js is never in index.html and
 * is injected on demand, only after a non-null key has been seen.
 */

export type StripeConstructor = (key: string) => {
  redirectToCheckout: (opts: { sessionId: string }) => Promise<unknown> | void
}

const STRIPE_SRC = 'https://js.stripe.com/v3/'

/** Extract the publishable key from the query payload; `null` hides Stripe. */
export function stripeKeyFromPayload (raw: unknown): string | null {
  let value = raw
  // The field is a JSONString scalar: the server sends it JSON-encoded.
  if (typeof value === 'string') {
    try { value = JSON.parse(value) } catch { return null }
  }
  if (value == null || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>
  // `publisableKey` (sic) is the backend's spelling.
  const key = obj.publisableKey ?? obj.publishableKey
  return typeof key === 'string' && key !== '' ? key : null
}

/**
 * Build-time kill switch (`STRIPE_CHECKOUT_UI`, inlined by quasar.config.js).
 * Card checkout is offered only when this is on AND a key is returned.
 */
export function stripeCheckoutUiEnabled (flag: unknown = process.env.STRIPE_CHECKOUT_UI): boolean {
  if (flag === true) return true
  if (typeof flag !== 'string') return false
  const v = flag.trim().toLowerCase()
  return v === 'true' || v === '1'
}

let scriptPromise: Promise<StripeConstructor> | null = null

function currentStripe (): StripeConstructor | null {
  const g = (window as unknown as Record<string, unknown>)['Stripe']
  return typeof g === 'function' ? (g as StripeConstructor) : null
}

/** Inject Stripe.js once and resolve its constructor. */
export function loadStripeJs (): Promise<StripeConstructor> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<StripeConstructor>((resolve, reject) => {
    const existing = currentStripe()
    if (existing) { resolve(existing); return }
    const script = document.createElement('script')
    script.src = STRIPE_SRC
    script.async = true
    script.onload = () => {
      const ctor = currentStripe()
      if (ctor) resolve(ctor)
      else reject(new Error('Stripe not loaded'))
    }
    script.onerror = () => {
      scriptPromise = null
      script.remove()
      reject(new Error('Stripe not loaded'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}
