import type { StatsPayload } from '../utils/siteStats'

/**
 * GET /api/stats
 * 公開流量統計，供 /stats 頁面顯示
 *
 * 回傳內容全是聚合數字，不含任何可指認個人的欄位
 * （無 IP、無城市、無 ASN、referrer 只有 hostname）。
 *
 * 這支只讀快取、不負責更新：重算交給 cron（server/plugins/scheduled.ts）。
 * 這樣任何時間點進來的訪客都拿到同一份資料，不會有人因為剛好撞上快取過期
 * 而替後面的人把查詢跑完。
 */
export default defineEventHandler(async (event): Promise<StatsPayload> => {
  const kv = useKV(event)

  if (kv) {
    const cached = await readStatsCache(kv)
    if (cached) return cached
  }

  /* ─── 快取還是空的：首次部署、KV 被清空，或 cron 還沒跑完第一輪 ───
   * 同步查一次把快取補起來，之後就都由 cron 維護。
   */
  const config = useRuntimeConfig(event)
  const creds = { accountId: config.cfAccountId, token: config.cfAnalyticsToken }

  try {
    return kv ? await refreshStatsCache(kv, creds) : await queryStats(creds)
  } catch (e) {
    if (e instanceof AnalyticsNotConfiguredError) {
      // 本機開發未設定憑證：回空資料讓頁面能正常開發，不報錯
      return emptyStatsPayload(false)
    }

    console.error('[API /api/stats] Analytics query failed:', e)
    throw createError({ statusCode: 503, statusMessage: 'Stats temporarily unavailable' })
  }
})
