import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

function extractJson(text) {
  if (!text) throw new Error("AI 沒有回傳內容");
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI 回傳內容不是 JSON 格式");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function normalizeStory(story, fallback) {
  const chapters = Array.isArray(story.chapters) ? story.chapters : [];
  if (chapters.length !== 4) {
    throw new Error("AI 必須產生四個章節");
  }

  return {
    title: String(story.title || fallback.title).slice(0, 30),
    description: String(story.description || fallback.description).slice(0, 140),
    intro: {
      question: String(story.intro?.question || "準備好進入這段故事了嗎？").slice(0, 80),
      options: [
        ...(Array.isArray(story.intro?.options) ? story.intro.options : []),
        "我準備好了",
        "慢慢靠近",
        "先觀察看看"
      ].slice(0, 3).map(option => String(option).slice(0, 18))
    },
    chapters: chapters.reduce((acc, chapter, index) => {
      const level = String(index + 1);
      acc[level] = {
        title: String(chapter.title || `第${level}章`).slice(0, 32),
        desc: String(chapter.desc || chapter.description || "").slice(0, 220)
      };
      return acc;
    }, {})
  };
}

export async function generateStoryScenario({ style, feeling, prompt, token, model}) {
  const endpoint = process.env.GITHUB_MODELS_BASE_URL || "https://models.github.ai/inference";

  if (!token) {
    throw new Error("缺少 STORY_GITHUB_TOKEN，無法呼叫故事生成模型");
  }

  const fallback = {
    title: `屬於你的${style || "魔法"}故事`,
    description: "一段依照你的心情與想像生成的四章繪畫旅程。"
  };

  const systemPrompt = [
    "你是 ArtEcho 的兒少友善劇情設計師。",
    "請用繁體中文生成適合作畫引導的故事，不要寫恐怖、血腥、成人或過度創傷內容。",
    "故事要像官方劇情卡片一樣：短、清楚、有畫面感，讓使用者能依章節畫圖。",
    "只能輸出 JSON，不要 Markdown，不要多餘說明。"
  ].join("\n");

  const userMessage = `
請根據以下資料生成一個四章節繪圖劇情：
- 風格：${style || "魔法奇幻"}
- 心情：${feeling || "好奇探索"}
- 使用者想法：${prompt || "沒有提供，請自由發揮"}

JSON 格式必須完全符合：
{
  "title": "故事標題，12字以內",
  "description": "故事卡片描述，60字以內",
  "intro": {
    "question": "進入故事前的提問，40字以內",
    "options": ["第一個短選項", "第二個短選項", "第三個短選項"]
  },
  "chapters": [
    { "title": "第1章標題", "desc": "第1章作畫劇情，80字以內" },
    { "title": "第2章標題", "desc": "第2章作畫劇情，80字以內" },
    { "title": "第3章標題", "desc": "第3章作畫劇情，80字以內" },
    { "title": "第4章標題", "desc": "第4章作畫劇情，80字以內" }
  ]
}
`;

  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model,
      max_tokens: 1400,
      temperature: 0.3
    }
  });

  /*console.log(JSON.stringify(response.body, null, 2));
*/
  if (isUnexpected(response)) {
    throw new Error(response.body.error?.message || "故事生成模型呼叫失敗");
  }

  const aiText = response.body.choices?.[0]?.message?.content;
  return normalizeStory(extractJson(aiText), fallback);
}
