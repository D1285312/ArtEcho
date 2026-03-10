/**
 * ArtEcho 資料管理中心
 * 負責畫作儲存、讀取與資料格式統一
 */
export const StorageManager = {
    DB_KEY: "artEchoGallery",

    /**
     * 儲存作品到 LocalStorage
     * @param {Object} data - 包含畫作所有資訊的物件
     */
    saveWork(data) {
        const { storyId, level, dataUrl, stats, chatLog, startTime, name, shapes } = data;

        // 統一計算作畫時長
        const endTime = Date.now();
        const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

        // 讀取舊資料
        let works = JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");

        // 封裝新作品物件
        const newWork = {
            id: Date.now(),
            storyId: storyId,
            level: level,
            dataUrl: dataUrl,
            stats: stats,
            chatLog: chatLog,
            duration: duration, // 確保畫廊讀得到這個欄位
            name: name || '',          // 自動命名
            shapes: shapes || [],      // 形狀偵測結果
            timestamp: new Date().toLocaleString()
        };

        works.push(newWork);

        // 限制儲存數量，避免空間炸掉 (保留最近 30 張)
        localStorage.setItem(this.DB_KEY, JSON.stringify(works.slice(-30)));

        // 紀錄最後進度
        localStorage.setItem("ArtEcho_LastLevel", level);

        return newWork;
    },

    /**
     * 讀取所有作品
     */
    getAllWorks() {
        return JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");
    }
};