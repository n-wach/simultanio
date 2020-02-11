import Building from "./Building";
import GameRenderable from "../ren/GameRenderable";

export default class City extends Building {
    static MAX_CIRCLE_RADIUS = GameRenderable.TILE_SIZE * 2;
    circleRadius: number = 0;

    draw(ctx: CanvasRenderingContext2D): void {
        let a = ctx.globalAlpha;
        ctx.globalAlpha = 0.3 * (City.MAX_CIRCLE_RADIUS - this.circleRadius) / City.MAX_CIRCLE_RADIUS;
        ctx.ellipse(0, 0, this.circleRadius, this.circleRadius, 0, 0, Math.PI * 2);
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
        this.circleRadius += (City.MAX_CIRCLE_RADIUS * dt);
        while(this.circleRadius > City.MAX_CIRCLE_RADIUS) this.circleRadius -= City.MAX_CIRCLE_RADIUS;
    }
}