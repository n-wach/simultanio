import Unit from "./Unit";

export default class Scout extends Unit {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.rotate(this.orientation);
        ctx.moveTo(0, 0.4);
        ctx.lineTo(0.2, -0.2);
        ctx.lineTo(0, -0.1);
        ctx.lineTo(-0.2, -0.2);
        ctx.closePath();
        ctx.rotate(-this.orientation);
    }

    getName(): string {
        return "Scout";
    }
}