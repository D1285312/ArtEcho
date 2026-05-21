/**
 * ArtEcho 劇情與章節整合資料庫
 * 針對國中小客群進行文字簡化，並支援「無圖片」的純文字卡片排版
 */
import { GeminiService } from "./geminiService.js";
window.ArtEchoScenarios = [
  // --- 官方劇情 ---
  {
    id: "Family",
    category: "official",
    title: "好久不見的親戚來到我家作客",
    description: "這是一個關於家人的故事，準備好了嗎？",
    image: "images/family.png",
    clickable: true,
    intro: {
      videoSrc: "video/open.mp4",
      question: "好久不見的親戚就在面前！見到他你的心情是怎麼樣的呢？",
      options: ["覺得厭煩", "有點生氣", "覺得難過", "非常開心"]
    },
    chapters: {
      "1": {
        title: "第一章：好久不見的家人",
        desc: "你終於見到好久不見的親戚了！你現在的心情是怎麼樣的呢？或是你們會有什麼樣的互動?把你的想法畫下來吧！",
        img: "images/family.png"
      },
      "2": {
        title: "第二章：分享美味的晚餐",
        desc: "大家圍坐在餐桌旁，吃著熱騰騰的飯菜，聊著分開時發生的趣事。畫出桌上你最想跟家人分享的那道菜吧！",
        img: "images/meal.jpg"
      },
      "3": {
        title: "第三章：飯後的客廳時光",
        desc: "吃飽後，大家一起坐在沙發上，客廳裡充滿了交談聲。試著畫出你和家人一起待在客廳相處的畫面。",
        img: "images/room.jpg"
      },
      "4": {
        title: "第四章：暖心的晚安擁抱",
        desc: "快樂的一天過去了，睡前家人給了你一個大大的擁抱。對於這個擁抱你的感覺是甚麼?畫出你的感受吧!",
        img: "images/hug.jpg"
      }
    }
  },
  {
    id: "locked-scenario-1",
    category: "official",
    title: "即將開放",
    description: "更多好玩的故事正在準備中，敬請期待喔！",
    image: "images/rat.png",
    clickable: false,
    chapters: {}
  },

  // --- 個人劇情 (模擬資料：這筆設定為沒有圖片，展示純文字卡片) ---
  {
    id: "my-dream-01",
    category: "personal",
    title: "昨晚的神祕夢境",
    description: "這是 AI 根據你的夢境變出來的深海探險故事，一起看看海底有什麼神秘生物吧！",
    image: "images/sea.jpg", // 設定為 null，畫面上就會變成純文字排版
    clickable: true,
    chapters: {
      "1": {
        title: "第一章：潛入深海",
        desc: "感覺水越來越深，光線也慢慢變暗了，請畫出你心中深海的景象(例如：魚群、珊瑚、漩渦)。",
        img: "images/sea.jpg"
      },
      "2": {
        title: "第二章：發光的發光生物",
        desc: "周圍出現了好多亮晶晶的水母和魚群！試著用亮麗的顏色，畫出在黑暗中為你引路的小生物吧。",
        img: "images/Fish.jpg"
      },
      "3": {
        title: "第三章：失落的水底遺蹟",
        desc: "前方隱約出現了一座古老神秘的建築物殘骸。發揮你的想像力，把這座沉睡在海底的城堡畫出來。",
        img: "images/castle.jpg"
      },
      "4": {
        title: "第四章：重見天日的寶藏",
        desc: "在遺蹟的深處，你發現了一個閃閃發光的寶箱！快用金色或你最喜歡的色彩，畫出寶箱裡裝著的神秘禮物。",
        img: "images/treasure.jpg"
      }
    }
  },

  // --- 社群共享劇情 (模擬資料) ---
  {
    id: "shared-01",
    category: "shared",
    title: "星空下的散步",
    description: "大家都很喜歡的星空故事，一起去看看滿天的星星，感受一下平靜的心情吧！",
    image: "images/star.jpeg",
    clickable: true,
    intro: {
      question: "走在看星星的路上，你現在心裡感覺怎麼樣？",
      options: ["非常開心","覺得孤單", "感到緊張", "覺得平靜"]
    },
    chapters: {
      "1": {
        title: "第一章：看星星的路上",
        desc: "周圍的風景感覺好特別，遠處的樹影在微風中輕輕搖曳，試著畫出腦袋中的影像吧!",
        img: "images/star.jpeg"
      },
      "2": {
        title: "第二章：夜幕低垂的森林",
        desc: "走進了密林之中，雖然有點黑，但腳邊有些不知名的發光植物正一閃一閃的，像是引路的精靈，畫出接下來的故事吧!",
        img: "images/Firefly.jpg"
      },
      "3": {
        title: "第三章：溪川旁的生物",
        desc: "夜晚的溪川邊，傳來樹叢輕輕晃動的沙沙聲，還有溪水緩緩流動的呢喃。跟著聲音一起探索，畫出夜晚森林中的生命吧",
        img: "images/creek.jpg"
      },
      "4": {
        title: "第四章：流星劃過的瞬間",
        desc: "你找了一塊舒服的草地躺了下來。這時，一顆流星悄悄劃過天際，你趕緊閉上眼睛許下了心願，畫下你此時的願望吧!",
        img: "images/meteor.jpg"
      }
    }
  }
];

