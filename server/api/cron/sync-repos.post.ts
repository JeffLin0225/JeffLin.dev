/**
 * POST /api/cron/sync-repos
 * 手動觸發 GitHub repos 同步到 KV
 *
 * 常態更新已由 cron 負責（server/plugins/scheduled.ts），
 * 這支留著當手動強制同步的逃生口（例如剛改完 repo 想立刻看到結果）。
 */
export default defineEventHandler(async (event) => {
  const kv = useKV(event)
  const config = useRuntimeConfig(event)
  const token = config.githubToken || undefined

  try {
    const { data, lastSync } = kv
      ? await refreshReposCache(kv, token)
      : { data: await fetchGitHubRepos(token), lastSync: new Date().toISOString() }

    return {
      success: true,
      message: `Synced ${data.length} repos`,
      lastSync,
      kvAvailable: !!kv,
    }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Sync failed: ${e instanceof Error ? e.message : String(e)}`,
    })
  }
})
