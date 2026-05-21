-- 1. 建立並使用 ArtEcho 資料庫
CREATE DATABASE IF NOT EXISTS artecho DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE artecho;

-- ========================================================
-- 1. 使用者帳戶表 (Users)
-- ========================================================
CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主鍵，使用者唯一識別碼',
                                     email VARCHAR(255) NOT NULL UNIQUE COMMENT '帳號，用於登入與寄送驗證碼',
    password_hash TEXT NOT NULL COMMENT '加密後的密碼（不可儲存明文）',
    display_name VARCHAR(100) NOT NULL COMMENT '顯示名稱',
    verify_code VARCHAR(10) NULL COMMENT '暫存驗證碼，用於兩階段登入（verify階段）',
    is_verified BOOLEAN DEFAULT FALSE COMMENT '帳號是否已完成郵件驗證',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '註冊時間'
    ) ENGINE=InnoDB;

-- ========================================================
-- 2. 畫作與創作紀錄表 (Artworks)
-- ========================================================
CREATE TABLE IF NOT EXISTS artworks (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主鍵，可用時間戳記，對應 cloud.js 的 id',
                                        user_id INT NOT NULL COMMENT '外鍵，關聯至 users.id，識別畫家是誰',
                                        image_url TEXT NOT NULL COMMENT '儲存於 S3 的畫作網址，對應 src',
                                        name VARCHAR(255) NOT NULL COMMENT '作品名稱',
    description TEXT NULL COMMENT '作品描述',
    story_id VARCHAR(50) NULL COMMENT '所屬劇情 ID (如 snow_white)',
    story_title VARCHAR(100) NULL COMMENT '劇情標題 (如 公主的等待)',
    metadata_json JSON NULL COMMENT '關鍵：儲存 Fabric.js 的筆觸 JSON 軌跡數據',
    is_shared BOOLEAN DEFAULT FALSE COMMENT '是否公開至雲端畫廊，對應 toggleShare 功能',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創作完成時間',

    -- 設定外鍵約束
    CONSTRAINT fk_artworks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- ========================================================
-- 3. 互動指標表 (Interactions)
-- ========================================================
CREATE TABLE IF NOT EXISTS interactions (
                                            user_id INT NOT NULL COMMENT '誰按的讚',
                                            artwork_id BIGINT NOT NULL COMMENT '哪張畫被按讚',
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '按讚時間',

    -- 複合主鍵，防止重複按讚
                                            PRIMARY KEY (user_id, artwork_id),
    -- 設定外鍵約束
    CONSTRAINT fk_interactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interactions_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- ========================================================
-- 4. 情緒問卷紀錄表 (Emotion_Logs)
-- ========================================================
CREATE TABLE IF NOT EXISTS emotion_logs (
                                            id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主鍵',
                                            artwork_id BIGINT NOT NULL COMMENT '外鍵，關聯至 artworks.id',
                                            pre_score INT NOT NULL COMMENT '前測情緒分數/數值',
                                            post_score INT NOT NULL COMMENT '後測情緒分數/數值',
                                            reflection_text TEXT NULL COMMENT '使用者與 AI 對話後留下的反思筆記',
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '紀錄時間',

    -- 設定外鍵約束
                                            CONSTRAINT fk_emotion_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
