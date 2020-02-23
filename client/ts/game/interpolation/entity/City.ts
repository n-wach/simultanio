import Building from "./Building";

export default class City extends Building {
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
        ctx.fill();
    }

    getName(): string {
        return "City";
    }
}