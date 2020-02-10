import EntityInterpolator from "../interpolation/EntityInterpolator";
import {Path, Unit} from "../../comms";
import {UNIT_SPEEDS} from "../../consts";

export default abstract class UnitInterpolator extends EntityInterpolator {
    path: Path;
    type: string;
    orientation: number = 0;
    update(): void {

    }
    sync(ref: Unit) {
        super.sync(ref);
        this.path = ref.path;
        this.type = ref.type;
    }
    interpolate(dt: number) {
        let remainingD = dt * UNIT_SPEEDS[this.type];
        while(remainingD > 0 && this.path.length > 0) {
            let next = this.path[0];
            let dx = next.x - this.x;
            let dy = next.y - this.y;
            let dd = Math.sqrt(dx ** 2 + dy ** 2);
            if(dd < remainingD) {
                this.x = next.x;
                this.y = next.y;
                this.path.splice(0, 1);
                remainingD -= dd;
            } else {
                this.x += (dx / dd) * remainingD;
                this.y += (dy / dd) * remainingD;
                remainingD = 0;
                this.orientation = Math.atan2(dy, dx) - Math.PI / 2;
            }
        }
    }
}