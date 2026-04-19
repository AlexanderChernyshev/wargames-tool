<template>
  <div class="home">
    <h1>Wargame Assistance Tool</h1>
    <div class="card">
      <p>Welcome to your generic wargaming companion. Use the navigation below to manage your army, track scores, check rules, or roll dice.</p>
    </div>
    <div class="grid">
      <NuxtLink to="/builder" class="card action-card">
        <h3>Army Builder</h3>
        <p>Create and manage rosters</p>
      </NuxtLink>
      <NuxtLink to="/tracker" class="card action-card">
        <h3>Game Tracker</h3>
        <p>Track points and roll dice</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.action-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}
</style>
