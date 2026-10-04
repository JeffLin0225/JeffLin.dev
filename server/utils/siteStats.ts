/**
 * 公開流量統計的查詢與快取
 *
 * 寫入者是 cron（server/plugins/scheduled.ts），讀取路徑只讀快取。
 *
 * 快取刻意不設過期時間：KV 裡永遠有一份可回的資料，cron 成功時覆蓋它、
 * 失敗時原封不動留著上一份。所以「資料多新」由 payload 裡的 updatedAt 表達，
 * 而不是由「快取存在或不存在」表達 —— 訪客看到什麼不該取決於他剛好幾點來。
 */

import { ANALYTICS_DATASET } from './analytics'
import { queryAnalyticsSQL, type AnalyticsCreds } from './useAnalyticsSQL'

export const STATS_CACHE_KEY = 'stats:public:v1'

const RANGE_DAYS = 30

export interface StatsPayload {
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

export const emptyStatsPayload = (configured: boolean): StatsPayload => ({
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

export const readStatsCache = async (kv: KVNamespace): Promise<StatsPayload | null> => {
  try {
    return await kv.get<StatsPayload>(STATS_CACHE_KEY, 'json')
  } catch (e) {
    console.warn('[siteStats] KV read failed:', e)
    return null
  }
}

export const writeStatsCache = async (kv: KVNamespace, payload: StatsPayload) => {
  try {
    await kv.put(STATS_CACHE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('[siteStats] KV write failed:', e)
  }
}

/**
 * 六個查詢並行發出
 *
 * 30 天總量不另外查：因為訪客雜湊每日輪替，同一人跨日是不同雜湊，
 * 所以把每日 distinct 相加即等於期間 distinct 總數。
 */
export const queryStats = async (creds: AnalyticsCreds): Promise<StatsPayload> => {
  const T = ANALYTICS_DATASET

  const [byDayRows, last24hRows, pageRows, referrerRows, countryRows, deviceRows] = await Promise.all([
    queryAnalyticsSQL<{ day: string; views: unknown; visitors: unknown }>(`
      SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day,
             ${WEIGHTED_VIEWS},
             COUNT(DISTINCT blob7) AS visitors
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY day
      ORDER BY day ASC
      FORMAT JSON
    `, creds),
    queryAnalyticsSQL<{ views: unknown }>(`
      SELECT ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE timestamp > NOW() - INTERVAL '1' DAY
      FORMAT JSON
    `, creds),
    queryAnalyticsSQL<{ path: string; views: unknown }>(`
      SELECT blob1 AS path, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 5
      FORMAT JSON
    `, creds),
    queryAnalyticsSQL<{ host: string; views: unknown }>(`
      SELECT blob2 AS host, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D} AND blob2 != 'direct'
      GROUP BY host
      ORDER BY views DESC
      LIMIT 5
      FORMAT JSON
    `, creds),
    queryAnalyticsSQL<{ code: string; views: unknown }>(`
      SELECT blob3 AS code, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY code
      ORDER BY views DESC
      LIMIT 8
      FORMAT JSON
    `, creds),
    queryAnalyticsSQL<{ type: string; views: unknown }>(`
      SELECT blob4 AS type, ${WEIGHTED_VIEWS}
      FROM ${T}
      WHERE ${WINDOW_30D}
      GROUP BY type
      ORDER BY views DESC
      FORMAT JSON
    `, creds),
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

/** cron 與冷啟動共用：查一次並寫回快取 */
export const refreshStatsCache = async (kv: KVNamespace, creds: AnalyticsCreds): Promise<StatsPayload> => {
  const payload = await queryStats(creds)
  await writeStatsCache(kv, payload)
  return payload
}
