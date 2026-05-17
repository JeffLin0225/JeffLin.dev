# 📐 GitHub Page Specs — GitHub 專案探索頁面設計規格

> **用途：** 定義網站中「GitHub 專案探索」頁面的功能、資料流與 UI 設計規格。  
> **渲染模式：** SSR + SWR（每小時重新驗證）  
> **技術棧：** Nuxt 4 + Cloudflare KV + Fuse.js + GitHub REST API  
> **實作狀態：** 🔴 尚未開始

---

## 1. 頁面總覽

### 1.1 頁面目標

打造一個讓使用者可以**極致絲滑**地瀏覽與搜尋 GitHub 專案的頁面，具備：

- 🔍 **即時模糊搜尋**（Fuse.js 客戶端搜尋，零延遲體驗）
- 📋 **完整專案資訊展示**（名稱、描述、語言、時間等）
- 🎯 **智慧推薦**（根據使用者瀏覽行為 / 熱門度推薦可能感興趣的專案）
- ⚡ **SSR 首屏直出**（SEO 友善，首次載入即有完整內容）

### 1.2 路由

```
/github          — 專案探索主頁面
/github/:name    — 單一專案詳情頁（可選，Phase 2）
```

### 1.3 渲染策略

```typescript
// nuxt.config.ts
routeRules: {
  '/github':     { swr: 3600 },  // SWR：每小時重新驗證（配合 cron 更新頻率）
  '/github/**':  { swr: 3600 },
}
```

---

## 2. 資料架構

### 2.1 GitHub API 資料來源

#### API 1 — 取得所有 Repos 列表

```
GET https://api.github.com/users/Jefflin0225/repos?per_page=100
```

擷取欄位：

```typescript
interface GitHubRepo {
  name: string;           // repo 名稱
  full_name: string;      // 完整名稱（含使用者名稱）
  description: string | null;
  html_url: string;       // GitHub 連結
  language: string | null;
  created_at: string;     // ISO 8601
  updated_at: string;     // ISO 8601
}
```

#### API 2 — 取得單一 Repo 詳細資訊（可選，用於詳情頁）

```
GET https://api.github.com/repos/Jefflin0225/{repo_name}
```

擷取欄位同上。

### 2.2 Cloudflare KV 儲存結構

```
Key: "github:repos:all"
Value: JSON.stringify(GitHubRepo[])
Metadata: { updatedAt: ISO8601 timestamp }
```

```
Key: "github:repos:{repo_name}"
Value: JSON.stringify(GitHubRepo)
Metadata: { updatedAt: ISO8601 timestamp }
```

### 2.3 Cron Job — 每小時同步 GitHub 資料

**執行頻率：** 每 1 小時  
**觸發方式：** Cloudflare Workers Cron Trigger（`scheduled` event）  
**wrangler.json 設定：**

```json
{
  "triggers": {
    "crons": ["0 * * * *"]
  }
}
```

**Cron Job 流程：**

```
1. 呼叫 GitHub API: GET /users/Jefflin0225/repos?per_page=100
2. 清洗資料：只保留需要的欄位（name, full_name, description, html_url, language, created_at, updated_at）
3. 寫入 KV:
   - "github:repos:all" → 完整 repo 列表 JSON
   - 每個 repo 寫入 "github:repos:{name}" → 單一 repo JSON（可選）
4. 記錄 "github:repos:lastSync" → 最後同步時間戳
```

**Server API 實作位置：**

```
server/api/cron/sync-repos.post.ts     — 手動觸發同步（開發用）
server/routes/_worker.ts               — Cloudflare scheduled event handler
```

**Nitro Server Task（推薦方式）：**

```typescript
// server/tasks/sync-github-repos.ts
export default defineTask({
  meta: { name: 'sync:github-repos', description: 'Sync GitHub repos to KV' },
  async run({ payload, context }) {
    // 1. fetch GitHub API
    // 2. 清洗資料
    // 3. 寫入 KV
    return { result: 'ok' }
  }
})
```

---

## 3. Server API 設計

### 3.1 取得所有專案

```
GET /api/github
```

**處理邏輯：**

```
1. 從 KV 讀取 "github:repos:all"
2. 若 KV 無資料 → 直接呼叫 GitHub API 並回寫 KV（fallback）
3. 回傳 { success: true, data: GitHubRepo[], lastSync: string }
```

### 3.2 取得單一專案（可選）

```
GET /api/github/:name
```

**處理邏輯：**

```
1. 從 KV 讀取 "github:repos:{name}"
2. 若無 → 呼叫 GitHub API 單一 repo endpoint
3. 回傳 { success: true, data: GitHubRepo }
```

