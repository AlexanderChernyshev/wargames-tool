import { defineStore } from 'pinia'
import { useArmyStore } from './army'
import { useRulesStore } from './rules'
import { useTrackerStore } from './tracker'

export const useDataStore = defineStore('data', {
  actions: {
    exportData() {
      const armyStore = useArmyStore()
      const rulesStore = useRulesStore()
      const trackerStore = useTrackerStore()

      const data = {
        army: {
          rosters: armyStore.rosters,
          currentRosterId: armyStore.currentRosterId
        },
        rules: {
          rules: rulesStore.rules
        },
        tracker: {
          turn: trackerStore.turn,
          players: trackerStore.players
        },
        exportDate: new Date().toISOString(),
        version: '1.0'
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wargame-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    },

    async importData(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            
            // Basic validation
            if (!data.army || !data.rules || !data.tracker) {
              throw new Error('Invalid backup file format')
            }

            const armyStore = useArmyStore()
            const rulesStore = useRulesStore()
            const trackerStore = useTrackerStore()

            // Update stores
            armyStore.$patch({
              rosters: data.army.rosters,
              currentRosterId: data.army.currentRosterId
            })
            
            rulesStore.$patch({
              rules: data.rules.rules
            })
            
            trackerStore.$patch({
              turn: data.tracker.turn,
              players: data.tracker.players
            })

            resolve(true)
          } catch (err) {
            reject(err)
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      })
    }
  }
})
