import StateInterpolator from "../StateInterpolator";
import {UNIT_SPEEDS} from "../../../consts";
import {Path, PathingState} from "../../../comms";

export default class PathingStateInterpolator extends StateInterpolator {
    path: Path;

    sync(ref: PathingState) {
        this.path = ref.path;
        super.sync(ref);
    }

    draw(ctx: CanvasRenderingContext2D): void {

    }

    interpolate(dt: number) {
        let p = this.parent;
        let remainingD = dt * UNIT_SPEEDS[p.type];
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