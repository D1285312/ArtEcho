(function () {
  /**
   * 1. 元素選取
   */
  var tickerText = document.getElementById("careTickerText");
  var prevBtn = document.getElementById("tickerPrevBtn"); // 新增左箭頭
  var nextBtn = document.getElementById("tickerNextBtn"); // 新增右箭頭

  var resetLayoutBtn = document.getElementById("resetLayoutBtn");
  var worksPool = document.getElementById("worksPool");
  var layoutBoard = document.getElementById("layoutBoard");

  /**
   * 2. 溫柔提醒 (Ticker) 相關邏輯
   */
  if (tickerText) {
    var tickerMessages = [
      "今天畫畫了嗎？",
      "陰影的背面是陽光。",
      "你不需要完美，只需要慢慢前進。",
      "先好好呼吸，再讓線條流動。",
      "情緒不是負擔，是值得被看見的訊號。",
      "我知道這不容易，但你會看到你撐起的，我們會一起慢慢練習"
    ];

    var tickerIndex = 0;
    var tickerTimer = null;

    // 更新文字內容與淡入淡出動畫
    var updateTickerText = function(index) {
      tickerText.style.opacity = "0";
      window.setTimeout(function () {
        tickerText.textContent = tickerMessages[index];
        tickerText.style.opacity = "1";
      }, 300); // 配合 CSS 的 0.3s transition
    };

    // 啟動自動輪播
    var startTicker = function() {
      if (tickerTimer) window.clearInterval(tickerTimer);
      tickerTimer = window.setInterval(function () {
        tickerIndex = (tickerIndex + 1) % tickerMessages.length;
        updateTickerText(tickerIndex);
      }, 4000); // 每 4 秒自動跳下一則
    };

    // 綁定左箭頭點擊事件
    if (prevBtn) {
      prevBtn.addEventListener("click", function() {
        // 計算上一則的索引 (避免變成負數)
        tickerIndex = (tickerIndex - 1 + tickerMessages.length) % tickerMessages.length;
        updateTickerText(tickerIndex);
        startTicker(); // 點擊後重新計算自動輪播時間，避免馬上又跳下一則
      });
    }

    // 綁定右箭頭點擊事件
    if (nextBtn) {
      nextBtn.addEventListener("click", function() {
        tickerIndex = (tickerIndex + 1) % tickerMessages.length;
        updateTickerText(tickerIndex);
        startTicker();
      });
    }

    // 初始啟動
    updateTickerText(tickerIndex);
    startTicker();
  }

  /**
   * 3. 佈置模組 (HomeLayoutManager)
   */
  if (worksPool && layoutBoard && typeof HomeLayoutManager !== "undefined") {
    HomeLayoutManager.init({
      worksPool: worksPool,
      layoutBoard: layoutBoard,
      resetBtn: resetLayoutBtn
    });
  }

  /**
   * 4. 切換資源列表 (Resource Toggle)
   */
  function toggleResource(type) {
    const govList = document.getElementById('gov-list');
    const clinicList = document.getElementById('clinic-list');

    if (govList && clinicList) {
      if (type === 'gov') {
        govList.style.display = 'block';
        clinicList.style.display = 'none';
      } else {
        govList.style.display = 'none';
        clinicList.style.display = 'block';
      }
    }
  }

  window.toggleResource = toggleResource;
})();

/**
 * 5. 輪播圖 (Carousel) 邏輯
 */
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelector(".carousel-images");
  const dots = document.querySelectorAll(".dot");

  if (!images || dots.length === 0) return; // 保護機制，避免其他頁面報錯

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

/**
 * 6. ArtEcho 多維藝術共生空間 - 沉浸式動態畫廊核心邏輯
 */
