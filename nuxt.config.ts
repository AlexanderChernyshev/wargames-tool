// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@vite-pwa/nuxt'
  ],

  pwa: {
    manifest: {
      name: 'Wargame Assistance Tool',
      short_name: 'WargameTool',
      description: 'A tool for tracking wargames offline.',
      theme_color: '#121212',
      background_color: '#121212',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})

