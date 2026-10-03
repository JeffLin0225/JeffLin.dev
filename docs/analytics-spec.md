# 公開流量統計頁 Spec（Cloudflare Analytics Engine + KV 快取）

> 狀態：草案，待實作
> 目標：在 jxlin.dev 上做一個**公開**的流量統計頁，作為作品集的一部分。
> 核心原則：**不收集個人資料。** 原始 IP 從不寫入任何儲存。

---

## 1. 設計前提

這個頁面是**公開的**，任何人都能看。整份設計由這一點推導出來 —— 它跟「只給自己看的後台儀表板」是兩種不同的東西，不能混用同一套資料模型。

### 1.1 不存 IP，而不是「存了但不顯示」

原始 IP 只在請求處理期間存在於記憶體，用來計算每日輪替的訪客雜湊後立即丟棄，**不寫入 Analytics Engine**。

```
visitor_hash = SHA256(ip + ua + VISITOR_SALT + 'YYYY-MM-DD')[0..16]
```

這個決定的連鎖效果：
- 不持有個資 → 不需要保留期清理、不需要處理刪除請求
- 不需要 cookie（session 不落地）→ 不需要 cookie 同意橫幅
- 隱私權說明只需要一小段，而不是一份政策
- 不會因為某個 endpoint 寫錯而洩漏 —— 資料庫裡本來就沒有

加日期的代價：算不出「回訪者」，不重複訪客的定義是「單日不重複」。這是刻意的取捨。

`VISITOR_SALT` 必須是 server-only 環境變數。外洩的話雜湊可被暴力反推（IPv4 空間小）。

### 1.2 公開頁面上不能出現的東西

| 不放 | 原因 |
|---|---|
| 城市 | 低流量站「台北市 · 2 分鐘前 · /github」等於指認單一個人 |
| 即時訪客列表 | 時間 + 來源 + 頁面的組合就是追蹤記錄 |
| 完整 referrer URL | 會洩漏**訪客端**的內部網址（私人 Notion 頁、公司工具、帶 token 的連結）|
| ASN / ISP 名稱 | 搭配時間窗一樣可縮小到個人 |

→ 地理只到**國家**；referrer 只存 **hostname**，解析後丟棄 path 與 query；要表現「活著」用「過去 24 小時 N 次瀏覽」這種聚合數字，不用個別事件。

### 1.3 為什麼是 Analytics Engine 而不是 D1

需求已經確認不需要回查個別訪客，那 D1 的優勢（逐筆原始紀錄、可 UPDATE/DELETE）全部用不到，剩下的只有成本：要寫 migration、要自己管保留期、要寫清理 cron。

Analytics Engine 對這個需求更合適：
- 寫入只有一個 `writeDataPoint` 呼叫，不需要 schema migration
- 保留期固定 3 個月，自動過期，**不需要寫清理 cron**（Pages 也沒有原生 Cron Triggers）
- Workers Free 每日 10 萬筆寫入 / 1 萬次查詢，目前官方尚未開始計費
- 只能 append、不能改不能刪 —— 在「不存個資」的前提下，這從缺點變成**特性**：資料結構上就不可能累積可變的個人資料

代價：高流量時會自動降採樣（查詢需用 `SUM(_sample_interval)` 加權還原）。以本站規模幾乎不會觸發，但不重複訪客的 `COUNT(DISTINCT)` 在取樣情況下會失準，屬已知限制。

---

## 2. 架構

```
瀏覽器
  │  路由變化
  ▼
app/plugins/analytics.client.ts
  │  POST /api/track
  ▼
server/api/track.post.ts ──── CF-Connecting-IP ──► 算雜湊 ──► 丟棄 IP
  │  waitUntil(writeDataPoint)
  ▼
Analytics Engine (ANALYTICS binding)
  ▲
  │  SQL API（僅快取失效時，每天最多 144 次）
  │
server/api/stats.get.ts ◄──── KV 快取（10 分鐘 TTL）
  │  JSON
  ▼
app/pages/stats.vue（公開頁面）
```

讀取路徑刻意不讓公開頁面直接打 Analytics Engine：查詢要走 Cloudflare REST API（需 Account ID + API Token），頁面一公開就會有爬蟲流量，既吃查詢額度也讓每次載入多等一個外部請求。KV binding 專案裡已經有，拿來當快取層零新增配置。

---

## 3. 資料模型（Analytics Engine）

Analytics Engine 的欄位是位置式的，沒有名稱。**這張對照表就是 schema，修改欄位順序會讓歷史資料對不上，只能新增不能重排。**

| 欄位 | 內容 | 範例 |
|---|---|---|
| `blob1` | 路徑（正規化，不含 query）| `/github` |
| `blob2` | referrer hostname（站內與空值記 `direct`）| `google.com` |
| `blob3` | 國家代碼 | `TW` |
| `blob4` | 裝置類型 | `desktop` / `mobile` / `tablet` |
| `blob5` | 瀏覽器 | `Chrome` |
| `blob6` | 作業系統 | `macOS` |
| `blob7` | 訪客雜湊（每日輪替）| `a3f2c9d1...` |
| `double1` | 固定為 `1`，供加權計數 | `1` |
| `indexes[0]` | 路徑（取樣鍵）| `/github` |

