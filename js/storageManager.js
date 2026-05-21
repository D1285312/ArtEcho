/**
 * 資料管理中心
 * 畫作儲存、讀取與資料格式統一
 */
export const StorageManager = {
    DB_KEY: "artEchoGallery",

    /**
     * 儲存作品到 LocalStorage
     * @param {Object} data - 包含畫作所有資訊的物件
     */
    saveWork(data) {
        const {
            id,
            storyId,
            storyTitle,
            level,
            dataUrl,
            stats,
            chatLog,
            startTime,
            duration,
            name,
            shapes,
            description,
            objectTime,
            shared,
            createdAt
        } = data;

        const endTime = Date.now();
        const finalDuration =
            typeof duration === "number"
                ? duration
                : (startTime ? Math.floor((endTime - startTime) / 1000) : 0);

        let works = JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");

        const newWork = {
            id: id || `work_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            storyId: storyId || "",
            storyTitle: storyTitle || "",
            level: level ?? "",
            dataUrl: dataUrl || "",
            stats: stats || {},
            chatLog: chatLog || [],
            duration: finalDuration,
            name: name || "",
            shapes: shapes || [],
            objectTime: objectTime || [],
            description: description || "",
            shared: typeof shared === "boolean" ? shared : false,
            createdAt: createdAt || new Date().toISOString(),
            timestamp: new Date().toLocaleString()
        };

        works.push(newWork);

        // 限制儲存數量，避免空間炸掉 (保留最近 30 張)
        localStorage.setItem(this.DB_KEY, JSON.stringify(works.slice(-10)));

        // 紀錄最後進度
        if (level !== undefined && level !== null && level !== "") {
            localStorage.setItem("ArtEcho_LastLevel", level);
        }

        return newWork;
    },

    /**
     * 讀取所有作品
     */
    getAllWorks() {
        const works = JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");
        return works.map(work => ({
            ...work,
            shared: !!work.shared
        }));
    },

    /**
     * 更新單一作品
     */
    updateWork(id, patch = {}) {
        let works = this.getAllWorks();
        let updatedWork = null;

        works = works.map(work => {
            if (String(work.id) === String(id)) {
                updatedWork = { ...work, ...patch };
                return updatedWork;
            }
            return work;
        });

        localStorage.setItem(this.DB_KEY, JSON.stringify(works));
        return updatedWork;
    },

    /**
     * 設定作品是否公開分享
     */
    setWorkShared(id, shared) {
        return this.updateWork(id, { shared: !!shared });
    },

    /**
     * 切換分享狀態
     */
    toggleWorkShared(id) {
        const works = this.getAllWorks();
        const target = works.find(work => String(work.id) === String(id));
        if (!target) return null;
        return this.setWorkShared(id, !target.shared);
    },

    /**
     * 刪除單一作品
     */
    deleteWork(id) {
        const works = this.getAllWorks().filter(work => String(work.id) !== String(id));
        localStorage.setItem(this.DB_KEY, JSON.stringify(works));
    },

    /**
     * 清空所有作品
     */
    clearAllWorks() {
        localStorage.removeItem(this.DB_KEY);
    },

    /**
     * 取得所有已分享作品
     */
    getSharedWorks() {
        return this.getAllWorks().filter(work => work.shared);
    }
};