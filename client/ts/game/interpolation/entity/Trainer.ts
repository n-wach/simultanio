import Building from "./Building";

export default class Trainer extends Building {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(0, 0.4);
        ctx.lineTo(0.1, 0.1);
        ctx.lineTo(0.4, 0);
        ctx.lineTo(0.1, -0.1);
        ctx.lineTo(0, -0.4);
        ctx.lineTo(-0.1, -0.1);
        ctx.lineTo(-0.4, 0);
        ctx.lineTo(-0.1, 0.1);
        ctx.closePath();
        ctx.ellipse(0, 0, 0.3, 0.3, 0, 0, Math.PI * 2);
        ctx.fill("nonzero"); //todo: this doesn't work as i expected...
    }
}