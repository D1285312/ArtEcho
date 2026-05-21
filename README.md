# ArtEcho | 深度故事創作與情緒共鳴系統

一個結合藝術治療概念與生成式 AI 的情感陪伴系統。它不只是一個繪圖工具，更是一個引導使用者透過視覺創作來察覺內在感受、記錄情緒軌跡的數位空間。

---
## 檔案結構說明

```text
├── CSS/                # 包含 styles.css, studio.css 等視覺樣式
├── js/
│   ├── analysisAPI.js   # 物理數據運算與形狀偵測核心
│   ├── brushEngine.js   # Canvas 渲染與筆觸效果引擎
│   ├── geminiService.js # AI 聊天與 Markdown 格式化處理
│   ├── storageManager.js# 作品儲存與 LocalStorage 管理
│   ├── Story.js         # 劇情腳本設定與章節切換邏輯
│   └── gallery.js       # 主頁佈置與拖拽功能模組
├── Studio.html          # 核心作畫空間
├── Gallery.html         # 個人雲端藝術庫
├── AnalysisSummary.html # 全維度報告生成頁面
├── Cloud_space.html     # 公開藝術畫廊
└── server.js            # Express 後端驗證伺服器
```

---
## 快速上手

1.  **安裝依賴** (針對後端伺服器)：
    ```bash
    npm install express cors nodemailer dotenv
    ```
2.  **設定環境變數**：
    建立 `.env` 檔案並填入您的 SMTP 資訊與 API Key。
3.  **啟動開發伺服器**：
    ```bash
    node server.js
    ```
4.  **瀏覽網頁**：
    直接開啟 `index.html` 即可開始您的情緒創作之旅。

---
## 未來展望
* [ ] 增加更多情境劇情選單（如：仙度瑞拉的眼淚）。
* [ ] 開放社群分享與「雲端點讚」互動功能。
* [ ] 導入多模態 AI 影像識別，提升更細緻的筆觸情感解讀。
