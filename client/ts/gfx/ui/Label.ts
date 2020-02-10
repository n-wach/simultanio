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
        if (this.height > 40) {
            ctx.font = Res.font_ui_lg;
        } else {
            ctx.font = Res.font_ui;
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width - 10);
    }
}