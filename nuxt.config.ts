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
    // 首頁不 prerender：靜態頁會把 build 當下的 runtimeConfig.public 烤死，
    // 跟正式環境實際的環境變數脫鉤（曾因此讓 /stats 的 token 在 SPA 導航時失效）
    // SWR 僅在正式環境啟用（dev 模式會導致 payload 快取衝突）
    ...(process.env.NODE_ENV === 'production' && {
      '/github/**': { swr: 3600 },
    }),
    '/api/**': {
      cors: {
        origin: ['https://jxlin.dev'],
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
    // ─── 流量統計（server-only，絕對不可移到 public）───
    // 訪客雜湊用的 salt，對應 NUXT_VISITOR_SALT
    // 外洩可暴力反推出原始 IP（IPv4 空間小）
    visitorSalt: '',
    // Analytics Engine SQL API 查詢用，對應 NUXT_CF_ACCOUNT_ID / NUXT_CF_ANALYTICS_TOKEN
    cfAccountId: '',
    cfAnalyticsToken: '',
    public: {
      appName: 'JXlin.dev',
      craditCardUrl: 'https://card.jxlin.dev/',
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
      title: 'Jia-Xian Lin (林家賢) — Full-Stack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Jia-Xian Lin (林家賢 / Jeff) — Full-Stack Developer. Building digital experiences with modern web technologies.' },
        { name: 'theme-color', content: 'hsl(0, 0%, 4%)' },
      ],
      link: [
        // ─── Favicon ───
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon2.svg' },
        { rel: 'shortcut icon', href: '/favicon2.svg' },
        // ─── Fonts ───
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
