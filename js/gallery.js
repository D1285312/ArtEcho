/**
 * ArtEcho 主頁佈置管理模組 (進階版)
 */
const HomeLayoutManager = {
    config: {
        galleryStorageKey: "artEchoGallery",
        layoutStorageKey: "artEcho.home.layout.v1",
        dragPayloadPrefix: "artecho-work:",
        cardSize: { width: 128, height: 160 },
        snapGrid: 20, // 自動對齊格線，設為 1 則關閉
    },
    layoutMap: {},
    works: [],

    init(nodes) {
        this.nodes = nodes;
        this.loadData();
        this.bindEvents();
        this.handleResize();
        this.render();
    },

    loadData() {
        try {
            const rawWorks = JSON.parse(localStorage.getItem(this.config.galleryStorageKey) || "[]");
            this.works = rawWorks.slice().reverse().map((work, index) => ({
                id: String(work.id || work.createdAt || `work-${index}`),
                title: work.name || (work.createdAt ? new Date(work.createdAt).toLocaleDateString() : "未命名作品"),
                image: work.dataUrl || ""
            })).filter(w => w.image);
        } catch (e) { this.works = []; }

        try {
            this.layoutMap = JSON.parse(localStorage.getItem(this.config.layoutStorageKey) || "{}");
        } catch (e) { this.layoutMap = {}; }
    },

    saveLayout() {
        localStorage.setItem(this.config.layoutStorageKey, JSON.stringify(this.layoutMap));
    },
    maxZIndex: 10,
    /** 核心：計算對齊與邊界限制 */
    updatePosition(workId, clientX, clientY) {
        if (!workId || !this.nodes.layoutBoard) return;

        const rect = this.nodes.layoutBoard.getBoundingClientRect();
        const { width, height } = this.config.cardSize;
        const grid = this.config.snapGrid;

        // 計算滑鼠在板上的相對座標 (中心點對齊)
        let x = clientX - rect.left - (width / 2);
        let y = clientY - rect.top - (height / 2);

        // 自動對齊格線
        x = Math.round(x / grid) * grid;
        y = Math.round(y / grid) * grid;

        // 邊界限制 (防止作品跑出板外)
        x = Math.max(0, Math.min(rect.width - width, x));
        y = Math.max(0, Math.min(rect.height - height, y));
        this.maxZIndex++;
        this.layoutMap[workId] = {
            x: Math.round(x),
            y: Math.round(y),
            zIndex: this.maxZIndex // 儲存層級
        };

        this.saveLayout();
        this.render();
    },

    /** 移除單一佈置作品 */
    removeWorkFromBoard(workId) {
        if (this.layoutMap[workId]) {
            delete this.layoutMap[workId];
            this.saveLayout();
            this.render();
        }
    },

    render() {
        this.renderPool();
        this.renderBoard();
    },

    renderPool() {
        const { worksPool } = this.nodes;
        if (!worksPool) return;
        worksPool.innerHTML = "";

        if (this.works.length === 0) {
            worksPool.innerHTML = `<p class="home-empty">目前還沒有作品。</p>`;
            return;
        }

        this.works.forEach(work => {
            const card = this.createCardElement(work, "work-card");
            if (this.layoutMap[work.id]) {
                card.classList.add("is-placed");
            }

            worksPool.appendChild(card);
        });
    },

    renderBoard() {
        const { layoutBoard } = this.nodes;
        if (!layoutBoard) return;

        layoutBoard.querySelectorAll(".placed-work, .board-empty").forEach(n => n.remove());

        let hasPlaced = false;
        const boardWidth = layoutBoard.clientWidth;

        this.works.forEach(work => {
            const pos = this.layoutMap[work.id];
            if (pos) {
                // 自適應修正：如果存檔的 X 超過目前板子寬度，自動推回邊界
                const safeX = Math.min(pos.x, boardWidth - this.config.cardSize.width);

                hasPlaced = true;
                const placed = this.createCardElement(work, "placed-work");
                Object.assign(placed.style, {
                    left: `${Math.min(pos.x, boardWidth - this.config.cardSize.width)}px`,
                    top: `${pos.y}px`,
                    zIndex: pos.zIndex || 1 // 如果舊資料沒 zIndex 預設為 1
                });
                placed.addEventListener('mousedown', () => {
                    this.maxZIndex++;
                    placed.style.zIndex = this.maxZIndex;
                    this.layoutMap[work.id].zIndex = this.maxZIndex;
                    this.saveLayout();
                });
                // 加入移除按鈕
                const delBtn = document.createElement("button");
                delBtn.className = "remove-work-btn";
                delBtn.innerHTML = "×";
                delBtn.title = "從佈置中移除";
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.removeWorkFromBoard(work.id);
                };
                placed.appendChild(delBtn);

                layoutBoard.appendChild(placed);
            }
        });

        if (!hasPlaced) {
            layoutBoard.insertAdjacentHTML('beforeend', `<p class="board-empty">拖曳作品到此開始佈置</p>`);
        }
    },

    createCardElement(work, className) {
        const el = document.createElement("article");
        el.className = className;
        el.draggable = true;
        el.innerHTML = `
            <div class="card-img-wrap">
                <img src="${work.image}" alt="作品" loading="lazy">
            </div>
            <p>${work.title}</p>
        `;

        el.addEventListener("dragstart", (e) => {
            el.classList.add("is-dragging");
            e.dataTransfer.setData("text/plain", this.config.dragPayloadPrefix + work.id);
            e.dataTransfer.effectAllowed = "move";
        });

        el.addEventListener("dragend", () => {
            el.classList.remove("is-dragging");
        });

        return el;
    },

    bindEvents() {
        const { layoutBoard, resetBtn } = this.nodes;

        layoutBoard.addEventListener("dragover", e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        layoutBoard.addEventListener("dragenter", () => layoutBoard.classList.add("is-over"));
        layoutBoard.addEventListener("dragleave", () => layoutBoard.classList.remove("is-over"));

        layoutBoard.addEventListener("drop", (e) => {
            e.preventDefault();
            layoutBoard.classList.remove("is-over");
            const rawId = e.dataTransfer.getData("text/plain");
            if (rawId.startsWith(this.config.dragPayloadPrefix)) {
                const id = rawId.replace(this.config.dragPayloadPrefix, "");
                this.updatePosition(id, e.clientX, e.clientY);
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if(confirm("確定要重設所有作品位置嗎？")) {
                    this.layoutMap = {};
                    this.saveLayout();
                    this.render();
                }
            });
        }
    },

    handleResize() {
        // 當視窗縮放時，重新渲染以修正可能溢出的座標
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.renderBoard(), 200);
        });
    }
};