### 3.3 手動觸發同步（開發用）

```
POST /api/cron/sync-repos
```

---

## 4. 前端架構

### 4.1 Composable — `useGithubRepos`

```typescript
// composables/useGithubRepos.ts
export const useGithubRepos = () => {
  const repos = useState<GitHubRepo[]>('github-repos', () => []);
  const searchQuery = useState<string>('github-search', () => '');
  const isLoading = useState<boolean>('github-loading', () => false);
  const lastSync = useState<string>('github-last-sync', () => '');

  // Fuse.js 實例（客戶端）
  const fuse = computed(() => new Fuse(repos.value, {
    keys: ['name', 'description', 'language'],
    threshold: 0.3,
    includeScore: true,
  }));

  // 搜尋結果
  const filteredRepos = computed(() => {
    if (!searchQuery.value) return repos.value;
    return fuse.value.search(searchQuery.value).map(r => r.item);
  });

  // 取得專案（SSR 時 server 端執行）
  const fetchRepos = async () => { /* useAsyncData + $fetch */ };

  return { repos, searchQuery, filteredRepos, isLoading, lastSync, fetchRepos };
};
```

### 4.2 Fuse.js 客戶端快取策略

```
1. SSR 階段：Server 從 KV 讀取完整 repo 列表，注入頁面
2. Hydration：客戶端接收資料，建立 Fuse.js 索引
3. 搜尋：純客戶端操作，零 API 請求，即時回應
4. 重新整理：透過 SWR 策略，背景重新驗證資料
```

**Fuse.js 設定：**

```typescript
const fuseOptions: Fuse.IFuseOptions<GitHubRepo> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.35 },
    { name: 'language', weight: 0.25 },
  ],
  threshold: 0.3,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
};
```

---

## 5. 頁面 UI 設計

### 5.1 頁面佈局結構

```
┌──────────────────────────────────────────────┐
│  [Glassmorphism Navbar — sticky]             │
├──────────────────────────────────────────────┤
│                                              │
│  Hero Section                                │
│  ┌────────────────────────────────────────┐  │
│  │  ✨ Explore My Projects               │  │
│  │  副標題 + 專案總數 badge               │  │
│  │                                        │  │
│  │  [ 🔍 搜尋框 — 全寬、毛玻璃背景 ]     │  │
│  │  [ 語言篩選 Tag Pills ]               │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  專案卡片 Grid                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Repo Card│ │ Repo Card│ │ Repo Card│     │
│  └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ ...      │ │ ...      │ │ ...      │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│  推薦區塊                                    │
│  ┌────────────────────────────────────────┐  │
│  │  🎯 You Might Also Like               │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐     │  │
│  │  │Featured│ │Featured│ │Featured│     │  │
│  │  └────────┘ └────────┘ └────────┘     │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│  [Footer]                                    │
└──────────────────────────────────────────────┘
```

### 5.2 搜尋框

- 全寬設計，置於 Hero Section 中央
- 毛玻璃背景（`backdrop-filter: blur(20px)`）
- 左側搜尋 icon 帶呼吸動畫
- 輸入時即時篩選（debounce 150ms）
- 空狀態顯示搜尋建議（熱門關鍵字 chips）
- 聚焦時外框發出 accent 色柔光（`box-shadow` glow）

### 5.3 語言篩選 Tag Pills

- 水平捲動的 pill 按鈕列
- 根據 repos 中出現的語言動態生成
- 每個語言配專屬色彩圓點（對應 GitHub 語言色）
- 支援多選 / 全選
- 選中時帶微彈跳動畫（`ease-spring`）

### 5.4 專案卡片（RepoCard）

```
┌─────────────────────────────────────┐
│  [語言色彩條 — 頂部 3px accent bar] │
│                                     │
│  📦 repo-name                       │
│  A short description of the repo    │
│  that can span multiple lines...    │
│                                     │
│  ┌─────┐                            │
│  │ 🟡 JavaScript │  📅 2024-03-15  │
│  └─────┘                            │
│                                     │
│  [ → View on GitHub ]               │
│                                     │
└─────────────────────────────────────┘
```

**卡片互動：**
- Hover：`translateY(-4px)` + shadow 加深 + 頂部色彩條加寬
- 點擊：`scale(0.98)` 反饋
- 進場：staggered fade-up 動畫（每張卡片延遲 50ms）

### 5.5 推薦區塊 — "You Might Also Like"

**推薦邏輯（Phase 1 — 客戶端）：**

```
1. 最近更新的專案（updated_at 排序，取前 5）
2. 與目前搜尋關鍵字相同語言的專案
3. 隨機推薦（避免重複已展示的）
```

