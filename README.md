# JeffLin.dev

個人網站 — Built with Nuxt 4 + Cloudflare Pages + KV

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

啟動後 `nitro-cloudflare-dev` 會自動模擬 Cloudflare KV binding，資料存在 `.wrangler/state/`。

## Cloudflare KV 測試

### 手動同步 GitHub repos 到 KV

```bash
curl -X POST http://localhost:3000/api/cron/sync-repos
```

預期回傳：

```json
{
  "success": true,
  "message": "Synced 25 repos",
  "lastSync": "2026-05-22T16:35:35.746Z",
  "kvAvailable": true
}
```

- `kvAvailable: true` — KV binding 可用（本地模擬成功）
- `kvAvailable: false` — KV binding 不可用（缺少 `wrangler.json` 或 `nitro-cloudflare-dev`）

### 從 KV 讀取資料

```bash
curl http://localhost:3000/api/github
```

預期回傳：

```json
{
  "success": true,
  "data": [ ... ],
  "lastSync": "2026-05-22T16:35:35.746Z"
}
```

- 有 `lastSync` 時間戳 → 資料來自 KV
- 沒有 → fallback 直接打 GitHub API

### 查看遠端 KV 內容（需 wrangler login）

```bash
# 列出所有 key
npx wrangler kv key list --namespace-id <KV_NAMESPACE_ID> --remote

# 讀取特定 key 的值
# 看 repos 完整資料
npx wrangler kv key get "github:repos:all" --namespace-id <KV_NAMESPACE_ID> --remote
npx wrangler kv key get "github:repos:lastSync" --namespace-id <KV_NAMESPACE_ID> --remote
```

> 本地開發的 KV 資料存在 `.wrangler/state/`，不會寫到遠端。

## Build & Deploy

> ⚠️ 本專案使用 **Cloudflare Pages Functions** 執行 `/api/*`（需要 KV + GitHub Token）
> 必須用 `npm run build`，**不能用 generate**（generate 只輸出靜態 HTML，API 無法運作）

```bash
# Build（產出 Cloudflare Pages Functions 格式到 dist/）
npm run build

# 本地用 wrangler 模擬 Cloudflare 環境預覽（需先 build）
npm run cf:preview

# 部署到 Cloudflare Pages（需先 build）
npm run cf:deploy
```

### Cloudflare Dashboard 設定（必要）
- **Environment variables**: `NUXT_GITHUB_TOKEN` = GitHub PAT（read:public_repo）
- **KV Namespace binding**: binding name `KV` → 對應正確的 namespace

## Scripts 速查

| Script | 用途 | 備註 |
|--------|------|------|
| `npm run dev` | 本地開發（KV 自動模擬） | — |
| `npm run build` | 產出 CF Pages Functions 到 `dist/` | **部署前必跑** |
| `npm run cf:preview` | wrangler 本地預覽 | 需先 build |
| `npm run cf:deploy` | 部署到 Cloudflare Pages | 需先 build |
