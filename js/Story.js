/**
 * ArtEcho 劇情與章節整合資料庫
 * 主選單資訊 (Scenarios) 與 內部章節內容 (Chapters)
 */
window.ArtEchoScenarios = [
  {
    id: "snow_white",
    title: "公主的等待",
    description: "一段關於權力、嫉妒與重生的心理旅程。妳將經歷從大廳到森林的轉變。",
    image: "images/princes.png",
    clickable: true,
    // 內部章節設定
    chapters: {
      "1": {
        title: "第一章：大廳的迎接",
        desc: "妳是一名公主正站在大廳迎接新繼母。請描繪當下的氛圍，妳的心情與樣貌。",
        img: "images/princes.png"
      },
      "2": {
        title: "第二章：魔鏡的預言",
        desc: "牆上的魔鏡給出了令人不安的答案。請描繪那股從腳底升起的寒意與預兆。",
        img: "images/rat.png"
      },
      "3": {
        title: "第三章：逃往森林",
        desc: "獵人的仁慈讓妳奔向深山。請描繪森林深處的恐懼與微弱的希望。",
        img: "images/grandandog.png"
      },
      "4": {
        title: "第四章：最終的抉擇",
        desc: "咬下那口蘋果之前... 請描繪這最後一刻的情緒與色彩。",
        img: "images/music.png"
      }
    }
  },
  // 以下為鎖定中的劇情
  {
    id: "locked-scenario-1",
    title: "即將開放",
    description: "更多情境劇情正在準備中，敬請期待...",
    image: "images/rat.png",
    clickable: false,
    chapters: {}
  },
  {
    id: "locked-scenario-2",
    title: "即將開放",
    description: "更多情境劇情正在準備中，敬請期待...",
    image: "images/grandandog.png",
    clickable: false,
    chapters: {}
  },
  {
    id: "locked-scenario-3",
    title: "即將開放",
    description: "更多情境劇情正在準備中，敬請期待...",
    image: "images/music.png",
    clickable: false,
    chapters: {}
  }
];

/* ==========================================================================
   工具函式區 (提供給 Story.html 與 Studio.html 使用)
   ========================================================================== */

/**
 * 根據劇情 ID 與 章節編號 取得特定內容 (Studio.html 使用)
 */
window.getChapterData = function(scenarioId, chapterLevel) {
  const scenario = window.ArtEchoScenarios.find(s => s.id === scenarioId);
  if (scenario && scenario.chapters) {
    // 預設如果抓不到該章節，就給第一章
    return scenario.chapters[chapterLevel] || scenario.chapters["1"];
  }
  return null;
};

/**
 * 根據 ID 取得整個劇情物件
 */
window.getScenarioById = function(id) {
  return window.ArtEchoScenarios.find(s => s.id === id);
};

/**
 * 取得第一個可用的劇情作為預設值
 */
window.getDefaultScenario = function() {
  return window.ArtEchoScenarios.find(s => s.clickable) || window.ArtEchoScenarios[0];
};

/**
 * 渲染 Story.html 的主選單畫面
 */
window.renderScenarios = function() {
  const scenarioGrid = document.getElementById("scenarioGrid");
  if (!scenarioGrid) return; // 如果不是在 Story.html 就不執行

  scenarioGrid.innerHTML = "";

  window.ArtEchoScenarios.forEach(function(scenario) {
    const card = document.createElement("article");
    card.className = "scenario-card";
    if (!scenario.clickable) card.classList.add("locked");

    const contentHtml = `
      <div class="scenario-card-img">
        <img src="${scenario.image}" alt="${scenario.title}">
        ${!scenario.clickable ? '<div class="lock-icon">🔒</div>' : ''}
      </div>
      <div class="scenario-card-content">
        <h3>${scenario.title}</h3>
        <p>${scenario.description}</p>
      </div>
    `;

    if (scenario.clickable) {
      const link = document.createElement("a");
      // 點擊後跳轉到 Studio，預設帶入第一章參數
      link.href = `Studio.html?scenario=${encodeURIComponent(scenario.id)}&chapter=1`;
      link.className = "scenario-link";
      link.innerHTML = contentHtml;
      card.appendChild(link);
    } else {
      card.innerHTML = contentHtml;
    }

    scenarioGrid.appendChild(card);
  });
};

// 監聽載入事件，自動渲染選單
document.addEventListener("DOMContentLoaded", window.renderScenarios);
