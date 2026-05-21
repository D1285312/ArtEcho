/**
 * ArtEcho 物理數據分析 API
 * 從畫布提取客觀物理參數、形狀偵測、名稱生成
 */
export const AnalysisAPI = {
    getPhysicalStats(ctx, width, height, drawingSteps) {
        const imgData = ctx.getImageData(0, 0, width, height).data;
        let warmPixels = 0, paintedPixels = 0, leftPixels = 0;

        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
            if (r < 252 || g < 252 || b < 248) {
                paintedPixels++;
                const x = (i / 4) % width;
                if (x < width / 2) leftPixels++;
                if (r > b) warmPixels++;
            }
        }

        const coverage = ((paintedPixels / (width * height)) * 100).toFixed(1);
        const warmRatio = paintedPixels > 0 ? Math.round((warmPixels / paintedPixels) * 100) : 0;

        let totalPressure = 0, pointCount = 0, hesitationPoints = 0;

        drawingSteps.forEach(stroke => {
            stroke.points.forEach((p, idx) => {
                pointCount++;
                totalPressure += (p.pressure || 0.5);

                if (idx > 0) {
                    const prev = stroke.points[idx - 1];
                    const dist = Math.sqrt(Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2));
                    if (dist < 1.5) hesitationPoints++;
                }
            });
        });

        return {
            coverage: coverage,
            warmRatio: warmRatio,
            coolRatio: 100 - warmRatio,
            leftWeight: paintedPixels > 0 ? Math.round((leftPixels / paintedPixels) * 100) : 50,
            strokeCount: drawingSteps.length,
            avgPressure: pointCount > 0 ? (totalPressure / pointCount).toFixed(2) : "0.00",
            hesitationRatio: pointCount > 0 ? Math.round((hesitationPoints / pointCount) * 100) : 0
        };
    },

    /**
     * 偵測畫布中的形狀物件
     * 使用連通區域分析 (Connected Component) 來識別獨立物件
     * 再根據每個物件的幾何特徵判斷形狀類別
     */
    detectShapes(ctx, width, height) {
        const imgData = ctx.getImageData(0, 0, width, height).data;
        const step = 3;
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

        const labels = new Int32Array(mapW * mapH);
        let labelId = 0;
        const regions = [];

        for (let my = 0; my < mapH; my++) {
            for (let mx = 0; mx < mapW; mx++) {
                const idx = my * mapW + mx;
                if (binaryMap[idx] === 1 && labels[idx] === 0) {
                    labelId++;
                    const region = {
                        id: labelId,
                        minX: mx,
                        minY: my,
                        maxX: mx,
                        maxY: my,
                        pixels: 0,
                        sumX: 0,
                        sumY: 0
                    };

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

                        const neighbors = [
                            ci - 1, ci + 1,
                            ci - mapW, ci + mapW
                        ];

                        for (const ni of neighbors) {
                            if (ni >= 0 && ni < binaryMap.length && binaryMap[ni] === 1 && labels[ni] === 0) {
                                const nx = ni % mapW;
                                const ny = Math.floor(ni / mapW);
                                if (Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1) {
                                    stack.push(ni);
                                }
                            }
                        }
                    }

                    if (region.pixels >= 15) {
                        regions.push(region);
                    }
                }
            }
        }

        const shapes = [];

        for (const r of regions) {
            const w = r.maxX - r.minX + 1;
            const h = r.maxY - r.minY + 1;
            const aspectRatio = w / (h || 1);
            const fillRatio = r.pixels / (w * h || 1);
            const centroidX = r.sumX / r.pixels;
            const centroidY = r.sumY / r.pixels;
            const relCentroidY = (centroidY - r.minY) / (h || 1);

            let shape = null;

            if (h > w * 0.8 && fillRatio > 0.25 && fillRatio < 0.65 && relCentroidY > 0.55) {
                shape = { type: 'house', label: '🏠 房子', confidence: fillRatio };
            } else if (aspectRatio < 0.6 && h > 8 && fillRatio > 0.15 && fillRatio < 0.55) {
                shape = { type: 'person', label: '👤 人物', confidence: fillRatio };
            } else if (aspectRatio > 0.7 && aspectRatio < 1.4 && fillRatio > 0.55) {
                shape = { type: 'circle', label: '🔴 圓形', confidence: fillRatio };
            } else if (fillRatio > 0.25 && fillRatio < 0.58 && relCentroidY > 0.5) {
                shape = { type: 'triangle', label: '🔺 三角形', confidence: fillRatio };
            } else if (aspectRatio > 0.5 && aspectRatio < 2.0 && fillRatio > 0.5) {
                shape = { type: 'square', label: '⬛ 方形', confidence: fillRatio };
            } else if (r.pixels > 30) {
                shape = { type: 'object', label: '🎯 物件', confidence: fillRatio };
            }

            if (shape) {
                shape.region = {
                    id: r.id,
                    minX: r.minX,
                    minY: r.minY,
                    maxX: r.maxX,
                    maxY: r.maxY,
                    centroidMapX: centroidX,
                    centroidMapY: centroidY,
                    pixels: r.pixels
                };
                shapes.push(shape);
            }
        }

        if (shapes.length === 0) {
            shapes.push({ type: 'freeform', label: '🌊 自由風格', confidence: 0, region: null });
        }

        const pixelRegions = regions.map(r => {
            return {
                id: r.id,
                minX: r.minX * step,
                minY: r.minY * step,
                maxX: Math.min(width, (r.maxX + 1) * step),
                maxY: Math.min(height, (r.maxY + 1) * step),
                pixels: r.pixels,
                centroidX: (r.sumX / r.pixels) * step,
                centroidY: (r.sumY / r.pixels) * step
            };
        });

        return {
            shapes: shapes,
            regionCount: regions.length,
            regions: pixelRegions,
            map: { step, mapW, mapH, labels }
        };
    },

    /**
     * 只輸出四類：人物 / 頭部 / 身體 / 背景
     */
    analyzeObjectsWithTime(ctx, width, height, drawingSteps) {
        const shapeResult = this.detectShapes(ctx, width, height);
        const regions = shapeResult.regions || [];
        const shapes = shapeResult.shapes || [];

        const personShapes = shapes.filter(sh => sh.type === 'person' && sh.region);

        const stats = {
            person: { label: '人物', seconds: 0, points: 0, totalPressure: 0 },
            head: { label: '頭部', seconds: 0, points: 0, totalPressure: 0 },
            body: { label: '身體', seconds: 0, points: 0, totalPressure: 0 },
            background: { label: '背景', seconds: 0, points: 0, totalPressure: 0 }
        };

        function findRegionForPoint(px, py) {
            for (const r of regions) {
                if (px >= r.minX && px < r.maxX && py >= r.minY && py < r.maxY) {
                    return r;
                }
            }
            return null;
        }

        function findPersonShapeByRegionId(regionId) {
            return personShapes.find(sh => sh.region.id === regionId) || null;
        }

        drawingSteps.forEach(stroke => {
            for (let i = 0; i < stroke.points.length; i++) {
                const p = stroke.points[i];
                const next = stroke.points[i + 1];
                const dt = next ? Math.max(1, (next.t - p.t)) : 16;
                const sec = dt / 1000;
                const pressure = (p.pressure || 0.5);

                const region = findRegionForPoint(p.x, p.y);

                if (!region) {
                    stats.background.seconds += sec;
                    stats.background.points += 1;
                    stats.background.totalPressure += pressure;
                    continue;
                }

                const personShape = findPersonShapeByRegionId(region.id);

                if (personShape) {
                    stats.person.seconds += sec;
                    stats.person.points += 1;
                    stats.person.totalPressure += pressure;

                    const h = region.maxY - region.minY;
                    const headEndY = region.minY + Math.max(1, Math.floor(h * 0.35));

                    if (p.y < headEndY) {
                        stats.head.seconds += sec;
                        stats.head.points += 1;
                        stats.head.totalPressure += pressure;
                    } else {
                        stats.body.seconds += sec;
                        stats.body.points += 1;
                        stats.body.totalPressure += pressure;
                    }
                } else {
                    stats.background.seconds += sec;
                    stats.background.points += 1;
                    stats.background.totalPressure += pressure;
                }
            }
        });

        const totalSeconds = stats.person.seconds + stats.background.seconds;

        const formatItem = (item) => ({
            label: item.label,
            seconds: Math.round(item.seconds * 10) / 10,
            percent: totalSeconds > 0 ? Math.round((item.seconds / totalSeconds) * 100) : 0,
            avgPressure: item.points > 0 ? (item.totalPressure / item.points).toFixed(2) : "0.00"
        });

        return {
            totalSeconds: Math.round(totalSeconds * 10) / 10,
            breakdown: [
                formatItem(stats.person),
                formatItem(stats.head),
                formatItem(stats.body),
                formatItem(stats.background)
            ],
            shapes: shapeResult.shapes,
            regionCount: shapeResult.regionCount
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

        const tempWords = warmRatio > 70 ? ['溫暖的', '熾熱的', '陽光下的']
            : warmRatio > 40 ? ['柔和的', '微光中的', '黃昏時的']
                : ['沉靜的', '涼爽的', '月光下的'];

        const densityWords = coverage > 50 ? ['繁盛', '填滿', '豐盈']
            : coverage > 20 ? ['漫步', '散落', '呢喃']
                : ['幾筆', '低語', '輕觸'];

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