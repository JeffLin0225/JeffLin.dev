/**
 * Nitro Middleware — API 存取保護
 *
 * 所有 /api/ 路由都必須帶上正確的 X-Internal-Token header
 * Token 從 Cloudflare Pages 環境變數 INTERNAL_API_TOKEN 讀取
 *
 * 排除：OPTIONS preflight（CORS 協商）
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // 只保護 /api/ 底下的路由
  if (!url.pathname.startsWith('/api/')) return

  // 放行 OPTIONS preflight（CORS 協商需要）
  if (event.method === 'OPTIONS') return

  const config = useRuntimeConfig(event)
  const expectedToken = config.internalApiToken

  // 若未設定 token（本機開發時允許跳過），直接放行
  if (!expectedToken) {
    console.warn('[auth middleware] INTERNAL_API_TOKEN 未設定，跳過驗證（僅限開發環境）')
    return
  }

  const providedToken = getHeader(event, 'x-internal-token')

  if (!providedToken || providedToken !== expectedToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
