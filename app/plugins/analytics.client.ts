/**
 * 流量統計 beacon（client-only）
 *
 * 為什麼是前端 beacon 而不是 server middleware：
 * nuxt.config.ts 的 routeRules 把 '/' 設為 prerender，首頁是 CDN 邊緣回應的靜態檔，
 * 不會進入 Nitro server，用 middleware 會漏掉流量最大的那一頁。
 *
 * 為什麼不用 navigator.sendBeacon：
 * 它無法設定自訂 header，會被 server/middleware/auth.ts 擋成 401。
 */

/** 同路徑在此毫秒數內重複觸發則忽略（防 page transition 重複送出）*/
const DEDUPE_WINDOW_MS = 1000

export default defineNuxtPlugin(() => {
  // 本機開發不污染正式資料
  if (import.meta.dev) return

  // 尊重 Do Not Track
  if (navigator.doNotTrack === '1') return

  const config = useRuntimeConfig()
  const router = useRouter()

  let lastPath = ''
  let lastSentAt = 0

  const send = (path: string, referrer?: string) => {
    // 統計頁自己不計入，否則每次去看數字都會把數字推高
    if (path === '/stats') return

    const now = Date.now()
    if (path === lastPath && now - lastSentAt < DEDUPE_WINDOW_MS) return
    lastPath = path
    lastSentAt = now

    $fetch('/api/track', {
      method: 'POST',
      keepalive: true,
      headers: {
        // 與 server/middleware/auth.ts 讀取同一個值
        'x-internal-token': config.public.internalApiToken,
      },
      body: { path, referrer },
    }).catch(() => {
      // 完全靜默：統計失敗不能影響使用者瀏覽
    })
  }

  // 首次載入（router.afterEach 不會為初始路由觸發）
  send(window.location.pathname, document.referrer || undefined)

  // 後續的 client-side 導航
  router.afterEach((to) => {
    send(to.path)
  })
})
