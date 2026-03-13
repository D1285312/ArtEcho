import { StorageManager } from './storageManager.js';

// 1. 定義存放於 ArtEcho/images/cloud 的模擬畫作 (後母主題)
const cloudSimulationWorks = [
    // === 第一組：2ea1e253e5f7b158af1ebe62f2fe73a0 系列 (snow_white) ===
    { id: 1710310001000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0.jpg', name: '鏡中的倒影', author: '旅人 A', storyId: 'snow_white', storyTitle: '公主的等待', level: 1 },
    { id: 1710310002000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製.jpg', name: '禁忌的蘋果', author: '心碎者', storyId: 'snow_white', storyTitle: '公主的等待', level: 2 },
    { id: 1710310003000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (2).jpg', name: '沉重的后冠', author: '故事家', storyId: 'snow_white', storyTitle: '公主的等待', level: 3 },
    { id: 1710310004000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (3).jpg', name: '冰冷的長廊', author: '寂寞的靈魂', storyId: 'snow_white', storyTitle: '公主的等待', level: 4 },
    { id: 1710310005000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (4).jpg', name: '破碎的真實', author: 'Ariel', storyId: 'snow_white', storyTitle: '公主的等待', level: 1 },
    { id: 1710310006000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (5).jpg', name: '天鵝絨幕後', author: '藝術愛好者', storyId: 'snow_white', storyTitle: '公主的等待', level: 2 },
    { id: 1710310007000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (6).jpg', name: '隱藏的淚水', author: '路人甲', storyId: 'snow_white', storyTitle: '公主的等待', level: 3 },
    { id: 1710310008000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (7).jpg', name: '古老的手稿', author: '時光機', storyId: 'snow_white', storyTitle: '公主的等待', level: 4 },
    { id: 1710310009000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (8).jpg', name: '黑夜中的玫瑰', author: '午夜畫家', storyId: 'snow_white', storyTitle: '公主的等待', level: 1 },
    { id: 1710310010000, src: 'images/cloud/2ea1e253e5f7b158af1ebe62f2fe73a0 - 複製 (9).jpg', name: '王座的階梯', author: '野心家', storyId: 'snow_white', storyTitle: '公主的等待', level: 2 },

    // === 第二組：91b95696d821cf201c4427d6310aad60 系列 (cinderella) ===
    { id: 1710310011000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60.jpg', name: '深淵的注視', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1 },
    { id: 1710310012000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製.jpg', name: '被遺忘的承諾', author: '灰燼', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2 },
    { id: 1710310013000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (2).jpg', name: '毒藥的餘味', author: '影子', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3 },
    { id: 1710310014000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (3).jpg', name: '月光下的詭計', author: '銀狐', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4 },
    { id: 1710310015000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (4).jpg', name: '華麗的束縛', author: '織網者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1 },
    { id: 1710310016000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (5).jpg', name: '寂靜的晚宴', author: '空杯', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2 },
    { id: 1710310017000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (6).jpg', name: '權力的代價', author: '守門人', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3 },
    { id: 1710310018000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (7).jpg', name: '冰封的心', author: '冬眠者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4 },
    { id: 1710310019000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (8).jpg', name: '最後的告別', author: '行者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1 },
    { id: 1710310020000, src: 'images/cloud/91b95696d821cf201c4427d6310aad60 - 複製 (9).jpg', name: '永恆的等待', author: '石像', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2 },

    // === 第三組：b402ba97-428b-43db-9e52-c7ea8d74be74 系列 (snow_white) ===
    { id: 1710310021000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74.webp', name: '窗外的偽裝', author: '窺探者', storyId: 'snow_white', storyTitle: '公主的等待', level: 3 },
    { id: 1710310022000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製.webp', name: '絲絨禮服', author: '裁縫師', storyId: 'snow_white', storyTitle: '公主的等待', level: 4 },
    { id: 1710310023000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (2).webp', name: '秘密花園', author: '園丁', storyId: 'snow_white', storyTitle: '公主的等待', level: 1 },
    { id: 1710310024000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (3).webp', name: '黃昏的懺悔', author: '信徒', storyId: 'snow_white', storyTitle: '公主的等待', level: 2 },
    { id: 1710310025000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (4).webp', name: '紅寶石的詛咒', author: '收藏家', storyId: 'snow_white', storyTitle: '公主的等待', level: 3 },
    { id: 1710310026000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (5).webp', name: '偏見的重量', author: '審判長', storyId: 'snow_white', storyTitle: '公主的等待', level: 4 },
    { id: 1710310027000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (6).webp', name: '孤獨的加冕', author: '皇后', storyId: 'snow_white', storyTitle: '公主的等待', level: 1 },
    { id: 1710310028000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (7).webp', name: '記憶的餘溫', author: '拾荒者', storyId: 'snow_white', storyTitle: '公主的等待', level: 2 },
    { id: 1710310029000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (8).webp', name: '破碎的童話', author: '說書人', storyId: 'snow_white', storyTitle: '公主的等待', level: 3 },
    { id: 1710310030000, src: 'images/cloud/b402ba97-428b-43db-9e52-c7ea8d74be74 - 複製 (9).webp', name: '不對稱的愛', author: '觀察員', storyId: 'snow_white', storyTitle: '公主的等待', level: 4 },

    // === 第四組：b805e660dd0d4d8638daf5035474b7bc 系列 (cinderella) ===
    { id: 1710310031000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc.jpg', name: '迷霧森林', author: '嚮導', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3 },
    { id: 1710310032000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製.jpg', name: '刺痛的擁抱', author: '仙人掌', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4 },
    { id: 1710310033000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (2).jpg', name: '被遮蓋的光', author: '螢火蟲', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1 },
    { id: 1710310034000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (3).jpg', name: '假面的告白', author: '小丑', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2 },
    { id: 1710310035000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (4).jpg', name: '鏽蝕的鑰匙', author: '鎖匠', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3 },
    { id: 1710310036000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (5).jpg', name: '枯萎的親情', author: '落葉', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4 },
    { id: 1710310037000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (6).jpg', name: '冷酷的教誨', author: '嚴師', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1 },
    { id: 1710310038000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (7).jpg', name: '嫉妒的迴響', author: '聽眾', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2 },
    { id: 1710310039000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (8).jpg', name: '沉重的腳步', author: '登山者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3 },
    { id: 1710310040000, src: 'images/cloud/b805e660dd0d4d8638daf5035474b7bc - 複製 (9).jpg', name: '最終的救贖', author: '祈禱者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4 }
];

const LIKE_STORAGE_KEY = "artEchoCloudLikes";
let currentAllWorks = [];

/**
 * 2. 取得按讚數據
 */
function getLikeData() {
    const raw = localStorage.getItem(LIKE_STORAGE_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch (e) { return {}; }
}

/**
 * 3. 儲存按讚數據
 */
function saveLikeData(data) {
    localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(data));
}

/**
 * 4. 建立標籤篩選列
 */
function buildTagBar(hasPersonalWorks) {
    const tagBar = document.getElementById('cloudTags');
    if (!tagBar) return;
    tagBar.innerHTML = '';

    const tags = new Set();
    tags.add('全部');
    cloudSimulationWorks.forEach(w => { if (w.storyTitle) tags.add(w.storyTitle); });
    if (hasPersonalWorks) tags.add('我的作品');

    tags.forEach((tag) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-btn' + (tag === '全部' ? ' active' : '');
        btn.textContent = tag;
        btn.addEventListener('click', () => {
            document.querySelectorAll('#cloudTags .tag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCloudGallery(tag);
        });
        tagBar.appendChild(btn);
    });
}

/**
 * 5. 處理愛心點擊邏輯 (記錄按讚數)
 */
function handleLikeClick(btn, workId) {
    const likeData = getLikeData();
    const countDisplay = btn.querySelector('.like-count');

    // 初始化該作品的數據
    if (!likeData[workId]) {
        likeData[workId] = { count: Math.floor(Math.random() * 50) + 10, isLiked: false };
    }

    // 切換狀態
    if (likeData[workId].isLiked) {
        likeData[workId].count--;
        likeData[workId].isLiked = false;
        btn.classList.remove('active');
    } else {
        likeData[workId].count++;
        likeData[workId].isLiked = true;
        btn.classList.add('active');
    }

    // 更新顯示與儲存
    countDisplay.textContent = likeData[workId].count;
    saveLikeData(likeData);
}

/**
 * 6. 渲染畫廊主體
 */
function renderCloudGallery(filterTag = '全部') {
    const cloudGrid = document.getElementById('cloudGrid');
    if (!cloudGrid) return;

    const likeData = getLikeData();

    // 取得個人作品
    let myPersonalWorks = [];
    try {
        const rawData = StorageManager.getAllWorks();
        myPersonalWorks = rawData.map(w => ({
            id: w.id || Date.now(),
            src: w.dataUrl,
            name: w.name || "我的情緒筆觸",
            author: "我",
            storyTitle: w.storyTitle
        }));
    } catch (e) {
        console.warn("目前個人畫廊暫無資料");
    }

    currentAllWorks = [...cloudSimulationWorks, ...myPersonalWorks];

    if (filterTag === '全部') {
        currentAllWorks.sort(() => Math.random() - 0.5);
    }

    let worksToShow = currentAllWorks;
    if (filterTag !== '全部') {
        if (filterTag === '我的作品') {
            worksToShow = currentAllWorks.filter(w => w.author === '我');
        } else {
            worksToShow = currentAllWorks.filter(w => w.storyTitle === filterTag);
        }
    }

    cloudGrid.innerHTML = '';
    worksToShow.forEach(work => {
        // 取得該作品的按讚狀態
        if (!likeData[work.id]) {
            likeData[work.id] = { count: Math.floor(Math.random() * 50) + 10, isLiked: false };
        }
        const workLikes = likeData[work.id];

        const card = document.createElement('div');
        card.className = 'cloud-item';
        card.innerHTML = `
            <img src="${work.src}" alt="${work.name}" loading="lazy">
            <div class="cloud-info">
                <h4>${work.name}</h4>
                <p>by ${work.author}</p>
            </div>
            <button class="like-btn ${workLikes.isLiked ? 'active' : ''}" aria-label="收藏作品" data-id="${work.id}">
                <span class="heart-icon">♥</span>
                <span class="like-count">${workLikes.count}</span>
            </button>
        `;

        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLikeClick(likeBtn, work.id);
        });

        cloudGrid.appendChild(card);
    });
    // 儲存初始化後的隨機按讚數
    saveLikeData(likeData);
}

/**
 * 7. 初始化頁面
 */
document.addEventListener('DOMContentLoaded', () => {
    let hasPersonal = false;
    try {
        const rawData = StorageManager.getAllWorks();
        hasPersonal = Array.isArray(rawData) && rawData.length > 0;
    } catch (e) {
        hasPersonal = false;
    }

    buildTagBar(hasPersonal);
    renderCloudGallery('全部');
});