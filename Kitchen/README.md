# SAKURA Kitchen — Vue 3 + Vite + SQLite CMS

台灣櫻花廚房電器行銷落地頁，含 **SQLite 後端** 與 **內容管理後台**。

## 功能

- **前台** `/`：產品分類、推薦系列、Hero 主視覺（由 API 載入）
- **後台** `/admin`：編輯文案、上傳圖片、管理推薦系列

## 快速開始

```bash
cd Kitchen
cp .env.example .env   # 可選，修改管理密碼
npm install
npm run dev:all        # 同時啟動 API :3001 與 Vite :5173
```

Repo 根目錄：`npm run dev`（等同 `dev:all`）

- 前台：http://localhost:5173/
- 管理：http://localhost:5173/admin  
- 預設密碼：`kitchen-admin`（見 `.env` 的 `ADMIN_PASSWORD`）

## 架構

```
Kitchen/
├── server/           # Express + better-sqlite3
│   ├── index.js
│   ├── db.js
│   └── routes/
├── data/             # kitchen.db（自動建立）
├── public/images/    # 上傳的產品圖
└── src/
    ├── views/        # SiteView、AdminView
    ├── api/          # fetch 客戶端
    └── components/   # 前台區塊
```

## API 摘要

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/catalog` | 前台完整目錄 |
| POST | `/api/admin/login` | 管理登入 |
| GET | `/api/admin/catalog` | 管理用詳細資料 |
| PUT | `/api/admin/site` | 更新 Hero / 分類介紹 |
| PUT | `/api/admin/categories/:slug` | 更新分類 |
| PUT | `/api/admin/products/:id` | 更新推薦系列 |
| POST | `/api/admin/upload` | 上傳圖片 → `/images/...` |

## 正式環境

```bash
npm run build
npm run start   # 提供 dist + API（port 3001）
```

建議以反向代理將網站與 `/api`、`/images` 指到同一服務。
