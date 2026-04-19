<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRulesStore } from '~/stores/rules'

const store = useRulesStore()
const searchQuery = ref('')
const isAdding = ref(false)
const newRuleTitle = ref('')
const newRuleContent = ref('')

const filteredRules = computed(() => {
  if (!searchQuery.value) return store.rules
  const query = searchQuery.value.toLowerCase()
  return store.rules.filter(r => 
    r.title.toLowerCase().includes(query) || 
    r.content.toLowerCase().includes(query)
  )
})

const handleAddRule = () => {
  if (newRuleTitle.value && newRuleContent.value) {
    store.addRule(newRuleTitle.value, newRuleContent.value)
    newRuleTitle.value = ''
    newRuleContent.value = ''
    isAdding.value = false
  }
}
</script>

<template>
  <div>
    <div class="header">
      <h1>Rules Reference</h1>
      <button @click="isAdding = !isAdding">
        {{ isAdding ? 'Cancel' : 'Add Rule' }}
      </button>
    </div>

    <!-- Add Rule Form -->
    <div v-if="isAdding" class="card">
      <h3>New Rule</h3>
      <div class="form-group">
        <label>Rule Title</label>
        <input v-model="newRuleTitle" placeholder="e.g. Poisoned Weapon" />
      </div>
      <div class="form-group">
        <label>Description / Rules Text</label>
        <textarea v-model="newRuleContent" placeholder="Enter rule details..."></textarea>
      </div>
      <button @click="handleAddRule" class="save-btn">Save Rule</button>
    </div>

    <!-- Search -->
    <div class="search-box">
      <input v-model="searchQuery" placeholder="Search rules..." class="search-input" />
    </div>

    <!-- Rules List -->
    <div class="rules-list">
      <div v-if="filteredRules.length === 0" class="card empty-state">
        <p>No rules found.</p>
      </div>
      
      <div v-for="rule in filteredRules" :key="rule.id" class="card rule-card">
        <div class="rule-header">
          <h3>{{ rule.title }}</h3>
          <button @click="store.removeRule(rule.id)" class="delete-btn">Delete</button>
        </div>
        <p class="rule-content">{{ rule.content }}</p>
      </div>
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

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  margin-bottom: 0;
}

.save-btn {
  width: 100%;
}

.rule-card {
  position: relative;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.delete-btn {
  background-color: transparent;
  color: var(--error-color);
  padding: 0;
  font-size: 0.8rem;
}

.rule-content {
  white-space: pre-wrap;
  font-size: 0.9rem;
  color: var(--text-color);
}

.empty-state {
  text-align: center;
  color: var(--text-color);
  opacity: 0.6;
}

textarea {
  min-height: 100px;
  resize: vertical;
}
</style>
