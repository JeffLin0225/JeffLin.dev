// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  /* ─── Modules ─── */
  modules: ['@nuxtjs/tailwindcss', 'nitro-cloudflare-dev'],

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
    '/api/**': {
      cors: {
        origin: ['https://jefflin-dev.pages.dev'],
        methods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'x-internal-token'],
      },
    },
  },

  /* ─── Runtime Config ─── */
  runtimeConfig: {
    githubToken: '',
    // 前後端共用的內部 API Token，對應 Cloudflare 環境變數 INTERNAL_API_TOKEN
    internalApiToken: '',
    public: {
      appName: 'JeffLin.dev',
      craditCardUrl: 'https://card-6h9.pages.dev/',
      // 前端讀取同一個 token 用於呼叫後端 API
      internalApiToken: '',
    },
  },

  /* ─── Vite Optimize ─── */
  vite: {
    optimizeDeps: {
      include: ['fuse.js'],
    },
  },

  /* ─── Nitro (Cloudflare Pages) ─── */
  nitro: {
    preset: 'cloudflare_pages',
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
