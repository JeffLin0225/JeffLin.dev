/**
 * POST /api/cron/sync-repos
 * 手動觸發 GitHub repos 同步到 KV（開發用）
 */
export default defineEventHandler(async (event) => {
  const kv = useKV(event)
  const config = useRuntimeConfig()

  try {
    const data = await fetchGitHubRepos(config.githubToken || undefined)
    const syncTime = new Date().toISOString()

    if (kv) {
      await kv.put('github:repos:all', JSON.stringify(data), {
        metadata: { updatedAt: syncTime },
      })
      await kv.put('github:repos:lastSync', syncTime)
    }

    return {
      success: true,
      message: `Synced ${data.length} repos`,
      lastSync: syncTime,
      kvAvailable: !!kv,
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Sync failed: ${e.message}`,
    })
  }
})
