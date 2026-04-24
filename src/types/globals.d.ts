// Ambient declarations for runtime globals attached to `window` by third-party
// SDKs that load via <script> tags rather than npm imports. Keep these narrow —
// widen only the methods components actually call, so typos still error.

declare global {
  interface Window {
    OneSignal?: {
      push: (cb: (() => void) | unknown[]) => void
      setExternalUserId?: (id: string) => void
      removeExternalUserId?: () => void
      on?: (event: string, cb: (...args: unknown[]) => void) => void
      off?: (event: string, cb: (...args: unknown[]) => void) => void
      getUserId?: () => Promise<string | null>
      isPushNotificationsEnabled?: () => Promise<boolean>
      [key: string]: unknown
    }
    FB?: {
      init: (opts: Record<string, unknown>) => void
      login: (cb: (res: unknown) => void, opts?: Record<string, unknown>) => void
      logout: (cb?: (res: unknown) => void) => void
      api: (path: string, cb: (res: unknown) => void) => void
      [key: string]: unknown
    }
    hello?: ((...args: unknown[]) => unknown) & Record<string, unknown>
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: Record<string, unknown>) => void
          prompt: (cb?: (notification: unknown) => void) => void
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void
          disableAutoSelect?: () => void
        }
      }
      [key: string]: unknown
    }
    Stripe?: (publishableKey: string) => {
      elements: (opts?: Record<string, unknown>) => unknown
      createToken: (element: unknown, data?: Record<string, unknown>) => Promise<{ token?: { id: string }; error?: { message: string } }>
      [key: string]: unknown
    }
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => { render: (selector: string) => Promise<void> }
      [key: string]: unknown
    }
    videojs?: {
      (el: HTMLElement | string, opts?: Record<string, unknown>): unknown
      Hls?: { xhr?: Record<string, unknown> }
      [key: string]: unknown
    }
    jQuery?: unknown
    $?: unknown
    $cookies?: {
      get: (name: string) => string | null
      set: (name: string, value: string, opts?: Record<string, unknown>) => void
      remove: (name: string, path?: string, domain?: string) => void
      [key: string]: unknown
    }
  }
}

export {}
