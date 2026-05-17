#!/bin/bash
# ─────────────────────────────────────────────
# 取得使用者的所有 GitHub Repos 清單
# 用法: ./github_user_repo_all.sh
# ─────────────────────────────────────────────

curl -s "https://api.github.com/users/Jefflin0225/repos?per_page=100" | jq '.[] | {
  name: .name,
  full_name: .full_name,
  description: .description,
  html_url: .html_url,
  language: .language,
  created_at: .created_at,
  updated_at: .updated_at
}'
