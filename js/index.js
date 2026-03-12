(function () {
  // 1. 元素選取
  var tickerText = document.getElementById("careTickerText");
  var tickerToggleBtn = document.getElementById("tickerToggleBtn");
  var resetLayoutBtn = document.getElementById("resetLayoutBtn");
  var worksPool = document.getElementById("worksPool");
  var layoutBoard = document.getElementById("layoutBoard");

  if (!tickerText || !worksPool || !layoutBoard) {
    return;
  }

  // 2. 心靈小語 (Ticker) 相關邏輯
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

  function loadTickerState() {
    try {
      var uiState = JSON.parse(localStorage.getItem(tickerStateKey) || "{}");
      tickerPaused = !!uiState.tickerPaused;
    } catch (error) {
      tickerPaused = false;
    }
  }

  function saveTickerState() {
    var uiState = { tickerPaused: tickerPaused };
    localStorage.setItem(tickerStateKey, JSON.stringify(uiState));
  }

  function renderTickerButton() {
    if (!tickerToggleBtn) return;
    tickerToggleBtn.textContent = tickerPaused ? "繼續提醒" : "暫停提醒";
    tickerToggleBtn.setAttribute("aria-pressed", tickerPaused ? "true" : "false");
  }

  function startTicker() {
    if (tickerTimer) window.clearInterval(tickerTimer);
    if (tickerPaused) return;

    tickerTimer = window.setInterval(function () {
      tickerText.style.opacity = "0";
      window.setTimeout(function () {
        tickerIndex = (tickerIndex + 1) % tickerMessages.length;
        tickerText.textContent = tickerMessages[tickerIndex];
        tickerText.style.opacity = "1";
      }, 180);
    }, 3200);
  }

  // 3. Ticker 初始化與事件監聽
  loadTickerState();
  tickerText.textContent = tickerMessages[tickerIndex];
  renderTickerButton();
  startTicker();

  if (tickerToggleBtn) {
    tickerToggleBtn.addEventListener("click", function () {
      tickerPaused = !tickerPaused;
      saveTickerState();
      renderTickerButton();
      startTicker();
    });
  }

  // 4. 調用獨立出來的佈置模組
  // 確保此處執行前，HomeLayoutManager 已經被載入
  if (typeof HomeLayoutManager !== "undefined") {
    HomeLayoutManager.init({
      worksPool: worksPool,
      layoutBoard: layoutBoard,
      resetBtn: resetLayoutBtn
    });
  }
})();
