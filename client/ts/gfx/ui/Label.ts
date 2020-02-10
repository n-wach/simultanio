import { Res } from "../../game/Res";
import Component from "./Component";

export default class Label extends Component {
    text: string;

    constructor(text: string) {
        super();
        this.text = text;
    }

    update(dt: number): void {

    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uifg;
        ctx.font = Math.min(this.height - 10, Res.max_font) + "px " + Res.font_face;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width - 10);
    }
}