/**
 * GitHub API 共用工具函數
 * 負責呼叫 GitHub REST API 並清洗資料
 */

export interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  created_at: string
  updated_at: string
}

interface GitHubApiRepo {
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
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
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }))
}
