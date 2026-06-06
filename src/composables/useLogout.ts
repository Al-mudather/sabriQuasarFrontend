// Single logout entry point for the whole UI.
//
// Every logout button (home navbar, mobile menu, main navbar, user-account
// sidebar) routes through this composable so the behavior is identical
// everywhere — no more divergent per-component cleanup.
//
// `auth.logOut()` already does the heavy lifting: best-effort server-side
// revoke, Apollo cache/WS teardown, and a full storage + cookie wipe (keeping
// only language/currency display prefs). Here we additionally reset the other
// in-memory Pinia stores so no reactive copy of the previous user's data
// lingers, then send the user Home.
//
// We deliberately do NOT reset the `settings` store — its language/currency
// prefs are intentionally preserved across logout.

import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useCartStore } from 'src/stores/cart'
import { usePyramidStore } from 'src/stores/pyramid'

export function useLogout (): { logout: () => Promise<void> } {
  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const pyramid = usePyramidStore()

  async function logout (): Promise<void> {
    try {
      await auth.logOut()
    } catch (_e) { /* graceful — proceed to reset + redirect regardless */ }

    // Re-derive in-memory state from the (now wiped) storage. $reset re-runs
    // each store's state() factory, which reads the cleared session/local
    // storage and falls back to empty defaults.
    try { cart.$reset() } catch (_e) { /* ignore */ }
    try { pyramid.$reset() } catch (_e) { /* ignore */ }

    void router.push({ name: 'Home' }).catch(() => { /* already there */ })
  }

  return { logout }
}
