/**
 * POST /api/cron/sync-repos
 * 手動觸發 GitHub repos 同步到 KV
 *
 * 常態更新已由 cron 負責（server/plugins/scheduled.ts），
 * 這支留著當手動強制同步的逃生口（例如剛改完 repo 想立刻看到結果）。
 *
 * 除了 auth middleware 的 x-internal-token，還要帶 Authorization: Bearer <NUXT_CRON_SECRET>：
 * internal token 是公開的（在 SSR payload 裡），只靠它的話任何人都能反覆觸發，
 * 耗掉 GitHub rate limit 與 KV 每日寫入額度。未設定 secret 時這支直接停用。
 *
 *   curl -X POST https://jxlin.dev/api/cron/sync-repos \
 *     -H "x-internal-token: <token>" -H "Authorization: Bearer <secret>"
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const secret = config.cronSecret
  if (!secret || getHeader(event, 'authorization') !== `Bearer ${secret}`) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const kv = useKV(event)
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
