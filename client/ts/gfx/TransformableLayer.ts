import Renderable from "./Renderable";
import Vec2 from "./Vec2";

export default abstract class TransformableLayer implements Renderable {
    renderables: Renderable[];
    ctxOrigin: Vec2 = new Vec2(0, 0);
    ctxScale: number = 100;

    constructor(...renderables: Renderable[]) {
        this.renderables = renderables;
    }

    transformToCanvas(event) {
        let scaled = new Vec2(event.offsetX / this.ctxScale, event.offsetY / this.ctxScale);
        return new Vec2(scaled.x - this.ctxOrigin.x / this.ctxScale, scaled.y - this.ctxOrigin.y / this.ctxScale);
    }

    transformVToCanvas(v: Vec2) {
        let scaled = new Vec2(v.x / this.ctxScale, v.y / this.ctxScale);
        return new Vec2(scaled.x - this.ctxOrigin.x / this.ctxScale, scaled.y - this.ctxOrigin.y / this.ctxScale);
    }

    update(dt: number) {
        for (let renderable of this.renderables) {
            renderable.update(dt);
        }
    }

    abstract draw(ctx: CanvasRenderingContext2D);

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.ctxOrigin.x, this.ctxOrigin.y);
        ctx.scale(this.ctxScale, this.ctxScale);
        for (let renderable of this.renderables) {
            renderable.render(ctx);
        }
        this.draw(ctx);
        ctx.restore();
    }

    add(...ren: Renderable[]): void {
        this.renderables.push(...ren);
    }

    clear(): void {
        this.renderables = [];
    }

    remove(ren: Renderable): void {
        this.renderables.splice(this.renderables.indexOf(ren), 1);
    }

    zoomOnPoint(zoomFactor: number, point: Vec2, minZoom: number=0.04, maxZoom: number=300) {
        let originalScale = this.ctxScale;
        let s = this.ctxScale - (zoomFactor * 0.005 * this.ctxScale);
        s = Math.min(maxZoom, Math.max(minZoom, s));
        this.ctxScale = s;
        let scaleChange = originalScale - this.ctxScale;
        this.ctxOrigin.x += (point.x * scaleChange);
        this.ctxOrigin.y += (point.y * scaleChange);
    }

    translate(offset: Vec2) {
        this.ctxOrigin.x += offset.x;
        this.ctxOrigin.y += offset.y;
    }
}