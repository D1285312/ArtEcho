//  Express 後端：處理 /api/send-code 與 /api/login（含寄信）
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors({
  origin: 'https://art-echo-ten.vercel.app' // 或者是你的自定義網域
}));
app.use(express.json());
const PORT = process.env.PORT || 3000;

// 暫存驗證資料：account -> { code, expiresAt, password }
const store = new Map();
const CODE_TTL_MS = 5 * 60 * 1000; // 5 分鐘

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

  // 若未提供 SMTP 設定，建立 Ethereal 測試帳號（開發用）
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

app.post('/api/send-code', async (req, res) => {
  const { account, password } = req.body || {};
  if (!account || !password) {
    return res.status(400).json({ ok: false, message: 'account 與 password 必填' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + CODE_TTL_MS;

  // 儲存暫存資訊
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

    const resp = { ok: true, message: '驗證碼已寄出' };

    // 如果使用 ethereal，回傳預覽連結（方便開發）
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      resp.previewUrl = nodemailer.getTestMessageUrl(info);
    }

    return res.json(resp);
  } catch (err) {
    console.error('send-code error', err);
    return res.status(500).json({ ok: false, message: '寄送驗證碼失敗' });
  }
});

app.post('/api/login', (req, res) => {
  const { account, password, code } = req.body || {};
  if (!account || !password || !code) {
    return res.status(400).json({ ok: false, message: 'account, password, code 三項皆需提供' });
  }

  const entry = store.get(account);
  if (!entry) {
    return res.status(400).json({ ok: false, message: '驗證碼不存在或已過期' });
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

  // 驗證成功，清除暫存並回傳成功
  store.delete(account);
  return res.json({ ok: true, message: '登入成功' });
});

// 清理過期項目的簡單排程
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.expiresAt <= now) store.delete(k);
  }
}, 60 * 1000);

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});