/* ==========================================================================
   工具函式區
   ========================================================================== */
window.getChapterData = function(scenarioId, chapterLevel) {
  const scenario = window.ArtEchoScenarios.find(s => s.id === scenarioId);
  if (scenario && scenario.chapters) {
    return scenario.chapters[chapterLevel] || getFallbackChapter(scenario, chapterLevel);
  }
  return null;
};

window.getScenarioById = function(id) {
  return window.ArtEchoScenarios.find(s => s.id === id);
};


/* ==========================================================================
   渲染畫面區 (支援動態切換：有圖片卡片 vs 純文字卡片)
   ========================================================================== */
window.renderScenarios = function() {
  const officialGrid = document.getElementById("officialGrid");
  const myGrid = document.getElementById("myGrid");
  const sharedGrid = document.getElementById("sharedGrid");

  if (!officialGrid || !myGrid || !sharedGrid) return;

  officialGrid.innerHTML = "";
  myGrid.innerHTML = "";
  sharedGrid.innerHTML = "";

  // [+] 新建按鈕卡片
  const addCardHtml = `
    <article class="scenario-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(255, 255, 255, 0.6); border: 2px dashed #cdb48a; min-height: 250px; transition: 0.3s; margin: 0;" onclick="createNewScenario()" onmouseover="this.style.background='#fff'; this.style.borderColor='var(--moss)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.6)'; this.style.borderColor='#cdb48a';">
      <div style="font-size: 3.8rem; color: #c66b3d; line-height: 1; margin-bottom: 6px;">+</div>
      <h3 style="color: var(--moss); font-size: 1.1rem; margin: 0; font-family: 'Noto Serif TC', serif;">AI 魔法故事機</h3>
      <p style="color: #4f595f; font-size: 0.85rem; margin-top: 6px; margin-bottom: 0;">自己做一個畫畫故事</p>
    </article>
  `;
  myGrid.innerHTML += addCardHtml;


  // 派發資料庫中的卡片
  window.ArtEchoScenarios.forEach(function(scenario) {
    const card = document.createElement("article");
    card.className = "scenario-card";
    if (!scenario.clickable) card.classList.add("locked");

    // 判斷是否有圖片，決定渲染「有圖版」還是「無圖版純文字卡片」
    const hasImage = !!scenario.image;

    const imgHtml = hasImage ? `
      <div class="scenario-card-img">
        <img src="${scenario.image}" alt="${scenario.title}">
        ${!scenario.clickable ? '<div class="lock-icon">🔒</div>' : ''}
      </div>
    ` : '';

    // 如果沒有圖片但又被上鎖，要把鎖頭放在文字區域內
    const lockHtml = (!hasImage && !scenario.clickable) ? '<div style="font-size: 2rem; text-align: center; margin-bottom: 10px;">🔒</div>' : '';

    const contentHtml = `
      ${imgHtml}
      <div class="scenario-card-content" ${!hasImage ? 'style="padding: 24px; min-height: 250px; display: flex; flex-direction: column; justify-content: center;"' : ''}>
        ${lockHtml}
        <h3 ${!hasImage ? 'style="font-size: 1.3rem; margin-bottom: 12px; color: var(--terracotta);"' : ''}>${scenario.title}</h3>
        <p ${!hasImage ? 'style="font-size: 1rem; line-height: 1.7;"' : ''}>${scenario.description}</p>
      </div>
    `;

    if (scenario.clickable) {
      const link = document.createElement("a");
      link.href = `Studio.html?scenario=${encodeURIComponent(scenario.id)}&chapter=1`;
      link.className = "scenario-link";
      // 讓卡片整塊可點，但避免純文字卡片高度塌陷
      link.style.display = "block";
      link.style.height = "100%";
      link.innerHTML = contentHtml;

      link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetUrl = `Studio.html?scenario=${scenario.id}&chapter=1`;

        if (!scenario.intro) {
          window.location.href = targetUrl;
          return;
        }

        let buttonsHtml = "";
        scenario.intro.options.forEach(opt => {
          buttonsHtml += `<button class="option-btn" onclick="window.location.href='${targetUrl}'" style="font-size: 1rem; padding: 10px 20px; border-radius: 8px; background-color: #c57e21; color: #ffffff; border: none; cursor: pointer; transition: background-color 0.3s ease;">${opt}</button>`;
        });

        const hasVideo = !!scenario.intro.videoSrc;

        const modalHtml = `
          <div class="video-modal" id="videoModalOverlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div class="video-container" style="position: relative; background: ${hasVideo ? 'transparent' : '#fffdf8'}; padding: ${hasVideo ? '0' : '35px'}; border-radius: 20px; max-width: ${hasVideo ? '800px' : '480px'}; width: 90%; border: ${hasVideo ? 'none' : '1px solid var(--line)'}; box-shadow: ${hasVideo ? 'none' : '0 20px 40px rgba(0,0,0,0.3)'};">
                <button class="close-btn" style="position: absolute; top: -15px; right: -15px; background: #fff; border: 2px solid #ccc; border-radius: 50%; width: 35px; height: 35px; font-size: 20px; cursor: pointer; z-index: 10;">✖</button>
                
                ${hasVideo ? `
                <video id="introVideo" autoplay playsinline style="width: 100%; border-radius: 8px; transition: filter 0.5s; display: block;">
                    <source src="${scenario.intro.videoSrc}" type="video/mp4">
                    您的瀏覽器不支援影片播放。
                </video>
                ` : ''}
                
                <div class="options-overlay" style="display: ${hasVideo ? 'none' : 'flex'}; position: ${hasVideo ? 'absolute' : 'relative'}; top: 0; left: 0; width: 100%; height: 100%; justify-content: center; align-items: center; background: ${hasVideo ? 'rgba(0,0,0,0.5)' : 'transparent'}; border-radius: 8px;">
                    <div class="options-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%; text-align: center;">
                        <strong style="grid-column: 1 / -1; font-size: 1.25rem; color: ${hasVideo ? '#fff' : 'var(--ink)'}; margin-bottom: 12px; text-shadow: ${hasVideo ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'}; font-family: 'Noto Serif TC', serif; line-height: 1.5;">${scenario.intro.question}</strong>
                        ${buttonsHtml}
                    </div>
                </div> 
            </div>
          </div>
        `;

        const modal = document.createElement("div");
        modal.innerHTML = modalHtml;
        document.body.appendChild(modal);

        modal.querySelector(".close-btn").addEventListener("click", () => document.body.removeChild(modal));

        if (hasVideo) {
          const video = modal.querySelector("#introVideo");
          const optionsOverlay = modal.querySelector(".options-overlay");
          video.oncontextmenu = (e) => e.preventDefault();

          video.addEventListener("ended", function () {
            video.style.filter = "brightness(0.3)";
            optionsOverlay.style.display = "flex";
          });
          video.addEventListener("error", function () {
            optionsOverlay.style.display = "flex";
          });
        }
      });

      card.appendChild(link);
    } else {
      card.innerHTML = contentHtml;
    }

    if (scenario.category === "official") {
      officialGrid.appendChild(card);
    } else if (scenario.category === "personal") {
      myGrid.appendChild(card);
    } else if (scenario.category === "shared") {
      sharedGrid.appendChild(card);
    } else {
      officialGrid.appendChild(card);
    }
  });
};

