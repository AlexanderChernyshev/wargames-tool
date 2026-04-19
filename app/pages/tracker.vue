<script setup lang="ts">
import { ref } from 'vue'
import { useTrackerStore } from '~/stores/tracker'
import { useArmyStore } from '~/stores/army'
import { useRulesStore } from '~/stores/rules'

const trackerStore = useTrackerStore()
const armyStore = useArmyStore()
const rulesStore = useRulesStore()

const handleReset = () => {
  if (confirm('Are you sure you want to reset the game state?')) {
    trackerStore.reset()
  }
}

// Sidebar State
const isRefSidebarOpen = ref(false)
const refTab = ref<'roster' | 'rules'>('roster')
const ruleSearch = ref('')

const filteredRules = computed(() => {
  if (!ruleSearch.value) return rulesStore.rules
  const query = ruleSearch.value.toLowerCase()
  return rulesStore.rules.filter(r => 
    r.title.toLowerCase().includes(query) || 
    r.content.toLowerCase().includes(query)
  )
})

// Dice Logic
const diceTypes = [4, 6, 8, 10, 12, 20, 100]
const diceCount = ref(1)
const results = ref<{ type: number; values: number[]; timestamp: number }[]>([])

const rollDice = (type: number) => {
  const count = Math.max(1, Math.min(100, diceCount.value))
  const values = []
  for (let i = 0; i < count; i++) {
    values.push(Math.floor(Math.random() * type) + 1)
  }
  
  results.value.unshift({
    type,
    values,
    timestamp: Date.now()
  })
  
  if (results.value.length > 20) {
    results.value.pop()
  }
}

const clearHistory = () => {
  results.value = []
}
</script>

