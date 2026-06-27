# 📐 Homepage Specs — 首頁設計規格

> **用途：** 定義網站首頁 `/` 的功能、UI 設計與互動規格。  
> **渲染模式：** SSG（Static Site Generation，`{ prerender: true }`）  
> **實作狀態：** ✅ 已完成

---

## 1. 頁面總覽

### 1.1 頁面目標

作為 JeffLin.dev 的入口，首頁需要：

- 🎨 **極致第一印象**：Premium Hacker 風格，深黑底 + 白線系，專業質感
- 🧩 **導航中心**：以互動式卡片引導訪客到各功能頁面
- ⚡ **零等待**：SSG 預渲染，秒開
- 🔤 **動態感**：名字 Scramble + 打字機效果，讓頁面活起來

### 1.2 路由與渲染策略

```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true },  // SSG 預渲染
}
```

---

## 2. 頁面結構

```
┌──────────────────────────────────────────────┐
│  [Glassmorphism Navbar — sticky]             │
├──────────────────────────────────────────────┤
│                                              │
│  Hero Section（3 欄 Grid）                   │
│  ┌─────┐  ┌──────────────────┐  ┌─────┐    │
│  │ TL  │  │   Hi, I'm        │  │ TR  │    │
│  │Card │  │   Jeff Lin       │  │Card │    │
│  └─────┘  │   > typewriter_  │  └─────┘    │
│  ┌─────┐  │   [CTA Button]   │  ┌─────┐    │
│  │ BL  │  └──────────────────┘  │ BR  │    │
│  │Card │                        │Card │    │
│  └─────┘                        └─────┘    │
│                                              │
├──────────────────────────────────────────────┤
│  [Footer]                                    │
└──────────────────────────────────────────────┘
```

---

## 3. Hero Section — `HeroSection.vue`

### 3.1 佈局

- **3 欄 Grid**（`1fr 1.6fr 1fr`），中央放自我介紹，四角放導航卡片
- 自動 radial gradient 背景虛化

### 3.2 名字 Scramble 效果

- 顯示「Jeff Lin」，先以隨機字元亂碼呈現，逐字解密還原
- 字元池：`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>`
- 迭代速率：45ms / 每次 `iteration += 1/3`
- 字體：`font-mono` + gradient（`from-text-primary to-text-secondary`）

### 3.3 打字機效果

循環打出以下短語：
1. `Full-Stack Developer 全端開發`
2. `Vue / Nuxt 愛好者`
3. `Java / Spring Boot & Python / FastApi`

- 打字速度：80ms / 刪除速度：20ms
- 換句停留：2000ms / 刪完等待：500ms
- 前綴 `> ` 符號 + 閃爍游標（`animate-blink`）

### 3.4 CTA 按鈕

- Filled 白底按鈕（`bg-white text-surface-primary`）
- 外部連結至 GitHub profile（`target="_blank"`）
- Hover：`bg-neutral-200` / Active：`scale(0.97)`

### 3.5 導航卡片（Hero 版 × 4）

| 位置 | 標題 | 連結 | Tags |
|------|------|------|------|
| 左上 (TL) | GitHub 專案 | `/github` | `repos`, `search` |
| 右上 (TR) | 關於我 | `/about` | `skills`, `stack` |
| 左下 (BL) | 聯繫方式 | `/contact` | `email`, `github` |
| 右下 (BR) | 精選作品 | `/github` | `portfolio` |

**卡片結構：**
- `PuzzleCardHeader` — 三圓點 + 檔名（模擬終端標題列）
- 標題 + 描述文字
- `PuzzleCardFooter` — Tag pills + 箭頭 `→`

**卡片互動（超厚 3D 浮起）：**
- 預設：`translateY(-4px)` + 多層 box-shadow
- Hover：`translateY(-12px)` + shadow 加厚 + `border-accent` + spotlight + shimmer
- 四角裝飾十字 `+`（hover 時旋轉 90° 淡入）

**進場動畫：**
- `fadeUpIn`（opacity + translateY + scale），時長 2.0s
- 交錯延遲：center 0s → TL 0.3s → TR 0.6s → BL 0.9s → BR 1.2s

### 3.6 響應式

| 斷點 | 佈局變化 |
|------|----------|
| ≥ 1024px | 3 欄 Grid（`1fr 1.6fr 1fr`），中央跨 2 列 |
| 640–1023px | 2 欄 Grid，中央置頂（`order: -1`） |
| < 640px | 單欄，中央在最上方 |

---

## 4. 共用子元件

### 4.1 `PuzzleCardHeader.vue`

```
Props: { filename: string }
UI: [●●●] filename.ts
```

### 4.2 `PuzzleCardFooter.vue`

```
Props: { tags: string[] }
UI: [tag1] [tag2]  →
- Hover 時 tag border 變亮、箭頭右移 1px
```

---

## 5. SEO 設定

```typescript
useSeoMeta({
  title: 'Jeff Lin — Full-Stack Developer',
  description: 'Jeff Lin — Full-Stack Developer。探索專案、了解技術棧、與我聯繫。',
  ogTitle: 'Jeff Lin — Full-Stack Developer',
  ogDescription: '用現代網路技術打造數位體驗。',
})
```

---

## 6. 檔案結構

```
app/
├── pages/
│   └── index.vue                 — 首頁主頁面
├── components/
│   ├── home/
│   │   └── HeroSection.vue       — Hero（scramble + 打字機 + 4 卡片）
│   └── puzzle/
│       ├── PuzzleCardHeader.vue   — 卡片標題列
│       └── PuzzleCardFooter.vue   — 卡片底部
```

> **注意：** `NavigationCards.vue` 目前存在但未在首頁使用（已被 HeroSection 整合取代）。

---

## 7. 完成清單

- [x] Hero Section 完整佈局（3 欄 Grid + 中央 Bio）
- [x] 名字 Scramble 解密動畫
- [x] 打字機效果（3 短語循環）
- [x] 4 張導航卡片（3D 浮起 + shimmer + spotlight）
- [x] PuzzleCardHeader / PuzzleCardFooter 共用元件
- [x] Staggered 進場動畫
- [x] 響應式設計（3 → 2 → 1 欄）
- [x] SEO (useSeoMeta)
- [x] SSG 預渲染
