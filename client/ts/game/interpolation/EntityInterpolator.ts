import Renderable from "../../gfx/Renderable";
import {Entity, EntityState, Id} from "../../comms";
import Interpolated from "./Interpolated";
import getState from "./StateCreator";
import StateInterpolator from "./StateInterpolator";
import Simul from "../../Simul";

export default abstract class EntityInterpolator extends Interpolated<Entity> implements Renderable {
    x: number;
    y: number;
    health: number;
    orientation: number;  // you spin me round-right-round like a record baby
    id: Id;
    type: string;
    state: EntityState;
    stateInterpolator: StateInterpolator;

    constructor(ref: Entity) {
        super();
        this.sync(ref);
    }

    sync(ref: Entity) {
        super.sync(ref);
        this.type = ref.type;
        this.id = ref.id;
        this.health = ref.health;
        this.x = ref.x;
        this.y = ref.y;
        if(!this.state || this.state.type != ref.state.type) {
            this.stateInterpolator = getState(ref.state, this);
        } else {
            // constructor performs sync
            this.stateInterpolator.sync(ref.state);
        }
        this.state = ref.state;
    }

    interpolate(dt: number) {
        this.stateInterpolator.interpolate(dt);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.translate(this.x, this.y);
        this.draw(ctx);
        this.stateInterpolator.draw(ctx);
        ctx.translate(-this.x, -this.y);
    }

    getName(): string {
        return Simul.STATS[this.type]["name"];
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    update(dt: number): void {

    }
}
