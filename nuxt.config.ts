// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  /* ─── Modules ─── */
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', 'nitro-cloudflare-dev'],

  /* ─── Fonts（自託管，build 時下載進 _fonts/，不再向 Google 發 render-blocking 請求）─── */
  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  },

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
    // 舊網址拼錯（craditCard），保留 301 讓外部連結與搜尋引擎轉過去
    '/craditCard': { redirect: { to: '/credit-card', statusCode: 301 } },
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
    // ─── 流量統計（server-only，絕對不可移到 public）───
    // 訪客雜湊用的 salt，對應 NUXT_VISITOR_SALT
    // 外洩可暴力反推出原始 IP（IPv4 空間小）
    visitorSalt: '',
    // Analytics Engine SQL API 查詢用，對應 NUXT_CF_ACCOUNT_ID / NUXT_CF_ANALYTICS_TOKEN
    cfAccountId: '',
    cfAnalyticsToken: '',
    // 手動同步 /api/cron/sync-repos 用，對應 NUXT_CRON_SECRET（server-only）
    // 不能沿用 public.internalApiToken：那個值會進 SSR payload，任何人都看得到
    cronSecret: '',
    public: {
      appName: 'JXlin.dev',
      creditCardUrl: 'https://card.jxlin.dev/',
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

  /* ─── Nitro (Cloudflare Workers) ─── */
  // Workers 而非 Pages：Pages 不支援 cron trigger，流量統計需要定時重算。
  //
  // 刻意不設 cloudflare.deployConfig —— 一旦開啟，dashboard 上的設定
  // 「包含環境變數」會被停用並丟棄（Nitro 官方說明），而本站所有 token
  // 都放在 dashboard 上。
  nitro: {
    preset: 'cloudflare_module',
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
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
