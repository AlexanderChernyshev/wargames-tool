import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    theme: 'dark' as 'light' | 'dark'
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    }
  },
  persist: true
})
