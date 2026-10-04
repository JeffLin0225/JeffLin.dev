/**
 * GET /api/github
 * 取得所有 GitHub 專案列表
 *
 * 這支只讀快取、不負責更新：重抓交給 cron（server/plugins/scheduled.ts），
 * 所以訪客永遠不會為了更新資料而等 GitHub API。
 */
export default defineEventHandler(async (event) => {
  const kv = useKV(event)
  const config = useRuntimeConfig(event)
  const token = config.githubToken || undefined

  if (kv) {
    const cached = await readReposCache(kv)
    if (cached) return { success: true, ...cached }
  }

  /* ─── 快取還是空的：首次部署、KV 被清空，或 cron 還沒跑完第一輪 ─── */
  try {
    const result = kv
      ? await refreshReposCache(kv, token)
      : { data: await fetchGitHubRepos(token), lastSync: new Date().toISOString() }

    return { success: true, ...result }
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch GitHub repos',
    })
  }
})
