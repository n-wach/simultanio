import StateInterpolator from "../StateInterpolator";

export default class GeneratingStateInterpolator extends StateInterpolator {
    static MAX_CIRCLE_RADIUS = 1;
    circleRadius: number = 0;

    draw(ctx: CanvasRenderingContext2D): void {
        let a = ctx.globalAlpha;
        let r = GeneratingStateInterpolator.MAX_CIRCLE_RADIUS;
        ctx.globalAlpha = 0.3 * (r - this.circleRadius) / r;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.circleRadius, this.circleRadius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a;
    }

    interpolate(dt: number) {
        let r = GeneratingStateInterpolator.MAX_CIRCLE_RADIUS;
        this.circleRadius -= (r * dt);
        while(this.circleRadius < 0) this.circleRadius += r;
    }
}