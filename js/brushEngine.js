/**
 * ArtEcho 畫筆渲染引擎
 * 負責處理 Canvas 繪圖上下文的所有筆觸效果
 */
export const BrushEngine = {
    /**
     * 執行單步繪製
     * @param {CanvasRenderingContext2D} ctx - 畫布上下文
     * @param {Object} stroke - 包含 type, color, size 的筆觸物件
     * @param {Object} point - 當前坐標 {x, y}
     * @param {Object} prevPoint - 前一個坐標 {x, y}
     */
    drawStep(ctx, stroke, point, prevPoint) {
        ctx.save();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const dist = Math.sqrt(Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2));

        switch(stroke.type) {
            case 'watercolor':
                // 🌟 優化後的水彩筆：具備分層暈染感
                ctx.globalAlpha = 0.5;
                ctx.shadowBlur = stroke.size / 2;
                ctx.shadowColor = stroke.color;
                ctx.beginPath();
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                break;

            case 'crayon':
                // 🌟 蠟筆：模擬隨機顆粒質感
                ctx.globalAlpha = 0.9;
                const cSteps = Math.max(Math.floor(dist / 2), 1);
                for(let s=0; s<cSteps; s++) {
                    const lx = prevPoint.x + (point.x - prevPoint.x) * (s / cSteps);
                    const ly = prevPoint.y + (point.y - prevPoint.y) * (s / cSteps);
                    for(let i=0; i<Math.max(4, Math.floor(stroke.size / 2)); i++) {
                        const r = Math.random() * stroke.size * 0.55;
                        const a = Math.random() * 2 * Math.PI;
                        ctx.beginPath();
                        ctx.arc(lx + r*Math.cos(a), ly + r*Math.sin(a), Math.random()*1.6, 0, Math.PI*2);
                        ctx.fillStyle = stroke.color;
                        ctx.fill();
                    }
                }
                break;

            case 'sketch':
                // 素描：模擬鉛筆線條重疊
                ctx.globalAlpha = 0.8;
                ctx.lineWidth = Math.max(1, stroke.size / 3);
                const sSteps = Math.max(Math.floor(dist), 1);
                const sGrain = 0.5 + stroke.size * 0.1;
                ctx.beginPath();
                for(let s=0; s<sSteps; s++) {
                    const lx = prevPoint.x + (point.x - prevPoint.x) * (s / sSteps);
                    const ly = prevPoint.y + (point.y - prevPoint.y) * (s / sSteps);
                    ctx.lineWidth = Math.random() * sGrain + 0.3;
                    const ox = (Math.random() - 0.5) * sGrain;
                    const oy = (Math.random() - 0.5) * sGrain;
                    ctx.moveTo(lx + ox, ly + oy);
                    ctx.lineTo(lx + ox + (Math.random() * 2), ly + oy + (Math.random() * 2));
                }
                ctx.stroke();
                break;

            case 'spray':
                // 噴漆：模擬隨機噴灑像素
                ctx.globalAlpha = 0.5;
                const spSteps = Math.max(Math.floor(dist / 3), 1);
                const spDensity = Math.max(15, Math.floor(stroke.size * 2));
                for(let s=0; s<spSteps; s++) {
                    const lx = prevPoint.x + (point.x - prevPoint.x) * (s / spSteps);
                    const ly = prevPoint.y + (point.y - prevPoint.y) * (s / spSteps);
                    for(let i=0; i<spDensity; i++) {
                        const r = Math.random() * stroke.size * 1.2;
                        const a = Math.random() * 2 * Math.PI;
                        ctx.fillStyle = stroke.color;
                        ctx.fillRect(lx + r*Math.cos(a), ly + r*Math.sin(a), 1.2, 1.2);
                    }
                }
                break;

            case 'oil':
                // 油畫：模擬多重刷痕效果
                ctx.globalAlpha = 0.95;
                const bCount = Math.max(5, Math.floor(stroke.size / 3));
                for(let i=0; i<bCount; i++) {
                    const offset = (i - (bCount/2)) * (stroke.size / bCount);
                    ctx.lineWidth = Math.max(1, stroke.size / bCount);
                    ctx.beginPath();
                    ctx.moveTo(prevPoint.x + offset, prevPoint.y + offset);
                    ctx.lineTo(point.x + offset, point.y + offset);
                    ctx.stroke();
                }
                break;

            default:
                // 預設一般畫筆
                ctx.beginPath();
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
        }
        ctx.restore();
    }
};