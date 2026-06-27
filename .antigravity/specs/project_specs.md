# 📋 Project Specs — 技術規格與 Code Style 規範

> **用途：** 開新專案時提供給 AI 或團隊成員閱讀，確保技術選型與程式碼風格一致。  
> **適用範圍：** 所有基於 Nuxt 4 + Cloudflare 的全端專案。

---

## 0. CSS / UIUX 設計標準 ✨

> **本專案所有頁面必須達到專業級、極致質感的視覺標準。**  
> **CSS 框架：TailwindCSS**（透過 `@nuxtjs/tailwindcss` Nuxt Module）  
> **參考檔案：** `ui_reference.html`（可直接在瀏覽器開啟對照元件樣式）

### 0.1 設計哲學

- **Premium First**：高端、精緻質感，拒絕廉價或陽春視覺
- **Dark + White Lines**：純黑暗底色 + 白色線條系，專業極簡風格
- **Micro-interaction Driven**：精緻微互動（hover、transition、scroll animation）
- **Glassmorphism + Depth**：毛玻璃效果（`backdrop-filter: blur()`）、陰影層次
- **Dark Mode First**：深色主題為預設

### 0.2 色彩系統（純黑白單色系）

- 禁止使用原生色彩（如 red, blue, #ff0000），必須使用 Design Token 變數
- **Surfaces**：`hsl(0,0%,4%)` 極深黑 / `hsl(0,0%,8%)` 卡片底 / `hsl(0,0%,12%)` 浮層 / `hsl(0,0%,15%)` Hover
- **White Line Borders**：`white 8%` 極細 / `12%` 預設 / `20%` 強調 / `40%` Hover/Focus
- **Text**：`hsl(0,0%,96%)` 主文字 / `hsl(0,0%,60%)` 次要 / `hsl(0,0%,38%)` 極淡
- **Status**（僅限 badge/通知）：Success `hsl(145,60%,45%)` / Warning `hsl(40,85%,55%)` / Error `hsl(0,65%,52%)`

### 0.3 字體規範

- 必須載入 Google Fonts，禁止瀏覽器預設字體
- **Space Grotesk** — 標題/導覽列/按鈕（幾何感、有辨識度）
- **Inter** — 內文/說明文字（乾淨專業）
- **JetBrains Mono** — 程式碼/Repo 名稱

### 0.4 間距與圓角

- Spacing Scale：4px base（`0.25rem` ~ `5rem`）
- Border Radius：`0.375rem`(sm) ~ `0.75rem`(card) ~ `9999px`(pill)

### 0.5 動畫與過渡

- Easing：`cubic-bezier(0.16, 1, 0.3, 1)` / `cubic-bezier(0.68, -0.15, 0.27, 1.15)`
- Duration：`150ms`（fast）/ `250ms`（normal）/ `400ms`（slow）
- **禁止 `transition: all`** — 必須指定具體屬性

### 0.6 元件質感要求

| 元件類型 | 必須具備 |
|----------|----------|
| 卡片 | `bg-secondary` + `border-subtle` + hover `translateY(-2px)` + 頂部漸層光線 |
| 按鈕 | Ghost（白邊框）或 Filled（白底黑字）+ click `scale(0.97)` |
| 輸入框 | 聚焦時 `border-accent` + 白光 glow |
| 導覽列 | 毛玻璃 `blur(20px)` + sticky + `border-subtle` 底線 |
| Filter Pills | `border-default` 圓形 + active 時白底微亮 |
| Loading | 全屏半透明毛玻璃覆蓋 + Orbit Constellation 或 Pulse Line，不顯示文字 |
| 頁面過場 | Nuxt transition fade + slide |
| 圖片 | lazy loading + fade-in |

### 0.7 嚴格禁止

- ❌ 瀏覽器預設字體 / ❌ 原生色彩值 / ❌ `transition: all`
- ❌ 無 hover/focus 的可互動元素 / ❌ `px` 字體單位
- ❌ 陽春表單元素 / ❌ 直白「Loading...」文字

---

## 1. 框架與技術選型

### 核心框架
- **Nuxt 4** (Vue 3.5+, Composition API only)
- **Nitro** 作為 Server Engine（內建於 Nuxt）
- **TypeScript** 為主要開發語言

### 樣式方案
- **TailwindCSS**（透過 `@nuxtjs/tailwindcss` Nuxt Module）
- 頁面以 Tailwind Utility Classes 為主，減少 `<style>` 區塊
- 全域共用樣式統一寫在 `assets/css/main.css`
- **所有自訂樣式必須遵守 Section 0 的 Design Token 系統**

### 雲端平台 (Cloudflare)
- **部署**：Cloudflare Pages（preset: `cloudflare_pages`）
- **KV 儲存**：Cloudflare KV（鍵值對存儲，適用於快取與輕量資料）
- **檔案儲存**：Cloudflare R2（S3 相容，無流出費用）
- **AI 推論**：Cloudflare Workers AI

