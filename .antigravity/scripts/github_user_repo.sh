#!/bin/bash
# ─────────────────────────────────────────────
# 取得單一 GitHub Repo 的詳細資訊
# 用法: ./github_user_repo.sh [repo_name]
# 預設: redisdemo
# ─────────────────────────────────────────────

REPO_NAME="${1:-redisdemo}"

curl -s "https://api.github.com/repos/Jefflin0225/${REPO_NAME}" | jq '{
  name: .name,
  full_name: .full_name,
  description: .description,
  html_url: .html_url,
  language: .language,
  created_at: .created_at,
  updated_at: .updated_at
}'
