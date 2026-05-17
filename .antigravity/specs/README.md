# 📚 SDD 文件索引 — Software Design Documents

> **本目錄為專案的唯一規格書來源（Single Source of Truth）。**  
> 所有開發、設計、AI 協作均以此目錄下的文件為準。

---

## 文件清單

| 文件 | 用途 | 適用時機 |
|------|------|----------|
| `project_specs.md` | 技術規格與 Code Style 規範 | 開新專案、寫任何程式碼前必讀 |
| `homepage_specs.md` | 首頁 `/` 設計規格（✅ 已完成） | 維護或修改首頁時查閱 |
| `github_page_specs.md` | GitHub 專案頁 `/github` 設計規格 | 開發 GitHub 專案探索頁時查閱 |
| `ui_reference.html` | UI 元件參考庫（可在瀏覽器開啟） | 實作 UI 元件時對照樣式 |

---

## 文件依賴關係

```
project_specs.md（全域技術標準）
├── Section 0: CSS/UIUX 設計標準 ──→ ui_reference.html（實作參考）
├── Section 1: 框架與技術選型
├── Section 2: Code Style 規範
├── Section 3: 架構規範
├── Section 4: 環境變數規範
├── Section 5: 設定檔範本
├── Section 6: 部署流程
└── Section 7: 安全性 Checklist

homepage_specs.md（首頁 /）
├── Hero Section + Scramble + 打字機
├── 導航卡片 ──→ project_specs.md Section 0（設計標準）
└── SEO + 響應式          ──→ ui_reference.html（元件樣式）

github_page_specs.md（GitHub 頁 /github）
├── Section 1-4: 功能與資料架構 ──→ project_specs.md Section 1（技術棧）
├── Section 5: UI 設計 ──→ project_specs.md Section 0（設計標準）
│                       ──→ ui_reference.html（元件樣式）
├── Section 6-8: 響應式 / SEO / 資料流
├── Section 9: 檔案結構
└── Section 10-11: 依賴 / Phase 規劃
```

---

## 快速導覽

### 🆕 我要開始一個新頁面
1. 先讀 `project_specs.md` — 確認技術選型與 Code Style
2. 建立該頁面的 `<page>_specs.md` — 定義功能、資料流與 UI
3. 開發時參考 `ui_reference.html` — 確保 UI 品質

### 🎨 我要調整 UI 樣式
1. 開啟 `ui_reference.html`（瀏覽器預覽）
2. 對照 `project_specs.md` Section 0 的 Design Token

### 🔌 我要新增 API
1. 查閱 `project_specs.md` Section 2.4 — Server API 結構
2. 查閱對應頁面的 specs — 現有 API 設計
3. 確認 KV 儲存結構：對應頁面 specs 的資料架構章節

### 🚀 我要部署
1. 依照 `project_specs.md` Section 6 的部署流程
2. 確認 `project_specs.md` Section 7 的安全性 Checklist

---

## 相關目錄

| 目錄 | 用途 |
|------|------|
| `skills/` | AI 可重複執行的複雜任務指令 |
| `scripts/` | 開發用測試指令（curl、jq 等） |
