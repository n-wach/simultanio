import Building from "./Building";

export default class City extends Building {
    draw(ctx: CanvasRenderingContext2D): void {
        let a = ctx.globalAlpha;
        ctx.globalAlpha = 0.3;
        ctx.ellipse(0, 0, 50, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(10, 10);
        ctx.lineTo(40, 0);
        ctx.lineTo(10, -10);
        ctx.lineTo(0, -40);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-40, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
    }

    interpolate(dt: number) {

    }

    update(dt: number): void {

    }
}