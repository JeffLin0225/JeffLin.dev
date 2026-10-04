/**
 * Cron 進入點
 *
 * Cloudflare 的 scheduled 事件由 Nitro 轉成 cloudflare:scheduled hook
 * （見 nitropack/presets/cloudflare/runtime/_module-handler.mjs）。
 *
 * 只有 Workers 會派送這個事件：Pages 不支援 cron trigger，就算 wrangler.json
 * 寫了 triggers.crons 也會被忽略且不報錯。這就是本站從 Pages 遷移過來的原因。
 *
 * 憑證一律從 hook 給的 env 取，不可用 useRuntimeConfig()：後者在沒有 H3Event 時
 * 回傳的是模組載入那一刻就 freeze 的快照，那時 Cloudflare 還沒把環境變數掛進
 * globalThis.__env__，token 會是空字串 —— 而且查詢只會安靜地失敗。
 */

interface ScheduledEnv {
  KV?: KVNamespace
  NUXT_GITHUB_TOKEN?: string
  NUXT_CF_ACCOUNT_ID?: string
  NUXT_CF_ANALYTICS_TOKEN?: string
}

/** 必須與 wrangler.json 的 triggers.crons 完全一致 */
const STATS_CRON = '*/10 * * * *'
const REPOS_CRON = '0 * * * *'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('cloudflare:scheduled', async ({ controller, env }) => {
    const cfEnv = env as ScheduledEnv
    const kv = cfEnv.KV

    if (!kv) {
      console.error('[cron] KV binding 不存在，這輪跳過')
      return
    }

    try {
      switch (controller.cron) {
        case STATS_CRON:
          await refreshStatsCache(kv, {
            accountId: cfEnv.NUXT_CF_ACCOUNT_ID ?? '',
            token: cfEnv.NUXT_CF_ANALYTICS_TOKEN ?? '',
          })
          break

        // 專案列表幾乎不變，沒必要跟著 stats 每 10 分鐘打一次 GitHub API
        case REPOS_CRON:
          await refreshReposCache(kv, cfEnv.NUXT_GITHUB_TOKEN || undefined)
          break

        default:
          console.warn(`[cron] 未知排程 ${controller.cron}，忽略`)
          return
      }

      console.log(`[cron ${controller.cron}] 完成`)
    } catch (e) {
      // 吞掉錯誤是刻意的：拋出去只是讓這次 invocation 標記失敗，
      // 而快取裡上一份資料仍然有效，下一輪會自己再試。
      console.error(`[cron ${controller.cron}] 失敗：`, e)
    }
  })
})
