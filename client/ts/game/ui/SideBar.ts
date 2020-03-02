import Grid from "../../gfx/ui/Grid";
import Res from "../Res";
import Minimap from "./Minimap";
import EntitySelection from "./EntitySelection";
import EntityActionList from "./EntityActionList";
import ScrollComponent from "../../gfx/ui/ScrollComponent";
import Game from "../../gfx/Game";

export default class SideBar extends Grid {
    constructor() {
        super([240, 1.0, 250, 5], [1.0]);
        let handle = (event) => {
            return this.hovered;
        };
        this.handlers.push(handle);
        Game.input.addHandler(handle, "mousedown");
        this.addComponent(new EntitySelection(), 0, 0, 1, 1, 10);
        this.addComponent(new ScrollComponent(new EntityActionList()), 1, 0, 1, 1, 10, 10);
        this.addComponent(new Minimap(), 2, 0, 1, 1, 10);

    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }
}

