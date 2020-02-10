import Unit from "./Unit";

export default class Scout extends Unit {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.rotate(this.orientation);
        ctx.moveTo(0, 40);
        ctx.lineTo(20, -20);
        ctx.lineTo(0, -10);
        ctx.lineTo(-20, -20);
        ctx.closePath();
        ctx.rotate(-this.orientation);
    }
}