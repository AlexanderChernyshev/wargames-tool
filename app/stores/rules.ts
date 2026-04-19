import { defineStore } from 'pinia'

export interface Rule {
  id: string
  title: string
  content: string
}

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [] as Rule[]
  }),
  actions: {
    addRule(title: string, content: string) {
      this.rules.push({
        id: Date.now().toString(),
        title,
        content
      })
    },
    removeRule(id: string) {
      this.rules = this.rules.filter(r => r.id !== id)
    },
    updateRule(id: string, title: string, content: string) {
      const rule = this.rules.find(r => r.id === id)
      if (rule) {
        rule.title = title
        rule.content = content
      }
    }
  },
  persist: true
})
