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
      // devtools 的兩個套件：dev 時先預打包，免得第一次開頁面被 Vite 觸發整頁重載
      include: ['fuse.js', '@vue/devtools-core', '@vue/devtools-kit'],
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
        // 加到手機主畫面時顯示的名稱（JXlin 系列命名）
        { name: 'apple-mobile-web-app-title', content: 'JXlin.dev' },
      ],
      link: [
        // ─── Favicon（JX_ 靜態版；游標閃爍只做在導覽列的 AppLogoMark）───
        // favicon2.svg 是舊的銀色 J，保留檔案但不再引用
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
