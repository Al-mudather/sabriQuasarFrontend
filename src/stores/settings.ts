// Pinia equivalent of the legacy Vuex `settings` module. Action names match
// 1:1 with the Vuex version for mechanical migration.
//
// Persistence:
//   - `isEnglish` persists via the Pinia persist plugin.
//   - `isEnglish` also writes directly to Quasar `LocalStorage` in its action
//     to match the Vuex behavior (legacy code still reads the raw key).
//   - `activeNav` keeps the direct LocalStorage write pattern (legacy code
//     reads the raw key on boot).
//   - `openMenu` is UI-transient and not persisted.
//
// `currency` USED TO LIVE HERE (default 'SDG', persisted, written by the
// SDG/USD switcher and by the login handlers from `user.userCurrency`). The
// platform now sells in USD only, so the display currency is the constant
// `DISPLAY_CURRENCY` in `src/utils/currency.ts`. Dropping the field from
// `persist.paths` is deliberate and load-bearing: existing visitors have
// `{"currency":"SDG"}` sitting in localStorage['settings'], and keeping it in
// the paths list would rehydrate that stale preference over the new default.

import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

// Load the pinia-plugin-persistedstate module augmentation so `persist: { paths: [...] }`
// is accepted as a valid option on DefineStoreOptions.
import 'pinia-plugin-persistedstate'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface SettingsStoreState {
  isEnglish: boolean
  openMenu: boolean
  activeNav: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => ({
    isEnglish: (LocalStorage.getItem<boolean>('isEnglish') ?? false),
    openMenu: false,
    activeNav: (LocalStorage.getItem<string>('activeNav') ?? ''),
  }),

  getters: {
    isEnglishGetter: (state): boolean => state.isEnglish,
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    updateActiveNav (value: string): void {
      LocalStorage.set('activeNav', JSON.stringify(value))
      this.activeNav = value
    },
    updateIsEnglish (value: boolean): void {
      LocalStorage.set('isEnglish', value)
      this.isEnglish = value
    },
    updateOpenMenu (value: boolean): void { this.openMenu = value },

    // ---- Vuex actions, names preserved --------------------------------------
    setActiveNavAction (value: string): void { this.updateActiveNav(value) },
    setOpenMenuAction (value: boolean): void { this.updateOpenMenu(value) },
    setIsEnglishAction (value: boolean): void { this.updateIsEnglish(value) },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setActiveNav (v: string): void { return this.setActiveNavAction(v) },
    setOpenMenu (v: boolean): void { return this.setOpenMenuAction(v) },
    setIsEnglish (v: boolean): void { return this.setIsEnglishAction(v) },
  },

  persist: {
    paths: ['isEnglish'],
  },
})
