import { Renderable } from "../Renderable";
import { Game } from "../Game";

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
            ctx.fillStyle = "#888888";
        } else {
            ctx.fillStyle = "#aaaaaa";
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "white";
        ctx.font = (this.h - 10) + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2, this.w - 10);
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

    }
}