import Building from "./Building";

export default class MatterCollector extends Building {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(0.2, 0.2);
        ctx.arc(0, 0.2, 0.2, 0, Math.PI, false);
        ctx.lineTo(-0.2, -0.2);
        ctx.arc(0, -0.2, 0.2, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();
    }

    getName(): string {
        return "Collector";
    }
}