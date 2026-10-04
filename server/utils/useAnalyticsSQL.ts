/**
 * Analytics Engine SQL API 查詢封裝
 *
 * Analytics Engine 的寫入走 binding，但查詢必須打 Cloudflare REST API，
 * 需要 Account ID 與具 Account Analytics Read 權限的 API Token。
 * 兩者都是 server-only 設定，不可出現在 runtimeConfig.public。
 *
 * 憑證由呼叫端傳入，這裡刻意不自己讀 runtimeConfig：
 * cron 觸發時沒有 H3Event，而 useRuntimeConfig() 不帶 event 會拿到模組載入那一刻
 * 就 freeze 的快照 —— 那時 Cloudflare 還沒把環境變數放進 globalThis.__env__，
 * token 會是空字串，查詢全部失敗且不會噴錯。讓呼叫端各自從手上的來源取憑證
 * （HTTP 走 event、cron 走 scheduled 給的 env），就不會踩到這個時序問題。
 */

const SQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/accounts'

export interface AnalyticsCreds {
  accountId: string
  token: string
}

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
  sql: string,
  creds: AnalyticsCreds,
): Promise<T[]> => {
  if (!creds.accountId || !creds.token) throw new AnalyticsNotConfiguredError()

  const response = await $fetch<SQLResponse<T>>(
    `${SQL_ENDPOINT}/${creds.accountId}/analytics_engine/sql`,
    {
      method: 'POST',
      // 本體是純 SQL 文字，不是 JSON
      body: sql,
      headers: {
        'Authorization': `Bearer ${creds.token}`,
        'Content-Type': 'text/plain',
      },
    },
  )

  return response?.data ?? []
}
