import { defineStore } from 'pinia'

export interface Unit {
  id: string
  name: string
  points: number
  description: string
}

export interface Roster {
  id: string
  name: string
  units: Unit[]
}

export const useArmyStore = defineStore('army', {
  state: () => ({
    rosters: [] as Roster[],
    currentRosterId: null as string | null
  }),
  getters: {
    currentRoster: (state) => state.rosters.find(r => r.id === state.currentRosterId),
    totalPoints: (state) => {
      const roster = state.rosters.find(r => r.id === state.currentRosterId)
      return roster ? roster.units.reduce((sum, unit) => sum + unit.points, 0) : 0
    }
  },
  actions: {
    createRoster(name: string) {
      const id = Date.now().toString()
      this.rosters.push({ id, name, units: [] })
      this.currentRosterId = id
    },
    deleteRoster(id: string) {
      this.rosters = this.rosters.filter(r => r.id !== id)
      if (this.currentRosterId === id) {
        this.currentRosterId = this.rosters.length > 0 ? this.rosters[0].id : null
      }
    },
    addUnit(unit: Omit<Unit, 'id'>) {
      const roster = this.rosters.find(r => r.id === this.currentRosterId)
      if (roster) {
        roster.units.push({
          ...unit,
          id: Date.now().toString()
        })
      }
    },
    removeUnit(unitId: string) {
      const roster = this.rosters.find(r => r.id === this.currentRosterId)
      if (roster) {
        roster.units = roster.units.filter(u => u.id !== unitId)
      }
    }
  },
  persist: true
})
