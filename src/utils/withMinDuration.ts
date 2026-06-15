// Keep an in-flight action's promise pending for at least `ms` milliseconds.
//
// Used to floor the lifetime of inline button-loading spinners: navigations that
// resolve instantly (warm route chunk) would otherwise flash the spinner for a
// frame or two, which reads as a glitch rather than feedback. Wrapping the
// navigation promise guarantees the spinner stays visible long enough to
// register the click — without holding up a genuinely slow (cold-network) load,
// which already exceeds the floor on its own.
//
// Resolves/rejects with the wrapped promise's own settlement, but never before
// `ms` has elapsed.

export function withMinDuration<T>(promise: Promise<T>, ms: number): Promise<T> {
  const delay = new Promise<void>((resolve) => setTimeout(resolve, ms))
  return Promise.allSettled([promise, delay]).then(([settled]) => {
    if (settled.status === 'fulfilled') return settled.value
    throw settled.reason
  })
}
