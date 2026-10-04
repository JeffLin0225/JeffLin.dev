import type { H3Event } from 'h3'

/**
 * GET /api/github
 * 取得所有 GitHub 專案列表
 *
 * KV 的資料刻意不設過期：永遠有東西可以回，訪客不會因為快取過期而等 GitHub API。
 * 新鮮度改用 metadata.updatedAt 判斷，過舊就在背景重抓（見 refreshInBackground）。
 */

const CACHE_KEY = 'github:repos:all'
const SYNC_KEY = 'github:repos:lastSync'
/** 背景重抓中的標記，避免同時湧入的請求各打一次 GitHub API */
const LOCK_KEY = 'github:repos:refreshing'
/** 超過這個時間就認為該更新了 */
const MAX_AGE_MS = 60 * 60 * 1000
/** 鎖故意不手動解除，靠過期自然釋放 —— 抓取失敗時順便變成重試間隔 */
const LOCK_TTL_SECONDS = 300

export default defineEventHandler(async (event) => {
  const kv = useKV(event)
  const config = useRuntimeConfig(event)

  // 1. 先回 KV 的資料，過舊則在背景重抓（訪客不會等到它）
  if (kv) {
    try {
      const { value, metadata } = await kv.getWithMetadata<string>(CACHE_KEY)
      if (value) {
        const data = JSON.parse(value)
        const lastSync = (metadata as Record<string, string>)?.updatedAt || ''

        if (isStale(lastSync)) await refreshInBackground(event, kv, config.githubToken || undefined)

        return { success: true, data, lastSync }
      }
    } catch (e) {
      console.warn('[API /api/github] KV read failed, falling back to GitHub API:', e)
    }
  }

  // 2. KV 完全沒資料（首次啟用）：只能同步抓一次
  try {
    const data = await fetchGitHubRepos(config.githubToken || undefined)
    const lastSync = new Date().toISOString()

    if (kv) await writeCache(kv, data, lastSync)

    return { success: true, data, lastSync }
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch GitHub repos',
    })
  }
})

/** lastSync 讀不到或解析不出來時一律當作過舊，寧可多抓一次也不要永遠卡在舊資料 */
const isStale = (lastSync: string): boolean => {
  const syncedAt = Date.parse(lastSync)
  return !Number.isFinite(syncedAt) || Date.now() - syncedAt > MAX_AGE_MS
}

const writeCache = async (kv: KVNamespace, data: unknown, lastSync: string) => {
  try {
    await kv.put(CACHE_KEY, JSON.stringify(data), { metadata: { updatedAt: lastSync } })
    await kv.put(SYNC_KEY, lastSync)
  } catch (e) {
    console.warn('[API /api/github] KV write failed:', e)
  }
}

/**
 * 在回應送出後才重抓。
 *
 * 鎖是 best-effort —— KV 沒有 atomic CAS，但足以讓同時進來的請求收斂成大約一次抓取。
 */
const refreshInBackground = async (event: H3Event, kv: KVNamespace, token?: string) => {
  try {
    if (await kv.get(LOCK_KEY)) return
    await kv.put(LOCK_KEY, '1', { expirationTtl: LOCK_TTL_SECONDS })
  } catch {
    return
  }

  event.waitUntil((async () => {
    try {
      const data = await fetchGitHubRepos(token)
      await writeCache(kv, data, new Date().toISOString())
    } catch (e) {
      console.error('[API /api/github] Background refresh failed:', e)
    }
  })())
}
