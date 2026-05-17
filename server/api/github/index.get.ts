/**
 * GET /api/github
 * 取得所有 GitHub 專案列表
 *
 * 處理邏輯：
 * 1. 嘗試從 KV 讀取快取
 * 2. KV 無資料 → fallback 呼叫 GitHub API 並回寫 KV
 * 3. 回傳 { success, data, lastSync }
 */
export default defineEventHandler(async (event) => {
  const kv = useKV(event)
  const config = useRuntimeConfig()

  // 1. 嘗試從 KV 讀取
  if (kv) {
    try {
      const { value, metadata } = await kv.getWithMetadata<string>('github:repos:all')
      if (value) {
        const data = JSON.parse(value)
        const lastSync = (metadata as Record<string, string>)?.updatedAt || ''
        return { success: true, data, lastSync }
      }
    } catch (e) {
      console.warn('[API /api/github] KV read failed, falling back to GitHub API:', e)
    }
  }

  // 2. Fallback：直接呼叫 GitHub API
  try {
    const data = await fetchGitHubRepos(config.githubToken || undefined)
    const lastSync = new Date().toISOString()

    // 嘗試回寫 KV（非阻塞）
    if (kv) {
      try {
        await kv.put('github:repos:all', JSON.stringify(data), {
          metadata: { updatedAt: lastSync },
        })
        await kv.put('github:repos:lastSync', lastSync)
      } catch (e) {
        console.warn('[API /api/github] KV write failed:', e)
      }
    }

    return { success: true, data, lastSync }
  } catch (e) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch GitHub repos',
    })
  }
})
