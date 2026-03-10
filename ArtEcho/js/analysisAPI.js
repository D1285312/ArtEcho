/**
 * ArtEcho 物理數據分析 API
 * 負責從畫布提取客觀物理參數、形狀偵測、名稱生成
 */
export const AnalysisAPI = {
    /**
     * 執行畫布像素掃描
     */
    getPhysicalStats(ctx, width, height, drawingSteps) {
        const imgData = ctx.getImageData(0, 0, width, height).data;
        let warmPixels = 0;
        let paintedPixels = 0;
        let leftPixels = 0;

        // 逐像素分析 RGB 數值
        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];

            // 判斷是否為「非背景色」像素 (背景為 #fffdfa)
            if (r < 252 || g < 252 || b < 248) {
                paintedPixels++;

                // 計算空間分佈
                const x = (i / 4) % width;
                if (x < width / 2) leftPixels++;

                // 判斷冷暖色 (R > B 為暖)
                if (r > b) warmPixels++;
            }
        }

        const totalPixels = width * height;
        const coverage = ((paintedPixels / totalPixels) * 100).toFixed(1);
        const warmRatio = paintedPixels > 0 ? Math.round((warmPixels / paintedPixels) * 100) : 0;

        return {
            coverage: coverage,
            warmRatio: warmRatio,
            coolRatio: 100 - warmRatio,
            leftWeight: paintedPixels > 0 ? Math.round((leftPixels / paintedPixels) * 100) : 50,
            strokeCount: drawingSteps.length // 從紀錄中提取總筆劃
        };
    },

    /**
     * 偵測畫布中的形狀物件
     * 使用連通區域分析 (Connected Component) 來識別獨立物件
     * 再根據每個物件的幾何特徵判斷形狀類別
     */
    detectShapes(ctx, width, height) {
        const imgData = ctx.getImageData(0, 0, width, height).data;
        const step = 3; // 每 3 個像素取一次，加速掃描

        // 建立二值化地圖 (是否有繪畫)
        const mapW = Math.ceil(width / step);
        const mapH = Math.ceil(height / step);
        const binaryMap = new Uint8Array(mapW * mapH);

        for (let my = 0; my < mapH; my++) {
            for (let mx = 0; mx < mapW; mx++) {
                const px = mx * step;
                const py = my * step;
                const i = (py * width + px) * 4;
                const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
                if (r < 252 || g < 252 || b < 248) {
                    binaryMap[my * mapW + mx] = 1;
                }
            }
        }

        // 連通區域標記 (Flood Fill)
        const labels = new Int32Array(mapW * mapH);
        let labelId = 0;
        const regions = []; // 每區域的 {minX, minY, maxX, maxY, pixels, sumX, sumY}

        for (let my = 0; my < mapH; my++) {
            for (let mx = 0; mx < mapW; mx++) {
                const idx = my * mapW + mx;
                if (binaryMap[idx] === 1 && labels[idx] === 0) {
                    labelId++;
                    const region = { minX: mx, minY: my, maxX: mx, maxY: my, pixels: 0, sumX: 0, sumY: 0 };
                    const stack = [idx];
                    while (stack.length > 0) {
                        const ci = stack.pop();
                        if (labels[ci] !== 0) continue;
                        labels[ci] = labelId;
                        const cy = Math.floor(ci / mapW);
                        const cx = ci % mapW;
                        region.pixels++;
                        region.sumX += cx;
                        region.sumY += cy;
                        if (cx < region.minX) region.minX = cx;
                        if (cx > region.maxX) region.maxX = cx;
                        if (cy < region.minY) region.minY = cy;
                        if (cy > region.maxY) region.maxY = cy;

                        // 4-方向擴展
                        const neighbors = [
                            ci - 1, ci + 1,
                            ci - mapW, ci + mapW
                        ];
                        for (const ni of neighbors) {
                            if (ni >= 0 && ni < binaryMap.length && binaryMap[ni] === 1 && labels[ni] === 0) {
                                const nx = ni % mapW;
                                const ny = Math.floor(ni / mapW);
                                // 確保不跨行
                                if (Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1) {
                                    stack.push(ni);
                                }
                            }
                        }
                    }
                    // 過濾太小的雜訊區域 (至少 15 個像素點)
                    if (region.pixels >= 15) {
                        regions.push(region);
                    }
                }
            }
        }

        // 分類每個區域的形狀
        const shapes = [];
        const detected = new Set();

        for (const r of regions) {
            const w = r.maxX - r.minX + 1;
            const h = r.maxY - r.minY + 1;
            const aspectRatio = w / (h || 1);
            const fillRatio = r.pixels / (w * h || 1);
            const centroidX = r.sumX / r.pixels;
            const centroidY = r.sumY / r.pixels;
            const relCentroidY = (centroidY - r.minY) / (h || 1);

            let shape = null;

            // 房子偵測：下方矩形 + 上方三角形 → 重心偏下，填充率中等
            if (h > w * 0.8 && fillRatio > 0.25 && fillRatio < 0.65 && relCentroidY > 0.55) {
                shape = { type: 'house', label: '🏠 房子', confidence: fillRatio };
            }
            // 人物偵測：高度 > 寬度 × 1.8，填充率低到中
            else if (aspectRatio < 0.6 && h > 8 && fillRatio > 0.15 && fillRatio < 0.55) {
                shape = { type: 'person', label: '👤 人物', confidence: fillRatio };
            }
            // 圓形偵測：長寬比接近 1，填充率高
            else if (aspectRatio > 0.7 && aspectRatio < 1.4 && fillRatio > 0.55) {
                shape = { type: 'circle', label: '🔴 圓形', confidence: fillRatio };
            }
            // 三角形偵測：重心偏下，填充率 0.3~0.6
            else if (fillRatio > 0.25 && fillRatio < 0.58 && relCentroidY > 0.5) {
                shape = { type: 'triangle', label: '🔺 三角形', confidence: fillRatio };
            }
            // 方形偵測：長寬比接近 1 或矩形，填充率高
            else if (aspectRatio > 0.5 && aspectRatio < 2.0 && fillRatio > 0.5) {
                shape = { type: 'square', label: '⬛ 方形', confidence: fillRatio };
            }
            // 其他有形物件
            else if (r.pixels > 30) {
                shape = { type: 'object', label: '🎯 物件', confidence: fillRatio };
            }

            if (shape && !detected.has(shape.type)) {
                detected.add(shape.type);
                shapes.push(shape);
            }
        }

        // 如果沒有辨識出任何形狀
        if (shapes.length === 0) {
            shapes.push({ type: 'freeform', label: '🌊 自由風格', confidence: 0 });
        }

        return {
            shapes: shapes,
            regionCount: regions.length
        };
    },

    /**
     * 根據數據與形狀自動為畫作取一箇中文名稱
     */
    generateName(stats, shapeResult) {
        const coverage = parseFloat(stats.coverage);
        const warmRatio = parseInt(stats.warmRatio);
        const shapes = shapeResult ? shapeResult.shapes : [];
        const shapeTypes = shapes.map(s => s.type);

        // 溫度描述詞
        const tempWords = warmRatio > 70 ? ['溫暖的', '熾熱的', '陽光下的']
            : warmRatio > 40 ? ['柔和的', '微光中的', '黃昏時的']
                : ['沉靜的', '涼爽的', '月光下的'];

        // 密度描述詞
        const densityWords = coverage > 50 ? ['繁盛', '填滿', '豐盈']
            : coverage > 20 ? ['漫步', '散落', '呢喃']
                : ['幾筆', '低語', '輕觸'];

        // 形狀主題詞
        let themeWords = ['風景'];
        if (shapeTypes.includes('person')) themeWords = ['身影', '行者', '旅人'];
        else if (shapeTypes.includes('house')) themeWords = ['家屋', '小鎮', '歸處'];
        else if (shapeTypes.includes('circle')) themeWords = ['圓舞', '漣漪', '光環'];
        else if (shapeTypes.includes('triangle')) themeWords = ['山峰', '稜角', '方向'];
        else if (shapeTypes.includes('square')) themeWords = ['窗框', '空間', '方格'];
        else if (shapeTypes.includes('object')) themeWords = ['物語', '造型', '意象'];
        else themeWords = ['夢境', '心情', '餘韻'];

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `${pick(tempWords)}${pick(themeWords)}${pick(densityWords)}`;
    }
};