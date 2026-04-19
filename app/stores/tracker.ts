import { defineStore } from 'pinia'

export interface Player {
  id: string
  name: string
  vp: number
  cp: number
}

export const useTrackerStore = defineStore('tracker', {
  state: () => ({
    turn: 1,
    players: [
      { id: '1', name: 'Player 1', vp: 0, cp: 0 },
      { id: '2', name: 'Player 2', vp: 0, cp: 0 }
    ] as Player[]
  }),
  actions: {
    incrementTurn() {
      if (this.turn < 10) this.turn++
    },
    decrementTurn() {
      if (this.turn > 1) this.turn--
    },
    addPlayer() {
      const id = Date.now().toString()
      this.players.push({
        id,
        name: `Player ${this.players.length + 1}`,
        vp: 0,
        cp: 0
      })
    },
    removePlayer(id: string) {
      if (this.players.length > 1) {
        this.players = this.players.filter(p => p.id !== id)
      }
    },
    updateVP(playerId: string, amount: number) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.vp = Math.max(0, player.vp + amount)
      }
    },
    updateCP(playerId: string, amount: number) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.cp = Math.max(0, player.cp + amount)
      }
    },
    reset() {
      this.turn = 1
      this.players.forEach(p => {
        p.vp = 0
        p.cp = 0
      })
    }
  },
  persist: true
})
