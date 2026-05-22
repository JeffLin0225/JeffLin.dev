/**
 * GitHub Repo 共用型別
 * 前端（app/）與後端（server/）共用
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
