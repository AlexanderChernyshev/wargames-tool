<script setup lang="ts">
import { ref } from 'vue'
import { useArmyStore } from '~/stores/army'

const store = useArmyStore()
const isCreatingRoster = ref(false)
const newRosterName = ref('')

const isAddingUnit = ref(false)
const newUnit = ref({
  name: '',
  points: 0,
  description: ''
})

const handleCreateRoster = () => {
  if (newRosterName.value) {
    store.createRoster(newRosterName.value)
    newRosterName.value = ''
    isCreatingRoster.value = false
  }
}

const handleAddUnit = () => {
  if (newUnit.value.name) {
    store.addUnit({ ...newUnit.value })
    newUnit.value = { name: '', points: 0, description: '' }
    isAddingUnit.value = false
  }
}
</script>

<template>
  <div>
    <div class="header">
      <h1>Army Builder</h1>
      <button v-if="!store.currentRosterId" @click="isCreatingRoster = true">New Roster</button>
    </div>

    <!-- Roster Selection -->
    <div v-if="store.rosters.length > 0" class="roster-selector">
      <select v-model="store.currentRosterId">
        <option v-for="r in store.rosters" :key="r.id" :value="r.id">
          {{ r.name }}
        </option>
      </select>
      <button @click="store.deleteRoster(store.currentRosterId!)" class="delete-btn">Delete Roster</button>
      <button @click="isCreatingRoster = true" class="small-btn">New</button>
    </div>

    <!-- Create Roster Form -->
    <div v-if="isCreatingRoster" class="card">
      <h3>New Roster</h3>
      <input v-model="newRosterName" placeholder="Roster Name (e.g. Space Marines)" />
      <div class="actions">
        <button @click="handleCreateRoster">Create</button>
        <button @click="isCreatingRoster = false" class="cancel-btn">Cancel</button>
      </div>
    </div>

    <div v-if="store.currentRoster" class="roster-view">
      <div class="roster-header">
        <h2>{{ store.currentRoster.name }}</h2>
        <div class="total-points">Total: {{ store.totalPoints }} pts</div>
      </div>

      <button @click="isAddingUnit = !isAddingUnit" class="add-unit-toggle">
        {{ isAddingUnit ? 'Cancel' : 'Add Unit' }}
      </button>

      <!-- Add Unit Form -->
      <div v-if="isAddingUnit" class="card add-unit-card">
        <h3>Add Unit</h3>
        <div class="form-group">
          <label>Unit Name</label>
          <input v-model="newUnit.name" placeholder="e.g. Tactical Squad" />
        </div>
        <div class="form-group">
          <label>Points</label>
          <input v-model.number="newUnit.points" type="number" placeholder="0" />
        </div>
        <div class="form-group">
          <label>Notes / Wargear</label>
          <textarea v-model="newUnit.description" placeholder="Notes, equipment, special rules..."></textarea>
        </div>
        <button @click="handleAddUnit">Add to Roster</button>
      </div>

      <!-- Units List -->
      <div class="units-list">
        <div v-for="unit in store.currentRoster.units" :key="unit.id" class="card unit-card">
          <div class="unit-header">
            <span class="unit-name">{{ unit.name }}</span>
            <span class="unit-points">{{ unit.points }} pts</span>
            <button @click="store.removeUnit(unit.id)" class="remove-btn">&times;</button>
          </div>
          <p v-if="unit.description" class="unit-desc">{{ unit.description }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="!isCreatingRoster" class="empty-state">
      <p>No rosters yet. Create one to get started!</p>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.roster-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.roster-selector select {
  margin-bottom: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.cancel-btn {
  background-color: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.delete-btn {
  background-color: var(--error-color);
  font-size: 0.8rem;
  white-space: nowrap;
}

.small-btn {
  font-size: 0.8rem;
}

.roster-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.total-points {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--secondary-color);
}

.add-unit-toggle {
  width: 100%;
  margin-bottom: 1rem;
}

.unit-card {
  padding: 0.75rem;
}

.unit-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.unit-name {
  font-weight: bold;
  flex-grow: 1;
}

.unit-points {
  color: var(--secondary-color);
  font-weight: bold;
}

.remove-btn {
  background: transparent;
  color: var(--error-color);
  font-size: 1.5rem;
  padding: 0;
  line-height: 1;
}

.unit-desc {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
}

.empty-state {
  text-align: center;
  margin-top: 4rem;
  opacity: 0.6;
}
</style>
