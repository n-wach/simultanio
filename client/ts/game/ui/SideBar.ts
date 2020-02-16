import Grid from "../../gfx/ui/Grid";
import Res from "../Res";
import Minimap from "./Minimap";
import Game from "../../gfx/Game";
import EntitySelection from "./EntitySelection";
import EntityActionList from "./EntityActionList";

export default class SideBar extends Grid {
    constructor() {
        super([240, 1.0, 250, 5], [1.0]);
        this.addComponent(new EntitySelection(), 0, 0, 1, 1, 10);
        this.addComponent(new EntityActionList(), 1, 0, 1, 1, 10, 10);
        this.addComponent(new Minimap(), 2, 0, 1, 1, 10);
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

