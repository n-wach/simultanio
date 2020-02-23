import {EntityState} from "../../comms";
import Interpolated from "./Interpolated";
import EntityInterpolator from "./EntityInterpolator";

export default abstract class StateInterpolator extends Interpolated<EntityState> {
    parent: EntityInterpolator;

    constructor(ref: EntityState, parent: EntityInterpolator) {
        super();
        this.parent = parent;
        this.sync(ref);
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
