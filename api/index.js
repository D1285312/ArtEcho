require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// 1. CORS 設定：務必補上 .app 並確保沒有多餘斜槓
app.use(cors({
  origin: 'https://art-echo-o-8ral.vercel.app'
}));

app.use(express.json());

// 2. 暫存驗證資料 (注意：Vercel 重啟後 Map 會清空)
const store = new Map();
const CODE_TTL_MS = 5 * 60 * 1000; // 5 分鐘

// 3. 建立郵件傳送器
async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // 備用測試帳號 (如果環境變數沒抓到)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

let transporterPromise = createTransporter();

// 4. API 路由定義
// 基礎路徑檢查
app.get('/api', (req, res) => {
  res.json({ status: 'ArtEcho API is running' });
});

// 寄送驗證碼
app.post('/api/send-code', async (req, res) => {
  const { account, password } = req.body || {};
  if (!account || !password) {
    return res.status(400).json({ ok: false, message: 'account 與 password 必填' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + CODE_TTL_MS;

  // 儲存至記憶體
  store.set(account, { code, expiresAt, password });

  try {
    const transporter = await transporterPromise;
    const from = process.env.FROM_EMAIL || 'ArtEcho <no-reply@artecho.local>';
    const info = await transporter.sendMail({
      from,
      to: account,
      subject: 'ArtEcho 驗證碼',
      text: `您的驗證碼為： ${code}。此驗證碼會在五分鐘後失效。`,
      html: `<p>您的驗證碼為： <strong>${code}</strong></p><p>此驗證碼會在五分鐘後失效。</p>`,
    });

    return res.json({ ok: true, message: '驗證碼已寄出' });
  } catch (err) {
    console.error('send-code error', err);
    return res.status(500).json({ ok: false, message: '寄送驗證碼失敗' });
  }
});

// 登入驗證
app.post('/api/login', (req, res) => {
  const { account, password, code } = req.body || {};
  
  if (!account || !password || !code) {
    return res.status(400).json({ ok: false, message: '請輸入帳號、密碼與驗證碼' });
  }

  const entry = store.get(account);
  
  // 排查日誌：在 Vercel 控制台可以看到這個輸出
  console.log(`正在驗證帳號: ${account}, 記憶體中是否有紀錄: ${!!entry}`);

  if (!entry) {
    return res.status(400).json({ ok: false, message: '驗證碼不存在或已過期，請重新獲取' });
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(account);
    return res.status(400).json({ ok: false, message: '驗證碼已過期' });
  }

  if (entry.code !== String(code)) {
    return res.status(400).json({ ok: false, message: '驗證碼錯誤' });
  }

  if (entry.password !== password) {
    return res.status(400).json({ ok: false, message: '密碼錯誤' });
  }

  store.delete(account);
  return res.json({ ok: true, message: '登入成功' });
});

// 5. 重要：導出 app 供 Vercel 使用
module.exports = app;