取樣鍵選路徑：取樣會按 index 分別套用，熱門頁面被取樣時不影響冷門頁面的準確度。

**不收集的欄位**：IP、城市、地區、ASN、完整 URL、螢幕尺寸、語言。前兩者是隱私考量，後兩者是公開頁面用不到就不收。

---

## 4. 檔案清單

| 檔案 | 動作 | 說明 |
|---|---|---|
| `wrangler.json` | 修改 | 新增 `analytics_engine_datasets` binding `ANALYTICS` |
| `nuxt.config.ts` | 修改 | server-only runtimeConfig：`visitorSalt`、`cfAccountId`、`cfAnalyticsToken` |
| `server/types/cloudflare.d.ts` | 修改 | env 加上 `ANALYTICS: AnalyticsEngineDataset` |
| `server/utils/analytics.ts` | 新增 | `hashVisitor()`、`parseUserAgent()`、`isBot()`、`normalizePath()`、`refererHost()` |
| `server/utils/useAnalyticsSQL.ts` | 新增 | 封裝 Analytics Engine SQL API 查詢 |
| `server/api/track.post.ts` | 新增 | 寫入端點 |
| `server/api/stats.get.ts` | 新增 | 讀取端點（KV 快取）|
| `app/plugins/analytics.client.ts` | 新增 | 前端 beacon |
| `app/composables/useSiteStats.ts` | 新增 | 比照 `useGithubRepos.ts` 的資料管理慣例 |
| `app/pages/stats.vue` | 新增 | 公開統計頁 |

沒有 migration、沒有 cron、沒有 GitHub Actions 排程 —— 保留期由平台處理。

---

## 5. 介面契約

### `POST /api/track`

Header：`x-internal-token`（沿用 `server/middleware/auth.ts` 現有機制，不需改 middleware）

Body：
```ts
{
  path: string        // location.pathname，必填
  referrer?: string   // document.referrer 完整值，由伺服器端解析成 hostname
}
```

Response：`204 No Content`

規則：
- `path` 缺少或非 `/` 開頭 → 400；長度上限 256，超出截斷
- 國家、裝置、瀏覽器、OS、時間**一律由伺服器端從 header 推導**，不接受前端傳入
- `referrer` 由伺服器端 `new URL()` 取 hostname，解析失敗或 host 等於自己 → `direct`
- `isBot(ua)` 命中則直接回 204，**不寫入**
- binding 不存在（本機無 wrangler）→ 回 204 不報錯
- `writeDataPoint()` 回傳 `void`、本身即為非阻塞的 fire-and-forget，**不需要 `waitUntil()`**
  （草案原本寫要包 `waitUntil`，實作時確認那是多餘的）

伺服器端取值：
```ts
const cf = event.context.cloudflare
const ip = getHeader(event, 'cf-connecting-ip')        // 僅用於算雜湊，不儲存
const country = cf?.request?.cf?.country as string
```

### `GET /api/stats`

**公開端點**，但仍帶 `x-internal-token`（前端 composable 帶上，與 `useGithubRepos.ts` 一致）。回傳內容全是聚合數字，不含任何可指認個人的欄位。

Response：
```ts
{
  success: true,
  updatedAt: string,                 // 快取產生時間，ISO 8601
  totals: {
    views30d: number,
    visitors30d: number,
    views24h: number,
  },
  byDay: Array<{ day: string; views: number; visitors: number }>,   // 近 30 天
  topPages:     Array<{ path: string; views: number }>,             // Top 5
  topReferrers: Array<{ host: string; views: number }>,             // Top 5，hostname only
  countries:    Array<{ code: string; views: number }>,             // Top 8
  devices:      Array<{ type: string; views: number }>,
}
```

快取行為：
- KV key `stats:public:v1`，TTL 600 秒
- 命中 → 直接回傳
- 未命中 → 查 Analytics Engine → 寫回 KV → 回傳
- **查詢失敗時若 KV 有過期舊值，回傳舊值並附上 `updatedAt`**，不要讓頁面壞掉；兩者都沒有才回 503

查詢一律用 `SUM(_sample_interval)` 而非 `COUNT(*)` 以還原取樣。

---

## 6. 前端行為

### `app/plugins/analytics.client.ts`
- `router.afterEach` + plugin 初始化時補送首次載入
- `$fetch` 搭配 `keepalive: true`，header 帶 `x-internal-token`
- **不能用 `navigator.sendBeacon`** —— 無法設自訂 header，會被 `auth.ts` 擋成 401
- `import.meta.dev` 直接 return，本機開發不污染資料
- `navigator.doNotTrack === '1'` 時不送出
- 失敗完全靜默（`.catch(() => {})`）
- 同路徑 1 秒內重複觸發忽略（防 page transition 重複送）
- **排除 `/stats` 自己**，避免統計頁自我計數造成虛高

### `app/pages/stats.vue`

