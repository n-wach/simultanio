import Building from "./Building";

export default class EnergyGenerator extends Building {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(0, 0.4);
        ctx.lineTo(0.2, 0);
        ctx.lineTo(0, -0.4);
        ctx.lineTo(-0.2, 0);
        ctx.closePath();
        ctx.fill();
    }
}