**UI 設計：**
- 獨立區塊，帶漸層分隔線
- 水平捲動卡片輪播（CSS scroll-snap）
- 卡片帶「推薦原因」小標籤（如「最近更新」「同語言」）

### 5.6 空狀態 & Loading

**Loading 狀態：** 使用共用 `LoadingOverlay.vue`（Orbit Constellation 模式）

**空搜尋結果：**
- 居中大圖示 + 「No projects found」
- 顯示搜尋建議：「Try searching for: JavaScript, Python, ...」
- 帶 fade-in 進場動畫

**無資料（KV 為空）：**
- 顯示重新同步按鈕（開發模式可見）
- 顯示 fallback 訊息

---

## 6. 響應式設計

| 斷點 | 卡片列數 | 搜尋框寬度 | 特殊處理 |
|------|----------|------------|----------|
| < 640px | 1 列 | 100% | 推薦區水平捲動 |
| 640–1023px | 2 列 | 80% | — |
| 1024–1279px | 3 列 | 60% | — |
| ≥ 1280px | 3–4 列 | 50% | 最大寬度 1400px |

---

## 7. SEO 設定

```typescript
useSeoMeta({
  title: 'GitHub — Jeff Lin',
  description: 'Explore my open-source projects on GitHub. Search and discover repositories by language, topic, and more.',
  ogTitle: 'Jeff Lin — GitHub Projects',
  ogDescription: 'Browse and search my GitHub repositories.',
  ogImage: '/og/github.png',
});
```

---

## 8. 完整資料流

```
[GitHub API]
     │
     ▼  (Cron Job 每小時)
[Cloudflare KV]
     │
     ▼  (SSR — Server API)
[Nuxt Server] ──→ HTML 直出（含完整 repo 列表）
     │
     ▼  (Hydration)
[Client 瀏覽器]
     │
     ├─→ Fuse.js 索引建立（client-side）
     ├─→ 使用者輸入搜尋 → Fuse.js 即時篩選（zero API call）
     └─→ SWR 背景重新驗證
```

---

## 9. 檔案結構

```
app/
├── pages/
│   └── github/
│       └── index.vue              — 專案探索主頁
├── components/
│   ├── github/
│   │   ├── HeroSearch.vue         — Hero + 搜尋框
│   │   ├── LanguageFilter.vue     — 語言篩選 pills
│   │   ├── RepoCard.vue           — 專案卡片
│   │   ├── RepoGrid.vue           — 卡片 Grid 容器
│   │   ├── RecommendSection.vue   — 推薦區塊
│   │   └── EmptyState.vue         — 空狀態
│   └── ui/
│       └── LoadingOverlay.vue     — 全屏 Loading（已完成）
├── composables/
│   └── useGithubRepos.ts          — 專案資料管理 + Fuse.js
server/
├── api/
│   ├── github/
│   │   └── index.get.ts           — GET /api/github
│   └── cron/
│       └── sync-repos.post.ts     — POST /api/cron/sync-repos
├── tasks/
│   └── sync-github-repos.ts       — Nitro scheduled task
└── utils/
    └── useKV.ts                   — KV binding 工具函數
```

---

## 10. 依賴清單

```json
{
  "dependencies": {
    "fuse.js": "^7.x"
  }
}
```

---

## 11. Phase 規劃

### Phase 1 — MVP
- [ ] Server 端：KV 工具函數（`useKV`）
- [ ] Server 端：GitHub API 同步 → KV（Cron + 手動 API）
- [ ] Server 端：`GET /api/github` 讀取 KV
- [ ] Composable：`useGithubRepos`（資料管理 + Fuse.js）
- [ ] 元件：HeroSearch（搜尋框 + 標題）
- [ ] 元件：LanguageFilter（語言篩選 pills）
- [ ] 元件：RepoCard（專案卡片）
- [ ] 元件：RepoGrid（Grid 容器 + stagger 動畫）
- [ ] 元件：EmptyState（空搜尋 / 無資料）
- [ ] 元件：RecommendSection（推薦區塊）
- [ ] 頁面：`/github` 主頁面組裝
- [ ] 響應式設計
- [ ] SEO（useSeoMeta）
- [ ] nuxt.config.ts 更新（SWR route rules）

### Phase 2 — 進階（可選）
- [ ] 單一專案詳情頁 `/github/:name`
- [ ] 更多 GitHub 資料（stars, forks, topics, README）
- [ ] AI 語意推薦（Workers AI）
- [ ] 瀏覽紀錄追蹤 + 個人化推薦
- [ ] 分頁 / 無限捲動（若 repo 數量超過 100）
