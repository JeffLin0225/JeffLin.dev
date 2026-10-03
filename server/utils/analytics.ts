/**
 * 流量統計工具函數
 *
 * 隱私原則：原始 IP 只用於計算 hashVisitor() 的輸入，計算完即丟棄，
 * 任何儲存（Analytics Engine / KV）中都不存在 IP。
 */

/** Analytics Engine 資料集名稱，同時是 SQL 查詢的 table 名稱 */
export const ANALYTICS_DATASET = 'jxlin_pageviews'

/** Analytics Engine index 欄位上限 96 bytes */
const INDEX_MAX_BYTES = 96

const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|pinterest|vkshare|whatsapp|telegram|headless|lighthouse|pagespeed|pingdom|gtmetrix|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http-client|java\/|okhttp|phantomjs|puppeteer|playwright|scrapy/i

/**
 * 判斷是否為爬蟲 / 監控工具
 * 空 UA 也視為 bot（正常瀏覽器一定會帶）
 */
export const isBot = (ua: string): boolean => !ua || BOT_PATTERN.test(ua)

/**
 * 路徑正規化：移除 query 與 hash、去掉結尾斜線、長度上限 256
 * 回傳 null 表示路徑不合法，呼叫端應回 400
 */
export const normalizePath = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null

  const cleaned = raw.split('?')[0]!.split('#')[0]!.trim()
  if (!cleaned.startsWith('/')) return null

  // 去掉結尾斜線（'/' 本身保留）
  const trimmed = cleaned.length > 1 ? cleaned.replace(/\/+$/, '') || '/' : '/'
  return trimmed.slice(0, 256)
}

/**
 * 從完整 referrer URL 取出 hostname
 *
 * 只保留 hostname 是刻意的：完整 URL 會洩漏訪客端的內部網址
 * （私人 Notion 頁、公司工具、帶 token 的連結），而這個頁面是公開的。
 * 站內跳轉與解析失敗一律歸為 'direct'。
 */
export const refererHost = (raw: unknown, selfHost: string): string => {
  if (typeof raw !== 'string' || !raw) return 'direct'

  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, '')
    if (!host) return 'direct'

    const self = selfHost.toLowerCase().replace(/^www\./, '').split(':')[0]!
    if (host === self) return 'direct'

    return host.slice(0, 128)
  } catch {
    return 'direct'
  }
}

/**
 * 以台北時間（UTC+8）回傳 'YYYY-MM-DD'
 * 用作訪客雜湊的每日輪替因子
 */
export const taipeiDay = (now: number = Date.now()): string =>
  new Date(now + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)

/**
 * 計算每日輪替的匿名訪客雜湊
 *
 * 加入日期使同一人跨日得到不同雜湊，因此無法做長期追蹤 —— 這是刻意的取捨，
 * 代價是算不出「回訪者」，不重複訪客的定義為「單日不重複」。
 *
 * 因為雜湊每日輪替，把每天的 distinct 數相加即等於期間的 distinct 總數。
 */
export const hashVisitor = async (
  ip: string,
  ua: string,
  salt: string,
  day: string,
): Promise<string> => {
  const input = new TextEncoder().encode(`${ip}|${ua}|${salt}|${day}`)
  const digest = await crypto.subtle.digest('SHA-256', input)

  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 粗略的 UA 解析
 *
 * 不引入 ua-parser-js：會增加 Worker bundle 體積與冷啟動時間，
 * 而公開頁面只需要大分類。原始 UA 本身不儲存。
 */
export const parseUserAgent = (ua: string): {
  device: string
  browser: string
  os: string
} => {
  /* ─── 裝置 ─── */
  let device = 'desktop'
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) device = 'tablet'
  else if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) device = 'mobile'

  /* ─── 瀏覽器（順序重要：Edge/Opera 的 UA 含 Chrome，Chrome 含 Safari）─── */
  let browser = 'Other'
  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera'
  else if (/Firefox\/|FxiOS/i.test(ua)) browser = 'Firefox'
  else if (/Chrome\/|CriOS/i.test(ua)) browser = 'Chrome'
  else if (/Safari\//i.test(ua)) browser = 'Safari'

  /* ─── 作業系統（iPadOS 會自稱 Macintosh，故先判斷觸控線索）─── */
  let os = 'Other'
  if (/iPhone|iPod/i.test(ua)) os = 'iOS'
  else if (/iPad/i.test(ua)) os = 'iPadOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/Windows NT/i.test(ua)) os = 'Windows'
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS'
  else if (/CrOS/i.test(ua)) os = 'ChromeOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  return { device, browser, os }
}

/**
 * 截斷字串使其 UTF-8 位元組數不超過 maxBytes
 * Analytics Engine 的 index 欄位有 96 bytes 硬限制
 */
export const truncateToBytes = (value: string, maxBytes: number = INDEX_MAX_BYTES): string => {
  const encoder = new TextEncoder()
  if (encoder.encode(value).length <= maxBytes) return value

  let result = value
  while (result.length > 0 && encoder.encode(result).length > maxBytes) {
    result = result.slice(0, -1)
  }
  return result
}
