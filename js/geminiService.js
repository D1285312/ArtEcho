// geminiService.js

function formatMarkdown(text) {
    if (!text) return "";
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

function getApiBaseUrl() {
    const isWebStormPreview = window.location.port === '63342';
    return isWebStormPreview ? 'http://localhost:3001' : '';
}

export const GeminiService = {
// =========================
// 聊天功能
// =========================
    async callChat({
        systemPrompt,
        userMessage,
        chatHistory,
        onLoading,
        onSuccess,
        onError
    }) {
        if (onLoading)
            onLoading(true);

        try {
            const fetchUrl = `${getApiBaseUrl()}/api/chat`;
            console.log("聊天 API:", fetchUrl);
            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    systemPrompt,
                    userMessage,
                    chatHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `伺服器錯誤: ${response.status}`);
        }

        const data = await response.json();
        if (onLoading)
            onLoading(false);
        if (data.error) {
            if (onError)
                onError(data.error);
            return;
        }

        if (data.text) {
            const formattedText = formatMarkdown(data.text);
            if (onSuccess) {onSuccess(formattedText, data.text);
            }
        }

        } catch (err) {
            console.error("聊天 API 異常:", err);
            if (onLoading) onLoading(false);
            if (onError) {
                onError(err.message || "聊天 API 連線失敗");
            }
        }
    },

// =========================
// 劇情生成
// =========================
async generateStory({
    style,
    feeling,
    prompt,
    onLoading,
    onSuccess,
    onError
}) {
    if (onLoading)
        onLoading(true);
    try {
        const fetchUrl = `${getApiBaseUrl()}/api/story`;
        console.log("故事 API:", fetchUrl);
        const response =
            await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    style,
                    feeling,
                    prompt
                })
            });
            if (!response.ok) {
                const errorData =
                    await response.json()
                        .catch(() => ({}));
                throw new Error(
                    errorData.error ||
                    `伺服器錯誤: ${response.status}`
                );
            }

            const data = await response.json();
            if (onLoading)
                onLoading(false);
            if (data.error) {
                if (onError)
                    onError(data.error);
                return;
            }

            if (data.story) {
                if (onSuccess)
                    onSuccess(data.story);
            }

        } catch (err) {
            console.error(
                "故事 API 異常:",
                err
            );
            if (onLoading)
                onLoading(false);
            if (onError) {
                onError(
                    err.message ||
                    "故事生成失敗"
                );
            }
        }
    }
};
