import type { H3Event } from 'h3'

/**
 * Analytics Engine SQL API 查詢封裝
 *
 * Analytics Engine 的寫入走 binding，但查詢必須打 Cloudflare REST API，
 * 需要 Account ID 與具 Account Analytics Read 權限的 API Token。
 * 兩者都是 server-only 設定，不可出現在 runtimeConfig.public。
 */

const SQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/accounts'

/** FORMAT JSON 的回應結構 */
interface SQLResponse<T> {
  meta: Array<{ name: string; type: string }>
  data: T[]
  rows: number
}

/** 查詢憑證未設定（本機開發）時丟出，呼叫端據此回傳空資料而非錯誤 */
export class AnalyticsNotConfiguredError extends Error {
  constructor() {
    super('Analytics SQL credentials not configured')
    this.name = 'AnalyticsNotConfiguredError'
  }
}

/**
 * 執行一段 SQL 並回傳 data 陣列
 *
 * 注意：所有查詢都是程式內的常數字串，不接受外部輸入拼接，
 * 因此沒有 SQL injection 面。新增需要參數的查詢前請先確認這點仍成立。
 */
export const queryAnalyticsSQL = async <T>(
  event: H3Event,
  sql: string,
): Promise<T[]> => {
  const config = useRuntimeConfig(event)
  const accountId = config.cfAccountId
  const token = config.cfAnalyticsToken

  if (!accountId || !token) throw new AnalyticsNotConfiguredError()

  const response = await $fetch<SQLResponse<T>>(
    `${SQL_ENDPOINT}/${accountId}/analytics_engine/sql`,
    {
      method: 'POST',
      // 本體是純 SQL 文字，不是 JSON
      body: sql,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
    },
  )

  return response?.data ?? []
}
