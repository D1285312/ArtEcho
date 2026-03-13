require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors({
  origin: 'https://art-echo-o-8ral.vercel.app'
}));

app.use(express.json());

// 暫存驗證資料
const store = new Map();
const CODE_TTL_MS = 5 * 60 * 1000; 

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
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

let transporterPromise = createTransporter();

app.post('/api/send-code', async (req, res) => {
  const { account, password } = req.body || {};
  if (!account) return res.status(400).json({ ok: false, message: '請輸入電子郵件' });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + CODE_TTL_MS;

  // 存入 Map
  store.set(account, { code, expiresAt });
  console.log(`[寄信] 帳號: ${account}, 產生的驗證碼: ${code}`);

  try {
    const transporter = await transporterPromise;
    const from = process.env.FROM_EMAIL || 'ArtEcho <no-reply@artecho.local>';
    await transporter.sendMail({
      from,
      to: account,
      subject: 'ArtEcho 驗證碼',
      html: `<p>您的驗證碼為： <strong>${code}</strong></p>`,
    });
    return res.json({ ok: true, message: '驗證碼已寄出' });
  } catch (err) {
    return res.status(500).json({ ok: false, message: '寄送失敗' });
  }
});

app.post('/api/login', (req, res) => {
  const { account, code } = req.body || {};
  
  // 檢查記憶體狀態
  const entry = store.get(account);
  console.log(`[登入嘗試] 帳號: ${account}, 記憶體中是否有資料: ${!!entry}`);

  if (!entry) {
    return res.status(400).json({ ok: false, message: '驗證碼已過期或伺服器重啟，請重新獲取' });
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(account);
    return res.status(400).json({ ok: false, message: '驗證碼已過期' });
  }

  // 僅比對驗證碼，不比對密碼
  if (entry.code !== String(code)) {
    return res.status(400).json({ ok: false, message: '驗證碼錯誤' });
  }

  store.delete(account);
  return res.json({ ok: true, message: '登入成功' });
});

module.exports = app;
