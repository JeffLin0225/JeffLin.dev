// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  /* ─── Modules ─── */
  modules: ['@nuxtjs/tailwindcss'],

  /* ─── Global CSS ─── */
  css: ['~/assets/css/main.css'],

  /* ─── Auto Imports ─── */
  imports: {
    dirs: ['composables/**'],
  },

  /* ─── Route Rules ─── */
  routeRules: {
    '/': { prerender: true },
    // SWR 僅在正式環境啟用（dev 模式會導致 payload 快取衝突）
    ...(process.env.NODE_ENV === 'production' && {
      '/github/**': { swr: 3600 },
    }),
    '/api/**': { cors: true },
  },

  /* ─── Runtime Config ─── */
  runtimeConfig: {
    githubToken: '',
    public: {
      appName: 'JeffLin.dev',
    },
  },

  /* ─── Vite Optimize ─── */
  vite: {
    optimizeDeps: {
      include: ['fuse.js'],
    },
  },

  /* ─── App Head — Fonts + Meta ─── */
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: 'Jeff Lin — Full-Stack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Jeff Lin — Full-Stack Developer. Building digital experiences with modern web technologies.' },
        { name: 'theme-color', content: 'hsl(0, 0%, 4%)' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
