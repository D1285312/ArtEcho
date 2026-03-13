/**
 * ArtEcho Gemini AI 服務模組
 * 封裝了 API 呼叫邏輯，並內建 Markdown 渲染工具
 */
export const GeminiService = {
    // API KEY
    apiKey: "YOUR_API_KEY",

    /**
     * 格式化 Markdown 語法
     * 將 **粗體** 轉換為 HTML 的 <b> 標籤
     */
    formatMarkdown(text) {
        if (!text) return "";
        // 1. 處理粗體
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        // 2. 處理換行 (選配：讓 AI 的分段更自然)
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    },

    /**
     * 核心呼叫函數
     */
    async call({ systemPrompt, userMessage, chatHistory, onLoading, onSuccess, onError }) {
        if (onLoading) onLoading(true);

        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] }
        ];

        chatHistory.forEach(m => {
            contents.push({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.text }]
            });
        });

        const finalUserText = userMessage || "你好，我完成畫作了。";
        contents.push({ role: "user", parts: [{ text: finalUserText }] });

        try {
            const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

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
            }
        } catch (err) {
            if (onLoading) onLoading(false);
            if (onError) onError("網路連線異常，請檢查網路狀態。");
        }
    }
};