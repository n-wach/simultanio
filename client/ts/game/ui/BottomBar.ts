import Grid from "../../gfx/ui/Grid";
import {Res} from "../Res";

export default class BottomBar extends Grid {
    constructor() {
        super([1.0], [100, 1.0, 40, 60, 40, 60, 40]);

    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }
}

