import Grid from "../../gfx/ui/Grid";
import Res from "../Res";
import MinimapComponent from "./MinimapComponent";
import Game from "../../gfx/Game";

export default class SideBar extends Grid {
    constructor() {
        super([250, 1.0, 250], [1.0]);
        this.addComponent(new MinimapComponent(), 2, 0, 1, 1, 10);
        Game.input.addHandler((event) => {
            return this.hovered;
        }, "mousedown");
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }
}

