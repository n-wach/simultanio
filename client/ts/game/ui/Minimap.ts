import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";
import Res from "../Res";
import Game from "../../gfx/Game";
import PlayScene from "../../scenes/PlayScene";
import GameTransformationLayer from "../ren/GameTransformationLayer";

export default class Minimap extends Component {
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
        if(Game.input.mouseDown && this.hovered) {
            let hs = this.width / Simul.match.terrainView.width;
            let vs = this.height / Simul.match.terrainView.height;
            let ox = Game.input.mousePos.x - this.x;
            let oy = Game.input.mousePos.y - this.y;
            (Game.scene as PlayScene).stage.centerOnGrid(ox / hs, oy / vs);
        }
    }
}

