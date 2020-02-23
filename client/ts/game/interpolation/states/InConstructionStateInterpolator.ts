import StateInterpolator from "../StateInterpolator";

export default class InConstructionState extends StateInterpolator {
    draw(ctx: CanvasRenderingContext2D): void {
        let a = ctx.globalAlpha;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(-0.4, -0.4, 0.8, 0.1);
        ctx.globalAlpha = a;
        ctx.fillRect(-0.4, -0.4, 0.8 * this.parent.health, 0.1);
    }

    interpolate(dt: number) {
    }
}