import {Path, PathingState} from "../../../comms";
import Simul from "../../../Simul";
import Idle from "./Idle";
import Game from "../../../gfx/Game";

export default class Pathing extends Idle {
    path: Path;

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        if (Game.debug) {
            ctx.beginPath();
            let x = this.parent.x;
            let y = this.parent.y;
            ctx.moveTo(0, 0);
            for (let p of this.path) {
                ctx.lineTo(p.x - x, p.y - y);
            }
            ctx.lineWidth = 0.1;
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    }

    sync(ref: PathingState) {
        this.path = ref.path;
        super.sync(ref);
    }

    interpolate(dt: number) {
        let p = this.parent;
        let remainingD = dt * Simul.STATS[p.type]["movement_speed"];
        while(remainingD > 0 && this.path.length > 0) {
            let next = this.path[0];
            let dx = next.x - p.x;
            let dy = next.y - p.y;
            let dd = Math.sqrt(dx ** 2 + dy ** 2);
            if(dd < remainingD) {
                p.x = next.x;
                p.y = next.y;
                this.path.splice(0, 1);
                remainingD -= dd;
            } else {
                p.x += (dx / dd) * remainingD;
                p.y += (dy / dd) * remainingD;
                remainingD = 0;
                p.orientation = Math.atan2(dy, dx) - Math.PI / 2;
            }
        }
    }

}