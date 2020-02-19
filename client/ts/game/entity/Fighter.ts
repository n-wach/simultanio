import Unit from "./Unit";

export default class Fighter extends Unit {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.rotate(this.orientation);
        ctx.moveTo(0, 0.4);
        ctx.lineTo(0.2, -0.3);
        ctx.lineTo(-0.2, -0.3);
        ctx.closePath();
        ctx.rotate(-this.orientation);
    }

    getName(): string {
        return "Fighter";
    }
}