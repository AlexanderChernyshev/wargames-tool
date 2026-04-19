<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

// This will set the data-theme attribute on the html tag reactively
useHead({
  htmlAttrs: {
    'data-theme': computed(() => uiStore.theme)
  }
})
</script>

<template>
  <div>
    <nav class="top-nav">
      <div class="nav-container">
        <div class="nav-links">
          <NuxtLink to="/" class="nav-item">Home</NuxtLink>
          <NuxtLink to="/builder" class="nav-item">Builder</NuxtLink>
          <NuxtLink to="/tracker" class="nav-item">Tracker</NuxtLink>
          <NuxtLink to="/rules" class="nav-item">Rules</NuxtLink>
        </div>
        <div class="theme-switch-wrapper">
          <span class="moon-icon">🌙</span>
          <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" :checked="uiStore.theme === 'light'" @change="uiStore.toggleTheme" />
            <div class="slider round"></div>
          </label>
        </div>
      </div>
    </nav>
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.top-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  z-index: 1000;
}

.nav-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.router-link-active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 4px;
}

.theme-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.moon-icon {
  font-size: 1.1rem;
  transition: filter 0.3s ease;
}

[data-theme="dark"] .moon-icon {
  filter: brightness(0) invert(1);
}

[data-theme="light"] .moon-icon {
  filter: brightness(0);
}

.theme-switch {
  display: inline-block;
  height: 24px;
  position: relative;
  width: 44px;
}

.theme-switch input {
  display:none;
}

.slider {
  background-color: #444;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.slider:before {
  background-color: #fff;
  bottom: 3px;
  content: "";
  height: 18px;
  left: 3px;
  position: absolute;
  transition: .4s;
  width: 18px;
  z-index: 2;
}

input:checked + .slider {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

input:checked + .slider:before {
  transform: translateX(20px);
  background-color: #000;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>