window.createNewScenario = function() {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="video-modal" id="aiGeneratorModal" style="z-index: 1000; position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
      <div class="panel" style="max-width: 560px; width: 92%; background: #fffdf8; position: relative; padding: 30px; border-radius: 24px; border: 1px solid var(--line); box-shadow: 0 20px 40px rgba(0,0,0,0.3); margin: 0; max-height: 90vh; overflow-y: auto;">
        <button class="close-btn" style="position: absolute; top: 18px; right: 18px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888;">x</button>

        <div id="ai-input-stage">
          <h2 style="color: var(--moss); margin-bottom: 6px; font-size: 1.4rem; font-family: 'Noto Serif TC', serif;">AI 魔法故事機</h2>
          <p style="color: #666; font-size: 0.9rem; margin-bottom: 22px;">上傳封面、選擇風格和心情，AI 會產生四個章節的繪圖劇情。</p>

          <div class="control-group" style="margin-bottom: 16px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px; font-size: 0.95rem;">故事封面圖片</label>
            <input type="file" id="ai-image-upload" class="editable-input" accept="image/*" style="width: 100%; background: #fff;">
          </div>

          <div class="control-group" style="margin-bottom: 16px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px; font-size: 0.95rem;">故事風格</label>
            <select id="ai-style" class="editable-input" style="width: 100%; height: 40px; background: #fff;">
              <option value="魔法奇幻">魔法奇幻</option>
              <option value="溫柔童話">溫柔童話</option>
              <option value="森林冒險">森林冒險</option>
              <option value="星空科幻">星空科幻</option>
            </select>
          </div>

          <div class="control-group" style="margin-bottom: 16px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px; font-size: 0.95rem;">故事心情</label>
            <select id="ai-feeling" class="editable-input" style="width: 100%; height: 40px; background: #fff;">
              <option value="好奇探索">好奇探索</option>
              <option value="安靜療癒">安靜療癒</option>
              <option value="勇敢面對">勇敢面對</option>
              <option value="溫暖陪伴">溫暖陪伴</option>
            </select>
          </div>

          <div class="control-group" style="margin-bottom: 22px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px; font-size: 0.95rem;">故事提示詞</label>
            <textarea id="ai-prompt" class="editable-textarea" style="width: 100%; height: 90px; resize: none; background: #fff;" placeholder="例如：一個在雨天迷路的小孩，找到會發光的種子..."></textarea>
          </div>

          <button id="ai-submit-btn" class="cta-btn primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 1rem; cursor: pointer; border-radius: 12px; background: #c2693d; color: white; border: none;">產生我的魔法故事</button>
        </div>

        <div id="ai-loading-stage" style="display: none; text-align: center; padding: 45px 0;">
          <div style="font-size: 3.5rem; animation: float 1.2s ease-in-out infinite; margin-bottom: 15px;">...</div>
          <h3 style="color: var(--moss); margin-bottom: 8px;">AI 正在編寫四章劇情</h3>
          <p style="color: #888; font-size: 0.88rem; margin: 0;">請稍等一下，故事正在成形。</p>
        </div>

        <div id="ai-result-stage" style="display: none;">
          <h2 style="color: #c66b3d; margin-bottom: 14px; font-size: 1.3rem; font-family: 'Noto Serif TC', serif;">故事生成完成</h2>
          <div style="background: rgba(47,93,79,0.05); padding: 18px; border-radius: 14px; border-left: 4px solid var(--moss); margin-bottom: 18px;">
            <h3 id="res-title" style="font-size: 1.1rem; margin: 0 0 8px 0; color: var(--ink);"></h3>
            <p id="res-desc" style="font-size: 0.9rem; color: #5a6b6a; line-height: 1.6; margin: 0;"></p>
          </div>
          <ol id="res-chapters" style="color: #4f595f; font-size: 0.9rem; line-height: 1.7; padding-left: 20px; margin-bottom: 22px;"></ol>
          <div style="display: flex; gap: 12px;">
            <button id="save-personal-btn" class="btn" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: bold;">存在我的專屬劇情</button>
            <button id="save-shared-btn" class="cta-btn primary" style="flex: 1; padding: 12px; border-radius: 12px; justify-content: center; background: #c2693d; color: white; border: none; font-weight: bold; cursor: pointer;">分享到社群共享</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector(".close-btn");
  const submitBtn = modal.querySelector("#ai-submit-btn");
  const inputStage = modal.querySelector("#ai-input-stage");
  const loadingStage = modal.querySelector("#ai-loading-stage");
  const resultStage = modal.querySelector("#ai-result-stage");
  const imageUploadInput = modal.querySelector("#ai-image-upload");

  closeBtn.addEventListener("click", () => document.body.removeChild(modal));

  const readCoverImage = () => new Promise(resolve => {
    if (!imageUploadInput.files || !imageUploadInput.files[0]) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(imageUploadInput.files[0]);
  });

  const buildScenario = (category, story, imageUrl) => {
    const isShared = category === "shared";
    const chapterImage = imageUrl || "images/music.png";
    return {
      id: `ai-generated-${Date.now()}`,
      category,
      title: isShared ? `${story.title} (匿名小畫家)` : story.title,
      description: story.description,
      image: imageUrl,
      clickable: true,
      intro: {
        question: story.intro.question,
        options: story.intro.options
      },
      chapters: Object.fromEntries(Object.entries(story.chapters).map(([level, chapter]) => [
        level,
        {
          title: chapter.title,
          desc: chapter.desc,
          img: chapterImage
        }
      ]))
    };
  };

  submitBtn.addEventListener("click", async () => {
    const style = modal.querySelector("#ai-style").value;
    const feeling = modal.querySelector("#ai-feeling").value;
    const prompt = modal.querySelector("#ai-prompt").value.trim();

    inputStage.style.display = "none";
    loadingStage.style.display = "block";
    submitBtn.disabled = true;

    try {
      const imageUrl = await readCoverImage();
      const story = await new Promise((resolve, reject) => {
        GeminiService.generateStory({
          style,
          feeling,
          prompt,
          onSuccess: resolve,
          onError: reject
        });
      });

      loadingStage.style.display = "none";
      resultStage.style.display = "block";
      modal.querySelector("#res-title").textContent = story.title;
      modal.querySelector("#res-desc").textContent = story.description;

      const chapterList = modal.querySelector("#res-chapters");
      chapterList.innerHTML = "";
      Object.values(story.chapters).forEach(chapter => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        title.textContent = chapter.title;
        item.appendChild(title);
        item.appendChild(document.createTextNode(`：${chapter.desc}`));
        chapterList.appendChild(item);
      });

      modal.querySelector("#save-personal-btn").onclick = function() {
        const scenario = buildScenario("personal", story, imageUrl);
        window.ArtEchoScenarios.push(scenario);
        saveGeneratedScenario(scenario);
        document.body.removeChild(modal);
        window.renderScenarios();
      };

      modal.querySelector("#save-shared-btn").onclick = function() {
        const scenario = buildScenario("shared", story, imageUrl);
        window.ArtEchoScenarios.push(scenario);
        saveGeneratedScenario(scenario);
        document.body.removeChild(modal);
        window.renderScenarios();
      };
    } catch (err) {
      loadingStage.style.display = "none";
      inputStage.style.display = "block";
      submitBtn.disabled = false;
      alert(err.message || "AI 劇情生成失敗，請稍後再試。");
    }
  });
};

