import {Renderable} from "./Renderable";
import {Vec2} from "./Vec2";

export class RenderableGroup implements Renderable {
    renderables: Renderable[];
    ctxOrigin: Vec2 = new Vec2(0, 0);
    ctxScale: number = 1;

    constructor(...renderables: Renderable[]) {
        this.renderables = renderables;
    }

    transformToCanvas(event) {
        let scaled = new Vec2(event.offsetX / this.ctxScale, event.offsetY / this.ctxScale);
        return new Vec2(scaled.x - this.ctxOrigin.x / this.ctxScale, scaled.y - this.ctxOrigin.y / this.ctxScale);
    }

    update(dt: number) {
        for (let renderable of this.renderables) {
            renderable.update(dt);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.ctxOrigin.x, this.ctxOrigin.y);
        ctx.scale(this.ctxScale, this.ctxScale);
        for (let renderable of this.renderables) {
            renderable.render(ctx);
        }
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

    zoomOnPoint(zoomFactor: number, point: Vec2) {
        let originalScale = this.ctxScale;
        let s = this.ctxScale - (zoomFactor * 0.005 * this.ctxScale);
        this.ctxScale = Math.min(10, Math.max(0.1, s));
        let scaleChange = originalScale - this.ctxScale;
        this.ctxOrigin.x += (point.x * scaleChange);
        this.ctxOrigin.y += (point.y * scaleChange);
    }

    translate(offset: Vec2) {
        this.ctxOrigin.x += offset.x;
        this.ctxOrigin.y += offset.y;
    }
}