import { defineStore } from 'pinia'

export const useTrackerStore = defineStore('tracker', {
  state: () => ({
    turn: 1,
    player1: {
      name: 'Player 1',
      vp: 0,
      cp: 0
    },
    player2: {
      name: 'Player 2',
      vp: 0,
      cp: 0
    }
  }),
  actions: {
    incrementTurn() {
      if (this.turn < 10) this.turn++
    },
    decrementTurn() {
      if (this.turn > 1) this.turn--
    },
    updateVP(player: 1 | 2, amount: number) {
      if (player === 1) {
        this.player1.vp = Math.max(0, this.player1.vp + amount)
      } else {
        this.player2.vp = Math.max(0, this.player2.vp + amount)
      }
    },
    updateCP(player: 1 | 2, amount: number) {
      if (player === 1) {
        this.player1.cp = Math.max(0, this.player1.cp + amount)
      } else {
        this.player2.cp = Math.max(0, this.player2.cp + amount)
      }
    },
    reset() {
      this.turn = 1
      this.player1.vp = 0
      this.player1.cp = 0
      this.player2.vp = 0
      this.player2.cp = 0
    }
  },
  persist: true
})
