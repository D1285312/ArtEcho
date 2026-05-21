//  Express 後端：處理 /api/login（已關閉驗證碼功能）
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://art-echo-ten.vercel.app'
}));
app.use(express.json());
const PORT = process.env.PORT || 3000;

// 【新增】測試用帳號密碼資料庫 (實務上應從資料庫讀取並加密)
const USERS_DB = {
  "test@example.com": "password123",
  "admin@artecho.com": "admin2026"
};

// 註解或刪除原本的 /api/send-code，因為不需要寄信了
app.post('/api/send-code', (req, res) => {
  return res.json({ ok: true, message: '驗證碼功能已關閉，請直接登入' });
});

// 修改後的登入 API：只檢查帳號與密碼
app.post('/api/login', (req, res) => {
  const { account, password } = req.body || {};

  // 1. 檢查必填欄位
  if (!account || !password) {
    return res.status(400).json({ ok: false, message: 'account 與 password 必填' });
  }

  // 2. 檢查帳號是否存在
  const correctPassword = USERS_DB[account];
  if (!correctPassword) {
    return res.status(400).json({ ok: false, message: '帳號不存在' });
  }

  // 3. 檢查密碼是否正確
  if (correctPassword !== password) {
    return res.status(400).json({ ok: false, message: '密碼錯誤' });
  }

  // 驗證成功
  return res.json({ ok: true, message: '登入成功' });
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});