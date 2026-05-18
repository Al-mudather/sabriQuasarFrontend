// Generic "fetch on mount + on focus, but only if cache is older than TTL"
// helper for Apollo queries running through @vue/apollo-composable.
//
// The classroom queries use fetchPolicy: 'cache-first' so revisits paint
// instantly from cache. This composable layers on top: it tracks the last
// time the query landed (via useClassroomCacheStore), and forces a
// network-only refetch whenever the cache is older than `ttlMs`. The check
// runs:
//   1. On consumer mount (component using the query is created).
//   2. When the tab transitions from hidden → visible (handles the
//      "user came back after lunch" case).
//
// Callers pass:
//   - key:     a stable id like `course:${pk}` or `unit:${pk}`. Same key
//              across reactive re-runs of the same logical query.
//   - ttlMs:   staleness threshold (default 10 minutes).
//   - refetch: () => Promise<unknown> | void — Apollo `refetch` callback.
//
// On every successful query result, call `markFresh()` (returned). This is
// what stamps the timestamp.

import { onBeforeUnmount, onMounted } from 'vue'

import { useClassroomCacheStore } from 'src/stores/classroomCache'

export interface UseStaleAfterTtlOptions {
  /** Stable id used to look up freshness in the cache store. */
  key: () => string | null
  /** Staleness threshold in milliseconds (default 10 minutes). */
  ttlMs?: number
  /** Apollo refetch callback. */
  refetch: () => Promise<unknown> | void
  /** If true, do nothing (useful when the query is gated by `enabled`). */
  disabled?: () => boolean
}

const DEFAULT_TTL_MS = 10 * 60 * 1000

export function useStaleAfterTtl(options: UseStaleAfterTtlOptions): {
  markFresh: () => void
} {
  const cache = useClassroomCacheStore()
  const ttl = options.ttlMs ?? DEFAULT_TTL_MS

  function shouldRefetch(): boolean {
    if (options.disabled?.()) return false
    const k = options.key()
    if (!k) return false
    return cache.isStale(k, ttl)
  }

  function maybeRefetch(): void {
    if (!shouldRefetch()) return
    void options.refetch()
  }

  function markFresh(): void {
    const k = options.key()
    if (k) cache.markFresh(k)
  }

  function onVisibility(): void {
    if (typeof document === 'undefined') return
    if (document.visibilityState === 'visible') maybeRefetch()
  }

  onMounted(() => {
    maybeRefetch()
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility)
    }
  })

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  })

  return { markFresh }
}
