import Game from "../Game";
import Res from "../../game/Res";
import Label from "./Label";

export default class Button extends Label {
    onclick: () => void;

    constructor(text: string, onclick?: () => void) {
        super(text);
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
        if(this.hovered) {
            ctx.fillStyle = Res.col_uibg_accent;
        } else {
            ctx.fillStyle = Res.col_uibg;
        }
        ctx.fillRect(this.x, this.y , this.width, this.height);
        super.render(ctx);
    }
}