// Pinia shell for the `settings` module. Action bodies map 1:1 from the
// Vuex version (mutations folded into actions).

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
    setActiveNav (value) {
      LocalStorage.set('activeNav', JSON.stringify(value))
      this.activeNav = value
    },
    setCurrency (value) { this.currency = value },
    setOpenMenu (value) { this.openMenu = value },
    setIsEnglish (value) {
      LocalStorage.set('isEnglish', value)
      this.isEnglish = value
    }
  },

  persist: {
    paths: ['currency', 'isEnglish']
  }
})
