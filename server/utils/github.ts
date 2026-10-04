/**
 * GitHub API 共用工具函數
 * 負責呼叫 GitHub REST API 並清洗資料
 */

// 型別從 app/types/github.ts 共用，避免重複定義
export type { GitHubRepo } from '../../app/types/github'
import type { GitHubRepo } from '../../app/types/github'

interface GitHubApiRepo {
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  fork: boolean
  [key: string]: unknown
}

const GITHUB_USER = 'Jefflin0225'
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * 取得 GitHub 使用者的所有公開 repos
 * @param token - GitHub Personal Access Token（可選，提高 rate limit）
 */
export async function fetchGitHubRepos(token?: string): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'JeffLin.dev',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    { headers },
  )

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `GitHub API error: ${response.statusText}`,
    })
  }

  const raw: GitHubApiRepo[] = await response.json()

  // 清洗資料：只保留需要的欄位，排除 fork
  return raw
    .filter(repo => !repo.fork)
    .map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      topics: repo.topics ?? [],
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }))
}

/* ─── KV 快取 ───
 *
 * 與 siteStats 相同策略：不設過期時間，由 cron 負責覆蓋，
 * 抓取失敗時原封不動留著上一份，讀取路徑永遠有東西可回。
 */

export const REPOS_CACHE_KEY = 'github:repos:all'
export const REPOS_SYNC_KEY = 'github:repos:lastSync'

export const readReposCache = async (
  kv: KVNamespace,
): Promise<{ data: GitHubRepo[]; lastSync: string } | null> => {
  try {
    const { value, metadata } = await kv.getWithMetadata<string>(REPOS_CACHE_KEY)
    if (!value) return null

    return {
      data: JSON.parse(value) as GitHubRepo[],
      lastSync: (metadata as Record<string, string>)?.updatedAt || '',
    }
  } catch (e) {
    console.warn('[github] KV read failed:', e)
    return null
  }
}

export const writeReposCache = async (
  kv: KVNamespace,
  data: GitHubRepo[],
  lastSync: string,
) => {
  try {
    await kv.put(REPOS_CACHE_KEY, JSON.stringify(data), { metadata: { updatedAt: lastSync } })
    await kv.put(REPOS_SYNC_KEY, lastSync)
  } catch (e) {
    console.warn('[github] KV write failed:', e)
  }
}

/** cron 與冷啟動共用：抓一次並寫回快取 */
export const refreshReposCache = async (kv: KVNamespace, token?: string) => {
  const data = await fetchGitHubRepos(token)
  const lastSync = new Date().toISOString()

  await writeReposCache(kv, data, lastSync)

  return { data, lastSync }
}
