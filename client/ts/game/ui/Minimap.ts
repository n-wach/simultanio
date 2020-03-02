import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";
import Res from "../Res";
import Game from "../../gfx/Game";
import PlayScene from "../../scenes/PlayScene";
import Vec2 from "../../gfx/Vec2";

export default class Minimap extends Component {
    constructor() {
        super();
        Game.input.addHandler((event) => {
            if (this.hovered) {
                if (event.button == 2) {
                    let g = this.translateToGrid(new Vec2(event.offsetX, event.offsetY));
                    let q = new Vec2(Math.floor(g.x + 0.5), Math.floor(g.y + 0.5));
                    if (Simul.selectedEntityAction) Simul.selectedEntityAction.onuse(q);
                }
                return true;
            }
            return false;
        }, "mousedown");
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.pal_black;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(Simul.mapImage.annotationCanvas, this.x, this.y, this.width, this.height);
        ctx.strokeStyle = Res.col_uifg;

        let tl = (Game.scene as PlayScene).stage.topLeftGrid;
        let br = (Game.scene as PlayScene).stage.bottomRightGrid;

        let hs = this.width / Simul.match.terrainView.width;
        let vs = this.height / Simul.match.terrainView.height;

        let x = tl.x * hs;
        let y = tl.y * vs;

        let w = br.x * hs - x;
        let h = br.y * vs - y;

        ctx.lineWidth = 2;

        ctx.strokeRect(this.x + x, this.y + y, w, h);
    }

    update(dt: number): void {
        super.update(dt);
        if (Game.input.mouseDown && Game.input.mouseButton == 0 && this.hovered) {
            let p = this.translateToGrid(Game.input.mousePos);
            (Game.scene as PlayScene).stage.centerOnGrid(p.x, p.y);
        }
    }

    translateToGrid(mousePos: Vec2) {
        let hs = this.width / Simul.match.terrainView.width;
        let vs = this.height / Simul.match.terrainView.height;
        let ox = mousePos.x - this.x;
        let oy = mousePos.y - this.y;
        return new Vec2(ox / hs, oy / vs);
    }
}