<template>
  <div class="tracker-page">
    <!-- Floating Quick Reference Drawer -->
    <div class="ref-drawer" :class="{ open: isRefSidebarOpen }">
      <button @click="isRefSidebarOpen = !isRefSidebarOpen" class="drawer-toggle">
        <span class="toggle-text">{{ isRefSidebarOpen ? 'CLOSE' : 'REF' }}</span>
      </button>
      
      <div class="drawer-content card">
        <div class="sidebar-tabs">
          <button 
            :class="{ active: refTab === 'roster' }" 
            @click="refTab = 'roster'"
          >Roster</button>
          <button 
            :class="{ active: refTab === 'rules' }" 
            @click="refTab = 'rules'"
          >Rules</button>
        </div>

        <div class="sidebar-content">
          <!-- Roster View -->
          <div v-if="refTab === 'roster'" class="roster-ref">
            <div v-if="armyStore.currentRoster" class="roster-data">
              <div class="roster-info">
                <h3>{{ armyStore.currentRoster.name }}</h3>
                <span class="pts">{{ armyStore.totalPoints }} pts</span>
              </div>
              <div class="ref-units-list">
                <div v-for="unit in armyStore.currentRoster.units" :key="unit.id" class="ref-unit-item">
                  <div class="ref-unit-header">
                    <strong>{{ unit.name }}</strong>
                    <span>{{ unit.points }}</span>
                  </div>
                  <p v-if="unit.description" class="ref-unit-desc">{{ unit.description }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-ref">
              <p>No roster selected in Builder.</p>
            </div>
          </div>

          <!-- Rules View -->
          <div v-if="refTab === 'rules'" class="rules-ref">
            <input v-model="ruleSearch" placeholder="Search rules..." class="ref-search" />
            <div class="ref-rules-list">
              <div v-for="rule in filteredRules" :key="rule.id" class="ref-rule-item">
                <strong>{{ rule.title }}</strong>
                <p>{{ rule.content }}</p>
              </div>
              <p v-if="filteredRules.length === 0" class="empty-ref">No rules found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="header">
      <h1>Game Tracker</h1>
      <button @click="handleReset" class="reset-btn">Reset Scores</button>
    </div>

    <div class="tracker-layout">
      <div class="main-tracker">
        <!-- Turn Counter -->
        <div class="card turn-card">
          <div class="label">TURN</div>
          <div class="counter-row">
            <button @click="trackerStore.decrementTurn">-</button>
            <div class="count">{{ trackerStore.turn }}</div>
            <button @click="trackerStore.incrementTurn">+</button>
          </div>
        </div>

        <!-- Players Grid -->
        <div class="players-grid">
          <div v-for="player in trackerStore.players" :key="player.id" class="card player-card">
            <div class="player-header">
              <input v-model="player.name" class="player-name-input" />
              <button 
                v-if="trackerStore.players.length > 1" 
                @click="trackerStore.removePlayer(player.id)" 
                class="remove-player-btn"
                title="Remove Player"
              >&times;</button>
            </div>
            
            <div class="stat-section">
              <div class="label">VP</div>
              <div class="counter-row small">
                <button @click="trackerStore.updateVP(player.id, -1)">-</button>
                <div class="count">{{ player.vp }}</div>
                <button @click="trackerStore.updateVP(player.id, 1)">+</button>
              </div>
            </div>

            <div class="stat-section">
              <div class="label">CP</div>
              <div class="counter-row small">
                <button @click="trackerStore.updateCP(player.id, -1)">-</button>
                <div class="count">{{ player.cp }}</div>
                <button @click="trackerStore.updateCP(player.id, 1)">+</button>
              </div>
            </div>
          </div>

          <!-- Add Player Card -->
          <button @click="trackerStore.addPlayer" class="card add-player-card">
            <span class="plus-icon">+</span>
            <span>Add Player</span>
          </button>
        </div>
      </div>

      <div class="dice-sidebar">
        <div class="card dice-card">
          <div class="label">DICE ROLLER</div>
          <div class="dice-count-control">
            <span># of dice to roll:</span>
            <input v-model.number="diceCount" type="number" min="1" max="100" class="count-input" />
          </div>
          <div class="dice-grid">
            <button v-for="d in diceTypes" :key="d" @click="rollDice(d)" class="dice-btn">D{{ d }}</button>
          </div>
        </div>

        <div v-if="results.length > 0" class="history-section card">
          <div class="history-header">
            <div class="label">HISTORY</div>
            <button @click="clearHistory" class="clear-btn">Clear</button>
          </div>
          <div class="results-list">
            <div v-for="res in results" :key="res.timestamp" class="result-group">
              <div class="result-info">
                <span class="dice-type">{{ res.values.length }}x D{{ res.type }}</span>
                <span class="total-sum" v-if="res.values.length > 1">Sum: {{ res.values.reduce((a, b) => a + b, 0) }}</span>
              </div>
              <div class="dice-values">
                <span v-for="(val, idx) in res.values" :key="idx" class="dice-value-small">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracker-page {
  max-width: 1200px; /* Increased to fit 3 columns better */
  margin: 0 auto;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reset-btn {
  background-color: var(--error-color);
  font-size: 0.8rem;
}

/* Floating Drawer Styles */
.ref-drawer {
  position: fixed;
  left: -320px;
  top: 80px;
  bottom: 20px;
  width: 320px;
  z-index: 1100;
  transition: left 0.3s ease;
  display: flex;
}

.ref-drawer.open {
  left: 0;
}

.drawer-toggle {
  position: absolute;
  right: -40px;
  top: 20px;
  width: 40px;
  height: 100px;
  background-color: var(--secondary-color);
  color: #000;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
}

.toggle-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.7rem;
  letter-spacing: 2px;
}

.drawer-content {
  width: 100%;
  height: 100%;
  padding: 0;
  margin-bottom: 0;
  background-color: var(--surface-color);
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 15px rgba(0,0,0,0.5);
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-tabs button {
  flex: 1;
  background: transparent;
  color: var(--text-color);
  border-radius: 0;
  padding: 0.75rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.sidebar-tabs button.active {
  opacity: 1;
  color: var(--secondary-color);
  border-bottom: 2px solid var(--secondary-color);
}

.sidebar-content {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.roster-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.roster-info h3 {
  font-size: 1rem;
  margin-bottom: 0;
}

.pts {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.ref-units-list, .ref-rules-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ref-unit-item, .ref-rule-item {
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.ref-unit-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.ref-unit-desc, .ref-rule-item p {
  opacity: 0.8;
  font-size: 0.8rem;
  white-space: pre-wrap;
}

.ref-search {
  font-size: 0.8rem;
  padding: 0.4rem;
  margin-bottom: 0.75rem;
}

.empty-ref {
  text-align: center;
  opacity: 0.5;
  font-size: 0.85rem;
  padding: 1rem 0;
}

/* Tracker Layout */
.tracker-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
}

.turn-card {
  text-align: center;
  margin-bottom: 1.5rem;
}

.label {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.counter-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.counter-row.small {
  gap: 1rem;
}

.count {
  font-size: 2.5rem;
  font-weight: bold;
}

.small .count {
  font-size: 1.8rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.player-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.player-name-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0;
  color: var(--primary-color);
  width: 80%;
}

.remove-player-btn {
  position: absolute;
  right: -5px;
  top: -5px;
  background: transparent;
  color: var(--error-color);
  border: none;
  font-size: 1.2rem;
  padding: 0;
  cursor: pointer;
  line-height: 1;
}

.stat-section {
  margin-bottom: 1.5rem;
}

.add-player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px dashed var(--border-color);
  background: transparent;
  color: var(--text-color);
  opacity: 0.6;
  transition: all 0.2s;
  cursor: pointer;
}

.add-player-card:hover {
  opacity: 1;
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.plus-icon {
  font-size: 2rem;
  line-height: 1;
}

/* Dice Styles */
.dice-card {
  margin-bottom: 1rem;
}

.dice-count-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

.count-input {
  width: 50px;
  margin-bottom: 0;
  padding: 0.2rem;
  text-align: center;
  font-size: 0.8rem;
}

.dice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dice-btn {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.clear-btn {
  background-color: transparent;
  color: var(--error-color);
  font-size: 0.7rem;
  padding: 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.result-group {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.result-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.dice-type {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--primary-color);
}

.total-sum {
  font-size: 0.75rem;
  opacity: 0.8;
}

.dice-values {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dice-value-small {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--primary-color);
  min-width: 24px;
  text-align: center;
}

@media (max-width: 1100px) {
  .players-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .tracker-layout {
    grid-template-columns: 1fr;
  }
  
  .dice-sidebar {
    order: 3;
  }
  
  .main-tracker {
    order: 2;
  }

  .dice-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
}

@media (max-width: 600px) {
  .players-grid {
    grid-template-columns: 1fr;
  }
}
</style>