require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// CORS 設定：確保網域正確
app.use(cors({
  origin: 'https://art-echo-o-8ral.vercel.app'
}));

app.use(express.json());

// 雖然 Vercel 會清空 Map，但我們留著 send-code 邏輯來寄信
const store = new Map();

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

// 1. 寄信 API (維持原樣，讓你可以收到信)
app.post('/api/send-code', async (req, res) => {
  const { account } = req.body || {};
  if (!account) return res.status(400).json({ ok: false, message: '請輸入帳號' });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  
  try {
    const transporter = await transporterPromise;
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'ArtEcho <no-reply@artecho.local>',
      to: account,
      subject: 'ArtEcho 驗證碼',
      html: `<p>您的驗證碼為： <strong>${code}</strong></p>`
    });
    return res.json({ ok: true, message: '驗證碼已寄出' });
  } catch (err) {
    console.error('寄信失敗:', err);
    return res.status(500).json({ ok: false, message: '寄送失敗' });
  }
});

// 2. 登入 API (改成只要有輸入驗證碼就通過)
app.post('/api/login', (req, res) => {
  const { account, code } = req.body || {};

  // 核心改動：只要前端有傳 code 過來（不論是多少），都回傳成功
  if (code && code.length > 0) {
    console.log(`[通行授權] 帳號 ${account} 使用驗證碼 ${code} 嘗試登入，已強制放行。`);
    return res.json({ 
      ok: true, 
      message: '登入成功（快速通行模式）' 
    });
  }

  return res.status(400).json({ ok: false, message: '請輸入驗證碼' });
});

module.exports = app;
