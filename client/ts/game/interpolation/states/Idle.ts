import StateInterpolator from "../StateInterpolator";
import Res from "../../Res";
import Game from "../../../gfx/Game";

export default class Idle extends StateInterpolator {
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.parent.health < 1) {
            let a = ctx.globalAlpha;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(-0.4, -0.4, 0.8, 0.1);
            ctx.globalAlpha = a;
            ctx.fillRect(-0.4, -0.4, 0.8 * this.parent.health, 0.1);
        }
        if (Game.debug) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "0.3px " + Res.font_face;
            ctx.fillText(this.parent.state.type, 0, 0.4);
        }
    }

    interpolate(dt: number) {
    }
}