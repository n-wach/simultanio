import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";
import Res from "../Res";

export default class EntitySelection extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg_accent;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.save();

        let es = Simul.selectedEntities;
        if(es.length == 0) {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.fillStyle = Res.col_uifg;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = Res.max_font + "px " + Res.font_face;
            ctx.fillText("Nothing selected", 0, 0);
        } else {
            let s = Math.ceil(Math.sqrt(es.length));
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = Math.min(Res.max_font, Res.max_font * 1.5 / s) + "px " + Res.font_face;
            ctx.translate(this.x + this.width / 2 / s, this.y + this.height / 2 / s);
            for(let i = 0; i < es.length; i++) {
                let e = es[i];
                let x = i % s;
                let y = Math.floor(i / s);
                ctx.save();
                ctx.translate(x * this.width / s, y * this.height / s);
                ctx.save();
                ctx.scale(this.width / 2 / s, this.width / 2 / s);
                ctx.beginPath();
                ctx.rect(-1, -1, 2, 2);
                ctx.clip();
                ctx.beginPath();
                ctx.fillStyle = Res.player_colors[Simul.match.you.color].style;
                e.draw(ctx);
                ctx.fill();
                ctx.restore();
                ctx.fillStyle = Res.col_uifg;
                ctx.fillText(e.getName(), 0, this.height * 2 / 5 / s);
                ctx.restore();
            }
        }
        ctx.restore();
    }
}