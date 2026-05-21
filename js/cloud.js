import { StorageManager } from './storageManager.js';

// 1. 40 張模擬畫作數據
const cloudSimulationWorks = [
    { id: 1710310001000, src: 'images/cloud/IMG_0592.PNG', name: '鏡中的倒影', author: '王大明', storyId: 'Family', storyTitle: '公主的等待', level: 1, description: '一面被時間磨亮的鏡子，映出旅人內心的壓抑與渴望。' },
    { id: 1710310002000, src: 'images/cloud/IMG_0593.PNG', name: '禁忌的蘋果', author: '王大明', storyId: 'Family', storyTitle: '公主的等待', level: 2, description: '表面光滑的果實下藏著無法言說的誘惑與後悔。' },
    { id: 1710310003000, src: 'images/cloud/IMG_0597.PNG', name: '沉重的后冠', author: '王大明', storyId: 'Family', storyTitle: '公主的等待', level: 3, description: '象徵責任與孤寂的王冠，每一步都是負擔與選擇。' },
    { id: 1710310004000, src: 'images/cloud/IMG_0598.PNG', name: '冰冷的長廊', author: 'Alex', storyId: 'Family', storyTitle: '公主的等待', level: 4, description: '長廊回蕩著遺忘的腳步聲，光線薄如冰霜。' },
    { id: 1710310005000, src: 'images/cloud/IMG_0599.PNG', name: '破碎的真實', author: '王大明', storyId: 'Family', storyTitle: '公主的等待', level: 1, description: '碎片拼湊出的世界，真實被剪裁成陌生的形狀。' },
    { id: 1710310006000, src: 'images/cloud/IMG_0600.PNG', name: '天鵝絨幕後', author: 'Alex', storyId: 'Family', storyTitle: '公主的等待', level: 2, description: '舞台背後的靜謐與秘密，柔軟卻不可觸碰。' },
    { id: 1710310007000, src: 'images/cloud/IMG_0601.PNG', name: '隱藏的淚水', author: 'Alex', storyId: 'Family', storyTitle: '公主的等待', level: 3, description: '笑容底下的濕潤，是未曾宣洩的柔軟。' },
    { id: 1710310008000, src: 'images/cloud/IMG_0602.PNG', name: '古老的手稿', author: '心碎阿偉', storyId: 'Family', storyTitle: '公主的等待', level: 4, description: '泛黃紙張記錄著被遺忘的約定與斷章。' },
    { id: 1710310009000, src: 'images/cloud/IMG_0605.PNG', name: '黑夜中的玫瑰', author: '心碎阿偉', storyId: 'Family', storyTitle: '公主的等待', level: 1, description: '在黑暗裡綻放的美麗，既脆弱又致命。' },
    { id: 1710310010000, src: 'images/cloud/IMG_0606.PNG', name: '王座的階梯', author: '野心家', storyId: 'Family', storyTitle: '公主的等待', level: 2, description: '通往權力的路上，每一級都蘊藏選擇的痕跡。' },
    { id: 1710310011000, src: 'images/cloud/IMG_0607.PNG', name: '深淵的注視', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1, description: '凝望深淵，深淵也回望你，恐懼與好奇交織。' },
    { id: 1710310012000, src: 'images/cloud/IMG_0609.PNG', name: '被遺忘的承諾', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '曾經溫暖的話語漸成煙灰，仍在心底燒灼。' },
    { id: 1710310013000, src: 'images/cloud/IMG_0610.PNG', name: '毒藥的餘味', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '一小口的決定，改變了原本能延展的生命味道。' },
    { id: 1710310014000, src: 'images/cloud/IMG_0611.PNG', name: '月光下的詭計', author: '心碎阿偉', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '柔和的月色掩飾不了暗潮洶湧的算計。' },
    { id: 1710310015000, src: 'images/cloud/IMG_0612.PNG', name: '華麗的束縛', author: '心碎阿偉', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1, description: '繁複的華服下是不能自由伸展的雙手。' },
    { id: 1710310016000, src: 'images/cloud/IMG_0613.PNG', name: '寂靜的晚宴', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '滿桌的盛宴卻沒有歡笑，只有默契的沉默。' },
    { id: 1710310017000, src: 'images/cloud/IMG_0614.PNG', name: '權力的代價', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '每一項決策都帶來收穫與不可避免的損失。' },
    { id: 1710310018000, src: 'images/cloud/IMG_0615.PNG', name: '冰封的心', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '曾熱的情感被凍結，時間刻成冷硬的表面。' },
    { id: 1710310019000, src: 'images/cloud/IMG_0616.PNG', name: '最後的告別', author: '無名氏', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1, description: '在陌生的車站，和過去溫柔地揮手再見。' },
    { id: 1710310020000, src: 'images/cloud/IMG_0617.PNG', name: '永恆的等待', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '坐在時光邊緣，等待一個可能不會來的人。' },
    { id: 1710310021000, src: 'images/cloud/IMG_0618.PNG', name: '窗外的偽裝', author: '無名氏', storyId: 'Family', storyTitle: '公主的等待', level: 3, description: '窗外世界的光影被修飾，真相躲在縫隙中。' },
    { id: 1710310022000, src: 'images/cloud/IMG_0619.PNG', name: '絲絨禮服', author: '無名氏', storyId: 'Family', storyTitle: '公主的等待', level: 4, description: '柔順的布料覆蓋著不被看見的痕跡與歷史。' },
    { id: 1710310023000, src: 'images/cloud/IMG_0620.PNG', name: '秘密花園', author: '園丁', storyId: 'Family', storyTitle: '公主的等待', level: 1, description: '一處只有記憶能通行的角落，花朵替代話語。' },
    { id: 1710310024000, src: 'images/cloud/IMG_0621.PNG', name: '黃昏的懺悔', author: '藝術信徒', storyId: 'Family', storyTitle: '公主的等待', level: 2, description: '夕陽餘暉下的自省與遺憾，像影子一樣拉長。' },
    { id: 1710310025000, src: 'images/cloud/IMG_0622.PNG', name: '紅寶石的詛咒', author: '恐龍讓我', storyId: 'Family', storyTitle: '公主的等待', level: 3, description: '閃爍的寶石吸引眼睛，也吞噬寧靜。' },
    { id: 1710310026000, src: 'images/cloud/IMG_0624.PNG', name: '偏見的重量', author: '審判長', storyId: 'Family', storyTitle: '公主的等待', level: 4, description: '不公平的視線像鉛一樣壓在肩頭。' },
    { id: 1710310027000, src: 'images/cloud/IMG_0623.PNG', name: '孤獨的加冕', author: '藝術信徒', storyId: 'Family', storyTitle: '公主的等待', level: 1, description: '戴上皇冠的那刻，歡呼消失，孤單開始。' },
    { id: 1710310028000, src: 'images/cloud/IMG_0625.PNG', name: '記憶的餘溫', author: '拾荒者', storyId: 'Family', storyTitle: '公主的等待', level: 2, description: '拾起昔日片段，殘存的熱度還能回暖胸膛。' },
    { id: 1710310029000, src: 'images/cloud/IMG_0626.PNG', name: '破碎的童話', author: '許春天', storyId: 'Family', storyTitle: '公主的等待', level: 3, description: '當故事被剪裁，結局不再如童年所想像。' },
    { id: 1710310030000, src: 'images/cloud/IMG_0627.PNG', name: '不對稱的愛', author: '許春天', storyId: 'Family', storyTitle: '公主的等待', level: 4, description: '付出與回報不成比例，愛在天秤上傾斜。' },
    { id: 1710310031000, src: 'images/cloud/IMG_0628.PNG', name: '迷霧森林', author: '拾荒者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '迷失於濃霧中，方向和記憶模糊不清。' },
    { id: 1710310032000, src: 'images/cloud/IMG_0629.PNG', name: '刺痛的擁抱', author: '拾荒者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '看似溫暖的擁抱卻帶來傷痕與警惕。' },
    { id: 1710310033000, src: 'images/cloud/IMG_0630.PNG', name: '被遮蓋的光', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1, description: '光存在，但被層層理解與誤解所遮蔽。' },
    { id: 1710310034000, src: 'images/cloud/IMG_0631.PNG', name: '假面的告白', author: '小丑', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '在歡笑面具下，真實的聲音小心翼翼地吐露。' },
    { id: 1710310035000, src: 'images/cloud/IMG_0632.PNG', name: '鏽蝕的鑰匙', author: '拾荒者', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '時間腐蝕了開啟舊門的能力，也改寫了意義。' },
    { id: 1710310036000, src: 'images/cloud/IMG_0633.PNG', name: '枯萎的親情', author: '落葉', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '曾經茂盛的情感，如今只剩無聲的枝條。' },
    { id: 1710310037000, src: 'images/cloud/IMG_0634.PNG', name: '冷酷的教誨', author: '嚴師', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 1, description: '嚴厲的課程把溫度抽離，只留下規矩的輪廓。' },
    { id: 1710310038000, src: 'images/cloud/IMG_0635.PNG', name: '嫉妒的迴響', author: '聽眾', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '他人的光芒在耳邊迴響，心中泛起酸澀。' },
    { id: 1710310039000, src: 'images/cloud/IMG_0636.PNG', name: '沉重的腳步', author: '許春天', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '每一步都踩在回憶上，前行變得沉重。' },
    { id: 1710310040000, src: 'images/cloud/IMG_0637.PNG', name: '最終的救贖', author: '許春天', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '在最後的祈禱中尋求和解，或是一種釋放。' },
    { id: 1710310040001, src: 'images/cloud/IMG_0638.PNG', name: '沉重的迴響', author: '許春天', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 2, description: '聲音在牆面反射，帶回更多未被說出的故事。' },
    { id: 1710310040002, src: 'images/cloud/IMG_0640.PNG', name: '沉重的告白', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 3, description: '直面過去的真相需要勇氣，也帶來解脫。' },
    { id: 1710310040003, src: 'images/cloud/IMG_0915.PNG', name: '冷酷的救贖', author: '恐龍讓我', storyId: 'cinderella', storyTitle: '仙度瑞拉的眼淚', level: 4, description: '救贖並非溫柔，它可能是嚴苛的重建。' }
];

const LIKE_STORAGE_KEY = "artEchoCloudLikes";
let currentFilterTag = '全部';

function injectCloudActionStyles() {
    if (document.getElementById('cloud-share-style')) return;

    const style = document.createElement('style');
    style.id = 'cloud-share-style';
    style.textContent = `
        .cloud-actions {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            margin-top:10px;
        }
        .share-btn {
            border:none;
            border-radius:999px;
            padding:8px 12px;
            font-size:0.85rem;
            cursor:pointer;
            background:#eef3f1;
            color:#2f5d4f;
            transition:.2s ease;
        }
        .share-btn:hover {
            transform:translateY(-1px);
        }
        .share-btn.active {
            background:#2f5d4f;
            color:#fff;
        }
        .share-status {
            font-size:0.82rem;
            color:#6f7c79;
        }
        .cloud-empty {
            grid-column:1 / -1;
            text-align:center;
            padding:48px 16px;
            color:#6f7c79;
            background:rgba(255,255,255,0.55);
            border-radius:20px;
        }
        /* Modal styles for artwork details - 加入內邊距避免貼邊 */
        .art-modal-backdrop {
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.5);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:1000;
            padding:20px;
        }
        .art-modal {
            background:#fff;
            border-radius:12px;
            max-width:900px;
            width:100%;
            box-shadow:0 10px 30px rgba(0,0,0,0.2);
            overflow:hidden;
            display:flex;
            gap:16px;
            align-items:flex-start;
            box-sizing: border-box; /* 確保 padding 計入寬度 */
            position: relative; /* 讓關閉鈕絕對定位參考 */
            padding: 24px; /* 增加內邊距，避免內容貼邊 */
        }
        .art-modal img {
            width:36%;
            height:auto;
            object-fit:cover;
            display:block;
            border-radius:8px;
            flex-shrink:0;
            margin-right:12px; /* 與文字區保持距離，避免貼邊 */
        }
        .art-modal-body {
            padding:12px; /* 確保文字區內有足夠空白，不貼邊 */
            flex:1;
            box-sizing:border-box;
        }
        .art-modal-body h3 {
            margin:0 0 8px 0;
            color:#2f5d4f;
        }
        .art-modal-body .author {
            color:#7a8886;
            margin-bottom:12px;
            font-size:0.95rem;
        }
        .author-link {
            color: #2f5d4f;
            text-decoration: none;
            font-weight: bold;
            border-bottom: 1px dashed #2f5d4f;
            transition: all 0.2s ease;
            cursor: pointer;
            padding-bottom: 2px;
        }
        .author-link:hover {
            color: #1a3a30;
            border-bottom: 1px solid #1a3a30;
            background-color: rgba(47, 93, 79, 0.1);
        }
        .art-modal-body .desc {
            color:#4f5b59;
            line-height:1.5;
            font-size:0.95rem;
            white-space:pre-wrap;
        }
        .art-modal-close {
            position:absolute;
            right:18px;
            top:18px;
            background:transparent;
            border:none;
            font-size:1.25rem;
            color:#2f5d4f;
            cursor:pointer;
        }
        @media (max-width:700px) {
            .art-modal { flex-direction:column; padding:12px; }
            .art-modal img { width:100%; max-height:40vh; }
            .art-modal-close { right:12px; top:12px; }
        }
    `;
    document.head.appendChild(style);
}

// 新增：Modal 建立與控制
function ensureModalExists() {
    if (document.getElementById('art-modal-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'art-modal-backdrop';
    backdrop.className = 'art-modal-backdrop';
    backdrop.style.display = 'none';

    backdrop.innerHTML = `
        <div class="art-modal" role="dialog" aria-modal="true" aria-labelledby="art-modal-title">
            <button class="art-modal-close" aria-label="關閉">✕</button>
            <img src="" alt="作品預覽" id="art-modal-img">
            <div class="art-modal-body">
                <h3 id="art-modal-title"></h3>
                <div class="author" id="art-modal-author"></div>
                <div class="desc" id="art-modal-desc"></div>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);

    // 事件：點擊 backdrop 外圍或關閉鈕關閉
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
    });
    const closeBtn = backdrop.querySelector('.art-modal-close');
    closeBtn.addEventListener('click', () => closeModal());

    // Esc 鍵關閉
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(work) {
    ensureModalExists();
    const backdrop = document.getElementById('art-modal-backdrop');
    const img = document.getElementById('art-modal-img');
    const title = document.getElementById('art-modal-title');
    const author = document.getElementById('art-modal-author');
    const desc = document.getElementById('art-modal-desc');
    const authorName = work.author || '匿名';
    img.src = work.src;
    img.alt = work.name || '作品預覽';
    title.textContent = work.name || '無名作品';
    author.innerHTML = `作者：<a href="Author_Space.html?author=${encodeURIComponent(authorName)}" class="author-link">${authorName}</a>`;    desc.textContent = work.description || (work.storyTitle ? `${work.storyTitle} - 情緒等級 ${work.level || '—'}` : '目前沒有作品介紹。');

    backdrop.style.display = 'flex';
    // focus trap simple: focus close button
    const closeBtn = backdrop.querySelector('.art-modal-close');
    closeBtn.focus();
}

function closeModal() {
    const backdrop = document.getElementById('art-modal-backdrop');
    if (!backdrop) return;
    backdrop.style.display = 'none';
}

function getLikeData() {
    const raw = localStorage.getItem(LIKE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

function saveLikeData(data) {
    localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(data));
}

function ensureLikeRecord(likeData, workId, min = 5, span = 40) {
    if (!likeData[workId]) {
        likeData[workId] = {
            count: Math.floor(Math.random() * span) + min,
            isLiked: false
        };
    }
}

function handleLikeClick(btn, workId) {
    const likeData = getLikeData();
    const countDisplay = btn.querySelector('.like-count');

    ensureLikeRecord(likeData, workId, 10, 50);

    if (likeData[workId].isLiked) {
        likeData[workId].count--;
        likeData[workId].isLiked = false;
        btn.classList.remove('active');
    } else {
        likeData[workId].count++;
        likeData[workId].isLiked = true;
        btn.classList.add('active');
    }

    countDisplay.textContent = likeData[workId].count;
    saveLikeData(likeData);
}

function getMyWorks() {
    try {
        return StorageManager.getAllWorks()
            .map(w => ({
                id: w.id,
                src: w.dataUrl,
                name: w.name || "情緒筆觸",
                author: "我",
                storyId: w.storyId || "",
                storyTitle: w.storyTitle || "",
                level: w.level,
                shared: !!w.shared,
                isMine: true
            }))
            .filter(w => w.src);
    } catch (e) {
        return [];
    }
}

function buildTagBar(hasPersonal) {
    const tagBar = document.getElementById('cloudTags');
    if (!tagBar) return;

    tagBar.innerHTML = '';
    const tags = ['全部', '公主的等待', '仙度瑞拉的眼淚'];
    if (hasPersonal) tags.push('我的作品');

    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn' + (tag === currentFilterTag ? ' active' : '');
        btn.textContent = tag;
        btn.onclick = () => {
            currentFilterTag = tag;
            document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCloudGallery(currentFilterTag);
        };
        tagBar.appendChild(btn);
    });
}

function getWorksForFilter(filterTag) {
    const myWorks = getMyWorks();
    const sharedMyWorks = myWorks.filter(w => w.shared);

    if (filterTag === '我的作品') {
        return myWorks.slice().sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    let works = [...cloudSimulationWorks, ...sharedMyWorks];

    if (filterTag === '全部') {
        return works.sort(() => Math.random() - 0.5);
    }

    return works.filter(w => w.storyTitle === filterTag);
}

function toggleShare(workId, nextShared) {
    StorageManager.setWorkShared(workId, nextShared);
    renderCloudGallery(currentFilterTag);
}

function createCard(work, likeData, isMyWorksTab) {
    ensureLikeRecord(likeData, work.id, 5, 40);

    const card = document.createElement('div');
    card.className = 'cloud-item';

    const img = document.createElement('img');
    img.src = work.src;
    img.loading = 'lazy';
    img.alt = work.name || '作品';

    const info = document.createElement('div');
    info.className = 'cloud-info';
    info.innerHTML = `
        <h4>${work.name}</h4>
        <p>by ${work.author}</p>
    `;

    const likeBtn = document.createElement('button');
    likeBtn.className = `like-btn ${likeData[work.id].isLiked ? 'active' : ''}`;
    likeBtn.innerHTML = `
        <span class="heart-icon">♥</span>
        <span class="like-count">${likeData[work.id].count}</span>
    `;
    likeBtn.onclick = (e) => {
        e.stopPropagation();
        handleLikeClick(likeBtn, work.id);
    };

    // 點擊卡片顯示作品資訊 Modal
    card.onclick = () => openModal(work);

    if (isMyWorksTab && work.isMine) {
        const actions = document.createElement('div');
        actions.className = 'cloud-actions';

        const shareBtn = document.createElement('button');
        shareBtn.className = `share-btn ${work.shared ? 'active' : ''}`;
        shareBtn.textContent = work.shared ? '取消分享' : '分享作品';
        shareBtn.onclick = (e) => {
            e.stopPropagation();
            toggleShare(work.id, !work.shared);
        };

        const status = document.createElement('span');
        status.className = 'share-status';
        status.textContent = work.shared ? '目前狀態：已公開' : '目前狀態：未公開';

        actions.appendChild(shareBtn);
        actions.appendChild(status);

        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(actions);
        card.appendChild(likeBtn);
        return card;
    }

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(likeBtn);
    return card;
}

function renderCloudGallery(filterTag = '全部') {
    const cloudGrid = document.getElementById('cloudGrid');
    const likeData = getLikeData();
    const works = getWorksForFilter(filterTag);

    cloudGrid.innerHTML = '';

    if (works.length === 0) {
        cloudGrid.innerHTML = `
            <div class="cloud-empty">
                <h3 style="margin-bottom:8px;">目前沒有可顯示的作品</h3>
                <p>${filterTag === '我的作品' ? '你還沒有儲存任何作品。' : '目前這個分類下還沒有已公開的作品。'}</p>
            </div>
        `;
        saveLikeData(likeData);
        return;
    }

    const isMyWorksTab = filterTag === '我的作品';

    works.forEach(work => {
        const card = createCard(work, likeData, isMyWorksTab);
        cloudGrid.appendChild(card);
    });

    saveLikeData(likeData);
}

document.addEventListener('DOMContentLoaded', () => {
    injectCloudActionStyles();

    let hasPersonal = false;
    try {
        hasPersonal = StorageManager.getAllWorks().length > 0;
    } catch (e) {}

    buildTagBar(hasPersonal);
    renderCloudGallery(currentFilterTag);
});