顯示區塊（由上而下）：
1. 三個大數字：近 30 天瀏覽量 / 近 30 天不重複訪客 / 過去 24 小時瀏覽量
2. 近 30 天趨勢（長條圖，純 CSS 或 inline SVG，不引入圖表套件）
3. 熱門頁面 Top 5（比例條）
4. 流量來源 Top 5（hostname）
5. 國家分布 Top 8（清單 + 比例條，**不做地圖** —— 手機上難用且對這個頁面是過度投資）
6. 裝置分布
7. **「這是怎麼做的」說明區塊** ← 作品集價值的實際所在

第 7 區塊要寫的內容：資料流（beacon → Analytics Engine → KV 快取 → 本頁）、更新頻率（10 分鐘）、以及**刻意不收集 IP／城市／完整 referrer 的理由**。這段比任何數字都更能展示工程判斷，不要省略。

UI 慣例沿用專案現有的 Tailwind token（`bg-surface-primary` 等）與 `/* ─── 區塊 ─── */` 註解風格。空資料狀態要處理（剛上線時全是 0），比照 `app/components/github/EmptyState.vue`。

---

## 7. 建置步驟

```bash
# 1. wrangler.json 加入 binding（dataset 不需預先建立，首次寫入自動產生）
#    "analytics_engine_datasets": [{ "binding": "ANALYTICS", "dataset": "jxlin_pageviews" }]

# 2. 建立查詢用的 API Token
#    Cloudflare Dashboard → My Profile → API Tokens → Create Token
#    權限：Account → Account Analytics → Read

# 3. Pages 專案環境變數（Settings → Environment variables，全部設為 Secret）
#    NUXT_VISITOR_SALT       = <隨機 32 字元>
#    NUXT_CF_ACCOUNT_ID      = <Account ID>
#    NUXT_CF_ANALYTICS_TOKEN = <上一步的 token>

# 4. 驗證寫入（部署後瀏覽網站，再查）
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $TOKEN" \
  -d "SELECT blob1 AS path, SUM(_sample_interval) AS views
      FROM jxlin_pageviews WHERE timestamp > NOW() - INTERVAL '1' DAY
      GROUP BY path ORDER BY views DESC"
```

`nitro-cloudflare-dev` 已安裝，`nuxt dev` 下 binding 會接到 miniflare 本機實例（本機寫入不會進正式 dataset）。

---

## 8. 分階段實作

**階段一 — 讓資料開始累積**
`wrangler.json` binding + `cloudflare.d.ts` + `analytics.ts` + `track.post.ts` + `analytics.client.ts`
驗收：部署後瀏覽網站，用上方 curl 查得到自己剛才的瀏覽紀錄，且**回傳欄位中不存在 IP**。

**階段二 — 頁面上線**
`useAnalyticsSQL.ts` + `stats.get.ts` + `useSiteStats.ts` + `stats.vue`
驗收：`/stats` 公開可見，數字正確，重新整理第二次是 KV 命中（回應明顯更快），`updatedAt` 10 分鐘內不變。

**階段三 — 打磨**
趨勢圖、空資料狀態、「這是怎麼做的」說明、footer 隱私權一行說明、`/stats` 加上 `routeRules` 的 SWR 快取。

---

## 9. 隱私檢查清單

- [ ] 原始 IP 在任何儲存中都不存在（Analytics Engine 寫入欄位不含 IP）
- [ ] 不使用 cookie 與 localStorage
- [ ] 地理資訊只到國家層級，不含城市與 ASN
- [ ] referrer 只保留 hostname
- [ ] `visitor_hash` 每日輪替，無法跨日追蹤
- [ ] `VISITOR_SALT`、`CF_ANALYTICS_TOKEN` 為 server-only，不在 `runtimeConfig.public`
- [ ] 尊重 `navigator.doNotTrack`
- [ ] footer 一行隱私權說明，連到 `/stats` 的說明區塊
- [ ] `/api/stats` 回傳內容逐欄檢查過，無可指認個人的資料

---

## 10. 已知取捨

- **算不出回訪者**：`visitor_hash` 每日輪替的代價，換取「不持有個資」。
- **取樣會讓不重複訪客失準**：`COUNT(DISTINCT)` 在降採樣下不準確；本站規模幾乎不觸發，但數字應理解為估計值而非精確值。公開頁面上可標註「估計值」。
- **資料只留 3 個月**：平台固定保留期。想保留長期趨勢，日後可加一個把每日彙總寫進 KV 的工作，但現階段不做。
- **擋不住刻意灌假資料**：`/api/track` 是公開端點，token 在前端 bundle 內可見。緩解靠 CORS origin 限制與 bot 過濾，無法根治；個人作品集網站可接受。
- **UA 解析是粗略字串比對**：不引入 ua-parser-js（增加 Worker bundle 與冷啟動），只做大分類。
- **漏掉關閉 JS 的訪客**：代價是順便過濾掉大部分爬蟲，划算。
- **欄位順序不可重排**：Analytics Engine 位置式欄位的後果，新增欄位只能往後接。
