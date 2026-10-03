/**
 * POST /api/track
 * 記錄一次頁面瀏覽
 *
 * 一律回 204，前端不需要知道結果 —— 統計失敗絕不能影響使用者瀏覽。
 *
 * 隱私設計：原始 IP 只用於計算每日輪替的訪客雜湊，計算完即離開作用域，
 * 寫入 Analytics Engine 的欄位中不含 IP、城市、ASN 或完整 referrer URL。
 * 欄位對照表見 docs/analytics-spec.md 第 3 節。
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; referrer?: string }>(event).catch(() => null)

  /* ─── 驗證：路徑由前端提供，必須檢查 ─── */
  const path = normalizePath(body?.path)
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  const ua = getHeader(event, 'user-agent') ?? ''

  /* ─── 爬蟲不計入 ─── */
  if (isBot(ua)) return sendNoContent(event, 204)

  /* ─── 本機開發無 binding，直接放過不報錯 ─── */
  const dataset = event.context.cloudflare?.env?.ANALYTICS
  if (!dataset) return sendNoContent(event, 204)

  const config = useRuntimeConfig(event)
  const cfRequest = event.context.cloudflare?.request

  /* ─── 以下欄位一律由伺服器端推導，不接受前端傳入 ─── */
  const ip = getHeader(event, 'cf-connecting-ip') ?? ''
  const country = (cfRequest?.cf?.country as string | undefined) ?? 'XX'
  const visitor = await hashVisitor(ip, ua, config.visitorSalt, taipeiDay())
  const { device, browser, os } = parseUserAgent(ua)
  const referrer = refererHost(body?.referrer, getRequestHost(event))

  /* ─── 寫入（writeDataPoint 本身即非阻塞，回傳 void，不需 waitUntil）─── */
  dataset.writeDataPoint({
    blobs: [path, referrer, country, device, browser, os, visitor],
    doubles: [1],
    indexes: [truncateToBytes(path)],
  })

  return sendNoContent(event, 204)
})
