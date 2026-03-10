(function () {
  var tickerText = document.getElementById("careTickerText");
  var tickerToggleBtn = document.getElementById("tickerToggleBtn");
  var resetLayoutBtn = document.getElementById("resetLayoutBtn");
  var worksPool = document.getElementById("worksPool");
  var layoutBoard = document.getElementById("layoutBoard");

  if (!tickerText || !worksPool || !layoutBoard) {
    return;
  }

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
    if (!tickerToggleBtn) {
      return;
    }
    tickerToggleBtn.textContent = tickerPaused ? "繼續提醒" : "暫停提醒";
    tickerToggleBtn.setAttribute("aria-pressed", tickerPaused ? "true" : "false");
  }

  function startTicker() {
    if (tickerTimer) {
      window.clearInterval(tickerTimer);
    }
    if (tickerPaused) {
      return;
    }

    tickerTimer = window.setInterval(function () {
      tickerText.style.opacity = "0";
      window.setTimeout(function () {
        tickerIndex = (tickerIndex + 1) % tickerMessages.length;
        tickerText.textContent = tickerMessages[tickerIndex];
        tickerText.style.opacity = "1";
      }, 180);
    }, 3200);
  }

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

  var galleryStorageKey = "artEchoGallery";
  var layoutStorageKey = "artEcho.home.layout.v1";
  var dragPayloadPrefix = "artecho-work:";

  function loadWorks() {
    try {
      var raw = localStorage.getItem(galleryStorageKey);
      var parsed = JSON.parse(raw || "[]");
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .slice()
        .reverse()
        .map(function (work, index) {
          var image = work.dataUrl || work.image || work.url || "";
          if (!image) {
            return null;
          }
          return {
            id: String(work.id || work.createdAt || ("work-" + index)),
            title: work.createdAt
              ? new Date(work.createdAt).toLocaleString("zh-Hant-TW", { hour12: false })
              : "未命名作品",
            image: image
          };
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function loadLayout() {
    try {
      var raw = localStorage.getItem(layoutStorageKey);
      var parsed = JSON.parse(raw || "{}");
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  var works = loadWorks();
  var layoutMap = loadLayout();

  function saveLayout() {
    localStorage.setItem(layoutStorageKey, JSON.stringify(layoutMap));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function cardPayload(id) {
    return dragPayloadPrefix + id;
  }

  function parsePayload(payload) {
    if (!payload || payload.indexOf(dragPayloadPrefix) !== 0) {
      return "";
    }
    return payload.replace(dragPayloadPrefix, "");
  }

  function createPoolCard(work) {
    var card = document.createElement("article");
    card.className = "work-card";
    card.draggable = true;
    card.dataset.workId = work.id;

    var img = document.createElement("img");
    img.alt = "個人作品";
    img.src = work.image;

    var label = document.createElement("p");
    label.textContent = work.title;

    card.appendChild(img);
    card.appendChild(label);

    card.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", cardPayload(work.id));
    });

    return card;
  }

  function createPlacedWork(work, position) {
    var placed = document.createElement("article");
    placed.className = "placed-work";
    placed.draggable = true;
    placed.dataset.workId = work.id;
    placed.style.left = position.x + "px";
    placed.style.top = position.y + "px";

    var img = document.createElement("img");
    img.alt = "主頁布置作品";
    img.src = work.image;

    var label = document.createElement("p");
    label.textContent = work.title;

    placed.appendChild(img);
    placed.appendChild(label);

    placed.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", cardPayload(work.id));
    });

    layoutBoard.appendChild(placed);
  }

  function renderPool() {
    worksPool.innerHTML = "";

    if (works.length === 0) {
      var empty = document.createElement("p");
      empty.className = "home-empty";
      empty.textContent = "目前還沒有作品，先到作畫空間建立作品，再回首頁布置。";
      worksPool.appendChild(empty);
      return;
    }

    works.forEach(function (work) {
      worksPool.appendChild(createPoolCard(work));
    });
  }

  function renderBoard() {
    layoutBoard.querySelectorAll(".placed-work, .board-empty").forEach(function (node) {
      node.remove();
    });

    var hasPlaced = false;
    works.forEach(function (work) {
      var position = layoutMap[work.id];
      if (!position) {
        return;
      }
      hasPlaced = true;
      createPlacedWork(work, position);
    });

    if (!hasPlaced) {
      var empty = document.createElement("p");
      empty.className = "board-empty";
      empty.textContent = "把作品拖曳到這裡，打造你的首頁小展牆。";
      layoutBoard.appendChild(empty);
    }
  }

  function updateLayoutByDrop(workId, clientX, clientY) {
    if (!workId) {
      return;
    }
    var boardRect = layoutBoard.getBoundingClientRect();
    var cardWidth = 128;
    var cardHeight = 152;
    var x = clamp(clientX - boardRect.left - cardWidth / 2, 0, boardRect.width - cardWidth);
    var y = clamp(clientY - boardRect.top - cardHeight / 2, 0, boardRect.height - cardHeight);

    layoutMap[workId] = {
      x: Math.round(x),
      y: Math.round(y)
    };

    saveLayout();
    renderBoard();
  }

  layoutBoard.addEventListener("dragenter", function () {
    layoutBoard.classList.add("is-over");
  });

  layoutBoard.addEventListener("dragleave", function (event) {
    if (event.relatedTarget && layoutBoard.contains(event.relatedTarget)) {
      return;
    }
    layoutBoard.classList.remove("is-over");
  });

  layoutBoard.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  layoutBoard.addEventListener("drop", function (event) {
    event.preventDefault();
    layoutBoard.classList.remove("is-over");

    var payload = event.dataTransfer.getData("text/plain");
    var workId = parsePayload(payload);
    updateLayoutByDrop(workId, event.clientX, event.clientY);
  });

  if (resetLayoutBtn) {
    resetLayoutBtn.addEventListener("click", function () {
      layoutMap = {};
      saveLayout();
      renderBoard();
    });
  }

  renderPool();
  renderBoard();
})();

