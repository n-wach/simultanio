import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";
import Res from "../Res";
import {GameTransformationLayer} from "../ren/GameRenderable";
import Game from "../../gfx/Game";

export default class MinimapComponent extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(Simul.mapImage.annotationCanvas, this.x, this.y, this.width, this.height);
        ctx.strokeStyle = Res.col_uifg;

        let tl = (Game.scene.stage as GameTransformationLayer).topLeftGrid;
        let br = (Game.scene.stage as GameTransformationLayer).bottomRightGrid;

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

    }
}

