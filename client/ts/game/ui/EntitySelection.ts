import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";
import Res from "../Res";
import Game from "../../gfx/Game";

export default class EntitySelection extends Component {

    constructor() {
        super();
        Game.input.addHandler((event) => {
            let es = Simul.selectedEntities;
            if(this.hovered && es.length > 0) {
                let s = Math.ceil(Math.sqrt(es.length));
                let p = Game.input.mousePos;
                let ox = p.x - this.x;
                let oy = p.y - this.y;
                let sw = this.width / s;
                let sv = this.height / s;
                let sx = Math.floor(ox / sw);
                let sy = Math.floor(oy / sv);
                let i = sy * s + sx;
                es.splice(i, 1);
                return true;
            }
            return false;
        }, "mouseup");
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg_secondary;
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
            let sx = -1;
            let sy = -1;
            if(this.hovered) {
                let p = Game.input.mousePos;
                let ox = p.x - this.x;
                let oy = p.y - this.y;
                let sw = this.width / s;
                let sv = this.height / s;
                sx = Math.floor(ox / sw);
                sy = Math.floor(oy / sv);
            }
            ctx.translate(this.x + this.width / 2 / s, this.y + this.height / 2 / s);
            for(let i = 0; i < es.length; i++) {
                let e = es[i];
                let x = i % s;
                let y = Math.floor(i / s);
                ctx.save();
                ctx.translate(x * this.width / s, y * this.height / s);
                ctx.save();
                ctx.scale(this.width / 2 / s, this.height / 2 / s);
                ctx.beginPath();
                ctx.rect(-1, -1, 2, 2);
                ctx.clip();
                if(x == sx && y == sy) {
                    ctx.fillStyle = Res.col_uibg_accent;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.fillStyle = Res.player_colors[Simul.match.you.color].style;
                e.draw(ctx);
                ctx.fill();
                ctx.restore();
                ctx.fillStyle = Res.col_uifg;
                if(x == sx && y == sy) {
                    ctx.fillText("Deselect", 0, this.height * 2 / 5 / s);
                } else {
                    ctx.fillText(e.getName(), 0, this.height * 2 / 5 / s);
                }
                ctx.restore();
            }
        }
        ctx.restore();
    }
}