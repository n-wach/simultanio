import Game from "../Game";
import Res from "../../game/Res";
import Icon from "./Icon";

export default class IconButton extends Icon {
    onclick: () => void;

    constructor(src: string, onclick?: () => void) {
        super(src);
        this.onclick = onclick;
        Game.input.addHandler((event) => {
            if(this.hovered) {
                if (this.onclick) this.onclick();
                return true;
            }
            return false;
        }, "mouseup");
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.hovered) {
            ctx.fillStyle = Res.col_uibg_accent;
        } else {
            ctx.fillStyle = Res.col_uibg;
        }
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        super.render(ctx);
    }
}