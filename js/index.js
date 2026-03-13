(function () {
  /**
   * 1. 元素選取
   * 改為獨立獲取，避免其中一個不存在就導致整個腳本停止
   */
  var tickerText = document.getElementById("careTickerText");
  var tickerToggleBtn = document.getElementById("tickerToggleBtn");
  
  var resetLayoutBtn = document.getElementById("resetLayoutBtn");
  var worksPool = document.getElementById("worksPool");
  var layoutBoard = document.getElementById("layoutBoard");

  /**
   * 2. 溫柔提醒 (Ticker) 相關邏輯
   * 使用 if (tickerText) 確保只有在該元素存在時才執行
   */
  if (tickerText) {
    var tickerMessages = [
      "今天畫畫了嗎？",
      "陰影的背面是陽光。",
      "你不需要完美，只需要慢慢前進。",
      "先好好呼吸，再讓線條流動。",
      "情緒不是負擔，是值得被看見的訊號。",
      "我知道這不容易，但我會盡我所能幫忙的，我們會一起度過難關"
    ];

    var tickerStateKey = "artEcho.home.ui.v1";
    var tickerIndex = 0;
    var tickerTimer = null;
    var tickerPaused = false;

    // 載入使用者偏好 (是否暫停)
    var loadTickerState = function() {
      try {
        var uiState = JSON.parse(localStorage.getItem(tickerStateKey) || "{}");
        tickerPaused = !!uiState.tickerPaused;
      } catch (error) {
        tickerPaused = false;
      }
    };

    // 儲存使用者偏好
    var saveTickerState = function() {
      var uiState = { tickerPaused: tickerPaused };
      localStorage.setItem(tickerStateKey, JSON.stringify(uiState));
    };

    // 更新按鈕文字與狀態
    var renderTickerButton = function() {
      if (!tickerToggleBtn) return;
      tickerToggleBtn.textContent = tickerPaused ? "繼續提醒" : "暫停提醒";
      tickerToggleBtn.setAttribute("aria-pressed", tickerPaused ? "true" : "false");
    };

    // 核心循環邏輯
    var startTicker = function() {
      if (tickerTimer) window.clearInterval(tickerTimer);
      if (tickerPaused) return;

      tickerTimer = window.setInterval(function () {
        tickerText.style.opacity = "0"; // 淡出
        window.setTimeout(function () {
          tickerIndex = (tickerIndex + 1) % tickerMessages.length;
          tickerText.textContent = tickerMessages[tickerIndex];
          tickerText.style.opacity = "1"; // 淡入
        }, 180);
      }, 3200);
    };

    // 初始化 Ticker
    loadTickerState();
    tickerText.textContent = tickerMessages[tickerIndex];
    renderTickerButton();
    startTicker();

    // 綁定切換按鈕
    if (tickerToggleBtn) {
      tickerToggleBtn.addEventListener("click", function () {
        tickerPaused = !tickerPaused;
        saveTickerState();
        renderTickerButton();
        startTicker();
      });
    }
  }

  /**
   * 3. 佈置模組 (HomeLayoutManager)
   * 只有在關鍵 DOM 元素都存在，且模組已載入時才啟動
   */
  if (worksPool && layoutBoard && typeof HomeLayoutManager !== "undefined") {
    HomeLayoutManager.init({
      worksPool: worksPool,
      layoutBoard: layoutBoard,
      resetBtn: resetLayoutBtn
    });
  }

  (function () {
    // 現有的功能模組...

    /**
     * 4. 切換資源列表 (Resource Toggle)
     */
    function toggleResource(type) {
      const govList = document.getElementById('gov-list');
      const clinicList = document.getElementById('clinic-list');

      if (type === 'gov') {
        govList.style.display = 'block';    // 顯示衛福部
        clinicList.style.display = 'none';  // 隱藏諮商所
      } else {
        govList.style.display = 'none';   // 隱藏衛福部
        clinicList.style.display = 'block'; // 顯示諮商所
      }
    }

    // 如果需要，將 `toggleResource` 綁定到全域作用域
    window.toggleResource = toggleResource;
  })();
  document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelector(".carousel-images");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    let startX = 0;
    let endX = 0;

    // 更新圖片和點的狀態
    const updateCarousel = (index) => {
      images.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    };

    // 綁定點擊事件到點
    dots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        currentIndex = index;
        updateCarousel(currentIndex);
      });
    });

    // 監聽觸控開始
    images.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    // 監聽觸控結束
    images.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (diff > 50) {
        // 向右滑動
        currentIndex = Math.max(0, currentIndex - 1);
      } else if (diff < -50) {
        // 向左滑動
        currentIndex = Math.min(dots.length - 1, currentIndex + 1);
      }

      updateCarousel(currentIndex);
    });
  });
})();
