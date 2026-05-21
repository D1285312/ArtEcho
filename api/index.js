import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { generateStoryScenario } from "./storyGenerator.js";

dotenv.config();

const app = express();

// 開發時允許 WebStorm preview 的 origin
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:63342',
  'http://127.0.0.1:63342',
  'https://art-echo-o-8ral.vercel.app/'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  }
}));

app.use(express.json({ limit: '1mb' }));

// 測試用健康檢查路由
app.get('/api/health', (req, res) => res.json({ ok: true, status: "伺服器運行中" }));

// 1. 聊天互動路由（串接 CHAT_GITHUB_TOKEN 與 CHAT_MODEL）
app.post('/api/chat', async (req, res) => {
  const token = process.env.CHAT_GITHUB_TOKEN;
  const endpoint = process.env.GITHUB_MODELS_BASE_URL || "https://models.github.ai/inference";

  if (!token) {
    return res.status(500).json({ error: '伺服器未設定 CHAT_GITHUB_TOKEN' });
  }

  const { systemPrompt, userMessage, chatHistory } = req.body || {};
  const messages = [];

  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  if (Array.isArray(chatHistory)) {
    chatHistory.forEach(m => {
      messages.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text });
    });
  }
  messages.push({ role: 'user', content: userMessage || '你好，我完成畫作了。' });

  try {
    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    const response = await client.path("/chat/completions").post({
      body: {
        messages: messages,
        model: process.env.CHAT_MODEL || "openai/gpt-4o-mini",
        max_tokens: 500,
        temperature: 0.7
      }
    });

    console.log(JSON.stringify(response.body, null, 2));

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || "模型呼叫失敗");
    }

    const content =
        response.body.choices?.[0]?.message?.content;

    const aiText =
        typeof content === "string"
            ? content
            : content?.map(c => c.text || "").join("");
    return res.json({ text: aiText });
  } catch (err) {
    console.error('API 錯誤:', err);
    return res.status(500).json({ error: 'AI 伺服器錯誤' });
  }
});

// 2. 繪畫故事劇情生成路由
// 💡 此處直接調用 storyGenerator.js，內部已完全與 STORY_GITHUB_TOKEN 和 STORY_MODEL 綁定
app.post('/api/story', async (req, res) => {
  // 💡 在這裡明確定義、明確讀取故事專用的環境變數
  const token = process.env.STORY_GITHUB_TOKEN;
  const model = process.env.STORY_MODEL || "openai/gpt-4o-mini";

  if (!token) {
    return res.status(500).json({ error: '伺服器未設定 STORY_GITHUB_TOKEN' });
  }

  const { style, feeling, prompt } = req.body || {};
  console.log(`🎨 收到故事生成請求 - 風格: ${style || '未指定'}, 心情: ${feeling || '未指定'}`);

  try {
    // 💡 把環境變數連同前端資料，一起封裝進物件傳過去
    const story = await generateStoryScenario({
      style,
      feeling,
      prompt,
      token, // 傳入 Token
      model  // 傳入指定的模型名稱
    });

    return res.json({ story });
  } catch (err) {
    console.error('❌ 劇情生成失敗:', err);
    return res.status(500).json({ error: err.message || 'AI 劇情生成失敗' });
  }
});

// 啟動伺服器
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 API 伺服器已啟動: http://localhost:${PORT}`));
}

// 這是 Vercel Serverless Functions 必須的匯出
export default app;