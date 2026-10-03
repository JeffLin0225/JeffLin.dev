import type { H3Event } from 'h3'

/**
 * GET /api/stats
 * 公開流量統計，供 /stats 頁面顯示
 *
 * 回傳內容全是聚合數字，不含任何可指認個人的欄位
 * （無 IP、無城市、無 ASN、referrer 只有 hostname）。
 *
 * 讀取路徑刻意經過 KV 快取：Analytics Engine 的查詢要打 Cloudflare REST API，
 * 公開頁面若每次載入都查，既吃查詢額度也讓頁面多等一個外部請求。
 */

const CACHE_KEY = 'stats:public:v1'
const STALE_KEY = 'stats:public:stale'
const CACHE_TTL_SECONDS = 600
/** 查詢失敗時用的備援資料保留 7 天 */
const STALE_TTL_SECONDS = 7 * 24 * 60 * 60

const RANGE_DAYS = 30

interface StatsPayload {
  updatedAt: string | null
  configured: boolean
  totals: { views30d: number; visitors30d: number; views24h: number }
  byDay: Array<{ day: string; views: number; visitors: number }>
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ host: string; views: number }>
  countries: Array<{ code: string; views: number }>
  devices: Array<{ type: string; views: number }>
}

/** Analytics Engine 會降採樣，計數一律用 SUM(_sample_interval) 加權還原，不可用 COUNT(*) */
const WEIGHTED_VIEWS = 'SUM(_sample_interval) AS views'
const WINDOW_30D = `timestamp > NOW() - INTERVAL '${RANGE_DAYS}' DAY`

const emptyPayload = (configured: boolean): StatsPayload => ({
  updatedAt: null,
  configured,
  totals: { views30d: 0, visitors30d: 0, views24h: 0 },
  byDay: [],
  topPages: [],
  topReferrers: [],
  countries: [],
  devices: [],
})

const toNumber = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

export default defineEventHandler(async (event): Promise<StatsPayload> => {
  const kv = useKV(event)

  /* ─── 1. 快取命中就直接回 ─── */
  if (kv) {
    try {
      const cached = await kv.get<StatsPayload>(CACHE_KEY, 'json')
      if (cached) return cached
    } catch (e) {
      console.warn('[API /api/stats] KV read failed:', e)
    }
  }

  /* ─── 2. 查 Analytics Engine ─── */
  let payload: StatsPayload
  try {
    payload = await queryStats(event)
  } catch (e) {
    if (e instanceof AnalyticsNotConfiguredError) {
      // 本機開發未設定憑證：回空資料讓頁面能正常開發，不報錯
      return emptyPayload(false)
    }

    console.error('[API /api/stats] Analytics query failed:', e)

    // 有過期備援就回備援，別讓頁面壞掉
    if (kv) {
      try {
        const stale = await kv.get<StatsPayload>(STALE_KEY, 'json')
        if (stale) return stale
      } catch { /* 備援也讀不到就往下回 503 */ }
    }

    throw createError({ statusCode: 503, statusMessage: 'Stats temporarily unavailable' })
  }

  /* ─── 3. 回寫快取與備援 ─── */
  if (kv) {
    const json = JSON.stringify(payload)
    try {
      await Promise.all([
        kv.put(CACHE_KEY, json, { expirationTtl: CACHE_TTL_SECONDS }),
        kv.put(STALE_KEY, json, { expirationTtl: STALE_TTL_SECONDS }),
      ])
    } catch (e) {
      console.warn('[API /api/stats] KV write failed:', e)
    }
  }

  return payload
})

/**
 * 六個查詢並行發出
 *
 * 30 天總量不另外查：因為訪客雜湊每日輪替，同一人跨日是不同雜湊，
 * 所以把每日 distinct 相加即等於期間 distinct 總數。
 */
const queryStats = async (event: H3Event): Promise<StatsPayload> => {
  const T = ANALYTICS_DATASET

  const [byDayRows, last24hRows, pageRows, referrerRows, countryRows, deviceRows] = await Promise.all([
    queryAnalyticsSQL<{ day: string; views: unknown; visitors: unknown }>(event, `
      SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day,
             ${WEIGHTED_VIEWS},
             COUNT(DISTINCT blob7) AS visitors
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY day
      ORDER BY day ASC
      FORMAT JSON
    `),
    queryAnalyticsSQL<{ views: unknown }>(event, `
      SELECT ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE timestamp > NOW() - INTERVAL '1' DAY
      FORMAT JSON
    `),
    queryAnalyticsSQL<{ path: string; views: unknown }>(event, `
      SELECT blob1 AS path, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 5
      FORMAT JSON
    `),
    queryAnalyticsSQL<{ host: string; views: unknown }>(event, `
      SELECT blob2 AS host, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D} AND blob2 != 'direct'
      GROUP BY host
      ORDER BY views DESC
      LIMIT 5
      FORMAT JSON
    `),
    queryAnalyticsSQL<{ code: string; views: unknown }>(event, `
      SELECT blob3 AS code, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY code
      ORDER BY views DESC
      LIMIT 8
      FORMAT JSON
    `),
    queryAnalyticsSQL<{ type: string; views: unknown }>(event, `
      SELECT blob4 AS type, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY type
      ORDER BY views DESC
      FORMAT JSON
    `),
  ])

  const byDay = byDayRows.map(r => ({
    day: String(r.day).slice(0, 10),
    views: toNumber(r.views),
    visitors: toNumber(r.visitors),
  }))

  return {
    updatedAt: new Date().toISOString(),
    configured: true,
    totals: {
      views30d: byDay.reduce((sum, d) => sum + d.views, 0),
      visitors30d: byDay.reduce((sum, d) => sum + d.visitors, 0),
      views24h: toNumber(last24hRows[0]?.views),
    },
    byDay,
    topPages: pageRows.map(r => ({ path: String(r.path), views: toNumber(r.views) })),
    topReferrers: referrerRows.map(r => ({ host: String(r.host), views: toNumber(r.views) })),
    countries: countryRows.map(r => ({ code: String(r.code), views: toNumber(r.views) })),
    devices: deviceRows.map(r => ({ type: String(r.type), views: toNumber(r.views) })),
  }
}