document.addEventListener("DOMContentLoaded", window.renderScenarios);
function saveGeneratedScenario(scenario) {
  try {
    // 撈出目前已經存下來的故事，如果沒有就初始化空陣列
    const savedList = JSON.parse(localStorage.getItem("ArtEcho_Custom_Scenarios") || "[]");

    // 把新生成的故事塞進去
    savedList.push(scenario);

    // 轉回字串存進 LocalStorage
    localStorage.setItem("ArtEcho_Custom_Scenarios", JSON.stringify(savedList));
    console.log(`🎉 故事「${scenario.title}」已成功永久保存至瀏覽器！`);
  } catch (e) {
    console.error("❌ 儲存故事至 LocalStorage 失敗:", e);
  }
}

/**
 * 網頁載入時，自動把之前存的故事撈出來，塞回畫面資料庫中
 */
function loadSavedScenarios() {
  try {
    const savedList = JSON.parse(localStorage.getItem("ArtEcho_Custom_Scenarios") || "[]");

    // 將撈出來的故事逐一推進全域陣列中
    savedList.forEach(scenario => {
      // 防止重複推進陣列（雖然機率很低）
      if (!window.ArtEchoScenarios.some(s => s.id === scenario.id)) {
        window.ArtEchoScenarios.push(scenario);
      }
    });
  } catch (e) {
    console.error("❌ 讀取自訂故事失敗:", e);
  }
}

// 💡 搶在網頁畫面渲染出來之前，先把硬碟裡的故事載入進來
loadSavedScenarios();