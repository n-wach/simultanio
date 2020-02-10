import Unit from "./Unit";

export default class Scout extends Unit {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.ellipse(0, 0, 40, 40, 0, 0, Math.PI * 2);
    }
}