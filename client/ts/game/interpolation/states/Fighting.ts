import Pathing from "./Pathing";
import {FightingState} from "../../../comms";
import Simul from "../../../Simul";

export default class Fighting extends Pathing {
    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        let targetId = (this.parent.state as FightingState).target;
        let target = Simul.match.getEntity(targetId);
        if (target) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(target.x - this.parent.x, target.y - this.parent.y);
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
    }
}
