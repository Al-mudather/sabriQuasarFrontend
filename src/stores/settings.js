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

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isEnglish: LocalStorage.getItem('isEnglish') || false,
    currency: 'SDG',
    openMenu: false,
    activeNav: LocalStorage.getItem('activeNav') || ''
  }),

  getters: {
    isEnglishGetter: (state) => state.isEnglish
  },

  actions: {
    // ---- Direct state writers (formerly Vuex mutations) ---------------------
    updateActiveNav (value) {
      LocalStorage.set('activeNav', JSON.stringify(value))
      this.activeNav = value
    },
    updateIsEnglish (value) {
      LocalStorage.set('isEnglish', value)
      this.isEnglish = value
    },
    updateOpenMenu (value) { this.openMenu = value },
    updateCurrency (value) { this.currency = value },

    // ---- Vuex actions, names preserved --------------------------------------
    setActiveNavAction (value) { this.updateActiveNav(value) },
    setCurrencyAction (value) { this.updateCurrency(value) },
    setOpenMenuAction (value) { this.updateOpenMenu(value) },
    setIsEnglishAction (value) { this.updateIsEnglish(value) },

    // ---- Short-name aliases used by C1/C2 migrated call sites --------------
    setActiveNav (v) { return this.setActiveNavAction(v) },
    setCurrency (v) { return this.setCurrencyAction(v) },
    setOpenMenu (v) { return this.setOpenMenuAction(v) },
    setIsEnglish (v) { return this.setIsEnglishAction(v) }
  },

  persist: {
    paths: ['currency', 'isEnglish']
  }
})
