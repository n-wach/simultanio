import Component from "../../gfx/ui/Component";
import Simul from "../../Simul";

export default class MinimapComponent extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(Simul.terrainImage.terrainCanvas, this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {

    }
}

