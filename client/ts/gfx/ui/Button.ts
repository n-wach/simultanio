import { Renderable } from "../Renderable";
import { Game } from "../Game";
import { Res } from "../../game/Res";

export class Button extends Renderable {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    onclick: () => void;
    hover: boolean = false;

    constructor(text: string, x: number, y: number, w: number, h: number, onclick?: () => void) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.onclick = onclick;
        Game.input.addHandler((event) => {
            if(this.hover) {
                if (this.onclick) this.onclick();
                return true;
            }
            return false;
        }, "mouseup");
    }

    update(): void {
        this.hover = this.x < Game.input.mousePos.x
            && Game.input.mousePos.x < this.x + this.w
            && this.y < Game.input.mousePos.y
            && Game.input.mousePos.y < this.y + this.h;
    }
    
    render(ctx: CanvasRenderingContext2D): void {
        if(this.hover) {
            ctx.fillStyle = Res.col_ui_accent;
        } else {
            ctx.fillStyle = Res.col_uibg;
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = Res.col_uifg;
        if (this.h > 40) {
            ctx.font = Res.font_ui_lg;
        } else {
            ctx.font = Res.font_ui;
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2, this.w - 10);
        ctx.strokeStyle = Res.col_uibg;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

    }
}