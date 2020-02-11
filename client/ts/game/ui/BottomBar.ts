import Grid from "../../gfx/ui/Grid";
import Res from "../Res";
import MinimapComponent from "./MinimapComponent";

export default class BottomBar extends Grid {
    constructor() {
        super([1.0], [1.0, 250]);
        this.addComponent(new MinimapComponent(), 0, 1, 1, 1, 10);
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }
}

