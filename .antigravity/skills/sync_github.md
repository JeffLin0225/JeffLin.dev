# Skill: GitHub Data Synchronization (Cloudflare KV)

## 任務描述
此技能用於實作「GitHub Repos 透過 Cron Job 同步至 Cloudflare KV」的完整流程。

## 執行步驟
1. **GitHub API 呼叫**: 
   - 使用 `https://api.github.com/users/Jefflin0225/repos?per_page=100`。
   - 必須處理 `User-Agent` Header。
2. **資料清洗 (Sanitization)**:
   - 僅保留：`name`, `full_name`, `description`, `html_url`, `language`, `created_at`, `updated_at`。
   - 確保 `description` 或 `language` 為空時給予預設值或處理。
3. **KV 寫入策略**:
   - 將整個陣列 JSON 化後存入 Key: `github:repos:all`。
   - 同時更新 Key: `github:repos:lastSync` 存儲當前 ISO 標記。
4. **Nitro Server Task**:
   - 依照 Nuxt 4 規範在 `server/tasks/sync-github-repos.ts` 中實作。
   - 必須能透過 `npx nuxi task sync:github-repos` 手動測試。

## 程式碼風格要求
- 必須包含完整的 TypeScript Interface 定義。
- 必須使用 `try-catch` 並記錄詳細錯誤日誌。
- 成功後回傳 `{ success: true, count: number }`。
