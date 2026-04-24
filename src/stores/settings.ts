// Pinia equivalent of the legacy Vuex `settings` module. Action names match
// 1:1 with the Vuex version for mechanical migration.
//
// Persistence:
//   - `currency` and `isEnglish` persist via the Pinia persist plugin.
//   - `isEnglish` also writes directly to Quasar `LocalStorage` in its action
//     to match the Vuex behavior (legacy code still reads the raw key).
//   - `activeNav` keeps the direct LocalStorage write pattern (legacy code
//     reads the raw key on boot).
//   - `openMenu` is UI-transient and not persisted.

import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

import type { CurrencyCode } from 'src/types/settings/types'

// Load the pinia-plugin-persistedstate module augmentation so `persist: { paths: [...] }`
// is accepted as a valid option on DefineStoreOptions.
import 'pinia-plugin-persistedstate'

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------
interface SettingsStoreState {
  isEnglish: boolean
  currency: CurrencyCode
  openMenu: boolean
  activeNav: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => ({
    isEnglish: (LocalStorage.getItem<boolean>('isEnglish') ?? false),
    currency: 'SDG',
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
    updateCurrency (value: CurrencyCode): void { this.currency = value },

    // ---- Vuex actions, names preserved --------------------------------------
    setActiveNavAction (value: string): void { this.updateActiveNav(value) },
    setCurrencyAction (value: CurrencyCode): void { this.updateCurrency(value) },
    setOpenMenuAction (value: boolean): void { this.updateOpenMenu(value) },
    setIsEnglishAction (value: boolean): void { this.updateIsEnglish(value) },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setActiveNav (v: string): void { return this.setActiveNavAction(v) },
    setCurrency (v: CurrencyCode): void { return this.setCurrencyAction(v) },
    setOpenMenu (v: boolean): void { return this.setOpenMenuAction(v) },
    setIsEnglish (v: boolean): void { return this.setIsEnglishAction(v) },
  },

  persist: {
    paths: ['currency', 'isEnglish'],
  },
})