<!--
  [DISABLED] 以下服務暫不使用，保留供未來啟用：
  - **資料庫**：Cloudflare D1（SQLite 相容）
  - **向量搜尋**：Cloudflare Vectorize（搭配 Workers AI 做 Embedding）
-->

### 狀態管理
- 使用 Nuxt 原生 `useState`，不使用 Pinia

### 不使用的技術
- ❌ Pinia / ❌ Express / Fastify / ❌ 外部 CSS 框架
- ❌ 外部 KV 服務（統一用 Cloudflare KV）
<!-- ❌ 外部資料庫服務（統一用 Cloudflare D1） [DISABLED — 目前改用 KV] -->

---

## 2. Code Style 規範

### 2.1 Vue SFC 區塊順序

`<template>` → `<script setup lang="ts">` → `<style scoped>`

### 2.2 命名規則

| 類型 | 命名方式 | 範例 |
|------|----------|------|
| 元件檔案 | PascalCase | `AppHeader.vue`, `UserCard.vue` |
| Composable | camelCase + `use` 前綴 | `useAuth.ts` |
| 工具函數 | camelCase | `formatDate.ts` |
| Server API | `<resource>.<method>.ts` | `users.get.ts` |
| Middleware | camelCase (`.global` 後綴=全域) | `auth.ts`, `log.global.ts` |

### 2.3 Composable 結構

```typescript
export const useXxx = () => {
    const state = useState<Type>('unique-key', () => defaultValue);
    const doSomething = () => { /* ... */ };
    return { state, doSomething };
};
```

### 2.4 Server API 結構

```typescript
export default defineEventHandler(async (event) => {
    // 1. 讀取並驗證輸入
    // 2. 透過工具函數取得 Cloudflare Binding
    // 3. try-catch 包裹業務邏輯
    // 4. 回傳 { success: boolean, data?: any, message?: string }
    // 5. 重大錯誤用 throw createError()
});
```

### 2.5 Cloudflare Binding 存取

- **禁止**直接寫 `event.context.cloudflare.env.XXX`
- **必須**透過工具函數封裝（`useKV(event)`, `useBucket(event)`）
- 工具函數統一放在 `server/utils/`

---

## 3. 架構規範

### 3.1 渲染策略

| 頁面特性 | 渲染模式 | 設定 |
|----------|----------|------|
| 內容固定 | SSG | `{ prerender: true }` |
| 需 SEO 但資料會變 | SWR | `{ swr: 秒數 }` |
| 不需 SEO（後台） | CSR | `{ ssr: false }` |
| 即時資料 | SSR | 預設行為 |

### 3.2 佈局系統
- 前台 `default` layout / 後台 `admin` layout / 特殊頁面 `blank` layout

### 3.3 權限控制
- `definePageMeta({ middleware: 'auth' })` 掛載
- Middleware 只做「攔截與導向」

### 3.4 全域錯誤處理
- `app/error.vue` 區分 404 vs 5xx
- `clearError({ redirect: '/' })` 回正常頁面

### 3.5 SEO
- 每頁必須 `useSeoMeta()` 設定 title、description、ogImage

### 3.6 Loading 與過渡策略

> **全域規則：任何頁面只要有 API / KV 資料讀取，必須套用 Loading 機制。**

#### 3.6.1 全站導航進度條

- `app.vue` 必須掛載 `<NuxtLoadingIndicator>`（頂部細線進度條）
- 設定：`height="2"`, `color="hsla(0,0%,100%,0.6)"`
- 效果：所有頁面切換時自動顯示，類似 GitHub / YouTube

#### 3.6.2 頁面級 Loading Overlay

適用條件：頁面的 `useAsyncData` / `useFetch` 會在客戶端導航時產生等待。

**實作模式：**

```typescript
// composable 內
const { data, pending } = await useAsyncData('key', () => $fetch('/api/xxx'), {
  lazy: true,  // ← 關鍵：頁面先切換，資料背景載入
})

// 將 pending 同步到 isLoading
watch(pending, (val) => { isLoading.value = val }, { immediate: true })
```

```vue
<!-- 頁面 template -->
<UiLoadingOverlay :visible="isLoading" />
```

- **`lazy: true`**：頁面立即切換，不阻塞導航
- **`LoadingOverlay`**：全屏毛玻璃 + Orbit Constellation 動畫
- 資料到達後 overlay 自動消失，內容淡入

#### 3.6.3 判斷是否需要 Loading

| 頁面資料來源 | 需要 Loading？ | 原因 |
|---|---|---|
| 無 API（純靜態 / SSG） | ❌ 不需要 | 頁面預渲染，秒開 |
| API / KV（SSR + lazy） | ✅ 需要 | 客戶端導航時有等待時間 |
| 外部 API（GitHub 等） | ✅ 需要 | 延遲不可控 |

