// In-memory cache-freshness tracker for the classroom data layer.
//
// Apollo's normalised cache decides WHAT to keep across navigations; this
// store decides WHEN that cache is stale enough to warrant a network refetch.
// useStaleAfterTtl writes a timestamp here every time a query lands, and
// reads it again on every classroom mount + on every `visibilitychange`
// transition to "visible". If `Date.now() - lastFetchedAt[key] > ttlMs`,
// the consumer triggers a `network-only` refetch.
//
// State is intentionally not persisted to localStorage — a fresh tab reload
// should pay one network round-trip and then enjoy cache for the TTL window.

import { defineStore } from 'pinia'

import 'pinia-plugin-persistedstate'

interface ClassroomCacheState {
  lastFetchedAt: Record<string, number>
}

export const useClassroomCacheStore = defineStore('classroomCache', {
  state: (): ClassroomCacheState => ({
    lastFetchedAt: {},
  }),

  actions: {
    markFresh(key: string): void {
      this.lastFetchedAt[key] = Date.now()
    },

    isStale(key: string, ttlMs: number): boolean {
      const at = this.lastFetchedAt[key]
      if (typeof at !== 'number') return true
      return Date.now() - at > ttlMs
    },

    /**
     * True once a query for this key has landed at least once this session.
     * Distinguishes "never fetched" (let the query's own initial fetch handle
     * it) from "fetched but now stale" (worth a refresh). Used by
     * useStaleAfterTtl to avoid duplicating the cold fetch with a mount refetch.
     */
    hasRecord(key: string): boolean {
      return typeof this.lastFetchedAt[key] === 'number'
    },

    /** Drop the freshness mark — useful when the user logs out or switches courses. */
    forget(prefix: string): void {
      for (const key of Object.keys(this.lastFetchedAt)) {
        if (key.startsWith(prefix)) delete this.lastFetchedAt[key]
      }
    },
  },

  // In-memory only — do not persist.
  persist: false,
})
