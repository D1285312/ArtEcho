/**
 * ArtEcho Gemini AI 服務模組
 * 封裝了 API 呼叫邏輯，並內建 Markdown 渲染工具
 */
export const GeminiService = {
    /**
     * API KEY 讀取邏輯
     * 在 Vercel 部署環境中，會嘗試讀取系統變數
     * 如果是純前端專案且未使用 Vite 等工具，import.meta.env 可能為 undefined
     */
    apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
            ? import.meta.env.VITE_GEMINI_API_KEY 
            : "", // 如果環境變數不存在，請在此處手動輸入本地測試金鑰（切記勿推送到 GitHub）

    /**
     * 格式化 Markdown 語法
     * 將 **粗體** 轉換為 HTML 的 <b> 標籤
     */
    formatMarkdown(text) {
        if (!text) return "";
        // 1. 處理粗體
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        // 2. 處理換行
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    },

    /**
     * 核心呼叫函數
     */
    async call({ systemPrompt, userMessage, chatHistory, onLoading, onSuccess, onError }) {
        if (!this.apiKey || this.apiKey === "YOUR_API_KEY") {
            if (onError) onError("API Key 尚未設定，請檢查 Vercel 環境變數。");
            return;
        }

        if (onLoading) onLoading(true);

        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] }
        ];

        // 建立對話歷史
        chatHistory.forEach(m => {
            contents.push({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.text }]
            });
        });

        // 加入當前使用者訊息
        const finalUserText = userMessage || "你好，我完成畫作了。";
        contents.push({ role: "user", parts: [{ text: finalUserText }] });

        try {
            // 使用 gemini-1.5-flash 以確保穩定性與速度
            const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });

            const data = await response.json();

            if (onLoading) onLoading(false);

            if (data.error) {
                if (onError) onError(data.error.message);
                return;
            }

            if (data.candidates && data.candidates[0].content) {
                const aiRawText = data.candidates[0].content.parts[0].text;

                // 在回傳成功前，先進行格式化
                const formattedText = this.formatMarkdown(aiRawText);

                // 回傳格式化後的文字，以及原始文字(備用)
                if (onSuccess) onSuccess(formattedText, aiRawText);
            } else {
                if (onError) onError("AI 未能生成回應，請稍後再試。");
            }
        } catch (err) {
            if (onLoading) onLoading(false);
            if (onError) onError("網路連線異常，請檢查網路狀態。");
        }
    }
};