---

## 4. 環境變數規範

| 前綴 | 可見範圍 | 讀取方式 |
|------|----------|----------|
| 無前綴 | Node.js only | `process.env.XXX` |
| `NUXT_` | Server only | `useRuntimeConfig().xxx` |
| `NUXT_PUBLIC_` | Server + Client | `useRuntimeConfig().public.xxx` |

- `.env` 不進版控 / 底線自動轉小駝峰

---

## 5. 設定檔範本

### 5.1 wrangler.json

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "jefflin-dev",
  "compatibility_date": "2025-07-15",
  "pages_build_output_dir": "dist",
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "<PRODUCTION_KV_ID>",
      "preview_id": "<PREVIEW_KV_ID>"
    }
  ]
}
```

<!--
  [DISABLED] R2 / AI / D1 / Vectorize：
  "r2_buckets": [{ "binding": "MY_BUCKET", "bucket_name": "..." }],
  "ai": { "binding": "AI" },
  "d1_databases": [{ "binding": "DB", "database_name": "...", "database_id": "..." }],
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "..." }]
-->

### 5.2 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  modules: ['@nuxtjs/tailwindcss', 'nitro-cloudflare-dev'],

  nitro: {
    preset: 'cloudflare_pages',
  },

  routeRules: {
    '/':          { prerender: true },
    '/github':    { swr: 3600 },
    '/github/**': { swr: 3600 },
    '/admin/**':  { ssr: false },
    '/api/**':    { cors: true },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  runtimeConfig: {
    someSecretKey: '',
    public: { appName: '' },
  },
})
```

### 5.3 TypeScript Binding 型別

在 `server/types/cloudflare.d.ts` 中定義 Cloudflare bindings 的 TypeScript 型別：

```typescript
declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: {
        KV: KVNamespace
        // MY_BUCKET: R2Bucket
        // AI: Ai
      }
    }
  }
}
export {}
```

---

## 6. Cloudflare 資源建立與部署流程

### 6.1 前置準備 — Wrangler 登入

```bash
# 安裝 wrangler（已在 devDependencies）
npm install

# 登入 Cloudflare 帳號（開啟瀏覽器授權）
wrangler login

# 驗證登入成功
wrangler whoami
```

### 6.2 建立 Cloudflare KV Namespace

```bash
# 建立 production KV namespace
npx wrangler kv namespace create KV
# → 輸出包含 id，例如：
# { binding = "KV", id = "abc123..." }

# 建立 preview（本地開發用）KV namespace
npx wrangler kv namespace create KV --preview
# → 輸出包含 preview_id，例如：
# { binding = "KV", preview_id = "def456..." }
```

將取得的 ID 填入 `wrangler.json`：

```json
{
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "<上方取得的 production id>",
      "preview_id": "<上方取得的 preview_id>"
    }
  ]
}
```

### 6.3 本地開發

```bash
# 啟動 Nuxt dev server（自動模擬 KV binding）
npm run dev

# 手動觸發 GitHub repos 同步到 KV
curl -X POST http://localhost:3000/api/cron/sync-repos

# 驗證 KV 讀取
curl http://localhost:3000/api/github
# → 應回傳 { success: true, data: [...], lastSync: "..." }
```

> **注意：** 本地 KV 資料存放在 `.wrangler/state/` 目錄，已加入 `.gitignore`。

### 6.4 Build + 部署

```bash
# 一鍵 build + 部署
npm run deploy

# 或分步執行
nuxt build                        # Build（preset 已設為 cloudflare_pages）
wrangler pages deploy dist        # 部署到 Cloudflare Pages
```

### 6.5 正式環境 Binding 設定

部署後需在 **Cloudflare Dashboard** 確認 binding：

1. 進入 **Workers & Pages** → 選擇專案
2. 點選 **Settings** → **Bindings**
3. 確認 KV namespace binding `KV` 已正確綁定到 production namespace

### 6.6 NPM Scripts 速查

| Script | 用途 |
|--------|------|
| `npm run dev` | 本地開發（自動模擬 KV） |
| `npm run build` | Build 產出 Cloudflare Pages 格式 |
| `npm run preview:cf` | Build + 本地 wrangler 模擬預覽 |
| `npm run deploy` | Build + 部署到 Cloudflare Pages |

---

## 7. 安全性 Checklist

- [ ] `.env` 已加入 `.gitignore`
- [ ] `.wrangler` 已加入 `.gitignore`
- [ ] 敏感金鑰使用 `NUXT_` 前綴
- [ ] 檔案上傳有做檔名清洗
- [ ] 後台頁面已掛載認證 Middleware
- [ ] API 輸入已驗證必填欄位
- [ ] 認證機制已替換為正式方案（JWT / Cookie）
