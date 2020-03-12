import Res from "../../game/Res";
import Component from "./Component";

export default class Label extends Component {
    text: string;
    align: CanvasTextAlign;
    color: string;

    constructor(text: string, align: CanvasTextAlign = "center", color?: string) {
        super();
        this.text = text;
        this.align = align;
        this.color = color ? color : Res.col_uifg;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.font = Math.min(this.height - 10, Res.max_font) + "px " + Res.font_face;
        ctx.textAlign = this.align;
        ctx.textBaseline = "middle";
        switch(this.align) {
            case "left":
                ctx.fillText(this.text, this.x + 5, this.y + this.height / 2, this.width - 10);
                break;
            case "right":
                ctx.fillText(this.text, this.x + this.width - 5, this.y + this.height / 2, this.width - 10);
                break;
            default:
                ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width - 10);
                break;
        }
    }
}