(function () {
  // 確保頁面 DOM 元素都載入完成後再執行初始化
  document.addEventListener("DOMContentLoaded", function () {
    var currentTheme = 'fish';
    var drawCanvas = document.getElementById('drawCanvas');
    var ecoCanvas = document.getElementById('ecoCanvas');

    // 保護機制：如果首頁沒有這些畫廊元素（例如在其他頁面引入了 index.js），則直接跳出不執行
    if (!drawCanvas || !ecoCanvas) return;

    var drawCtx = drawCanvas.getContext('2d');
    var ecoCtx = ecoCanvas.getContext('2d');
    var drawingOverlay = document.getElementById('drawing-overlay');
    var namingOverlay = document.getElementById('naming-overlay');
    var wrapper = document.getElementById('gallery-zone-wrapper');

    var creatures = { fish: [], butterfly: [], jellyfish: [] };
    var isDrawing = false;
    var isEraser = false;
    var history = [];
    var pendingCreatureData = null;
    var selectedCreature = null;
    var selectedCreatureTimer = null;
    var creatureStorageKey = 'artEchoSymbioticCreatures';
    var deleteCreatureBtn = document.getElementById('deleteCreatureBtn');

    var feedbackMessages = {
      fish: ["一隻可愛的小金魚誕生了！", "看！水池裡多了一位新朋友。", "這隻小魚游得真自在。", "優雅的金魚加入了水族館。"],
      butterfly: ["美麗的蝴蝶翩翩起舞了！", "花叢中多了一抹亮麗的色彩。", "這隻蝴蝶畫得真精緻。", "自由的靈魂化作蝴蝶飛翔了。"],
      jellyfish: ["幻彩水母在深海中發光了！", "深海裡多了一個溫柔的呼吸。", "神祕的水母正在靜靜漂浮。", "這隻水母讓深海變得更夢幻了。"]
    };

    // 視窗尺寸重設邏輯
    var resizeGallery = function () {
      if (!wrapper) return;
      var rect = wrapper.getBoundingClientRect();
      ecoCanvas.width = rect.width;
      ecoCanvas.height = rect.height;
      drawCanvas.width = 600;
      drawCanvas.height = 450;
    };

    // 全域導覽與控制函數（綁定至 window 確保 HTML 的 onclick 讀取得到）
    window.initGallery = function (theme) {
      currentTheme = theme;
      var bgMap = {
        fish: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(180deg, #054d74 0%, #022e47 100%)',
        butterfly: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 40%), linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
        jellyfish: 'radial-gradient(circle at 50% 50%, rgba(103,58,183,0.2) 0%, transparent 70%), linear-gradient(180deg, #1a237e 0%, #0d1137 100%)'
      };
      ecoCanvas.style.background = bgMap[theme];
      document.getElementById('selector-overlay').style.display = 'none';
      resizeGallery();
    };

    window.resetToSelector = function () {
      document.getElementById('selector-overlay').style.display = 'flex';
    };

    window.openDrawing = function () {
      drawingOverlay.style.display = 'flex';
      clearDrawingBoard();
    };

    window.closeDrawing = function () {
      drawingOverlay.style.display = 'none';
    };

    window.toggleEraser = function () {
      isEraser = !isEraser;
      document.getElementById('eraserBtn').classList.toggle('active', isEraser);
    };

    window.undo = function () {
      if (history.length === 0) return;
      var img = new Image();
      img.onload = function () {
        drawCtx.clearRect(0, 0, 600, 450);
        drawCtx.drawImage(img, 0, 0);
      };
      img.src = history.pop();
    };

    var clearDrawingBoard = function () {
      drawCtx.clearRect(0, 0, 600, 450);
      history = [];
    };

    var showToast = function (message) {
      var toast = document.getElementById('feedback-toast');
      if (!toast) return;
      toast.innerText = message;
      toast.classList.add('show');
      window.setTimeout(function () { toast.classList.remove('show'); }, 2500);
    };

    var updateDeleteButton = function () {
      if (!deleteCreatureBtn) return;
      deleteCreatureBtn.disabled = !selectedCreature;
      deleteCreatureBtn.classList.toggle('is-visible', !!selectedCreature);
    };

    var clearSelectedCreature = function () {
      if (selectedCreature) selectedCreature.isSelected = false;
      selectedCreature = null;
      if (selectedCreatureTimer) window.clearTimeout(selectedCreatureTimer);
      selectedCreatureTimer = null;
      updateDeleteButton();
    };

    var selectCreature = function (creature) {
      clearSelectedCreature();
      selectedCreature = creature;
      selectedCreature.isSelected = true;
      selectedCreature.triggerName();
      updateDeleteButton();
      selectedCreatureTimer = window.setTimeout(clearSelectedCreature, 6000);
    };

    var saveCreatures = function () {
      try {
        var data = {};
        Object.keys(creatures).forEach(function (theme) {
          data[theme] = creatures[theme].map(function (c) {
            return {
              id: c.id,
              name: c.name,
              type: c.type,
              image: c.canvas.toDataURL('image/png'),
              xRatio: ecoCanvas.width ? c.x / ecoCanvas.width : 0.5,
              yRatio: ecoCanvas.height ? c.y / ecoCanvas.height : 0.5,
              headSide: c.headSide,
              vx: c.vx,
              vy: c.vy
            };
          });
        });
        localStorage.setItem(creatureStorageKey, JSON.stringify(data));
      } catch (err) {
        console.warn('Unable to save gallery creatures.', err);
      }
    };

    var loadCreatures = function () {
      var raw = localStorage.getItem(creatureStorageKey);
      if (!raw) return;
      try {
        var data = JSON.parse(raw);
        Object.keys(creatures).forEach(function (theme) {
          (data[theme] || []).forEach(function (item) {
            var img = new Image();
            img.onload = function () {
              var storedCanvas = document.createElement('canvas');
              storedCanvas.width = img.width;
              storedCanvas.height = img.height;
              storedCanvas.getContext('2d').drawImage(img, 0, 0);
              var c = new SmartCreature(
                storedCanvas,
                (item.xRatio || 0.5) * ecoCanvas.width,
                (item.yRatio || 0.5) * ecoCanvas.height,
                item.type || theme,
                item.headSide || 1,
                item.name || '無名小生物',
                item.id
              );
              if (typeof item.vx === 'number') c.vx = item.vx;
              if (typeof item.vy === 'number') c.vy = item.vy;
              c.updateFlip();
              creatures[theme].push(c);
            };
            img.src = item.image;
          });
        });
      } catch (err) {
        console.warn('Unable to load gallery creatures.', err);
      }
    };

    // 獲取精確繪圖相對座標
    var getPos = function (e) {
      var rect = drawCanvas.getBoundingClientRect();
      var clientX = e.clientX || (e.touches && e.touches[0].clientX);
      var clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    // 繪圖事件綁定
    drawCanvas.onmousedown = drawCanvas.ontouchstart = function (e) {
      if (e.type === 'touchstart') e.preventDefault();
      history.push(drawCanvas.toDataURL());
      isDrawing = true;
      var pos = getPos(e);
      drawCtx.beginPath();
      drawCtx.moveTo(pos.x, pos.y);
    };

    drawCanvas.onmousemove = drawCanvas.ontouchmove = function (e) {
      if (!isDrawing) return;
      if (e.type === 'touchmove') e.preventDefault();
      var pos = getPos(e);
      drawCtx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      drawCtx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : document.getElementById('colorPicker').value;
      drawCtx.lineWidth = document.getElementById('sizeSlider').value;
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.lineTo(pos.x, pos.y);
      drawCtx.stroke();
    };

    window.onmouseup = window.ontouchend = function () {
      isDrawing = false;
    };

    // 點擊畫廊生物觸發顯示名字
    ecoCanvas.onclick = function (e) {
      var rect = ecoCanvas.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var clickY = e.clientY - rect.top;
      var target = null;
      creatures[currentTheme].slice().reverse().some(function (c) {
        var dx = clickX - c.x;
        var dy = clickY - c.y;
        if (Math.abs(dx) < c.w / 2 + 20 && Math.abs(dy) < c.h / 2 + 20) {
          target = c;
          return true;
        }
        return false;
      });
      if (target) {
        selectCreature(target);
      } else {
        clearSelectedCreature();
      }
    };

    window.deleteSelectedCreature = function () {
      if (!selectedCreature) {
        showToast('請先點選想刪除的生物');
        return;
      }
      var creatureName = selectedCreature.name || '這個生物';
      var themeCreatures = creatures[selectedCreature.type] || creatures[currentTheme];
      var index = themeCreatures.indexOf(selectedCreature);
      if (index !== -1) themeCreatures.splice(index, 1);
      clearSelectedCreature();
      saveCreatures();
      showToast('「' + creatureName + '」已從畫廊移除');
    };

    // 完成繪製演算法
    window.finalize = function () {
      var imgData = drawCtx.getImageData(0, 0, 600, 450);
      var minX = 600, maxX = 0, minY = 450, maxY = 0, found = false;
      for (var y = 0; y < 450; y++) {
        for (var x = 0; x < 600; x++) {
          if (imgData.data[(y * 600 + x) * 4 + 3] > 20) {
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
            found = true;
          }
        }
      }
      if (!found) return;

      var w = maxX - minX, h = maxY - minY;
      var headSide = 1;
      if (currentTheme === 'fish') {
        var tempC = document.createElement('canvas'); tempC.width = w; tempC.height = h;
        var tCtx = tempC.getContext('2d'); tCtx.drawImage(drawCanvas, minX, minY, w, h, 0, 0, w, h);
        var data = tCtx.getImageData(0, 0, w, h).data;
        var lH = 0, rH = 0;
        for (var x = 0; x < w; x++) {
          var col = 0;
          for (var y = 0; y < h; y++) if (data[(y * w + x) * 4 + 3] > 20) col++;
          if (x < w * 0.25) lH += col; if (x > w * 0.75) rH += col;
        }
        headSide = (rH >= lH) ? -1 : 1;
      }

      var offCanvas = document.createElement('canvas');
      offCanvas.width = w + 20; offCanvas.height = h + 20;
      offCanvas.getContext('2d').drawImage(drawCanvas, minX - 10, minY - 10, w + 20, h + 20, 0, 0, w + 20, h + 20);

      pendingCreatureData = { canvas: offCanvas, headSide: headSide };
      var titles = { fish: "幫金魚取個名字", butterfly: "幫蝴蝶取個名字", jellyfish: "幫水母取個名字" };
      document.getElementById('naming-title').innerText = titles[currentTheme];
      document.getElementById('creature-name').value = "";
      namingOverlay.style.display = 'flex';
    };

    // 確認命名並投入畫廊
    window.confirmNaming = function () {
      var name = document.getElementById('creature-name').value || "無名小生物";
      var c = new SmartCreature(pendingCreatureData.canvas, ecoCanvas.width / 2, ecoCanvas.height / 2, currentTheme, pendingCreatureData.headSide, name);
      creatures[currentTheme].push(c);
      saveCreatures();

      namingOverlay.style.display = 'none';
      window.closeDrawing();

      showToast('「' + name + '」已加入畫廊！');
      pendingCreatureData = null;
    };

    // 智能生物動態類別
    class SmartCreature {
      constructor(canvas, x, y, type, headSide, name, id) {
        this.canvas = canvas; this.x = x; this.y = y;
        this.w = canvas.width; this.h = canvas.height;
        this.type = type; this.headSide = headSide; this.name = name;
        this.id = id || String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        this.isSelected = false;
        this.vx = (Math.random() * 0.6 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = (type === 'jellyfish' ? -0.5 : (Math.random() - 0.5) * 1.0);
        this.phase = Math.random() * Math.PI * 2;
        this.nameOpacity = 0; this.nameTargetOpacity = 0;
        this.updateFlip();
      }
      updateFlip() {
        if (this.type === 'jellyfish') { this.flip = 1; return; }
        this.flip = (this.vx > 0) ? (this.headSide === 1 ? 1 : -1) : (this.headSide === 1 ? -1 : 1);
      }
      triggerName() {
        this.nameTargetOpacity = 1;
        var self = this;
        window.setTimeout(function () { self.nameTargetOpacity = 0; }, 5000);
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        var speed = { fish: 0.15, butterfly: 0.07, jellyfish: 0.05 };
        this.phase += speed[this.type];
        if (this.x < 50 || this.x > ecoCanvas.width - 50) { this.vx *= -1; this.updateFlip(); }
        if (this.y < 50 || this.y > ecoCanvas.height - 50) this.vy *= -1;
        if (this.type === 'jellyfish' && this.y < 30) this.y = ecoCanvas.height + 30;

        if (this.nameOpacity < this.nameTargetOpacity) this.nameOpacity += 0.04;
        if (this.nameOpacity > this.nameTargetOpacity) this.nameOpacity -= 0.04;
      }
      draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);

        if (this.isSelected) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(-this.w / 2 - 10, -this.h / 2 - 10, this.w + 20, this.h + 20);
          ctx.restore();
        }

        if (this.nameOpacity > 0) {
          ctx.save();
          ctx.globalAlpha = this.nameOpacity;
          ctx.fillStyle = "white";
          ctx.font = "14px Noto Sans TC";
          ctx.textAlign = "center";
          ctx.shadowBlur = 4; ctx.shadowColor = "black";
          ctx.fillText(this.name, 0, this.h / 2 + 25);
          ctx.restore();
        }

        ctx.scale(this.flip, 1);
        if (this.type === 'fish') {
          var slices = 15, sw = this.w / slices;
          for (var i = 0; i < slices; i++) {
            var t = i / (slices - 1);
            var wiggle = (this.headSide === 1) ? (t < 0.5 ? Math.sin(this.phase + t * 4) * ((0.5 - t) / 0.5) * 12 : 0) : (t > 0.5 ? Math.sin(this.phase + (1 - t) * 4) * ((t - 0.5) / 0.5) * 12 : 0);
            ctx.drawImage(this.canvas, i * sw, 0, sw, this.h, (i * sw) - this.w / 2, wiggle - this.h / 2, sw, this.h);
          }
        } else if (this.type === 'butterfly') {
          var flap = Math.abs(Math.sin(this.phase)) * 0.75 + 0.25;
          ctx.save(); ctx.scale(flap, 1); ctx.drawImage(this.canvas, 0, 0, this.w / 2, this.h, -this.w / 2, -this.h / 2, this.w / 2, this.h); ctx.restore();
          ctx.save(); ctx.scale(flap, 1); ctx.drawImage(this.canvas, this.w / 2, 0, this.w / 2, this.h, 0, -this.h / 2, this.w / 2, this.h); ctx.restore();
        } else if (this.type === 'jellyfish') {
          var s = Math.sin(this.phase) * 0.15 + 0.85;
          ctx.scale(1 / s * 0.9, s); ctx.globalAlpha = 0.8; ctx.drawImage(this.canvas, -this.w / 2, -this.h / 2);
        }
        ctx.restore();
      }
    }

    // 畫廊實時渲染主循環
    var loopGallery = function () {
      ecoCtx.clearRect(0, 0, ecoCanvas.width, ecoCanvas.height);
      if (document.getElementById('selector-overlay').style.display !== 'flex') {
        creatures[currentTheme].forEach(function (c) {
          c.update();
          c.draw(ecoCtx);
        });
      }
      window.requestAnimationFrame(loopGallery);
    };

    // 初始化與事件監聽
    resizeGallery();
    loadCreatures();
    window.addEventListener('resize', resizeGallery);
    loopGallery();
  });
})();
